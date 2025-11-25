(() => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const fields = Array.from(form.querySelectorAll(".contact-field"));

  const showError = (field, message) => {
    field.classList.add("is-invalid");
    const feedback = field.querySelector(".invalid-feedback");
    if (feedback) feedback.textContent = message;
  };

  const clearError = (field) => {
    field.classList.remove("is-invalid");
  };

  const validators = {
    name(value) {
      if (!value.trim()) return "please add your name";
      return "";
    },
    email(value) {
      if (!value.trim()) return "please use a valid email";
      const simplePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!simplePattern.test(value)) return "please use a valid email";
      return "";
    },
    message(value) {
      if (!value.trim()) return "let us know how we can help";
      if (value.trim().length < 10) return "share a little more detail";
      return "";
    },
  };

  const validateField = (field) => {
    const input = field.querySelector("input, textarea");
    if (!input) return true;
    const name = input.name;
    const value = input.value || "";
    const validator = validators[name];
    if (!validator) return true;
    const error = validator(value);
    if (error) {
      showError(field, error);
      return false;
    }
    clearError(field);
    return true;
  };

  form.addEventListener("submit", (event) => {
    let allValid = true;
    fields.forEach((field) => {
      const valid = validateField(field);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      event.preventDefault();
      const firstError = form.querySelector(".contact-field.is-invalid input, .contact-field.is-invalid textarea");
      if (firstError) firstError.focus();
    }
  });

  fields.forEach((field) => {
    const input = field.querySelector("input, textarea");
    if (!input) return;
    input.addEventListener("input", () => validateField(field));
    input.addEventListener("blur", () => validateField(field));
  });
})();
