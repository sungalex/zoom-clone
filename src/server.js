import express from "express";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = app.listen(3000, handleListen);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

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
  socket["nickname"] = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket event: ${event}`);
  });
  socket.on("nickname", (room, nickname, done) => {
    const oldNickname = socket.nickname;
    socket["nickname"] = nickname;
    done();
    if (oldNickname !== socket.nickname) {
      socket.to(room).emit("change_nick", oldNickname, socket.nickname);
    }
  });
  socket.on("enter_room", (room, done) => {
    socket.join(room);
    done();
    socket.to(room).emit("welcome", socket.nickname);
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
    socket.to(room).emit("bye", socket.nickname, countRoom(room));
  });
  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", socket.nickname, message);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_changed", publicRooms());
  });
});
