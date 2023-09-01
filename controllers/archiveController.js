const Archive = require("../models/archiveModel");
const Log = require("../models/logsModel");
const IP = require("ip");
const os = require("os");
const add = async (req, res) => {
  const { region, number, bookNumber, date, date2 } = req.body;
  if (!req.user || !req.file) {
    return res.status(400).json("حدث خطأ ما حاول مره اخري");
  }
  
  try {
    console.log(req.user)
    if(!req.user.hidden){
        await Log.create({
          type: "اضافه",
          user: req.user.name,
          details: ` اضافه ارشيف:${req.user.fullName}`,
          system: os.platform(),
          ip: IP.address(),
        });
      }
    let temp = await Archive.create({
      image: req.file.path,
      region,
      number,
      bookNumber,
      date,
      date2,
      user: req.user,
    });
    console.log(temp);
    return res.status(200).json(temp);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const search = async (req, res) => {
  const { search } = req.body;
  console.log(req.body);

  let data = await Archive.find({
    $or: [
      { region: { $regex: `${search}` } },
      { bookNumber: { $regex: `${search}` } },
      { date: { $regex: `${search}` } },
    ],
  }).limit(30);
  return res.status(200).json(data);
};

const get = async (req, res) => {
  const { id } = req.query.id;
  if(!req.query.id) return res.status(400).json('رجاء ادخال الرفم التعريفي')
  let data = await Archive.findById(req.query.id).populate('user');
  return res.status(200).json(data);
};

const deleteArchive = async (req, res) => {
  const { id } = req.query.id;
  console.log(id)
  if(!req.query.id) return res.status(400).json('رجاء ادخال الرفم التعريفي')
  try{
     if(!req.user.hidden){
        await Log.create({
          type: "مسح",
          user: req.user.name,
          details: ` مسح ارشيف:${req.user.fullName}`,
          system: os.platform(),
          ip: IP.address(),
        });
      }
    let data = await Archive.findByIdAndDelete(req.query.id);
    return res.status(200).json(data);
  }catch(e){
    return res.status(400).json(e)
  }
};

const getAll = async (req, res) => {
  const page = req.query.page ? req.query.page * 1 : 1;
  let data = await Archive.find({})
    .skip((page - 1) * 30)
    .limit(30);
  return res.status(200).json(data);
};

module.exports = { add, search, get, getAll, deleteArchive };
