const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Log = require("../models/logsModel");
const IP = require("ip");
const os = require("os");
const User = require("../models/userModel");
const Logo = require("../models/logoModel");
const Form = require('../models/formModel')
const signIn = async (req, res) => {
  //console.log(req.body);
  if (!req.body.name) return res.status(400).json("name is required");
  if (!req.body.password) return res.status(400).json("Password is required");

  try {
    let user = await User.find({ name: req.body.name });
    let user2 = await User.find({ name: req.body.name }, { password: false });
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
        user: user.name,
        details: "",
        system: os.platform(),
        ip: IP.address(),
      });
      res.status(200).json({ token: token });
    });
  } catch (err) {
    console.log(err);
  }
};

const signUp = async (req, res) => {
  //console.log(req.body);
  if (!req.body.name) return res.status(400).json("name is required");
  if (!req.body.password) return res.status(400).json("Password is required");
  if (!req.body.fullName) return res.status(400).json("full Name is required");
  let { name, password, fullName, phone, email, admin, role } = req.body;
  //console.log(role);
  let image = req.file ? req.file.path : undefined;
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length > 0) {
      return res.status(400).json("user already exists");
    }
    bcrypt.hash(password, 10).then(async (hashed) => {
      try {
        let user = await User.create({
          name,
          password: hashed,
          fullName,
          phone,
          email,
          admin,
          image,
          role:String(req.body.role).split(',') ,
        });

        await Log.create({
          type: "اضافه موظف",
          user: user.userName,
          details: `تسجيل موظف جديد :${name}`,
          system: os.platform(),
          ip: IP.address(),
        });
      } catch (err) {
        return res.status(400).json(err.message);
      }

      return res.status(200).json("signup sucessfully");
    });
  } catch (err) {
    return res.status(401).json(err);
    console.log("xxxx", err);
  }
};

const editProfile = async (req, res) => {
  console.log(req.body);
  try {
    if (req.params.id != req.user._id && !req.user.admin)
      return res.status(400).json("you are not authorized");

    try {
      let user = await User.findById(req.params.id);
      if (req.body.name) {
        const test = await User.find({ name: req.body.name });
        if (test.length && test[0].name != user.name) {
          return res.status(400).json("not allowed to use this email");
        }
      }
      let hashed = user.password;
      console.log(req.body.role);
      if(req.body.role) console.log(req.body.role);
      let image = req.file ? req.file.path : user.image;
      if (req.body.password)
        bcrypt.hash(req.body.password, 10).then((result) => {
          hashed = result;
        });
        console.log("yyyyyyyyyy");
      user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name || user.name,
        password: hashed,
        fullName: req.body.fullName || user.fullName,
        phone: req.body.phone || user.phone,
        email: req.body.email || user.email,
        admin: req.body.admin || user.admin,
        image: image,
        role:  String(req.body.role).split(',')  ,
      });
      user = await User.findById(req.params.id);
      const token = jwt.sign(user.toJSON(), "HS256", {
        expiresIn: "24h",
      });
      await Log.create({
        type: "تعديل بيانات",
        user: user.name,
        details: `قام ${req.user.name} بتعديل البيانات`,
        system: os.platform(),
        ip: IP.address(),
      });
      return res.status(200).json({ token: token });
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  } catch (err) {
    console.log(err);
  }
};

const getAll = async (req, res) => {
  try {
    const data = await User.find({});
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const changeSign = async (req, res) => {
  console.log(req.user.admin, req.file);
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

const getUser = async (req, res) => {
  if (!req.user.admin && req.user._id != req.params.id)
    return res.status(400).json("not authorized");
  try {
    let user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
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

const deleteUser = async (req, res) => {
  console.log(req.user);
  if (!req.user.admin && !req.user.role.includes("setting"))
    return res.status(400).json("not authorized");
  try {
    await User.findByIdAndDelete(req.params.id)
    return res.status(200).json('deleted')
  } catch (error) {
    return res.status(400).json(error)
  }
};

// const numOfForms = async(req,res)=>{
//   try {
//     let len = await Form.find({})
//     if(len) return res.status(200).json(len[len.length - 1].formNumber+1)
//     else return res.status(200).json(1)
//   } catch (error) {
//     return res.status(400).json(error)
    
//   }
// }
module.exports = {
  signIn,
  signUp,
  editProfile,
  getAll,
  changeSign,
  changeRole,
  getLogo,
  getUser,
  deleteUser,
  
};
