import express from "express";
import { registeredUser ,verifyUser, login, getProfile ,logout ,updateProfile ,forgotPassword ,resetPassword} from "../controller/user.controller.js";
import { isLogged } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registeredUser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);
router.get("/getProfile",isLogged, getProfile);
router.put("/updateProfile", isLogged,updateProfile);   
router.get("/logout",isLogged, logout);

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:resetToken", resetPassword);


export default router;