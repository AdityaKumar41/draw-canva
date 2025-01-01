import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { activeRoom, addActiveRoom, removeExpiredRooms } from "./data";
import { DrawLineProps } from "./type";
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());
const options: cors.CorsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(options));

// Add rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
  transports: ['websocket'],
  pingInterval: 10000,
  pingTimeout: 5000,
});

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    connectedUsers.set(socket.id, roomId);
    console.log(`User joined room: ${roomId}`);
    socket.to(roomId).emit("get-canvas-state");
  });

  socket.on("send-canvas-state", ({ state, roomId }) => {
    console.log(`Sending canvas state to room: ${roomId}`);
    socket.to(roomId).emit("receive-canvas-state", state);
  });

  socket.on("start-drawing", ({ roomId, roomDrawLine }, callback) => {
    socket.to(roomId).volatile.emit("draw-line", roomDrawLine);
    if (callback) callback();
  });

  // setup for eraser

  socket.on("clear-canvas", (roomId) => {
    socket.to(roomId).emit("clearing-canvas");
  });

  socket.on("disconnect", () => {
    const roomId = connectedUsers.get(socket.id);
    if (roomId) {
      socket.to(roomId).emit("user-disconnected", socket.id);
      connectedUsers.delete(socket.id);
    }
  });
});

// Cleanup interval
setInterval(removeExpiredRooms, 60000);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/add-room", (req, res) => {
  try {
    const roomId = req.body.roomId;
    if (!roomId) {
      res.status(400).send("Invalid room ID");
    }
    const expiry = Date.now() + 10 * 60 * 1000;
    addActiveRoom(roomId, expiry);
    res.json({ success: true });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.post("/check-room", (req, res) => {
  try {
    const roomId = req.body.roomId;
    if (!roomId) {
      res.status(400).send("Invalid room ID");
    }
    const currentData = Date.now();

    // remove expired rooms
    removeExpiredRooms();

    const Active = Array.from(activeRoom.values()).some(
      (room) => room.roomId === roomId && room.expiry >= currentData
    );

    if (Active) {
      res.json({ active: true });
    } else {
      res.json({ active: false });
    }
  } catch (error) {
    res.status(500).send("Internal server");
  }
});

// Add error handling middleware
app.use((err: Error, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Don't use app.listen, use server.listen instead
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
