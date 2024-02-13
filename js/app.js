import { fetchData } from "../utils/httpReq.js";

const questionContainer = document.getElementById("question-container");
const paginationContainer = document.querySelector(".pagination");
const searchInput = document.getElementById("search-input");
const alertText = document.querySelector(".alert-text");

const questionsPerPage = 10; // تعداد سوالات در هر صفحه
let currentPage = 1; // صفحه فعلی
let questionsData;

const e2p = (s) => s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const showAlert = (message) => {
  let tempText = alertText.innerText;
  alertText.style.background = "#c62828";
  alertText.style.color = "#fff";
  alertText.innerText = message;
  setTimeout(() => {
    alertText.innerText = tempText;
    alertText.style = "";
  }, 3000);
};

const fetchDataAndRender = async () => {
  questionsData = await fetchData();
  render(questionsData);
};

const render = (questions) => {
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const questionsToShow = questions.slice(startIndex, endIndex);

  questionContainer.innerHTML = ""; // پاک کردن محتوای قبلی

  questionsToShow.forEach((question) => {
    const questionHTML = `
    <div class="question">
        <h2>${e2p(question.title)} <i class="fas fa-arrow-alt-circle-down toggle-icon"></i></h2>
        <div class="answer">
            ${question.answer}
        </div>
    </div>
    `;
    questionContainer.innerHTML += questionHTML;
  });

  renderPagination(questions.length);
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
      fetchDataAndRender(); // دوباره بازیابی داده‌ها و نمایش آن‌ها
    });
  });
};

const addClickHandlers = () => {
  // اضافه کردن Event Listener به سوالات
  const allQuestions = document.querySelectorAll(".question");
  allQuestions.forEach((question) => {
    question.addEventListener("click", (event) => {
      if (event.target.tagName === "H2" || event.target.tagName === "I") {
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

const searchQuestions = (event) => {
  event.preventDefault();
  const searchInputValue = searchInput.value.trim().toLowerCase();

  if (searchInputValue.length < 3) {
    showAlert("لطفاً حداقل ۳ حرف برای جستجو وارد کنید.");
    fetchDataAndRender(); // دوباره بازیابی داده‌ها و نمایش آن‌ها
    return;
  }

  currentPage = 1; // بازنشانی صفحه فعلی به صفحه اول
  const matchedQuestions = questionsData.filter((question) => question.title.toLowerCase().includes(searchInputValue));

  if (matchedQuestions.length === 0) {
    showAlert("سوالی با این عنوان یافت نشد.");
    return;
  }

  render(matchedQuestions); // نمایش سوالات یافته شده
};

const initHandler = async () => {
  await fetchDataAndRender();
  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", searchQuestions);

  // اضافه کردن event listener برای تغییرات در input جستجو
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      // اگر input خالی شود، دوباره تمام سوالات را نمایش بده
      fetchDataAndRender();
    }
  });
};

document.addEventListener("DOMContentLoaded", initHandler);
