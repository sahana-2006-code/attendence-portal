import { registerUser,loginUser } from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";
export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

   return res.status(201).json(
    new ApiResponse(
        201,
        "User registered successfully",
        user
    )
);
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.status(200).json(
    new ApiResponse(
        200,
        "Login successful",
        result
    )
);
  } catch (error) {
    next(error);
  }
};