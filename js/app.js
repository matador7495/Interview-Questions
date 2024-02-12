import { fetchData } from "../utils/httpReq.js";

const questionContainer = document.getElementById("question-container");
const paginationContainer = document.querySelector(".pagination");

const questionsPerPage = 5; // تعداد سوالات در هر صفحه
let currentPage = 1; // صفحه فعلی

const e2p = (s) => s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const render = async () => {
  const questionsData = await fetchData();
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const questionsToShow = questionsData.slice(startIndex, endIndex);

  questionContainer.innerHTML = ""; // پاک کردن محتوای قبلی

  questionsToShow.forEach((question) => {
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

  renderPagination(questionsData.length);
  addClickHandlers(); // اضافه کردن event listener به سوالات
};

const renderPagination = (totalQuestions) => {
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${e2p(i)}</button>`;
  }

  paginationContainer.innerHTML = paginationHTML;

  // اضافه کردن Event Listener برای دکمه‌های صفحه‌بندی
  const pageButtons = document.querySelectorAll(".page-btn");
  pageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = parseInt(button.dataset.page);
      render();
    });
  });
};

const addClickHandlers = () => {
  // اضافه کردن Event Listener به سوالات
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

const initHandler = async () => {
  await render();
};

document.addEventListener("DOMContentLoaded", initHandler);
