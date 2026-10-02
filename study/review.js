/* review.js — shared "questions to review" feature for Adventure Island quizzes.
   Include with <script src="review.js"></script> BEFORE the quiz's own <script>.
   Expects the quiz DOM to use: .question-en, .quiz-icon, .opt-btn[data-correct]. */
const Review = (() => {
  let missed = [];

  /* ---- styles (injected once, so quiz files need no extra CSS) ---- */
  const style = document.createElement("style");
  style.textContent = `
    .rv-card {
      border: 3px solid #333;
      border-radius: 14px;
      background: #fff;
      padding: 10px 12px;
      margin-bottom: 12px;
    }
    .rv-quiz {
      display: inline-block;
      font-family: var(--font-chalk, sans-serif);
      font-size: 0.8rem;
      color: #4a7a2a;
      margin-bottom: 6px;
    }
    .rv-body { display: flex; align-items: center; gap: 12px; }
    .rv-icon {
      width: 96px;
      height: 64px;
      flex-shrink: 0;
      border: 3px solid #333;
      border-radius: 10px;
      background: #f4f8ee;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 4px;
      overflow: hidden;
    }
    .rv-icon img { min-width: 0; max-width: 100%; max-height: 100%; object-fit: contain; }
    .rv-text { flex: 1; font-family: var(--font-chalk, sans-serif); font-weight: 700; }
    .rv-context { color: #333; font-size: 1.2rem; margin-bottom: 2px; }
    .rv-q { color: #333; margin-bottom: 4px; }
    .rv-context + .rv-q { color: #777; font-size: 0.85rem; }
    .rv-yours { color: var(--wrong, #e6483a); }
    .rv-correct { color: var(--correct, #38a446); }
    .rv-perfect {
      text-align: center;
      font-family: var(--font-chalk, sans-serif);
      font-size: 1.2rem;
      color: var(--correct, #38a446);
      margin-bottom: 14px;
    }
  `;
  document.head.appendChild(style);

  const LABELS = {
    ja: { title: "まちがえた もんだい", perfect: "🎉 ぜんぶ せいかい！" },
    en: { title: "Questions to review", perfect: "🎉 Perfect score! Nothing to review." },
  };

  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );

  function reset() {
    missed = [];
  }

  /* manual version: use this if a quiz file's DOM is different */
  function add({ quiz = "", prompt = "", iconHtml = "", context = "", yours = "", correct = "" }) {
    missed.push({ quiz, prompt, iconHtml, context, yours, correct });
  }

  /* automatic version: reads the question, icon and correct answer from the screen */
  function recordWrong(chosenBtn, quizLabel = "") {
    let prompt = "";
    const promptEls = document.querySelectorAll(".question-en");
    const promptEl = promptEls[promptEls.length - 1];
    if (promptEl) {
      const clone = promptEl.cloneNode(true);
      clone.querySelectorAll(".speak-btn").forEach((b) => b.remove());
      prompt = clone.textContent.trim();
    }
    /* .quiz-icon holds either a picture (img / svg / colour swatch) or text (a word / sentence) */
    let iconHtml = "";
    let context = "";
    const iconEl = document.querySelector(".quiz-icon");
    if (iconEl) {
      const c = iconEl.cloneNode(true);
      c.querySelectorAll(".speak-btn").forEach((b) => b.remove());
      if (c.querySelector("img, svg, div[style]")) iconHtml = c.innerHTML;
      else context = c.textContent.trim();
    }
    const correctBtn = document.querySelector('.opt-btn[data-correct="true"]');
    add({
      quiz: quizLabel,
      prompt,
      iconHtml,
      context,
      yours: chosenBtn.textContent.trim(),
      correct: correctBtn ? correctBtn.textContent.trim() : "",
    });
  }

  /* returns the HTML to drop into the final score screen */
  function html(lang = "ja") {
    const L = LABELS[lang] || LABELS.ja;
    if (!missed.length) {
      return `<div class="rv-perfect">${L.perfect}</div>`;
    }
    return (
      `<h2 class="section-title">${L.title}</h2>` +
      missed
        .map(
          (m) => `
        <div class="rv-card">
          ${m.quiz ? `<div class="rv-quiz">${esc(m.quiz)}</div>` : ""}
          <div class="rv-body">
            ${m.iconHtml ? `<div class="rv-icon">${m.iconHtml}</div>` : ""}
            <div class="rv-text">
              ${m.context ? `<div class="rv-context">${esc(m.context)}</div>` : ""}
              <div class="rv-q">${esc(m.prompt)}</div>
              <div class="rv-yours">✗ ${esc(m.yours)}</div>
              <div class="rv-correct">✓ ${esc(m.correct)}</div>
            </div>
          </div>
        </div>`,
        )
        .join("")
    );
  }

  return { reset, add, recordWrong, html };
})();