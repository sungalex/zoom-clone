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
  h3.style.display = "inline";
  h3.style.paddingRight = "10px";
  h3.innerText = `Room: ${socket.roomName} (${socket.roomCount})`;
}

function applySpanStyle(span) {
  span.style.backgroundColor = "#fbc531";
  span.style.padding = "5px 10px";
  span.style.cursor = "pointer";
  span.style.borderRadius = "5px";
}

function displayLeaveButton() {
  const leaveRoom = room.querySelector("span");
  leaveRoom.innerText = "Leave Room";
  applySpanStyle(leaveRoom);
  leaveRoom.addEventListener("click", () => {
    room.hidden = true;
    welcomeForm.hidden = false;
    socket.emit("leave_room", socket.roomName);
    socket["roomName"] = "";
  });
  welcome.style.marginBottom = "20px";
}

function showRoom() {
  welcomeForm.hidden = true;
  room.hidden = false;
  displayRoomName();
  displayLeaveButton();
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
  ul.style.maxHeight = "30vh";
  ul.style.overflow = "auto";
}

function displyRooms(publicRooms) {
  const ul = welcome.querySelector("ul");
  ul.innerText = "";
  publicRooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    li.style.cursor = "pointer";
    li.style.textDecorationLine = "underline";
    li.addEventListener("click", (event) => {
      const newRoom = event.target.innerText;
      if (newRoom === socket.roomName) {
        return;
      }
      socket.emit("leave_room", socket.roomName);
      socket["roomName"] = newRoom;
      socket.emit("enter_room", newRoom, showRoom);
    });
    ul.appendChild(li);
  });
}

function displayNickName(nickname) {
  const h3 = nick.querySelector("h3");
  const changeNick = nick.querySelector("span");
  h3.innerText = `Nickname: ${nickname}`;
  h3.style.display = "inline";
  h3.style.paddingRight = "10px";
  changeNick.innerText = "Change Nick";
  applySpanStyle(changeNick);
  changeNick.addEventListener("click", () => {
    nickForm.hidden = false;
  });
  nick.style.marginBottom = "20px";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  displayNickName(input.value);
  socket["nickname"] = input.value;
  socket.emit("nickname", socket.roomName, input.value, showWelcome);
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

socket.on("welcome", (nickname) => {
  addMessage(`${nickname} joined!`);
});

socket.on("new_message", (nickname, message) => {
  addMessage(`${nickname}: ${message}`);
});

socket.on("bye", (nickname, roomCount) => {
  socket["roomCount"] = roomCount;
  displayRoomName();
  addMessage(`${nickname} left ㅠㅠ`);
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

socket.on("change_nick", (oldNickname, newNickname) => {
  addMessage(`${oldNickname}' nickname is changed to ${newNickname}`);
});
