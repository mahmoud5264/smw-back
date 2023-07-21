const Class = require("../models/classModel");
const Log = require("../models/logsModel");
const IP = require("ip");
const os = require("os");

const add = async (req, res) => {
  console.log(req.body);
  if (!req.body.name || !req.user.admin)
    return res.status(400).json("you are not authorized");
  try {
    const temp = await Class.find({ name: req.body.name,type:req.body.type });
 //   console.log(temp.length);
    if (temp.length) {
    } else {
      await Class.create({
        name: req.body.name,
        type: req.body.type
      });
      //console.log(req.body);
      if(!req.user.hidden){
        await Log.create({
          type: "اضافه استماره",
          user: req.user.name,
          details: `اضافة دائرة احوال جديدة : ${req.body.name}`,
          system: os.platform(),
          ip: IP.address(),
        });
      }
    }
    return res.status(200).json("done");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const get = async (req, res) => {
  console.log(req.user);
  //if (!req.user.admin) return res.status(400).json("you must be admin");
  try {
    const tmp = await Class.find({});
    return res.status(200).json(tmp);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const delet = async (req, res) => {
  if (!req.user.admin) return res.status(400).json("you must be admin");
  console.log(req.body);
  try {
    await Class.findByIdAndDelete( req.params.id);
    if(!req.user.hidden){
      await Log.create({
        type: "حذف",
        user: req.user.name,
        details: `مسح تصنيف`,
        system: os.platform(),
        ip: IP.address(),
      });
    }
    return res.status(200).json("done");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

module.exports = { add, get, delet };
