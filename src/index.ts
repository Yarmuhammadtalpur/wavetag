import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import http from "http";
import socketIo from "socket.io";
import cors from "cors";

import { errorMiddleWare, notFound } from "./middlewares/error-middleware";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import linkRoutes from "./routes/link.routes";
import imageRoutes from "./routes/image.routes";
import cardRoutes from "./routes/card.routes";
import leadFormRoutes from "./routes/leadForm.routes";
import blogRoutes from "./routes/blog.routes";
import settingRoutes from "./routes/setting.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import formDataRoutes from "./routes/formData.routes";

import insightRoutes from "./routes/insight.routes";

const app = express();

dotenv.config();

import databaseConnection from "./config/database";
import { setupSwagger } from "./config/swagger";
import { createSocketServer } from "./config/socket";

//# to do
var corsOptions = {
  origin: "http://example.com",
};
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Wavetags");
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const server = http.createServer(app);

databaseConnection();
setupSwagger(app);
const io: socketIo.Server = createSocketServer(server);

// API Routes

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/users", userRoutes);
app.use("/api/uploads", imageRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/leadForm", leadFormRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/form-data", formDataRoutes);
app.use("/api/insight", insightRoutes);

app.use(errorMiddleWare);
app.use(notFound);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("connection", null);
});
