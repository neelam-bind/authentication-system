import express from "express";
import { registeredUser ,verifyUser, login } from "../controller/user.controller.js";
const router = express.Router();

router.post("/register", registeredUser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);


export default router;