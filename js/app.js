// ایمپورت تابع fetchData از فایل httpReq.js
import fetchData from "../utils/httpReq.js";

// انتخاب المان‌های مورد نیاز از DOM
const questionContainer = document.getElementById("question-container");
const paginationContainer = document.querySelector(".pagination");
const searchInput = document.getElementById("search-input");
const alertText = document.getElementById("alert-text");

// تعریف تعداد سوالات در هر صفحه و صفحه فعلی
const questionsPerPage = 10;
let currentPage = 1;
let questionsData;

// تابع تبدیل اعداد به فارسی
const toPersianDigits = (str) => str.toString().replace(/\d/g, (d) => String.fromCharCode(1776 + parseInt(d)));

// تابع نمایش پیام هشدار
const showAlert = (message) => {
  const tempText = alertText.innerText;
  alertText.style.background = "#c62828";
  alertText.style.color = "#fff";
  alertText.innerText = message;
  setTimeout(() => {
    alertText.innerText = tempText;
    alertText.style = "";
  }, 2500);
};

// تابع بازیابی داده و نمایش آن‌ها
const fetchDataAndRender = async () => {
  questionsData = await fetchData();
  render(questionsData);
};

// تابع نمایش سوالات
const render = (questions) => {
  // محاسبه شاخص‌های شروع و پایان برای نمایش سوالات
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const questionsToShow = questions.slice(startIndex, endIndex);

  // پاک کردن محتوای قبلی قسمت سوالات
  questionContainer.innerHTML = "";
  // نمایش هر سوال
  questionsToShow.forEach(renderQuestion);

  // نمایش ابزارهای صفحه‌بندی و اضافه کردن event listener آن‌ها
  renderPagination(questions.length);
  addClickHandlers();
};

// تابع نمایش یک سوال
const renderQuestion = (question) => {
  const questionHTML = `
    <div class="question">
      <h2>${toPersianDigits(question.title)} <i class="fas fa-arrow-alt-circle-down toggle-icon"></i></h2>
      <div class="answer">${question.answer}</div>
    </div>
  `;
  questionContainer.innerHTML += questionHTML;
};

// تابع نمایش ابزارهای صفحه‌بندی
const renderPagination = (totalQuestions) => {
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  let paginationHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${toPersianDigits(i)}</button>`;
  }
  paginationContainer.innerHTML = paginationHTML;
  document.querySelectorAll(".page-btn").forEach(addPageButtonClickListener);
};

// تابع اضافه کردن event listener به دکمه‌های صفحه‌بندی
const addPageButtonClickListener = (button) => {
  button.addEventListener("click", () => {
    currentPage = parseInt(button.dataset.page);
    fetchDataAndRender();
  });
};

// تابع اضافه کردن event listener به سوالات
const addClickHandlers = () => {
  document.querySelectorAll(".question").forEach((question) => {
    question.addEventListener("click", toggleAnswerVisibility);
  });
};

// تابع toggle کردن نمایش جواب‌ها
const toggleAnswerVisibility = (event) => {
  const question = event.currentTarget;
  if (event.target.tagName === "H2" || event.target.tagName === "I") {
    const answer = question.querySelector(".answer");
    document.querySelectorAll(".answer").forEach((ans) => {
      if (ans !== answer && ans.classList.contains("show")) {
        ans.classList.remove("show");
        const icon = ans.closest(".question").querySelector(".toggle-icon");
        icon.classList.remove("rotate");
      }
    });
    answer.classList.toggle("show");
    question.querySelector(".toggle-icon").classList.toggle("rotate");
  }
};

// تابع بررسی و جستجوی سوالات
const searchQuestions = (event) => {
  event.preventDefault();
  const searchInputValue = searchInput.value.trim().toLowerCase();
  if (searchInputValue.length < 3) {
    showAlert("لطفاً حداقل ۳ حرف برای جستجو وارد کنید.");
    fetchDataAndRender();
    return;
  }
  currentPage = 1;
  const matchedQuestions = questionsData.filter((question) => question.title.toLowerCase().includes(searchInputValue));
  if (matchedQuestions.length === 0) {
    showAlert("سوالی با این عنوان یافت نشد.");
    return;
  }
  render(matchedQuestions);
};

// تابع شروع برنامه
const initHandler = async () => {
  await fetchDataAndRender();
  document.getElementById("search-form").addEventListener("submit", searchQuestions);
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      fetchDataAndRender();
    }
  });
};

// Event listener برای رویداد DOMContentLoaded
document.addEventListener("DOMContentLoaded", initHandler);
