export type WhatsAppPhase =
  | "starting"
  | "waiting_for_qr"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "logged_out"
  | "error";

export type WhatsAppGroup = {
  id: string;
  name: string;
  participants: number;
  isCommunity: boolean;
  isAnnouncement: boolean;
};

export type RockyStatus = {
  phase: WhatsAppPhase;
  qrDataUrl: string | null;
  qrUpdatedAt: string | null;
  phone: string | null;
  lastConnectedAt: string | null;
  lastDisconnectedAt: string | null;
  lastError: string | null;
  reconnectAttempt: number;
  groups: WhatsAppGroup[];
  groupsUpdatedAt: string | null;
  messagesSeen: number;
  lastMessageAt: string | null;
  lastResponseAt: string | null;
  agentBusy: boolean;
  agentThreadActive: boolean;
  lastAgentAt: string | null;
  lastAgentError: string | null;
};

type Listener = (status: Readonly<RockyStatus>) => void;

const initialStatus: RockyStatus = {
  phase: "starting",
  qrDataUrl: null,
  qrUpdatedAt: null,
  phone: null,
  lastConnectedAt: null,
  lastDisconnectedAt: null,
  lastError: null,
  reconnectAttempt: 0,
  groups: [],
  groupsUpdatedAt: null,
  messagesSeen: 0,
  lastMessageAt: null,
  lastResponseAt: null,
  agentBusy: false,
  agentThreadActive: false,
  lastAgentAt: null,
  lastAgentError: null,
};

export class StatusStore {
  private status: RockyStatus = { ...initialStatus };
  private readonly listeners = new Set<Listener>();

  get(): Readonly<RockyStatus> {
    return { ...this.status, groups: [...this.status.groups] };
  }

  update(changes: Partial<RockyStatus>): void {
    this.status = { ...this.status, ...changes };
    const snapshot = this.get();
    for (const listener of this.listeners) listener(snapshot);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
