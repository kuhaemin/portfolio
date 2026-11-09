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
const projectModal = document.querySelector("#project-modal");
const modalCloseButton = projectModal.querySelector(".modal-close");
const projectCards = document.querySelectorAll(".project-card");
const projectDetails = {
  pulse: {
    name: "Pulse Analytics",
    description: "예시 프로젝트: 핵심 데이터를 한눈에 확인할 수 있는 서비스 대시보드를 만들었습니다.",
    role: "사용자 흐름 설계, 대시보드 화면 디자인, 반응형 프론트엔드 구현",
    technologies: ["HTML", "CSS", "Vanilla JavaScript"],
    outcome: "예시 성과: 핵심 정보를 찾는 시간이 30% 줄었다는 가상의 결과입니다."
  },
  wayfinder: {
    name: "Wayfinder",
    description: "예시 프로젝트: 새로운 장소와 이야기를 발견하는 브랜드 웹사이트를 기획했습니다.",
    role: "브랜드 웹 디자인, 정보 구조 설계, 인터랙션 구현",
    technologies: ["HTML", "CSS Grid", "Vanilla JavaScript"],
    outcome: "예시 성과: 콘텐츠 상세 페이지 방문이 24% 늘었다는 가상의 결과입니다."
  },
  moneta: {
    name: "Moneta App",
    description: "예시 프로젝트: 스튜디오의 작업과 서비스를 소개하는 모바일 중심 웹 경험입니다.",
    role: "모바일 UX/UI 설계, 프로토타입 제작, 웹 화면 구현",
    technologies: ["HTML", "CSS", "Vanilla JavaScript"],
    outcome: "예시 성과: 문의 과정의 완료 시간이 18% 줄었다는 가상의 결과입니다."
  }
};
let lastFocusedProject = null;

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

// 선택한 프로젝트의 예시 상세 정보를 모달에 표시합니다.
function openProjectModal(projectId, trigger) {
  const project = projectDetails[projectId];
  if (!project) return;

  lastFocusedProject = trigger;
  projectModal.querySelector("[data-project-name]").textContent = project.name;
  projectModal.querySelector("[data-project-description]").textContent = project.description;
  projectModal.querySelector("[data-project-role]").textContent = project.role;
  projectModal.querySelector("[data-project-outcome]").textContent = project.outcome;

  const technologyList = document.createElement("ul");
  project.technologies.forEach((technology) => {
    const item = document.createElement("li");
    item.textContent = technology;
    technologyList.append(item);
  });
  projectModal.querySelector("[data-project-technologies]").replaceChildren(technologyList);

  projectModal.hidden = false;
  document.body.style.overflow = "hidden";
  modalCloseButton.focus();
}

// 모달을 닫고 키보드 포커스를 열었던 프로젝트 카드로 돌려줍니다.
function closeProjectModal() {
  if (projectModal.hidden) return;

  projectModal.hidden = true;
  document.body.style.overflow = "";
  lastFocusedProject?.focus();
}

// 키보드 조작으로 카드를 열고, 모달 안에서 포커스가 유지되도록 합니다.
projectCards.forEach((card) => {
  card.addEventListener("click", () => openProjectModal(card.dataset.projectId, card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectModal(card.dataset.projectId, card);
    }
  });
});

modalCloseButton.addEventListener("click", closeProjectModal);
projectModal.addEventListener("click", (event) => {
  if (event.target === projectModal) closeProjectModal();
});
document.addEventListener("keydown", (event) => {
  if (projectModal.hidden) return;
  if (event.key === "Escape") {
    closeProjectModal();
    return;
  }
  if (event.key === "Tab") {
    event.preventDefault();
    modalCloseButton.focus();
  }
});
