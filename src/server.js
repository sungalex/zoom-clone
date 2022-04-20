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

wsServer.on("connection", (socket) => {
  socket["nickName"] = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket event: ${event}`);
  });
  socket.on("nickname", (nickName, done) => {
    socket["nickName"] = nickName;
    done();
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickName);
  });
  socket.on("new_message", (message, roomName, done) => {
    socket.to(roomName).emit("new_message", socket.nickName, message);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickName)
    );
  });
});
