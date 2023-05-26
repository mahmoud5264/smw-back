const Class = require("../models/classModel");
const Log = require("../models/logsModel");
const IP = require("ip");
const os = require("os");
const add = async (req, res) => {
  if (!req.body.name) return res.status(400).json("you are not authorized");
  try {
    const temp = await Class.find({ name: req.body.name });
    if (temp.length) {
    } else {
      await Class.create({
        name: req.body.name,
      });

      await Log.create({
        type: "اضافه استماره",
        user: req.user.userName,
        details: `اضافة دائرة احوال جديدة : ${req.body.name}`,
        system: os.platform(),
        ip: IP.address(),
      });
    }
    return res.status(200).json("done");
  } catch (error) {
    return res.status(400).json(error);
  }
};

const get = async (req, res) => {
  try {
    const tmp = await Class.find({});
    return res.status(200).json(tmp);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const delet = async (req, res) => {
  try {
    await Class.findOneAndDelete({ name: req.body.name });
    await Log.create({
      type: "حذف",
      user: req.user.userName,
      details: `مسح تصنيف`,
      system: os.platform(),
      ip: IP.address(),
    });
    return res.status(200).json("done");
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = { add, get, delet };
