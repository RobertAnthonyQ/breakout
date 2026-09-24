export const adminPage = String.raw`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>Rocky · WhatsApp Bridge</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; --blue: #5967ff; --blue-soft: #202968; --line: #252b3f; --muted: #9ea6c4; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; color: #f5f7ff; background: radial-gradient(circle at 20% 0%, #27315f 0, transparent 33%), #080a12; }
    main { width: min(1040px, calc(100% - 32px)); margin: 0 auto; padding: 48px 0; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .avatar { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 16px; background: var(--blue); box-shadow: 0 12px 35px #5967ff55; font-size: 24px; }
    h1 { margin: 0; font-size: clamp(22px, 4vw, 32px); letter-spacing: -.03em; }
    .subtitle { color: #9ea6c4; margin: 5px 0 0; }
    .pill { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #32384f; border-radius: 999px; padding: 9px 13px; color: #bac1dc; background: #111522cc; }
    .dot { width: 9px; height: 9px; border-radius: 50%; background: #8890a8; box-shadow: 0 0 0 5px #8890a822; }
    .connected .dot { background: #42e28a; box-shadow: 0 0 0 5px #42e28a22; }
    .waiting_for_qr .dot { background: #ffc85c; box-shadow: 0 0 0 5px #ffc85c22; }
    .error .dot, .logged_out .dot { background: #ff6577; box-shadow: 0 0 0 5px #ff657722; }
    .grid { display: grid; grid-template-columns: minmax(300px, 1.1fr) minmax(280px, .9fr); gap: 20px; }
    .card { border: 1px solid var(--line); border-radius: 24px; background: #10131ef2; box-shadow: 0 18px 60px #0005; overflow: hidden; }
    .card-body { padding: 28px; }
    .qr-zone { min-height: 482px; display: grid; place-items: center; text-align: center; background: linear-gradient(145deg, #171b2b, #0e111b); }
    #qr { width: min(100%, 360px); border-radius: 18px; background: white; padding: 10px; display: none; }
    .empty { max-width: 360px; color: #a7aec8; }
    .empty-icon { font-size: 54px; margin-bottom: 12px; }
    h2 { margin: 0 0 8px; font-size: 22px; }
    p { line-height: 1.55; }
    dl { margin: 0; }
    .row { display: flex; justify-content: space-between; gap: 20px; padding: 17px 0; border-bottom: 1px solid #252b3f; }
    .row:last-child { border-bottom: 0; }
    dt { color: #8f98b8; }
    dd { margin: 0; text-align: right; max-width: 60%; overflow-wrap: anywhere; }
    button { width: 100%; border: 0; border-radius: 14px; padding: 13px 18px; margin-top: 20px; font: inherit; font-weight: 700; color: white; background: var(--blue); cursor: pointer; transition: transform .18s ease, background .18s ease; }
    button:hover { background: #6f7aff; transform: translateY(-1px); }
    button:disabled { opacity: .55; cursor: wait; }
    .groups { margin-top: 20px; padding-top: 20px; border-top: 1px solid #252b3f; }
    .groups h3 { margin: 0 0 12px; font-size: 15px; color: #dce1f5; }
    .group-list { display: grid; gap: 9px; max-height: 190px; overflow: auto; }
    .group { display: flex; justify-content: space-between; gap: 12px; padding: 11px 12px; border-radius: 10px; background: #0b0e17; }
    .group small { color: #7f88a6; white-space: nowrap; }
    .notice { margin-top: 16px; padding: 13px 15px; border-radius: 12px; color: #ffbdc6; background: #401e28; display: none; }
    .token { margin-top: 18px; }
    input, textarea, select { width: 100%; border: 1px solid #303750; border-radius: 12px; padding: 12px; color: white; background: #0b0e17; font: inherit; outline: none; }
    input:focus, textarea:focus, select:focus { border-color: #6875ff; box-shadow: 0 0 0 3px #5967ff22; }
    textarea { min-height: 170px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; line-height: 1.5; }
    .gmail-card { position: relative; isolation: isolate; min-height: 520px; margin-top: 20px; overflow: hidden; border-color: #3345b8; background: radial-gradient(circle at 50% -10%, #5262ff66, transparent 43%), linear-gradient(145deg, #11194c, #080b1c 68%); }
    .gmail-card::before { content: ''; position: absolute; inset: 0; z-index: -2; opacity: .38; background-image: linear-gradient(#7180ff1a 1px, transparent 1px), linear-gradient(90deg, #7180ff1a 1px, transparent 1px); background-size: 54px 54px; mask-image: linear-gradient(to bottom, #000, transparent 85%); }
    .gmail-card::after { content: ''; position: absolute; width: 420px; height: 420px; left: 50%; top: 48%; z-index: -1; border-radius: 50%; background: #2430ff2e; filter: blur(90px); transform: translate(-50%, -50%); }
    #gmail-particles { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; pointer-events: none; }
    .gmail-content { width: min(100%, 640px); margin: 0 auto; padding: 66px 28px 48px; }
    .gmail-access { position: relative; padding: 38px; text-align: center; border: 1px solid #ffffff21; border-radius: 28px; background: linear-gradient(145deg, #131a3ed9, #0a0e25e8); box-shadow: 0 28px 90px #0008, inset 0 1px #ffffff12; backdrop-filter: blur(18px); }
    .google-mark { display: grid; place-items: center; width: 58px; height: 58px; margin: 0 auto 22px; border-radius: 18px; background: white; box-shadow: 0 14px 36px #0007; }
    .google-mark svg { width: 30px; height: 30px; }
    .gmail-access h2 { margin: 0; font-size: clamp(28px, 5vw, 42px); letter-spacing: -.045em; line-height: 1.05; }
    .gmail-copy { max-width: 460px; margin: 16px auto 22px; color: #b7bfde; line-height: 1.6; }
    .field { display: grid; gap: 8px; margin-bottom: 16px; }
    .field label { color: #cfd4e8; font-size: 13px; font-weight: 700; }
    .field small { color: #747d9c; }
    .gmail-state { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; margin-bottom: 18px; padding: 8px 12px; border-radius: 999px; color: #c7cde4; background: #080b18aa; border: 1px solid #ffffff1f; font-size: 13px; }
    .gmail-state::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #858da8; }
    .gmail-state.connected::before { background: #42e28a; box-shadow: 0 0 0 5px #42e28a1d; }
    .eyebrow { margin: 0 0 8px; color: #7f8cff; font-size: 12px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
    .google-button { display: flex; align-items: center; justify-content: center; gap: 12px; max-width: 330px; margin: 0 auto; color: #1f2430; background: white; box-shadow: 0 14px 36px #0005; }
    .google-button:hover { color: #121620; background: #f2f4ff; }
    .google-button svg { width: 20px; height: 20px; flex: 0 0 auto; }
    .security-note { display: flex; align-items: center; justify-content: center; gap: 7px; margin: 15px 0 0; color: #7f89ad; font-size: 12px; }
    .gmail-feedback { display: none; margin: 16px auto 0; padding: 11px 14px; border-radius: 12px; color: #ffbdc6; background: #401e28; }
    .gmail-tools { display: none; margin-top: 18px; border: 1px solid #ffffff1a; border-radius: 20px; background: #0a0e22e8; box-shadow: 0 18px 50px #0005; overflow: hidden; }
    .gmail-card.connected .gmail-tools { display: block; }
    .gmail-tools summary { padding: 18px 22px; color: #dfe3f7; cursor: pointer; font-weight: 750; list-style: none; }
    .gmail-tools summary::-webkit-details-marker { display: none; }
    .gmail-tools summary::after { content: '+'; float: right; color: #8490ff; font-size: 20px; line-height: 1; }
    .gmail-tools[open] summary::after { content: '−'; }
    .gmail-form { padding: 4px 22px 24px; border-top: 1px solid #ffffff12; }
    .gmail-form .field:first-child { margin-top: 20px; }
    .team-panel { margin-top: 18px; padding: 20px 22px; border: 1px solid #ffffff1a; border-radius: 20px; background: #0a0e22e8; }
    .team-panel h3 { margin: 0 0 6px; }
    .team-panel > p { margin: 0 0 16px; color: #8d96b7; font-size: 13px; }
    .member-form { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
    .member-form button { width: auto; min-width: 130px; margin: 0; }
    .member-list { display: grid; gap: 8px; margin-top: 14px; }
    .member-item { display: flex; justify-content: space-between; gap: 12px; padding: 10px 12px; border-radius: 11px; color: #dfe3f7; background: #080b18aa; }
    .member-item small { color: #8992b0; }
    .campaign-form { display: grid; grid-template-columns: 1fr 1fr minmax(100px, .5fr) auto; gap: 10px; margin-top: 12px; }
    #campaign-form { grid-template-columns: 1fr 1fr auto; }
    .campaign-form button { width: auto; min-width: 110px; margin: 0; }
    .campaign-list { display: grid; gap: 8px; margin-top: 14px; }
    .campaign-item { padding: 12px; border-radius: 11px; background: #080b18aa; }
    .campaign-item strong { display: block; color: #e4e7f8; }
    .campaign-item small { color: #8992b0; }
    .success { display: none; margin-top: 16px; padding: 13px 15px; border-radius: 12px; color: #9df0bd; background: #173526; }
    footer { margin-top: 22px; color: #747d9c; text-align: center; font-size: 13px; }
    body.google-only { display: grid; min-height: 100vh; background: radial-gradient(circle at 50% -15%, #32409a 0, #11173f 43%, #080a17 100%); }
    .google-only main { display: grid; place-items: center; width: min(1120px, calc(100% - 32px)); min-height: 100vh; padding: 48px 0; }
    .google-only header, .google-only .grid, .google-only .team-panel, .google-only .gmail-tools, .google-only footer { display: none !important; }
    .google-only .gmail-card { width: 100%; min-height: auto; margin: 0; }
    .google-only .gmail-content { width: min(100%, 760px); padding: clamp(42px, 7vw, 76px) 28px; }
    .google-only .gmail-access { padding: clamp(32px, 6vw, 56px); }
    @media (max-width: 760px) { main { padding-top: 24px; } header, .grid { grid-template-columns: 1fr; } header { align-items: flex-start; flex-direction: column; } .qr-zone { min-height: 390px; } .gmail-content { padding: 42px 16px 30px; } .gmail-access { padding: 30px 20px; } .member-form, .campaign-form { grid-template-columns: 1fr; } .member-form button, .campaign-form button { width: 100%; } }
    @media (prefers-reduced-motion: reduce) { #gmail-particles { display: none; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="brand"><div class="avatar">🤖</div><div><h1>Rocky Bridge</h1><p class="subtitle">Consola privada de WhatsApp</p></div></div>
      <div id="status-pill" class="pill"><span class="dot"></span><span id="phase">Iniciando</span></div>
    </header>
    <section class="grid">
      <article class="card qr-zone">
        <img id="qr" alt="Código QR para vincular WhatsApp" />
        <div id="empty" class="empty"><div class="empty-icon">📡</div><h2>Preparando conexión</h2><p id="instruction">Rocky está solicitando un código QR a WhatsApp.</p></div>
      </article>
      <aside class="card"><div class="card-body">
        <h2>Estado de la sesión</h2>
        <p class="subtitle">La sesión se conserva al reiniciar el servicio.</p>
        <dl>
          <div class="row"><dt>Teléfono</dt><dd id="phone">—</dd></div>
          <div class="row"><dt>Conectado</dt><dd id="connected-at">—</dd></div>
          <div class="row"><dt>Último QR</dt><dd id="qr-at">—</dd></div>
          <div class="row"><dt>Reintentos</dt><dd id="attempts">0</dd></div>
          <div class="row"><dt>Menciones leídas</dt><dd id="messages-seen">0</dd></div>
          <div class="row"><dt>Última respuesta</dt><dd id="response-at">—</dd></div>
          <div class="row"><dt>Codex</dt><dd id="agent-state">Disponible</dd></div>
          <div class="row"><dt>Memoria</dt><dd id="agent-memory">Nueva</dd></div>
        </dl>
        <div id="error" class="notice"></div>
        <section class="groups"><h3>Grupos disponibles</h3><div id="groups" class="group-list"><span class="subtitle">Consultando grupos…</span></div></section>
        <div class="token"><input id="token" type="password" autocomplete="off" placeholder="Token administrativo (si aplica)" /></div>
        <button id="test-message">Enviar mensaje de prueba</button>
        <button id="reconnect">Reconectar WhatsApp</button>
      </div></aside>
    </section>
    <section id="gmail-card" class="gmail-card card">
      <canvas id="gmail-particles" aria-hidden="true"></canvas>
      <div class="gmail-content">
        <div class="gmail-access">
          <div class="google-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.29-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.72 1.06-2.87 0-5.3-1.94-6.17-4.54H2.14v2.85A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.83 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.34-2.1V7.05H2.14A11 11 0 0 0 1 12c0 1.78.43 3.46 1.14 4.95l3.69-2.85Z"/><path fill="#EA4335" d="M12 5.36c1.62 0 3.06.56 4.2 1.64l3.17-3.17A10.64 10.64 0 0 0 12 1a11 11 0 0 0-9.86 6.05L5.83 9.9C6.7 7.3 9.13 5.36 12 5.36Z"/></svg></div>
          <p class="eyebrow">Rocky + Google</p>
          <h2 id="gmail-title">Conecta Gmail en un clic</h2>
          <p id="gmail-copy" class="gmail-copy">Autoriza a Rocky para preparar borradores. Tú conservas la revisión y el envío desde Gmail.</p>
          <span id="gmail-state" class="gmail-state">Consultando conexión…</span>
          <button id="connect-gmail" class="google-button" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.29-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.72 1.06-2.87 0-5.3-1.94-6.17-4.54H2.14v2.85A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.83 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.34-2.1V7.05H2.14A11 11 0 0 0 1 12c0 1.78.43 3.46 1.14 4.95l3.69-2.85Z"/><path fill="#EA4335" d="M12 5.36c1.62 0 3.06.56 4.2 1.64l3.17-3.17A10.64 10.64 0 0 0 12 1a11 11 0 0 0-9.86 6.05L5.83 9.9C6.7 7.3 9.13 5.36 12 5.36Z"/></svg><span>Continuar con Google</span></button>
          <p class="security-note"><span>🔒</span> Acceso protegido con OAuth · Rocky no conoce tu contraseña</p>
          <div id="gmail-feedback" class="gmail-feedback"></div>
        </div>
        <section class="team-panel">
          <h3>Equipo autorizado</h3>
          <p>Invita primero el correo. Después esa persona abre este panel y pulsa “Continuar con Google”.</p>
          <form id="member-form" class="member-form">
            <input id="member-email" type="email" autocomplete="off" placeholder="integrante@pucp.edu.pe" required />
            <button id="add-member" type="submit">Agregar persona</button>
          </form>
          <div id="member-list" class="member-list"><span class="subtitle">Consultando equipo…</span></div>
        </section>
        <section class="team-panel">
          <h3>Campañas</h3>
          <p>Crea la campaña y asigna cuántos destinatarios gestionará cada integrante.</p>
          <form id="campaign-form" class="campaign-form">
            <input id="campaign-name" placeholder="Open World" required />
            <input id="campaign-slug" placeholder="open-world" required />
            <button type="submit">Crear</button>
          </form>
          <form id="assignment-form" class="campaign-form">
            <input id="assignment-slug" placeholder="open-world" required />
            <select id="assignment-email" required></select>
            <input id="assignment-count" type="number" min="0" value="0" aria-label="Cantidad de destinatarios" required />
            <button type="submit">Asignar</button>
          </form>
          <div id="campaign-list" class="campaign-list"><span class="subtitle">Todavía no hay campañas.</span></div>
        </section>
        <details id="gmail-tools" class="gmail-tools">
          <summary>Crear un borrador de prueba</summary>
          <form id="draft-form" class="gmail-form">
          <div class="field"><label for="draft-account">Cuenta que crea el borrador</label><select id="draft-account" required></select></div>
          <div class="field"><label for="draft-to">Destinatario</label><input id="draft-to" type="email" autocomplete="off" placeholder="estudiante@pucp.edu.pe" required /></div>
          <div class="field"><label for="draft-campaign">Campaña (opcional)</label><input id="draft-campaign" autocomplete="off" placeholder="open-world" /><small>Si existe una asignación, Rocky registrará el borrador.</small></div>
          <div class="field"><label for="draft-subject">Asunto</label><input id="draft-subject" required value="Invitación de Breakout" /></div>
          <div class="field"><label for="draft-html">Contenido HTML</label><textarea id="draft-html" required><div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#20243a">
  <h1 style="color:#2430ff">Breakout</h1>
  <p>Hola,</p>
  <p>Este es un borrador de prueba creado por Rocky. Revísalo en Gmail antes de enviarlo.</p>
</div></textarea></div>
          <button id="create-draft" type="submit" disabled>Crear borrador de prueba</button>
          <div id="draft-success" class="success"></div>
          </form>
        </details>
      </div>
    </section>
    <footer>Disponible solo en esta máquina · No expongas el panel ni el QR públicamente.</footer>
  </main>
  <script>
    const labels = { starting: 'Iniciando', waiting_for_qr: 'Esperando QR', connecting: 'Conectando', connected: 'Conectado', reconnecting: 'Reconectando', disconnected: 'Desconectado', logged_out: 'Sesión cerrada', error: 'Error' };
    const tokenInput = document.querySelector('#token');
    tokenInput.value = localStorage.getItem('rocky-token') || '';
    tokenInput.addEventListener('change', () => { localStorage.setItem('rocky-token', tokenInput.value); connectEvents(); });
    const formatDate = value => value ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(value)) : '—';
    function authUrl(path) { const token = tokenInput.value.trim(); return token ? path + '?token=' + encodeURIComponent(token) : path; }
    function render(status) {
      const pill = document.querySelector('#status-pill');
      pill.className = 'pill ' + status.phase;
      document.querySelector('#phase').textContent = labels[status.phase] || status.phase;
      document.querySelector('#phone').textContent = status.phone ? '+' + status.phone : '—';
      document.querySelector('#connected-at').textContent = formatDate(status.lastConnectedAt);
      document.querySelector('#qr-at').textContent = formatDate(status.qrUpdatedAt);
      document.querySelector('#attempts').textContent = status.reconnectAttempt;
      document.querySelector('#messages-seen').textContent = status.messagesSeen;
      document.querySelector('#response-at').textContent = formatDate(status.lastResponseAt);
      document.querySelector('#agent-state').textContent = status.agentBusy ? 'Trabajando…' : status.lastAgentError ? 'Error' : 'Disponible';
      document.querySelector('#agent-memory').textContent = status.agentThreadActive ? 'Activa' : 'Nueva';
      const qr = document.querySelector('#qr'); const empty = document.querySelector('#empty'); const instruction = document.querySelector('#instruction');
      if (status.qrDataUrl) { qr.src = status.qrDataUrl; qr.style.display = 'block'; empty.style.display = 'none'; }
      else { qr.style.display = 'none'; empty.style.display = 'block'; instruction.textContent = status.phase === 'connected' ? 'WhatsApp está vinculado. Ya puedes cerrar esta página.' : status.phase === 'logged_out' ? 'La sesión fue cerrada desde WhatsApp. Reinicia la sesión para obtener un QR nuevo.' : 'Rocky está estableciendo la conexión con WhatsApp.'; }
      const error = document.querySelector('#error'); error.textContent = status.lastError || ''; error.style.display = status.lastError ? 'block' : 'none';
      const groups = document.querySelector('#groups'); groups.replaceChildren();
      if (!status.groups.length) { const emptyGroup = document.createElement('span'); emptyGroup.className = 'subtitle'; emptyGroup.textContent = status.phase === 'connected' ? 'No se encontraron grupos.' : 'Disponible al conectar WhatsApp.'; groups.append(emptyGroup); }
      for (const group of status.groups) { const row = document.createElement('div'); row.className = 'group'; const name = document.createElement('span'); name.textContent = group.name; const count = document.createElement('small'); count.textContent = group.participants + ' miembros'; row.append(name, count); groups.append(row); }
    }
    async function loadStatus() { const response = await fetch(authUrl('/api/status'), { cache: 'no-store' }); if (response.ok) render(await response.json()); }
    async function loadGmailStatus() {
      const response = await fetch(authUrl('/api/integrations/google/status'), { cache: 'no-store' });
      const card = document.querySelector('#gmail-card'); const state = document.querySelector('#gmail-state'); const connect = document.querySelector('#connect-gmail'); const connectLabel = connect.querySelector('span'); const create = document.querySelector('#create-draft'); const title = document.querySelector('#gmail-title'); const copy = document.querySelector('#gmail-copy');
      if (!response.ok) { state.textContent = 'Sin acceso'; return; }
      const gmail = await response.json();
      card.classList.toggle('connected', gmail.connected);
      state.className = 'gmail-state' + (gmail.connected ? ' connected' : '');
      state.textContent = gmail.connected ? 'Gmail conectado' : gmail.configured ? 'Listo para conectar' : 'Falta configuración';
      title.textContent = gmail.connected ? 'Tu Gmail ya está conectado' : 'Conecta Gmail en un clic';
      copy.textContent = gmail.connected ? 'Rocky puede preparar borradores para que tú los revises y envíes desde Gmail.' : 'Autoriza a Rocky para preparar borradores. Tú conservas la revisión y el envío desde Gmail.';
      connectLabel.textContent = gmail.connected ? 'Cambiar cuenta de Google' : 'Continuar con Google';
      connect.disabled = !gmail.configured;
      create.disabled = !gmail.connected;
      const account = document.querySelector('#draft-account'); account.replaceChildren();
      for (const item of gmail.accounts) { const option = document.createElement('option'); option.value = item.email; option.textContent = item.name ? item.name + ' · ' + item.email : item.email; account.append(option); }
      const memberList = document.querySelector('#member-list'); memberList.replaceChildren();
      const assignmentEmail = document.querySelector('#assignment-email'); assignmentEmail.replaceChildren();
      if (!gmail.members.length) { const empty = document.createElement('span'); empty.className = 'subtitle'; empty.textContent = 'Agrega al primer integrante; será el propietario.'; memberList.append(empty); }
      for (const member of gmail.members) { const row = document.createElement('div'); row.className = 'member-item'; const email = document.createElement('span'); email.textContent = member.email; const status = document.createElement('small'); status.textContent = member.status === 'connected' ? 'Conectado' : 'Invitado'; row.append(email, status); memberList.append(row); const memberOption = document.createElement('option'); memberOption.value = member.email; memberOption.textContent = member.email; assignmentEmail.append(memberOption); }
    }
    async function loadCampaigns() {
      const response = await fetch(authUrl('/api/campaigns'), { cache: 'no-store' }); if (!response.ok) return;
      const body = await response.json(); const list = document.querySelector('#campaign-list'); list.replaceChildren();
      if (!body.campaigns.length) { const empty = document.createElement('span'); empty.className = 'subtitle'; empty.textContent = 'Todavía no hay campañas.'; list.append(empty); return; }
      for (const campaign of body.campaigns) { const item = document.createElement('div'); item.className = 'campaign-item'; const title = document.createElement('strong'); title.textContent = campaign.name; const detail = document.createElement('small'); const sent = campaign.assignments.filter(entry => entry.status === 'sent').length; detail.textContent = campaign.slug + ' · ' + sent + '/' + campaign.assignments.length + ' integrantes enviados'; item.append(title, detail); list.append(item); }
    }
    function startGmailParticles() {
      const canvas = document.querySelector('#gmail-particles');
      if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const context = canvas.getContext('2d'); const host = canvas.parentElement; let width = 0; let height = 0; let particles = [];
      const reset = () => {
        const ratio = Math.min(devicePixelRatio || 1, 2); width = host.clientWidth; height = host.clientHeight;
        canvas.width = Math.floor(width * ratio); canvas.height = Math.floor(height * ratio); context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const total = Math.max(24, Math.min(62, Math.floor(width / 18)));
        particles = Array.from({ length: total }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .32, vy: (Math.random() - .5) * .32, r: Math.random() * 1.7 + .7 }));
      };
      const draw = () => {
        context.clearRect(0, 0, width, height);
        for (let index = 0; index < particles.length; index += 1) {
          const particle = particles[index]; particle.x += particle.vx; particle.y += particle.vy;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
          context.beginPath(); context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2); context.fillStyle = '#91a0ffb8'; context.fill();
          for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
            const other = particles[otherIndex]; const dx = particle.x - other.x; const dy = particle.y - other.y; const distance = Math.hypot(dx, dy);
            if (distance < 125) { context.beginPath(); context.moveTo(particle.x, particle.y); context.lineTo(other.x, other.y); context.strokeStyle = 'rgba(151,164,255,' + ((1 - distance / 125) * .24) + ')'; context.lineWidth = 1; context.stroke(); }
          }
        }
        requestAnimationFrame(draw);
      };
      new ResizeObserver(reset).observe(host); reset(); draw();
    }
    let events;
    function connectEvents() { if (events) events.close(); events = new EventSource(authUrl('/api/events')); events.onmessage = event => render(JSON.parse(event.data)); events.onerror = () => setTimeout(loadStatus, 1500); }
    document.querySelector('#reconnect').addEventListener('click', async event => { const button = event.currentTarget; button.disabled = true; try { await fetch('/api/reconnect', { method: 'POST', headers: tokenInput.value ? { Authorization: 'Bearer ' + tokenInput.value } : {} }); await loadStatus(); } finally { button.disabled = false; } });
    document.querySelector('#test-message').addEventListener('click', async event => { const button = event.currentTarget; button.disabled = true; try { const response = await fetch('/api/test-message', { method: 'POST', headers: tokenInput.value ? { Authorization: 'Bearer ' + tokenInput.value } : {} }); if (!response.ok) { const body = await response.json(); throw new Error(body.error || 'No se pudo enviar'); } await loadStatus(); } catch (error) { alert(error.message); } finally { button.disabled = false; } });
    document.querySelector('#connect-gmail').addEventListener('click', () => { window.location.href = authUrl('/api/integrations/google/connect'); });
    document.querySelector('#member-form').addEventListener('submit', async event => {
      event.preventDefault(); const button = document.querySelector('#add-member'); const input = document.querySelector('#member-email'); button.disabled = true;
      try {
        const response = await fetch('/api/workspace/members', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(tokenInput.value ? { Authorization: 'Bearer ' + tokenInput.value } : {}) }, body: JSON.stringify({ email: input.value }) });
        const body = await response.json(); if (!response.ok) throw new Error(body.error || 'No se pudo agregar'); input.value = ''; await loadGmailStatus();
      } catch (error) { alert(error.message); } finally { button.disabled = false; }
    });
    document.querySelector('#campaign-form').addEventListener('submit', async event => {
      event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); button.disabled = true;
      try { const response = await fetch('/api/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(tokenInput.value ? { Authorization: 'Bearer ' + tokenInput.value } : {}) }, body: JSON.stringify({ name: document.querySelector('#campaign-name').value, slug: document.querySelector('#campaign-slug').value }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error || 'No se pudo crear'); document.querySelector('#assignment-slug').value = body.campaign.slug; await loadCampaigns(); } catch (error) { alert(error.message); } finally { button.disabled = false; }
    });
    document.querySelector('#assignment-form').addEventListener('submit', async event => {
      event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); const slug = document.querySelector('#assignment-slug').value; button.disabled = true;
      try { const response = await fetch('/api/campaigns/' + encodeURIComponent(slug) + '/assignments', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(tokenInput.value ? { Authorization: 'Bearer ' + tokenInput.value } : {}) }, body: JSON.stringify({ email: document.querySelector('#assignment-email').value, assignedRecipients: Number(document.querySelector('#assignment-count').value) }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error || 'No se pudo asignar'); await loadCampaigns(); } catch (error) { alert(error.message); } finally { button.disabled = false; }
    });
    document.querySelector('#draft-form').addEventListener('submit', async event => {
      event.preventDefault(); const button = document.querySelector('#create-draft'); const success = document.querySelector('#draft-success'); button.disabled = true; success.style.display = 'none';
      try {
        const response = await fetch('/api/integrations/google/drafts', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(tokenInput.value ? { Authorization: 'Bearer ' + tokenInput.value } : {}) }, body: JSON.stringify({ accountEmail: document.querySelector('#draft-account').value, campaignSlug: document.querySelector('#draft-campaign').value, to: document.querySelector('#draft-to').value, subject: document.querySelector('#draft-subject').value, html: document.querySelector('#draft-html').value }) });
        const body = await response.json(); if (!response.ok) throw new Error(body.error || 'No se pudo crear el borrador');
        success.textContent = 'Borrador creado en Gmail. ID: ' + body.draft.id; success.style.display = 'block';
      } catch (error) { alert(error.message); } finally { button.disabled = false; }
    });
    const googleParams = new URLSearchParams(location.search); const googleResult = googleParams.get('google'); const gmailFeedback = document.querySelector('#gmail-feedback');
    if (googleResult === 'connected') { gmailFeedback.textContent = 'Cuenta conectada correctamente: ' + (googleParams.get('email') || 'Google'); gmailFeedback.style.display = 'block'; gmailFeedback.style.color = '#9df0bd'; gmailFeedback.style.background = '#173526'; history.replaceState({}, '', '/'); }
    if (googleResult === 'error') { gmailFeedback.textContent = googleParams.get('message') || 'No se pudo conectar Gmail'; gmailFeedback.style.display = 'block'; history.replaceState({}, '', '/'); }
    startGmailParticles(); loadGmailStatus();
    if (!document.body.classList.contains('google-only')) { loadStatus(); loadCampaigns(); connectEvents(); }
  </script>
</body>
</html>`;

export function renderAdminPage(googleOnly: boolean): string {
  return googleOnly
    ? adminPage.replace("<body>", '<body class="google-only">')
    : adminPage;
}
