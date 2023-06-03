require("dotenv").config();
const Logo = require("../models/logoModel");
const Log = require("../models/logsModel");
const User = require("../models/userModel");
const Class = require("../models/classModel");
const Form = require("../models/formModel");
const cron = require("node-cron");
const axios = require("axios");

 let time = "0 28 2 * * 7";

cron.schedule(time, async () => {
   console.log("xxxxxxxx");
  try {
  
  let result = {};
  let users = await User.find({});
  result.users = users;
  let forms = await Form.find({});
  result.forms = forms;
  let logs = await Log.find({});
  result.logs = logs;
  let logo = await Logo.find({});
  result.logo = logo;
  let classes = await Class.find({});
  result.classes = classes;
  const res = await axios.post(process.env.EXhost, {
    result,
  });
  console.log('res');

  } catch (err) {
    console.log(err);
  }
});

const setTime = async (req, res) => {
  if (!req.user.admin) return res.status(400).json("you are not authorized");
  if (req.body.time == 0) {
  } else if (req.body.time == 7) {
    time = "* * * * * 7";
  } else if (req.body.time == 1) {
    time = "* * 23 * * *";
  } else if (req.body.time == 30) {
    time = "* * * 1 * *";
  }
  res.status(200).json("done");
};

const getBackUp = async (req, res) => {
  if (!req.user.admin) return res.status(400).json("you are not authorized");
  try {
    let result = {};
    let users = await User.find({});
    result.users = users;
    let forms = await Form.find({});
    result.forms = forms;
    let logs = await Log.find({});
    result.logs = logs;
    let logo = await Logo.find({});
    result.logo = logo;
    let classes = await Class.find({});
    result.classes = classes;
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json(err);
  }
};
module.exports = {
  setTime,
  getBackUp,
};

