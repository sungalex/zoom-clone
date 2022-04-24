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

function countRoom(room) {
  return wsServer.sockets.adapter.rooms.get(room)?.size;
}

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName, done) => {
    if (countRoom(roomName) === undefined || countRoom(roomName) < 2) {
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
      done(true);
    } else {
      done(false);
      console.log(countRoom(roomName));
    }
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
  socket.on("new_message", (message, room, nickname, done) => {
    socket.to(room).emit("new_message", nickname, message);
    done();
  });
});
