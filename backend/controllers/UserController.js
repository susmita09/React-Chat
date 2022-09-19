const asyncHandler = require("express-async-handler"); //for handling async request
var bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//REGISTER
//api- @ /api/user/signup
const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400).send({ message: "Please Enter All Fields" });
  }

  const exisUser = await User.findOne({ email });

  if (exisUser) {
    res.status(400).send({ message: "User already exists" });
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashPassword,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send({ message: "something went wrong" });
  }
};

//LOGIN
//@@ api- @ /api/user/login
const signInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: "Please enter all the fields" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: " User does not exists" });
  }

  const isvalid = await bcrypt.compare(password, user.password);

  if (user && isvalid) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send({ message: "Invalid User or Password" });
  }
});

//@description     Get or Search all users
//@route           GET /api/user/alluser?search=""
//@access          Protected

const getAllUser = async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, // regex for regular expression op - case sensitive
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); //where id not equal to req user id
  // console.log(users);
  // if (!users) {
  //   res.status(401).send({ message: "No User Exists" });
  // }
  res.status(201).send(users);
};

module.exports = { registerUser, signInUser, getAllUser };
