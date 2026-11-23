(function () {
  const { $, escapeHtml, getModeName, brawlerName } = window.BSApp;
  const data = window.BS_DATA;

  function renderModes() {
    const el = $("#modes-container");
    el.innerHTML = data.modes.map((m) => `
      <article class="panel card">
        <div class="card-icon">🎯</div>
        <h3>${escapeHtml(m.name)}</h3>
        <p>${escapeHtml(m.objective)}</p>
        <div class="pill-list">${m.tips.map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join("")}</div>
      </article>`).join("");
  }

  function renderMaps() {
    const mode = $("#mode-filter").value;
    const q = $("#search-map").value.trim().toLowerCase();
    const maps = data.maps.filter((m) => (!mode || m.mode === mode) && (!q || m.name.toLowerCase().includes(q)));
    const el = $("#maps-container");
    if (!maps.length) {
      el.innerHTML = '<div class="empty">No hay mapas que coincidan con el filtro.</div>';
      return;
    }
    el.innerHTML = maps.map((m) => `
      <article class="panel map-card">
        <div class="result-head">
          <div>
            <h3>${escapeHtml(m.name)}</h3>
            <div class="map-meta">${escapeHtml(getModeName(m.mode))} · ${escapeHtml(m.type)}</div>
          </div>
          <span class="badge">${escapeHtml(getModeName(m.mode))}</span>
        </div>
        <div class="kv">
          <div class="kv-row"><div class="k">Recomendados</div><div class="v">${m.recommended.map((id) => `<span class="pill">${escapeHtml(brawlerName(id))}</span>`).join(" ")}</div></div>
          <div class="kv-row"><div class="k">Evitar</div><div class="v">${m.avoid.map((id) => `<span class="badge bad">${escapeHtml(brawlerName(id))}</span>`).join(" ")}</div></div>
          <div class="kv-row"><div class="k">Nota</div><div class="v muted">${escapeHtml(m.notes)}</div></div>
        </div>
      </article>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const modeSel = $("#mode-filter");
    modeSel.innerHTML = `<option value="">Todos los modos</option>` +
      data.modes.map((m) => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.name)}</option>`).join("");
    renderModes();
    renderMaps();
    modeSel.addEventListener("change", renderMaps);
    $("#search-map").addEventListener("input", renderMaps);
  });
})();
