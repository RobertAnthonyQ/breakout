import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import type { RockyConfig } from "../config.js";
import type { GmailIntegration } from "../google/gmail.js";
import type { StatusStore } from "../state.js";
import type { WhatsAppClient } from "../whatsapp/client.js";
import type { WorkspaceStore } from "../workspace/store.js";
import { renderAdminPage } from "./page.js";

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 512_000) throw new Error("La solicitud supera el límite de 500 KB.");
    chunks.push(buffer);
  }
  if (!chunks.length) return {};
  const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("El cuerpo debe ser un objeto JSON.");
  }
  return parsed as Record<string, unknown>;
}

function getToken(request: IncomingMessage): string {
  const authorization = request.headers.authorization;
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);
  const url = new URL(request.url || "/", "http://localhost");
  return url.searchParams.get("token") || "";
}

function isAuthorized(request: IncomingMessage, config: RockyConfig): boolean {
  return !config.adminToken || getToken(request) === config.adminToken;
}

export function createAdminServer(
  config: RockyConfig,
  status: StatusStore,
  whatsapp: WhatsAppClient,
  gmail: GmailIntegration,
  workspace: WorkspaceStore,
) {
  return createServer(async (request, response) => {
    const url = new URL(request.url || "/", "http://localhost");

    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "no-referrer");

    if (request.method === "GET" && url.pathname === "/") {
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'",
        "Content-Type": "text/html; charset=utf-8",
      });
      const googleOnlyPreview =
        config.host === "127.0.0.1" && url.searchParams.get("view") === "google";
      response.end(renderAdminPage(config.googleOnlyPage || googleOnlyPreview));
      return;
    }

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { ok: true, phase: status.get().phase });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/integrations/google/callback") {
      const code = url.searchParams.get("code") || "";
      const state = url.searchParams.get("state") || "";
      const oauthError = url.searchParams.get("error");
      if (oauthError) {
        response.writeHead(302, { Location: `/?google=error&message=${encodeURIComponent(oauthError)}` });
        response.end();
        return;
      }
      try {
        if (!code || !state) throw new Error("Google no devolvió el código OAuth esperado.");
        const email = await gmail.completeAuthorization(code, state);
        response.writeHead(302, { Location: `/?google=connected&email=${encodeURIComponent(email)}` });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        response.writeHead(302, { Location: `/?google=error&message=${encodeURIComponent(message)}` });
      }
      response.end();
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/integrations/google/public-status") {
      const gmailStatus = await gmail.getStatus();
      sendJson(response, 200, {
        configured: gmailStatus.configured,
        connected: gmailStatus.connected,
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/integrations/google/connect") {
      try {
        response.writeHead(302, {
          "Cache-Control": "no-store",
          Location: gmail.createAuthorizationUrl(),
        });
        response.end();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        sendJson(response, 409, { error: message });
      }
      return;
    }

    if (!isAuthorized(request, config)) {
      sendJson(response, 401, { error: "Token administrativo inválido." });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/status") {
      sendJson(response, 200, status.get());
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/groups") {
      const snapshot = status.get();
      sendJson(response, 200, {
        groups: snapshot.groups,
        updatedAt: snapshot.groupsUpdatedAt,
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/integrations/google/status") {
      sendJson(response, 200, await gmail.getStatus());
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/workspace/members") {
      try {
        const body = await readJsonBody(request);
        const member = gmail.addMember(
          typeof body.email === "string" ? body.email : "",
          typeof body.name === "string" ? body.name : undefined,
        );
        sendJson(response, 201, { ok: true, member });
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : String(error) });
      }
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/campaigns") {
      sendJson(response, 200, { campaigns: workspace.listCampaigns() });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/campaigns") {
      try {
        const body = await readJsonBody(request);
        const campaign = workspace.createCampaign(
          typeof body.slug === "string" ? body.slug : "",
          typeof body.name === "string" ? body.name : "",
        );
        sendJson(response, 201, { ok: true, campaign });
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : String(error) });
      }
      return;
    }

    const campaignMatch = /^\/api\/campaigns\/([^/]+)$/.exec(url.pathname);
    if (request.method === "GET" && campaignMatch?.[1]) {
      const campaign = workspace.getCampaign(decodeURIComponent(campaignMatch[1]));
      sendJson(response, campaign ? 200 : 404, campaign || { error: "Campaña no encontrada." });
      return;
    }

    const assignmentMatch = /^\/api\/campaigns\/([^/]+)\/assignments$/.exec(url.pathname);
    if (request.method === "POST" && assignmentMatch?.[1]) {
      try {
        const body = await readJsonBody(request);
        const campaign = workspace.assignCampaign(
          decodeURIComponent(assignmentMatch[1]),
          typeof body.email === "string" ? body.email : "",
          typeof body.assignedRecipients === "number" ? body.assignedRecipients : 0,
        );
        sendJson(response, 201, { ok: true, campaign });
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : String(error) });
      }
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/integrations/google/drafts") {
      try {
        const body = await readJsonBody(request);
        const result = await gmail.createDraft({
          accountEmail: typeof body.accountEmail === "string" ? body.accountEmail : "",
          to: typeof body.to === "string" ? body.to : "",
          bcc: typeof body.bcc === "string" ? body.bcc : "",
          subject: typeof body.subject === "string" ? body.subject : "",
          html: typeof body.html === "string" ? body.html : "",
        });
        if (typeof body.campaignSlug === "string" && body.campaignSlug.trim()) {
          workspace.recordDraft(body.campaignSlug, result.accountEmail, result.id);
        }
        sendJson(response, 201, { ok: true, draft: result });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        sendJson(response, 400, { error: message });
      }
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/integrations/google/drafts/send") {
      try {
        const body = await readJsonBody(request);
        if (body.confirm !== true) throw new Error("El envío requiere confirmación explícita.");
        const accountEmail = typeof body.accountEmail === "string" ? body.accountEmail : "";
        const draftId = typeof body.draftId === "string" ? body.draftId : "";
        const result = await gmail.sendDraft(accountEmail, draftId);
        if (typeof body.campaignSlug === "string" && body.campaignSlug.trim()) {
          workspace.recordSent(body.campaignSlug, result.accountEmail, result.messageId);
        }
        sendJson(response, 200, { ok: true, sent: result });
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : String(error) });
      }
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/events") {
      response.writeHead(200, {
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream; charset=utf-8",
      });
      response.write(`data: ${JSON.stringify(status.get())}\n\n`);
      const unsubscribe = status.subscribe((snapshot) => {
        response.write(`data: ${JSON.stringify(snapshot)}\n\n`);
      });
      const heartbeat = setInterval(() => response.write(": keep-alive\n\n"), 20_000);
      request.on("close", () => {
        clearInterval(heartbeat);
        unsubscribe();
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/reconnect") {
      void whatsapp.reconnect();
      sendJson(response, 202, { ok: true });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/test-message") {
      try {
        await whatsapp.sendTestMessage();
        sendJson(response, 200, { ok: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        sendJson(response, 409, { error: message });
      }
      return;
    }

    if (url.pathname === "/favicon.ico") {
      response.writeHead(204);
      response.end();
      return;
    }

    sendJson(response, 404, { error: "Ruta no encontrada." });
  });
}
