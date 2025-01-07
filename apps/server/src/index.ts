import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { activeRoom, addActiveRoom, removeExpiredRooms } from "./data";
import { DrawLineProps } from "./type";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());

// Add production security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

const options: cors.CorsOptions = {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST'],
};
app.use(cors(options));

// Update rate limiting for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 50 : 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    credentials: true,
  },
  transports: ["websocket"],
  pingInterval: 20000,
  pingTimeout: 10000,
});

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Implement connection tracking
  let lastActivityTime = Date.now();

  const updateActivity = () => {
    lastActivityTime = Date.now();
  };

  socket.on("join-room", (roomId) => {
    updateActivity();
    console.log(`Client ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
    connectedUsers.set(socket.id, roomId);
    // Request canvas state from other users in the room
    socket.to(roomId).emit("request-canvas-state");
  });

  socket.on("canvas-state", ({ roomId, paths }) => {
    console.log(`Sending canvas state to room ${roomId}`);
    socket.to(roomId).emit("receive-canvas-state", paths);
  });

  socket.on("draw-path", ({ roomId, pathData }) => {
    updateActivity();
    // Only broadcast if the last activity was within 5 minutes
    if (Date.now() - lastActivityTime < 300000) {
      console.log(`Drawing in room ${roomId}`);
      // Use volatile for real-time drawing updates
      socket.to(roomId).volatile.emit("draw-path", pathData);
    }
  });

  socket.on("clear-canvas", (roomId) => {
    socket.to(roomId).emit("clear-canvas");
  });

  // Implement inactive connection cleanup
  const activityCheck = setInterval(() => {
    if (Date.now() - lastActivityTime > 300000) {
      // 5 minutes
      socket.disconnect();
      clearInterval(activityCheck);
    }
  }, 60000);

  socket.on("disconnect", () => {
    clearInterval(activityCheck);
    const roomId = connectedUsers.get(socket.id);
    if (roomId) {
      socket.to(roomId).emit("user-disconnected", socket.id);
      connectedUsers.delete(socket.id);
    }
  });
});

// Cleanup interval
setInterval(removeExpiredRooms, 60000);

// Implement memory monitoring
const memoryCheck = setInterval(() => {
  const used = process.memoryUsage();
  if (used.heapUsed > 500 * 1024 * 1024) {
    // 500MB threshold
    console.warn("High memory usage detected:", used);
  }
}, 300000);

// Clean up on server shutdown
process.on("SIGTERM", () => {
  clearInterval(memoryCheck);
  io.close();
  server.close();
});

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
  res.status(500).send("Something broke!");
});

// Add server-side logging
const logger = {
  error: (message: string, ...args: any[]) => {
    console.error(new Date().toISOString(), 'ERROR:', message, ...args);
  },
  info: (message: string, ...args: any[]) => {
    console.log(new Date().toISOString(), 'INFO:', message, ...args);
  }
};

// Don't use app.listen, use server.listen instead
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
