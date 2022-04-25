# Zoom Clone (Noom)

Zoom Clone with NodeJS, Websocket, SocketIO and WebRTC

## Code Challenge - Day1 : WebSocket

- Implement a real time chat using **WebSocket**.

- Put the backend code on `src/server.js` and the frontend code on `src/public/app.js`.

- Allow users to change nickname.

- Display messages sents by other users.

- codsandbox.io : https://codesandbox.io/s/websockets-chat-ur466n

## Code Challenge - Day2 : SocketIO

- Implement a real time chat using **SocketIO** with room support.

- Users **should** be able to **create**, **join** and **leave** rooms.

- Allow users to change nickname.

- Put the backend code on `src/server.js` and the frontend code on `src/public/app.js`.

- Extra points: Show a list of all the `rooms` currently on the server.

- codsandbox.io : https://codesandbox.io/s/socketio-m9b3if

- Github Branch : [zoom-clone SocketIO branch](https://github.com/sungalex/zoom-clone/tree/SocketIO)

## SocketIO Admin UI

- Documents: https://socket.io/docs/v4/admin-ui/

- Link to the hosted version: [https://admin.socket.io/](https://admin.socket.io/)
  - Server URL setup: http://localhost:3000/admin
  - Nothing in Path field.

## Code Challenge - Day3 : Video Call with WebRTC

- Implement a P2P Videocall with WebRTC.

- Put the backend code on src/server.js and the frontend code on src/public/app.js.

- Videocall Flow:

  - User A should create a room.
  - User B should join the room.
  - Video call should start.
  - 2 people max. allowed per room.
  - Extra points: Implement a realtime chat using **Data Channels**.

- Optionals

  - Improve the CSS.
  - When a peer leaves the room, remove the stream. (TBD)

- codsandbox.io : https://codesandbox.io/s/webrtc-video-call-yf6qt0
