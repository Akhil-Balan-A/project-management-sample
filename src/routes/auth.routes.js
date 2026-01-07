import { Router } from "express";
import {registerUser, login,logout,verifyEmail,getCurrentUser,resendEmailVerification,refreshAccessToken,forgotPasswordRequest,resetForgotPassword,changeCurrentPassword} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator, userLoginValidator, userForgotPasswordValidator, userResetForgotPasswordValidator, userChangeCurrentPasswordValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();

// public routes
authRouter.route("/register").post(userRegisterValidator(), validate, registerUser);//done
authRouter.route("/login").post(userLoginValidator(), validate, login);//done
authRouter.route("/verify-email/:verificationToken").get(verifyEmail);//done
authRouter.route("/refresh-token").post(refreshAccessToken); //done
authRouter.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest);//done
authRouter.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validate, resetForgotPassword);//error



// secure routes
authRouter.route("/logout").post(verifyJWT, logout);//done
authRouter.route('/get-current-user').get(verifyJWT, getCurrentUser);//done
authRouter.route('/change-password').post(verifyJWT, userChangeCurrentPasswordValidator(), validate,changeCurrentPassword);//done
authRouter.route('/resend-email-verification').post(verifyJWT, resendEmailVerification);//done




export default authRouter;
