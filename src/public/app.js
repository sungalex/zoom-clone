const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");

const backendCallBack = (msg) => {
  console.log(`The backend says: ${msg}`);
};

const handleSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, backendCallBack);
  input.value = "";
};

form.addEventListener("submit", handleSubmit);
