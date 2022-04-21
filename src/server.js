import express from "express";
import SocketIO from "socket.io";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = app.listen(3000, handleListen);
const wsServer = SocketIO(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(room) {
  return wsServer.sockets.adapter.rooms.get(room)?.size;
}

wsServer.on("connection", (socket) => {
  socket["nickName"] = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket event: ${event}`);
  });
  socket.on("nickname", (nickName, done) => {
    socket["nickName"] = nickName;
    done();
  });
  socket.on("enter_room", (room, done) => {
    socket.join(room);
    done();
    socket.to(room).emit("welcome", socket.nickName);
    wsServer.sockets.emit(
      "room_changing",
      publicRooms(),
      room,
      countRoom(room)
    );
  });
  socket.on("leave_room", (room) => {
    socket.leave(room);
    wsServer.sockets.emit(
      "room_changing",
      publicRooms(),
      room,
      countRoom(room)
    );
  });
  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", socket.nickName, message);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickName, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_changed", publicRooms());
  });
});
