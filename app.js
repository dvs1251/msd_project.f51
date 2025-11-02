import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";
import path from "path";

dotenv.config();
const app = express();

const port = process.env.PORT;

connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app",
  // add more origins as needed
];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the React app build directory
app.use(express.static(path.join(process.cwd(), "../frontend/build")));

// Router
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "../frontend/build/index.html"));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on http://localhost:${port}`);
  console.log(`Server is also accessible on your network at http://10.255.203.14:${port}`);
});
