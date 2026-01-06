import { Router } from "express";
import {registerUser, login,logout,verifyEmail,getCurrentUser,resendEmailVerification,refreshAccessToken,forgotPasswordRequest,resetForgotPassword,changeCurrentPassword} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator, userLoginValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();


authRouter.route("/register").post(userRegisterValidator(), validate, registerUser);
authRouter.route("/login").post(userLoginValidator(), validate, login);
// secure routes
authRouter.route("/logout").post(verifyJWT, logout);

// authRouter.route('/get-current-user').get(verifyJWT, getCurrentUser);

//verify email
authRouter.route("/verify-email/:verificationToken").get(verifyJWT, verifyEmail);


export default authRouter;
