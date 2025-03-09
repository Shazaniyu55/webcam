const passwordInput = document.getElementById("password");
const togglePasswordIcon = document.querySelector(".toggle-password");

togglePasswordIcon.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePasswordIcon.textContent = isPassword ? "👁️" : "🙈";
});
