const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = document.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, showRoom);
  roomName = input.value;
  input.value = "";
}

function handleMsgSubmit(event) {
  event.preventDefault();
  // const input = room.querySelector("input");
  // socket.emit("new_message", { payload: input.value }, addMessage(msg));
  // input.value = "";
}

form.addEventListener("submit", handleSubmit);
room.addEventListener("submit", handleMsgSubmit);

socket.on("welcome", () => {
  addMessage("Someone joined!");
});
