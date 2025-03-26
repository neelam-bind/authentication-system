import express from "express"; 
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import model from "./model/User.model.js";
//import all routes 
import userRoutes from "./routes/user.routes.js";
import { registeredUser ,verifyUser ,login} from "./controller/user.controller.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000; 

console.log("PORT", process.env.PORT);
console.log("BASE_url ", process.env.BASE_URL);

app.use(cors({
    origin: process.env.BASE_URL, 
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get("/", (req, res) => {
    res.send("Hello World");
});

// Connect to database
db();

//user routes 
app.use("/api/v1/users", userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
