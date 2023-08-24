import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// registeer user
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;
    console.log(req.body);
    // const salt = await bcrypt.genSalt(10);
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// login user
export const login = async (req, res) => {
    // trying if this function works
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    // compare provided password for hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    // If the email and password are correct, generate a jwt for authentication
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
    try {
      res.status(200).json({ message: "Logout successful." });
    } catch (err) {
      // Handle any errors that may occur during the logout process
      res.status(500).json({ error: err.message });
    }
  };