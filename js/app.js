import { fetchData } from "../utils/httpReq.js";

const questionContainer = document.getElementById("question-container");
const e2p = (s) => s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);


const render = async () => {
  const questionsData = await fetchData();
  questionsData.forEach((question) => {
    const questionHTML = `
    <div class="question">
        <h3>${e2p(question.title)} <i class="fas fa-arrow-alt-circle-down toggle-icon"></i></h3>
        <div class="answer">
            <p>${question.answer}</p>
        </div>
    </div>
      `;
    questionContainer.innerHTML += questionHTML;
  });
};

const initHandler = async () => {
  await render();
  const allQuestions = document.querySelectorAll(".question");
  allQuestions.forEach((question) => {
    question.addEventListener("click", (event) => {
      if (event.target.tagName === "H3" || event.target.tagName === "I") {
        const answer = question.querySelector(".answer");
        const allAnswers = document.querySelectorAll(".answer");
        allAnswers.forEach((ans) => {
          if (ans !== answer && ans.classList.contains("show")) {
            ans.classList.remove("show");
            const icon = ans.closest(".question").querySelector(".toggle-icon");
            icon.classList.remove("rotate");
          }
        });
        answer.classList.toggle("show");
        const icon = question.querySelector(".toggle-icon");
        icon.classList.toggle("rotate");
      }
    });
  });
};


document.addEventListener("DOMContentLoaded", initHandler);
