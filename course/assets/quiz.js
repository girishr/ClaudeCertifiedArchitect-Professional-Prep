/* Reusable quiz component for the CCAR-P teaching workspace.
 *
 * Markup contract:
 *
 *   <div class="quiz" data-answer="B">
 *     <p class="scenario">...binding constraint buried in here...</p>
 *     <p class="stem">Which approach...?</p>
 *     <ol class="options">
 *       <li data-key="A" data-why="Right for X, wrong here because Y.">Option text</li>
 *       ...
 *     </ol>
 *     <div class="verdict" hidden>Why the answer is the answer.</div>
 *   </div>
 *
 * Multi-answer: data-answer="B,D". Feedback is immediate and per-option, because
 * the point of the drill is the reason, not the score.
 */
(function () {
  "use strict";

  function init(quiz) {
    var answer = (quiz.dataset.answer || "").split(",").map(function (s) { return s.trim(); });
    var multi = answer.length > 1;
    var options = Array.prototype.slice.call(quiz.querySelectorAll(".options li"));
    var verdict = quiz.querySelector(".verdict");
    var picked = [];
    var settled = false;

    if (multi) {
      var hint = document.createElement("p");
      hint.className = "quiz-hint";
      hint.textContent = "Select " + (answer.length === 3 ? "THREE" : "TWO") + ".";
      quiz.querySelector(".stem").insertAdjacentElement("afterend", hint);
    }

    var status = document.createElement("p");
    status.className = "quiz-status";
    status.setAttribute("role", "status");
    // Verdict explains, status scores. Score reads first, so insert above the verdict.
    if (verdict) quiz.insertBefore(status, verdict); else quiz.appendChild(status);

    options.forEach(function (li) {
      li.tabIndex = 0;
      li.setAttribute("role", "button");
      li.addEventListener("click", function () { choose(li); });
      li.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(li); }
      });
    });

    function choose(li) {
      if (settled) return;
      var key = li.dataset.key;
      if (picked.indexOf(key) === -1) picked.push(key);
      li.classList.add("chosen");
      if (!multi || picked.length === answer.length) settle();
    }

    function settle() {
      settled = true;
      var right = picked.length === answer.length && picked.every(function (k) {
        return answer.indexOf(k) !== -1;
      });

      options.forEach(function (li) {
        var key = li.dataset.key;
        var isAnswer = answer.indexOf(key) !== -1;
        var wasPicked = picked.indexOf(key) !== -1;
        li.classList.add(isAnswer ? "is-right" : wasPicked ? "is-wrong" : "is-idle");
        li.tabIndex = -1;
        li.removeAttribute("role");

        if (li.dataset.why) {
          var why = document.createElement("span");
          why.className = "why";
          why.textContent = li.dataset.why;
          li.appendChild(why);
        }
      });

      status.textContent = right
        ? "Correct."
        : "Not this time. The answer is " + answer.join(" and ") + ".";
      status.classList.add(right ? "right" : "wrong");

      if (verdict) verdict.hidden = false;
      quiz.dispatchEvent(new CustomEvent("quiz:settled", { bubbles: true, detail: { right: right } }));
    }
  }

  function scoreboard() {
    var quizzes = document.querySelectorAll(".quiz");
    var board = document.querySelector("[data-quiz-score]");
    if (!board || !quizzes.length) return;
    var done = 0, right = 0;
    document.addEventListener("quiz:settled", function (e) {
      done++; if (e.detail.right) right++;
      board.textContent = right + " of " + done + " right, " + quizzes.length + " in this lesson.";
    });
  }

  function boot() {
    document.querySelectorAll(".quiz").forEach(init);
    scoreboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
