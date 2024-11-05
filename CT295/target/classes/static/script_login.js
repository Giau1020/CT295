document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  // const loginMessage = document.getElementById('loginMessage');

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission to handle login with JS

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic client-side validation
    if (!username || !password) {
      // loginMessage.textContent = "Username and password are required!";
      // loginMessage.style.color = "red";
      alert("Vui lòng nhập đầy đủ username và mật khẩu!");
      return;
    }

    // Send the login credentials to the API
    fetch("https://iot123.azurewebsites.net/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.text(); // Extract the response text (success message)
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        alert("Đăng nhập thành công!");
        window.location.href = "trangchu.html"; // Replace with actual dashboard URL
      })
      .catch((error) => {
        alert("Đăng nhập thất bại");
      });
  });
});
