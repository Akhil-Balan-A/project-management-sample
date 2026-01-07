import { User } from '../models/user.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import jwt from 'jsonwebtoken';
import { sendEmail,emailVerificationMailgenContent,forgotPasswordMailgenContent } from '../utils/mail.js';
import crypto from 'crypto';

const generateAccessAndRefreshTtokens = async (userId) => {
    try {
       const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating tokens');
    }
}

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const userExists = await User.findOne({
    $or: [{ email: email }, { username: username }],
  })
    .lean()
    .exec();

  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    username,
    email,
    password, // hashing will be done in model
    role,
    isEmailVerified: false,
  });
    const { hashedToken, tokenExpiry, unHashedToken } = user.generateTemporaryToken();
    
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });//validateBeforeSave: false is used to skip validation on save

    await sendEmail({
        email: email,
        subject: "Verify your email",
        mailGenContent: emailVerificationMailgenContent(username, `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHashedToken}`),
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
    
    if(!createdUser){
        throw new ApiError(400, 'User not found');
    }
    return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully and email sent for verification", { user: createdUser }));    
    
});

const login = asyncHandler(async (req, res) => {
  const { email, password,} = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  const isPasswordMatched = await user.isPasswordMatched(password);

  if (!isPasswordMatched) {
    throw new ApiError(400, 'Invalid password');
  }    
  const { accessToken, refreshToken } = await generateAccessAndRefreshTtokens(user._id);
    
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

  const options = {
    httpOnly: true,
    secure: true,
  };  
  
  return res
  .status(200)
  .cookie('accessToken', accessToken, options)
  .cookie('refreshToken', refreshToken, options)
  .json(new ApiResponse(200, "User logged in successfully", { user: loggedInUser, accessToken, refreshToken }));
    
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id,
    {
      refreshToken: null 
    },
    {
      new: true, // used to return the updated document
      
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };  

  return res
  .status(200)
  .clearCookie('accessToken', options)
  .clearCookie('refreshToken', options)
  .json(new ApiResponse(200, "User logged out successfully"));
  
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(200, "Current user fetched successfully", { user: req.user }));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const verificationToken = req.params.verificationToken;
  if (!verificationToken) {
    throw new ApiError(400, 'Verification token is missing.');
  }

  let hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  const user = await User.findOne({ emailVerificationToken: hashedToken, emailVerificationExpiry: { $gt: Date.now() } });

  if (!user) {
    throw new ApiError(400, "Token is invalid or has expired.");
  }

  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });//validateBeforeSave: false is used to skip validation on save which helps in skipping password validation
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  return res
  .status(200)
  .json(new ApiResponse(200, "Email verified successfully", { user }));
  
});
const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(400, 'User not found');
  }
  if(user.isEmailVerified){
    throw new ApiError(400, "Email is already verified");
  }

  const { hashedToken, tokenExpiry, unHashedToken } = user.generateTemporaryToken();
    
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });//validateBeforeSave: false is used to skip validation on save

    await sendEmail({
        email: user.email,
        subject: "Verify your email",
        mailGenContent: emailVerificationMailgenContent(user.username, `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHashedToken}`),
    });
  
    return res
    .status(200)
    .json(new ApiResponse(200, "Email sent for verification", { user }));


});

const refreshAccessToken  = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, 'Refresh token is missing.');
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if(!user){
      throw new ApiError(400, 'User not found');
    }

    if(user?.refreshToken !== incomingRefreshToken){
      throw new ApiError(400, 'Refresh token is invalid.');
    }

    const options = {
      httpOnly: true,
      secure: true,
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTtokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    
    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', newRefreshToken, options);

    return res
    .status(200)
    .json(new ApiResponse(200, "Access token refreshed successfully", { accessToken }));  
  } catch (error) {
    throw new ApiError(400, 'Refresh token is invalid.');
  }
})

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body
  
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new ApiError(400, "User not found!");
  }

  const { hashedToken, tokenExpiry, unHashedToken } = user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });//validateBeforeSave: false is used to skip validation on save
  await sendEmail({
    email: email,
    subject: "Reset your password",
    mailGenContent: forgotPasswordMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Email sent for password reset"));
  
})


const resetForgotPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body; 
  
  let hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({ forgotPasswordToken: hashedToken, forgotPasswordExpiry: { $gt: Date.now() } });

  if (!user) {
    throw new ApiError(400, "Token is invalid or has expired.");
  }

  user.password = newPassword;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save({ validateBeforeSave: false });//validateBeforeSave: false is used to skip validation on save

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully"));

});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(400, "User not found!");
  }

  const isPasswordMatched = await user.isPasswordMatched(currentPassword);

  if (!isPasswordMatched) {
    throw new ApiError(400, "Current password is incorrect!");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });//validateBeforeSave: false is used to skip validation on save

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));

  
});

export {
  registerUser,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword
};
    
