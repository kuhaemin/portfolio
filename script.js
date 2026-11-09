const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const messageError = document.querySelector("#message-error");
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const themeToggleLabel = document.querySelector(".theme-toggle-label");

let theme = "light";
try {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") theme = savedTheme;
} catch (error) {
  console.error("저장된 테마를 불러오지 못했습니다.", error);
}

function applyTheme(nextTheme) {
  theme = nextTheme;
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
  themeToggleIcon.textContent = isDark ? "☀" : "☾";
  themeToggleLabel.textContent = isDark ? "라이트 모드" : "다크 모드";
}

applyTheme(theme);

themeToggle.addEventListener("click", () => {
  const nextTheme = theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);

  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch (error) {
    console.error("테마 설정을 저장하지 못했습니다.", error);
  }
});

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const messageValue = messageInput.value.trim();
  let firstInvalidInput = null;

  const nameMessage = nameValue ? "" : "이름을 입력해 주세요.";
  setFieldError(nameInput, nameError, nameMessage);
  if (nameMessage) firstInvalidInput = nameInput;

  let emailMessage = "";
  if (!emailValue) emailMessage = "이메일을 입력해 주세요.";
  else if (!emailInput.checkValidity()) emailMessage = "올바른 이메일 주소를 입력해 주세요.";
  setFieldError(emailInput, emailError, emailMessage);
  if (emailMessage && !firstInvalidInput) firstInvalidInput = emailInput;

  const messageErrorText = messageValue ? "" : "메시지를 입력해 주세요.";
  setFieldError(messageInput, messageError, messageErrorText);
  if (messageErrorText && !firstInvalidInput) firstInvalidInput = messageInput;

  formStatus.classList.remove("is-error", "is-success");
  if (firstInvalidInput) {
    formStatus.classList.add("is-error");
    formStatus.textContent = "입력 내용을 확인해 주세요. 각 항목 아래 안내를 확인해 주세요.";
    firstInvalidInput.focus();
    return;
  }

  formStatus.classList.add("is-success");
  formStatus.textContent = "입력 내용이 확인되었습니다. 실제 이메일은 전송되지 않았습니다.";
});

// 입력이 수정되면 해당 항목의 오류와 이전 제출 안내를 지웁니다.
function clearFieldErrorOnInput(input, errorElement) {
  input.addEventListener("input", () => {
    const value = input.value.trim();
    const hasError = !value || (input.type === "email" && !input.checkValidity());

    if (!hasError) setFieldError(input, errorElement, "");
    formStatus.textContent = "";
    formStatus.classList.remove("is-error", "is-success");
  });
}

// 오류 문구, 화면 낭독기 상태, 필드의 오류 상태를 함께 업데이트합니다.
function setFieldError(input, errorElement, message) {
  errorElement.textContent = message;
  errorElement.hidden = !message;
  input.setAttribute("aria-invalid", String(Boolean(message)));
}

clearFieldErrorOnInput(nameInput, nameError);
clearFieldErrorOnInput(emailInput, emailError);
clearFieldErrorOnInput(messageInput, messageError);

document.querySelector("#year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
