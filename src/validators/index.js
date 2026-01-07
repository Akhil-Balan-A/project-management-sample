import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is not valid"),
        body("username")
            .trim()
            .notEmpty().withMessage("Username is required")
            .isLowercase().withMessage("Username must be lowercase")
            .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters"),
        body("password")
            .trim()
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).withMessage("Password must contain at least one number one alphabet and one special character"),
        body("fullName")
            .optional()
            .trim()
            .isLength({ min: 3, max: 50 }).withMessage("Full name must be between 3 and 50 characters")
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isLowercase().withMessage("Email must be lowercase")
            .isEmail().withMessage("Email is not valid"),
        body("password")
            .trim()
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    ]
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("currentPassword").notEmpty().withMessage("Current password is required")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).withMessage("Password must contain at least one number one alphabet and one special character"),
        body("newPassword").notEmpty().withMessage("New password is required")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).withMessage("Password must contain at least one number one alphabet and one special character")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isLowercase().withMessage("Email must be lowercase")
            .isEmail().withMessage("Email is not valid"),
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
            .trim()
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).withMessage("Password must contain at least one number one alphabet and one special character"),
    ]
}

export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator
}