const socket = io();

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const room = document.getElementById("room");
const roomFrom = room.querySelector("form");
const nick = document.getElementById("nick");
const nickForm = nick.querySelector("form");

welcome.hidden = true;
room.hidden = true;

function showWelcome() {
  nickForm.hidden = true;
  welcome.hidden = false;
}

function displayRoomName() {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${socket.roomName} (${socket.roomCount})`;
}

function showRoom() {
  welcomeForm.hidden = true;
  room.hidden = false;
  displayRoomName();
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function displyRooms(publicRooms) {
  const ul = welcome.querySelector("ul");
  ul.innerText = "";
  publicRooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    ul.appendChild(li);
  });
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  const h3 = nick.querySelector("h3");
  h3.innerText = `Nickname: ${input.value}`;
  socket["nickName"] = input.value;
  socket.emit("nickname", input.value, showWelcome);
  input.value = "";
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket["roomName"] = input.value;
  socket.emit("enter_room", input.value, showRoom);
  input.value = "";
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = roomFrom.querySelector("input");
  const value = input.value;
  const addMsg = () => addMessage(`me: ${value}`);
  socket.emit("new_message", input.value, socket.roomName, addMsg);
  input.value = "";
}

nickForm.addEventListener("submit", handleNickSubmit);
welcomeForm.addEventListener("submit", handleRoomSubmit);
roomFrom.addEventListener("submit", handleMessageSubmit);

socket.on("welcome", (nickName) => {
  addMessage(`${nickName} joined!`);
});

socket.on("new_message", (nickName, message) => {
  addMessage(`${nickName}: ${message}`);
});

socket.on("bye", (nickName, roomCount) => {
  socket["roomCount"] = roomCount;
  displayRoomName();
  addMessage(`${nickName} left ㅠㅠ`);
});

socket.on("room_changing", (publicRooms, roomName, roomCount) => {
  if (roomName === socket.roomName) {
    socket["roomCount"] = roomCount;
    displayRoomName();
  }
  displyRooms(publicRooms);
});

socket.on("room_changed", (publicRooms) => {
  displyRooms(publicRooms);
});
