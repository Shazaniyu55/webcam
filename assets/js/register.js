const passwordInput = document.getElementById("password");
const togglePasswordIcon = document.querySelector(".toggle-password");

togglePasswordIcon.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePasswordIcon.textContent = isPassword ? "👁️" : "🙈";
});



document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;

    const password = document.getElementById("password").value;
   console.log(username)
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT Token
        alert("Register successful!");
        window.location.href = "/login"; // Redirect after login
      } else {
        alert(data.error || "Register failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });


  


