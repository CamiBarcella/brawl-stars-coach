(function () {
  const { $, escapeHtml, setStatus, clearStatus, formatDate, requireSupabaseNotice, brawlerName, getModeName } = window.BSApp;
  const data = window.BS_DATA;
  let currentUser = null;

  function populateBrawlerSelects() {
    const opts = data.brawlers.map((b) => `<option value="${escapeHtml(b.id)}">${escapeHtml(b.name)}</option>`).join("");
    $("#favorite-brawler").innerHTML = `<option value="">Selecciona...</option>` + opts;
    $("#stat-brawler").innerHTML = opts;
    $("#stat-mode").innerHTML = `<option value="">Cualquier modo</option>` +
      data.modes.map((m) => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.name)}</option>`).join("");
  }

  function showView() {
    const authView = $("#auth-view");
    const profileView = $("#profile-view");
    if (currentUser) {
      authView.classList.add("hidden");
      profileView.classList.remove("hidden");
    } else {
      authView.classList.remove("hidden");
      profileView.classList.add("hidden");
    }
  }

  async function loadProfile() {
    if (!currentUser) return;
    $("#profile-email").textContent = currentUser.email || "—";
    const { data: profile } = await window.BSAuth.getProfile(currentUser.id);
    $("#display-name").value = profile?.display_name || currentUser.user_metadata?.username || "";
    $("#favorite-brawler").value = profile?.favorite_brawler || "";
  }

  async function loadSummary() {
    if (!currentUser) return;
    const [progressRes, attemptsRes, statsRes] = await Promise.all([
      window.BSAuth.getCourseProgress(currentUser.id),
      window.BSAuth.getQuizAttempts(currentUser.id),
      window.BSAuth.getBrawlerStats(currentUser.id)
    ]);
    const progress = progressRes.data || [];
    const attempts = attemptsRes.data || [];
    const stats = statsRes.data || [];

    $("#summary-lessons").textContent = progress.filter((p) => p.completed).length;
    $("#summary-quizzes").textContent = attempts.length;
    const best = attempts.reduce((acc, a) => Math.max(acc, Math.round((a.score / a.total) * 100)), -1);
    $("#summary-best").textContent = best >= 0 ? best + "%" : "—";
    $("#summary-stats").textContent = stats.length;

    renderAttempts(attempts);
    renderStats(stats);
  }

  function renderAttempts(attempts) {
    const body = $("#attempts-body");
    if (!attempts.length) { body.innerHTML = '<tr><td colspan="3" class="muted">Sin intentos.</td></tr>'; return; }
    body.innerHTML = attempts.map((a) => `
      <tr>
        <td>${escapeHtml(a.quiz_id)}</td>
        <td>${a.score}/${a.total} (${Math.round((a.score / a.total) * 100)}%)</td>
        <td>${escapeHtml(formatDate(a.created_at))}</td>
      </tr>`).join("");
  }

  function renderStats(stats) {
    const body = $("#stats-body");
    if (!stats.length) { body.innerHTML = '<tr><td colspan="7" class="muted">Sin datos.</td></tr>'; return; }
    body.innerHTML = stats.map((s) => `
      <tr>
        <td>${escapeHtml(brawlerName(s.brawler) || s.brawler)}</td>
        <td>${escapeHtml(s.mode ? getModeName(s.mode) : "—")}</td>
        <td>${escapeHtml(s.map_name || "—")}</td>
        <td>${s.wins}/${s.losses}</td>
        <td>${escapeHtml(s.notes || "—")}</td>
        <td>${escapeHtml(formatDate(s.updated_at || s.created_at))}</td>
        <td><button class="btn btn-danger btn-sm stat-delete" data-id="${escapeHtml(s.id)}">Borrar</button></td>
      </tr>`).join("");
    body.querySelectorAll(".stat-delete").forEach((btn) => btn.addEventListener("click", async () => {
      btn.disabled = true;
      const { error } = await window.BSAuth.deleteBrawlerStat(btn.dataset.id, currentUser.id);
      if (error) { alert(error.message); btn.disabled = false; return; }
      await loadSummary();
    }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    const status = $("#login-status");
    clearStatus(status);
    if (!window.BSAuth?.configured) return setStatus(status, "Configura Supabase primero.", "error");
    const email = $("#login-email").value.trim();
    const password = $("#login-password").value;
    setStatus(status, "Iniciando sesión...", "info");
    const { error } = await window.BSAuth.signIn({ email, password });
    if (error) return setStatus(status, error.message, "error");
    setStatus(status, "Sesión iniciada.", "success");
  }

  async function handleRegister(e) {
    e.preventDefault();
    const status = $("#register-status");
    clearStatus(status);
    if (!window.BSAuth?.configured) return setStatus(status, "Configura Supabase primero.", "error");
    const username = $("#register-username").value.trim();
    const email = $("#register-email").value.trim();
    const password = $("#register-password").value;
    setStatus(status, "Creando cuenta...", "info");
    const { data: res, error } = await window.BSAuth.signUp({ email, password, username });
    if (error) return setStatus(status, error.message, "error");
    if (res?.session) {
      setStatus(status, "Cuenta creada e iniciada.", "success");
    } else {
      setStatus(status, "Cuenta creada. Revisa tu email si la confirmación está habilitada, luego inicia sesión.", "success");
    }
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    const status = $("#profile-status");
    clearStatus(status);
    const row = {
      id: currentUser.id,
      display_name: $("#display-name").value.trim(),
      favorite_brawler: $("#favorite-brawler").value || null
    };
    setStatus(status, "Guardando...", "info");
    const { error } = await window.BSAuth.upsertProfile(row);
    if (error) return setStatus(status, error.message, "error");
    setStatus(status, "Perfil guardado.", "success");
  }

  async function handleStatAdd(e) {
    e.preventDefault();
    const status = $("#stat-status");
    clearStatus(status);
    const row = {
      user_id: currentUser.id,
      brawler: $("#stat-brawler").value,
      mode: $("#stat-mode").value || null,
      map_name: $("#stat-map").value.trim() || null,
      wins: Math.max(0, Number($("#stat-wins").value || 0)),
      losses: Math.max(0, Number($("#stat-losses").value || 0)),
      notes: $("#stat-notes").value.trim() || null
    };
    setStatus(status, "Guardando...", "info");
    const { error } = await window.BSAuth.addBrawlerStat(row);
    if (error) return setStatus(status, error.message, "error");
    setStatus(status, "Estadística guardada.", "success");
    $("#stat-form").reset();
    $("#stat-wins").value = 0;
    $("#stat-losses").value = 0;
    await loadSummary();
  }

  async function refresh() {
    showView();
    if (currentUser) {
      await loadProfile();
      await loadSummary();
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    requireSupabaseNotice("supabase-notice");
    populateBrawlerSelects();
    $("#login-form").addEventListener("submit", handleLogin);
    $("#register-form").addEventListener("submit", handleRegister);
    $("#profile-form").addEventListener("submit", handleProfileSave);
    $("#stat-form").addEventListener("submit", handleStatAdd);
    $("#logout-btn").addEventListener("click", async () => { await window.BSAuth.signOut(); });

    if (window.BSAuth) {
      currentUser = await window.BSAuth.getUser();
      window.BSAuth.onAuthChange(async (user) => { currentUser = user; await refresh(); });
    }
    await refresh();
  });
})();
