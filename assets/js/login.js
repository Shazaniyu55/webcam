const passwordInput = document.getElementById("password");
const togglePasswordIcon = document.querySelector(".toggle-password");

togglePasswordIcon.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePasswordIcon.textContent = isPassword ? "👁️" : "🙈";
});


document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      //console.log(data)
  
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT Token
        alert("Login successful!");
        window.location.href = "/api/users/videocall"; // Redirect after login
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });



  // Fetch Protected Dashboard
async function fetchDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Not authorized, please log in");
    window.location.href = "/login";
    return;
  }

  const response = await fetch("/api/users/videocall", {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();

  if (response.ok) {
    document.getElementById("dashboardContent").innerText = data.message;
  } else {
    alert("Unauthorized access");
    window.location.href = "/login";
  }
}


