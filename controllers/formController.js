const { default: mongoose } = require("mongoose");
const Form = require("../models/formModel");
const Log = require("../models/logsModel");
const IP = require("ip");
const os = require("os");
const Class = require("../models/classModel");

const editForm = async (req, res) => {
  if (!req.params.id) return res.status(400).json("id is not valid");
  if (mongoose.isValidObjectId(req.params.id)) {
    const form = await Form.findById(req.params.id);
    if (form.createdBy != req.user._id && !req.user.admin)
      return res.status(400).json("you are not authorized");
    if (!form) return res.status(400).json("there is no such form");
    try {
      await Form.findByIdAndUpdate(req.params.id, {
        date: req.body.data || form.date,
        area: req.body.area || form.area,
        pieceNumber: req.body.pieceNumber || form.paperNubmer,
        address: req.body.address || form.address,
        department: req.body.department || form.department,
        paperNubmer: req.body.paperNubmer || form.paperNubmer,
        recordNumber: req.body.recordNumber || form.recordNumber,
        husbandName: req.husbandName || form.husbandName,
        motherName: req.body.motherName || form.motherName,
        classType: req.body.classType || form.classType,
        birthDate: req.body.birthDate || form.birthDate,
        birthPlace: req.body.birthPlace || form.birthPlace,
        fullName: req.body.fullName || form.fullName,
        formNumber: req.body.formNumber || form.formNumber,
        beneficiary: req.body.beneficiary || form.beneficiary,
      });
      let fullName = req.body.fullName || form.fullName;
      await Log.create({
        type: "تعديل",
        user: req.user.userName,
        details: `تعديل استمارة:${fullName}`,
        system: os.platform(),
        ip: IP.address(),
      });
      return res.status(200).json("form updated");
    } catch (error) {
      return res.status(400).json(error);
    }
  } else {
    return res.status(400).json("id is not valid");
  }
};

const createForm = async (req, res) => {
  let {
    date,
    area,
    pieceNumber,
    address,
    department,
    paperNubmer,
    recordNumber,
    husbandName,
    motherName,
    classType,
    birthDate,
    birthPlace,
    fullName,
    formNumber,
    beneficiary,
  } = req.body;
  if (!req.body.fullName) return res.status(400).json("data is not completed");
  const temp = await Class.findOne({ address });

  try {
    await Form.create({
      date,
      area,
      pieceNumber,
      address,
      department,
      paperNubmer,
      recordNumber,
      husbandName,
      motherName,
      classType,
      birthDate,
      birthPlace,
      fullName,
      formNumber,
      beneficiary,
      createdBy: req.user._id,
    });
    if (!temp) {
      await Class.create({
        name: address,
      });
    }
    await Log.create({
      type: "اضافه استماره",
      user: req.user.userName,
      details: `أضافة استمارة جديد تحت اسم:${fullName}`,
      system: os.platform(),
      ip: IP.address(),
    });

    return res.status(200).json("form added");
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getForms = async (req, res) => {
  try {
    const data = await Form.find({});
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteForm = async (req, res) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    const form = await Form.findById(req.params.id);
    if (req.user._id != form.createdBy && !req.user.admin)
      return res.status(400).json("you are not authorized");
    try {
      await Form.findByIdAndRemove(req.params.id);
      await Log.create({
        type: "حذف",
        user: req.user.userName,
        details: `مسح استمارة تحت اسم :${form.fullName}`,
        system: os.platform(),
        ip: IP.address(),
      });

      return res.status(200).json("done");
    } catch (error) {
      return res.status(400).json(error);
    }
  } else {
    return res.status(400).json("id is not valid");
  }
};

const getMyForms = async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user._id });
    return res.status(200).json(forms);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getNumberOfForms = async (req, res) => {
  try {
    const result = await Form.find({});
    return res.status(200).json(result.length);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const filter = async (req, res) => {
  try {
    let filterData = await Form.find({});
    if (req.body.user) {
      filterData = filterData.filter((form) => {
        if (form.createdBy == req.body.user) return form;
      });
    }
    if (req.body.classType) {
      filterData = filterData.filter((form) => {
        if (form.classType == req.body.classType) return form;
      });
    }
    if (req.body.birthPlace) {
      filterData = filterData.filter((form) => {
        if (form.birthPlace == req.body.birthPlace) return form;
      });
    }
    if (req.body.address) {
      filterData = filterData.filter((form) => {
        if (form.address == req.body.address) return form;
      });
    }
    if (req.body.name) {
      filterData = filterData.filter((form) => {
        if (
          form.husbandName.includes(req.body.name) ||
          form.fullName.includes(req.body.name)
        )
          return form;
      });
    }
    return res.status(200).json(filterData);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  createForm,
  getForms,
  editForm,
  deleteForm,
  getMyForms,
  getNumberOfForms,
  filter,
};
