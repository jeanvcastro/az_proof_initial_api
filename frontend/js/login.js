const formLogin = document.querySelector("#form-login");
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");

formLogin.onsubmit = (e) => {
  e.preventDefault();

  const data = {
    email: inputEmail.value,
    password: inputPassword.value,
  };

  fetch("http://localhost:3333/proof/session", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    });
};
