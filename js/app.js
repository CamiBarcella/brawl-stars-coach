// Utilidades compartidas y UI base
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getBrawler(id) {
    return (window.BS_DATA?.brawlers || []).find((b) => b.id === id);
  }
  function getMode(id) {
    return (window.BS_DATA?.modes || []).find((m) => m.id === id);
  }
  function getModeName(id) {
    return getMode(id)?.name || id || "—";
  }
  function brawlerName(id) {
    return getBrawler(id)?.name || id || "—";
  }

  function ratingBadge(rating) {
    const map = {
      favorable: { label: "Favorable", cls: "good" },
      neutral: { label: "Neutral", cls: "neutral" },
      desfavorable: { label: "Desfavorable", cls: "bad" }
    };
    const r = map[rating] || { label: rating, cls: "" };
    return `<span class="badge ${r.cls}">${r.label}</span>`;
  }

  function formatDate(iso) {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return iso; }
  }

  function setStatus(el, msg, type = "info") {
    if (!el) return;
    el.className = `status-msg ${type}`;
    el.textContent = msg;
    el.classList.remove("hidden");
  }
  function clearStatus(el) {
    if (!el) return;
    el.textContent = "";
    el.className = "status-msg hidden";
  }

  function initNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    $$(".nav-links a[data-page]").forEach((a) => {
      if (a.dataset.page === path) a.classList.add("active");
    });
    const toggle = $(".nav-toggle");
    const links = $(".nav-links");
    toggle?.addEventListener("click", () => links?.classList.toggle("open"));

    // Auth-aware nav
    const authArea = $("#nav-auth");
    async function renderAuth(user) {
      if (!authArea) return;
      if (user) {
        const name = user.user_metadata?.username || user.email?.split("@")[0] || "Usuario";
        authArea.innerHTML = `
          <a class="btn btn-ghost btn-sm" href="profile.html" title="${escapeHtml(user.email || "")}">${escapeHtml(name)}</a>
          <button class="btn btn-secondary btn-sm" id="nav-logout">Salir</button>`;
        $("#nav-logout")?.addEventListener("click", async () => {
          await window.BSAuth?.signOut();
          location.href = "index.html";
        });
      } else {
        authArea.innerHTML = `<a class="btn btn-primary btn-sm" href="profile.html">Entrar</a>`;
      }
    }
    if (window.BSAuth) {
      window.BSAuth.getUser().then(renderAuth);
      window.BSAuth.onAuthChange(renderAuth);
    } else {
      renderAuth(null);
    }
  }

  function requireSupabaseNotice(containerId) {
    const el = document.getElementById(containerId);
    if (!el || window.BSAuth?.configured) return;
    el.innerHTML = `
      <div class="status-msg info">
        <strong>Supabase no configurado.</strong> Puedes usar la guía y los matchups, pero el registro, progreso y pruebas guardadas requieren configurar
        <code>js/supabase-config.js</code> y ejecutar <code>supabase/schema.sql</code>. Ver <code>README.md</code>.
      </div>`;
  }

  window.BSApp = {
    $, $$, escapeHtml, getBrawler, getMode, getModeName, brawlerName, ratingBadge,
    formatDate, setStatus, clearStatus, initNav, requireSupabaseNotice
  };

  document.addEventListener("DOMContentLoaded", initNav);
})();
