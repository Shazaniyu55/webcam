const passwordInput = document.getElementById("password");
const togglePasswordIcon = document.querySelector(".toggle-password");

togglePasswordIcon.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePasswordIcon.textContent = isPassword ? "👁️" : "🙈";
});



document.getElementById('signUpForm').addEventListener('submit', async function(event) {
  event.preventDefault(); 
     

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

 
  try {
      const token = localStorage.getItem('token');
      console.log(token)
      const response = await fetch('/api/users/login', { // Adjust URL based on your route
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization':  `Bearer ${token}`                      },
          body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
          document.getElementById('message').textContent = result.message;
          document.getElementById('message').style.color = 'green';
          // Optionally redirect to login page or another page
          //window.location.href = `https://qmap.adaintech.com/api/auth/dashboard/${result.user.id}`;

      } else {
          document.getElementById('message').textContent = result.message;
          document.getElementById('message').style.color = 'red';
      }
  } catch (error) {
    console.log(error)
      document.getElementById('message').textContent = 'An error occurred. Please try again.';
      document.getElementById('message').style.color = 'red';
  }finally{
      //hode preloader
      document.getElementById('preloader').style.display = 'none';
  }
});

