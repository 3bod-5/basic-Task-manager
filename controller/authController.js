const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const multer = require('multer')
const bcrypt = require('bcrypt')
exports.protect = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies); // 👈 check if token exists

    const token = req.cookies?.token;
    if (!token) {
      console.log("No token found, redirecting to login");
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.log("User not found, redirecting to login");
      return res.redirect("/login");
    }

    req.user = currentUser;
    console.log("User authenticated:", currentUser.email);
    next();
  } catch (err) {
    console.log("Auth middleware error:", err.message);
    res.redirect("/login");
  }
};

// show register page
exports.registerPage = (req, res) => {
  res.render("register");
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).send("All fields are required");
    }

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Save token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return res.render("login");

  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

// show login page
exports.loginPage = (req, res) => {
  res.render("login");
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    // Generate JWT
    const token = jwt.sign(
      { id: user._id},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // ✅ Store token in HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // always false locally
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

    return res.redirect("/dashboard"); // fallback

  } catch (err) {
    console.log("Login error:", err);
    res.status(500).send("Server error");
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

exports.upload = multer({ storage });