#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BLOCKED_TAGS = ["script", "form", "iframe", "video", "audio", "canvas", "svg"];

export function validateEmailHtml(html) {
  const errors = [];
  const warnings = [];

  for (const tag of BLOCKED_TAGS) {
    if (new RegExp(`<\\s*${tag}\\b`, "i").test(html)) {
      errors.push(`No uses <${tag}> en un correo de producción.`);
    }
  }

  if (/display\s*:\s*(flex|grid)/i.test(html)) {
    errors.push("No uses Flexbox ni Grid; maqueta con tablas de presentación.");
  }
  if (/position\s*:\s*(fixed|absolute)/i.test(html)) {
    warnings.push("Evita position fixed/absolute por compatibilidad entre clientes.");
  }
  if (/<link\b[^>]*rel=["']?stylesheet/i.test(html)) {
    errors.push("No uses hojas de estilo externas.");
  }
  if (!/<table\b[^>]*role=["']presentation["']/i.test(html)) {
    warnings.push('No se encontró una tabla con role="presentation".');
  }
  if (!/preheader/i.test(html)) {
    warnings.push("No se detectó un preheader identificable.");
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const source = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!source) {
      errors.push("Hay una imagen sin atributo src.");
    } else if (!source.startsWith("https://") && !source.startsWith("{{ASSET_BASE_URL}}/")) {
      errors.push(`La imagen usa una URL no pública o relativa: ${source}`);
    }
    if (!/\balt\s*=\s*["'][^"']*["']/i.test(tag)) {
      errors.push("Hay una imagen sin atributo alt.");
    }
    if (!/\bwidth\s*=\s*["']?\d+/i.test(tag) || !/\bheight\s*=\s*["']?\d+/i.test(tag)) {
      warnings.push("Declara width y height en cada imagen.");
    }
  }

  const forbiddenUrlPatterns = [
    [/\b(?:src|href)\s*=\s*["'](?:file:|blob:)/i, "Hay una URL file: o blob:."],
    [/\b(?:src|href)\s*=\s*["']https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i, "Hay una URL de localhost."],
    [/\b(?:src|href)\s*=\s*["']\//i, "Hay una URL relativa que empieza con /."],
  ];
  for (const [pattern, message] of forbiddenUrlPatterns) {
    if (pattern.test(html)) errors.push(message);
  }

  if (/{{ASSET_BASE_URL}}/.test(html)) {
    warnings.push("El correo todavía usa {{ASSET_BASE_URL}}; reemplázalo antes de crear el borrador real.");
  }
  if (!/<a\b[^>]*href=/i.test(html)) {
    warnings.push("No se encontró ningún enlace o CTA.");
  }

  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}

function runCli() {
  const input = process.argv[2];
  if (!input) {
    console.error("Uso: validate-email.mjs <email.html>");
    process.exitCode = 2;
    return;
  }

  const resolved = path.resolve(input);
  const html = fs.readFileSync(resolved, "utf8");
  const result = validateEmailHtml(html);

  for (const warning of result.warnings) console.warn(`WARN: ${warning}`);
  for (const error of result.errors) console.error(`ERROR: ${error}`);

  if (result.errors.length) {
    console.error(`Falló la validación: ${result.errors.length} error(es).`);
    process.exitCode = 1;
    return;
  }
  console.log(`Correo válido${result.warnings.length ? ` con ${result.warnings.length} advertencia(s)` : ""}.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) runCli();
