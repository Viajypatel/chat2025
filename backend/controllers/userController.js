import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists, try a different one" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Incorrect username or password" });
    }

    // 3️⃣ Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect username or password" });
    }

    // 4️⃣ Create token
    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    // 5️⃣ Send token in response body (NOT in cookies)
    return res.status(200).json({
      message: "Login successful",
      token, // frontend will store this in localStorage
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}