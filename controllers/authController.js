const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Log = require("../models/logsModel");
const IP = require("ip");
const os = require("os");
const User = require("../models/userModel");
const Logo = require("../models/logoModel");

const signIn = async (req, res) => {
  console.log(req.body);
  if (!req.body.email) return res.status(400).json("Email is required");
  if (!req.body.password) return res.status(400).json("Password is required");
  let user = await User.find({ email: req.body.email });
  let user2 = await User.find({ email: req.body.email }, { password: false });
  if (user.length == 0) return res.status(404).json("user not exist");
  user = user[0];
  user2 = user2[0];
  bcrypt.compare(req.body.password, user.password).then(async (same) => {
    if (!same) {
      return res.status(400).json("Password is not correct");
    }
    const token = jwt.sign(user2.toJSON(), "HS256", {
      expiresIn: "24h",
    });
    await Log.create({
      type: "تسجيل دخول",
      user: user.userName,
      details: "",
      system: os.platform(),
      ip: IP.address(),
    });
    res.status(200).json({ token: token });
  });
};

const signUp = async (req, res) => {
  if (!req.body.email) return res.status(400).json("email is required");
  if (!req.body.userName) return res.status(400).json("username is required");
  if (!req.body.password) return res.status(400).json("Password is required");
  if (!req.body.fullName) return res.status(400).json("fullName is required");
  let { userName, password, fullName, phone, email, admin } = req.body;
  let image = req.file ? req.file.path : undefined;
  const user = await User.find({ email: req.body.email });
  if (user.length > 0) {
    return res.status(400).json("user already exists");
  }
  bcrypt.hash(password, 10).then(async (hashed) => {
    try {
      let user = await User.create({
        userName,
        password: hashed,
        fullName,
        phone,
        email,
        admin,
        image,
      });

      await Log.create({
        type: "اضافه موظف",
        user: user.userName,
        details: `تسجيل موظف جديد :${userName}`,
        system: os.platform(),
        ip: IP.address(),
      });
    } catch (err) {
      return res.status(400).json(err.message);
    }
    res.status(200).json("signup sucessfully");
  });
};

const editProfile = async (req, res) => {
  console.log(req.body);
  if (req.params.id != req.user._id && !req.user.admin)
    return res.status(400).json("you are not authorized");
  const user = await User.findById(req.params.id);
  if (req.body.email) {
    const test = await User.find({ email: req.body.email });
    if (test.length && test[0].email != user.email) {
      return res.status(400).json("not allowed to use this email");
    }
  }
  try {
    let hashed = user.password;
    let image = req.file ? req.file.path : user.image;
    if (req.body.password)
      bcrypt.hash(password, 10).then((result) => {
        hashed = result;
      });
    await User.findByIdAndUpdate(req.params.id, {
      userName: req.body.userName || user.userName,
      password: hashed,
      fullName: req.body.fullName || user.fullName,
      phone: req.body.phone || user.phone,
      email: req.body.email || user.email,
      admin: req.body.admin || user.admin,
      image: image,
    });
    return res.status(200).json("user updated");
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAll = async (req, res) => {
  try {
    const data = await User.find({}, { password: false });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const changeSign = async (req, res) => {
  if (!req.user.admin || !req.file)
    return res.status(400).json("you are not authorized");
  try {
    await Logo.deleteMany({});
    await Logo.create({
      image: req.file.path,
    });
    return res.status(200).json(req.file.path);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const changeRole = async (req, res) => {
  if (!req.user.admin) return res.status(400).json("you are not authorized");
  try {
    await User.findByIdAndUpdate(req.body.id, { admin: req.body.admin });
    return res.status(200).json("done");
  } catch (error) {
    res.status(400).json(error);
  }
};

const getLogo = async (req, res) => {
  try {
    const result = await Logo.find({});
    return res.status(200).json(result[0].image);
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports = {
  signIn,
  signUp,
  editProfile,
  getAll,
  changeSign,
  changeRole,
  getLogo
};
