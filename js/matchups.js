(function () {
  const { $, escapeHtml, brawlerName, getModeName, ratingBadge } = window.BSApp;
  const data = window.BS_DATA;

  function fillSelect(select, items, getValue, getLabel, includeAny = false, anyLabel = "Todos") {
    const opts = [];
    if (includeAny) opts.push(`<option value="">${escapeHtml(anyLabel)}</option>`);
    opts.push(...items.map((it) => `<option value="${escapeHtml(getValue(it))}">${escapeHtml(getLabel(it))}</option>`));
    select.innerHTML = opts.join("");
  }

  function renderBrawlerSummary(id) {
    const b = data.brawlers.find((x) => x.id === id);
    const el = $("#brawler-summary");
    if (!b) { el.innerHTML = '<span class="muted">Selecciona un brawler.</span>'; return; }
    el.innerHTML = `
      <div class="result-item">
        <div class="result-head">
          <div>
            <div class="result-title">${escapeHtml(b.name)}</div>
            <div class="result-meta">${escapeHtml(b.class)} · Rango ${escapeHtml(b.range)}</div>
          </div>
        </div>
        <div class="kv">
          <div class="kv-row"><div class="k">Roles</div><div class="v">${b.roles.map(escapeHtml).join(", ")}</div></div>
          <div class="kv-row"><div class="k">Fortalezas</div><div class="v">${b.strengths.map(escapeHtml).join(", ")}</div></div>
          <div class="kv-row"><div class="k">Debilidades</div><div class="v">${b.weaknesses.map(escapeHtml).join(", ")}</div></div>
        </div>
      </div>`;
  }

  function renderGeneralTips() {
    const el = $("#general-tips");
    const tips = [
      "Revisa el rango: si te superan en distancia, busca cobertura o flanqueo.",
      "Guarda recursos clave (Super/gadget) para el momento decisivo.",
      "El matchup cambia según mapa: un brawler débil en abierto puede ser fuerte en arbustos.",
      "Juega por el objetivo del modo, no solo por eliminaciones."
    ];
    el.innerHTML = tips.map((t) => `<div class="result-item"><p>${escapeHtml(t)}</p></div>`).join("");
  }

  function findMatchups({ brawler, opponent, mode, map }) {
    // Exact first
    const exact = data.matchups.filter((m) =>
      m.brawler === brawler && m.opponent === opponent &&
      (!mode || m.mode === mode) && (!map || m.map === map)
    );
    if (exact.length) return { items: exact, exact: true };

    // Fallback: same pair, any mode/map
    const pair = data.matchups.filter((m) => m.brawler === brawler && m.opponent === opponent);
    if (pair.length) return { items: pair, exact: false };

    // Reverse pair: invert perspective
    const reverse = data.matchups.filter((m) => m.brawler === opponent && m.opponent === brawler);
    if (reverse.length) {
      const inv = { favorable: "desfavorable", desfavorable: "favorable", neutral: "neutral" };
      return {
        exact: false,
        reversed: true,
        items: reverse.map((m) => ({
          ...m,
          brawler,
          opponent,
          rating: inv[m.rating] || m.rating,
          tip: `Perspectiva invertida: ${m.tip}`
        }))
      };
    }
    return { items: [], exact: false };
  }

  function renderResult() {
    const brawler = $("#brawler").value;
    const opponent = $("#opponent").value;
    const mode = $("#mode").value;
    const map = $("#map").value;
    const out = $("#matchup-result");
    renderBrawlerSummary(brawler);

    if (!brawler || !opponent) {
      out.innerHTML = '<div class="empty">Selecciona tu brawler y un oponente.</div>';
      return;
    }
    if (brawler === opponent) {
      out.innerHTML = '<div class="empty">Elige dos brawlers diferentes para comparar.</div>';
      return;
    }

    const { items, exact, reversed } = findMatchups({ brawler, opponent, mode, map });
    if (!items.length) {
      const b = data.brawlers.find((x) => x.id === brawler);
      const o = data.brawlers.find((x) => x.id === opponent);
      out.innerHTML = `
        <div class="result-item">
          <div class="result-head"><div class="result-title">Sin matchup específico</div><span class="badge neutral">Estimación</span></div>
          <p>No hay un consejo exacto para esta combinación en la base de ejemplo. Compara rangos y roles: <strong>${escapeHtml(b?.name || brawler)}</strong> (${escapeHtml(b?.range || "?")}) vs <strong>${escapeHtml(o?.name || opponent)}</strong> (${escapeHtml(o?.range || "?")}).</p>
          <p class="small muted">Tip: prioriza cobertura si tienes menos rango, y mantén distancia si tienes ventaja de rango.</p>
        </div>`;
      return;
    }

    const note = !exact ? `<div class="status-msg info">Mostrando coincidencias cercanas${reversed ? " (perspectiva invertida)" : ""}. Para más precisión, agrega este matchup en <code>js/data.js</code>.</div>` : "";
    out.innerHTML = note + items.slice(0, 4).map((m) => `
      <div class="result-item">
        <div class="result-head">
          <div>
            <div class="result-title">${escapeHtml(brawlerName(m.brawler))} vs ${escapeHtml(brawlerName(m.opponent))}</div>
            <div class="result-meta">${escapeHtml(getModeName(m.mode))} · ${escapeHtml(m.map || "Mapa no especificado")}</div>
          </div>
          ${ratingBadge(m.rating)}
        </div>
        <p>${escapeHtml(m.tip)}</p>
      </div>`).join("");
  }

  function renderFeatured() {
    const el = $("#featured-matchups");
    el.innerHTML = data.matchups.slice(0, 6).map((m) => `
      <article class="panel map-card">
        <div class="result-head">
          <div>
            <h3>${escapeHtml(brawlerName(m.brawler))} vs ${escapeHtml(brawlerName(m.opponent))}</h3>
            <div class="map-meta">${escapeHtml(getModeName(m.mode))} · ${escapeHtml(m.map)}</div>
          </div>
          ${ratingBadge(m.rating)}
        </div>
        <p class="muted">${escapeHtml(m.tip)}</p>
      </article>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const brawlerSel = $("#brawler");
    const oppSel = $("#opponent");
    const modeSel = $("#mode");
    const mapSel = $("#map");
    fillSelect(brawlerSel, data.brawlers, (b) => b.id, (b) => b.name);
    fillSelect(oppSel, data.brawlers, (b) => b.id, (b) => b.name);
    fillSelect(modeSel, data.modes, (m) => m.id, (m) => m.name, true, "Cualquier modo");
    fillSelect(mapSel, data.maps, (m) => m.name, (m) => `${m.name} (${getModeName(m.mode)})`, true, "Cualquier mapa");

    // Default useful selection
    brawlerSel.value = "shelly";
    oppSel.value = "el-primo";
    modeSel.value = "gem-grab";
    mapSel.value = "Cavern Churn";

    renderGeneralTips();
    renderResult();
    renderFeatured();

    $("#check-matchup").addEventListener("click", renderResult);
    [brawlerSel, oppSel, modeSel, mapSel].forEach((s) => s.addEventListener("change", renderResult));
    $("#swap-brawlers").addEventListener("click", () => {
      const a = brawlerSel.value;
      brawlerSel.value = oppSel.value;
      oppSel.value = a;
      renderResult();
    });
  });
})();
