// // import { Socket } from "dgram";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import ACTIONS from "./serverConfigs/configs.js";
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 5000;
const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const x = path.dirname(__filename);
const __dirname = path.dirname(x);

const cors_option = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH"],
  credentials: true,
};

const io = new Server(server, {
  cors: cors_option,
});
console.log(__dirname);
app.use(express.static("dist"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const userSocketMap = {};
const roomState = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets?.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId],
    };
  });
};
// app.use(cors(cors_option));

io.on("connection", (socket) => {
  console.log("socket Connected: ", socket.id);

  socket.on(ACTIONS.JOIN, ({ username, roomID, code }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomID);

    if (!roomState[roomID]) {
      roomState[roomID] = { code: code };
    }

    const clients = getAllConnectedClients(roomID);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
        code,
      });
    });
    // delete userSocketMap[socket.id];
    // socket.leave();
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, value }) => {
    roomState[roomId] = { code: value };
    io.to(roomId).emit(ACTIONS.CODE_CHANGE, { value });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, roomID }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { value: roomState[roomID]?.code, roomId: roomID });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

server.listen(PORT, (req, res) => {
  console.log("Connected on this PORT: ", PORT);
});
