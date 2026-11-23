(function () {
  const { $, $$, escapeHtml, setStatus, clearStatus, requireSupabaseNotice } = window.BSApp;
  const data = window.BS_DATA;
  let currentUser = null;
  let progressRows = [];

  function lessonCompleted(id) {
    return progressRows.some((r) => r.lesson_id === id && r.completed);
  }

  function renderProgress() {
    const total = data.lessons.length;
    const done = data.lessons.filter((l) => lessonCompleted(l.id)).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    $("#progress-bar").style.width = pct + "%";
    $("#progress-text").textContent = pct + "%";
    $("#progress-detail").textContent = currentUser
      ? `${done} de ${total} lecciones completadas. Guardado en Supabase.`
      : `${done} de ${total} lecciones marcadas en esta sesión. Inicia sesión para guardar en Supabase.`;
  }

  function renderLessons() {
    const container = $("#lessons-container");
    container.innerHTML = data.lessons.map((lesson) => {
      const done = lessonCompleted(lesson.id);
      return `
        <article class="panel lesson-card ${done ? "completed" : ""}" id="lesson-${escapeHtml(lesson.id)}">
          <div class="lesson-head">
            <div>
              <div class="eyebrow">${escapeHtml(lesson.level)}</div>
              <h3>${escapeHtml(lesson.title)}</h3>
            </div>
            <span class="badge ${done ? "good" : ""}">${done ? "Completada" : "Pendiente"}</span>
          </div>
          <div class="lesson-content">
            ${lesson.content.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
            <div class="pill-list">${lesson.keyPoints.map((k) => `<span class="pill">${escapeHtml(k)}</span>`).join("")}</div>
          </div>
          <div class="mt-2">
            <button class="btn ${done ? "btn-secondary" : "btn-primary"} btn-sm lesson-toggle" data-id="${escapeHtml(lesson.id)}">
              ${done ? "Marcar como pendiente" : "Marcar como completada"}
            </button>
          </div>
        </article>`;
    }).join("");

    $$(".lesson-toggle").forEach((btn) => btn.addEventListener("click", () => toggleLesson(btn.dataset.id)));
  }

  async function toggleLesson(lessonId) {
    const done = lessonCompleted(lessonId);
    if (!currentUser || !window.BSAuth?.configured) {
      // Local-only fallback
      if (done) progressRows = progressRows.filter((r) => r.lesson_id !== lessonId);
      else progressRows.push({ lesson_id: lessonId, completed: true });
      renderLessons(); renderProgress();
      return;
    }
    const row = {
      user_id: currentUser.id,
      lesson_id: lessonId,
      completed: !done,
      completed_at: !done ? new Date().toISOString() : null
    };
    const { error } = await window.BSAuth.upsertLessonProgress(row);
    if (error) { alert("Error guardando progreso: " + error.message); return; }
    await loadProgress();
  }

  function renderQuiz() {
    const quiz = data.quizzes[0];
    if (!quiz) return;
    $("#quiz-title").textContent = quiz.title;
    $("#quiz-subtitle").textContent = `Responde las preguntas para evaluar lo aprendido.`;
    $("#quiz-form").innerHTML = quiz.questions.map((q, qi) => `
      <div class="question">
        <h4>${qi + 1}. ${escapeHtml(q.text)}</h4>
        <div class="options">
          ${q.options.map((opt, oi) => `
            <label class="option">
              <input type="radio" name="${escapeHtml(q.id)}" value="${oi}">
              <span>${escapeHtml(opt)}</span>
            </label>`).join("")}
        </div>
      </div>`).join("");
  }

  async function submitQuiz() {
    const quiz = data.quizzes[0];
    const resultEl = $("#quiz-result");
    clearStatus(resultEl);
    resultEl.classList.remove("good", "bad");

    let score = 0;
    const answers = [];
    for (const q of quiz.questions) {
      const selected = document.querySelector(`input[name="${q.id}"]:checked`);
      const value = selected ? Number(selected.value) : -1;
      answers.push({ questionId: q.id, selected: value, correct: q.answer });
      if (value === q.answer) score++;
    }
    const total = quiz.questions.length;
    const pct = Math.round((score / total) * 100);
    const pass = pct >= 70;
    resultEl.className = `quiz-result ${pass ? "good" : "bad"}`;
    resultEl.innerHTML = `
      <strong>${pass ? "¡Bien hecho!" : "Sigue practicando"}</strong>
      <p class="muted" style="margin:0.35rem 0 0;">Obtuviste ${score}/${total} (${pct}%). ${pass ? "Has demostrado una buena base." : "Revisa las lecciones e inténtalo de nuevo."}</p>`;

    if (currentUser && window.BSAuth?.configured) {
      const { error } = await window.BSAuth.saveQuizAttempt({
        user_id: currentUser.id,
        quiz_id: quiz.id,
        score,
        total,
        answers
      });
      if (error) {
        resultEl.innerHTML += `<p class="small" style="color:#ffb0b0;margin-top:0.5rem;">No se pudo guardar en Supabase: ${escapeHtml(error.message)}</p>`;
      } else {
        resultEl.innerHTML += `<p class="small muted" style="margin-top:0.5rem;">Intento guardado en Supabase.</p>`;
      }
    } else {
      resultEl.innerHTML += `<p class="small muted" style="margin-top:0.5rem;">Inicia sesión para guardar tus intentos en Supabase.</p>`;
    }
  }

  function resetQuiz() {
    $("#quiz-form").reset();
    const resultEl = $("#quiz-result");
    resultEl.className = "quiz-result hidden";
    resultEl.innerHTML = "";
  }

  async function loadProgress() {
    if (!currentUser || !window.BSAuth?.configured) { progressRows = []; renderLessons(); renderProgress(); return; }
    const { data: rows, error } = await window.BSAuth.getCourseProgress(currentUser.id);
    if (error) { console.error(error); progressRows = []; }
    else progressRows = rows || [];
    renderLessons();
    renderProgress();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    requireSupabaseNotice("supabase-notice");
    renderQuiz();
    $("#submit-quiz").addEventListener("click", submitQuiz);
    $("#reset-quiz").addEventListener("click", resetQuiz);

    if (window.BSAuth) {
      currentUser = await window.BSAuth.getUser();
      window.BSAuth.onAuthChange(async (user) => {
        currentUser = user;
        await loadProgress();
      });
    }
    await loadProgress();
  });
})();
