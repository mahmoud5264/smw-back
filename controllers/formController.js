const { default: mongoose } = require("mongoose");
const Form = require("../models/formModel");
const Log = require("../models/logsModel");
const IP = require("ip");
const os = require("os");
const Class = require("../models/classModel");

const editForm = async (req, res) => {
  if (!req.user.admin && (!req.user.role || req.user.role.includes("edit")))
    return res.status(400).json("user is not authorized");
  if (!req.params.id) return res.status(400).json("id is not valid");
  if (mongoose.isValidObjectId(req.params.id)) {
    try {
      const form = await Form.findById(req.params.id);
      if (form.createdBy != req.user._id && !req.user.admin)
        return res.status(400).json("you are not authorized");
      if (!form) return res.status(400).json("there is no such form");

      let test = await Form.findByIdAndUpdate(req.params.id, {
        assignDate: req.body.data || form.date,
        area: req.body.area || form.area,
        pieceNumber: req.body.pieceNumber || form.pieceNumber,
        addressNubmer: req.body.addressNubmer || form.addressNubmer,
        department: req.body.department || form.department,
        paperNumber: req.body.paperNumber || form.paperNumber,
        recordNumber: req.body.recordNumber || form.recordNumber,
        husbandName: req.body.husbandName || form.husbandName,
        motherName: req.body.motherName || form.motherName,
        classType: req.body.classType || form.classType,
        birthDate: req.body.birthDate || form.birthDate,
        birthPlace: req.body.birthPlace || form.birthPlace,
        fullName: req.body.fullName || form.fullName,
        beneficiary: req.body.beneficiary || form.beneficiary,
      });
      console.log("re", test);
      if (req.body.department) {
        const temp = await Class.findOne({
          name: req.body.department,
          type: "address",
        });
        if (!temp) {
          await Class.create({
            name: req.body.department,
            type: "address",
          });
        }
      }
      if (req.body.classType) {
        const temp2 = await Class.findOne({
          name: req.body.classType,
          type: "classType",
        });
        if (!temp2) {
          await Class.create({
            name: req.body.classType,
            type: "classType",
          });
        }
      }
      let fullName = req.body.fullName || form.fullName;
      await Log.create({
        type: "تعديل",
        user: req.user.name,
        details: `تعديل استمارة:${fullName}`,
        system: os.platform(),
        ip: IP.address(),
      });
      console.log("done");
      return res.status(200).json("form updated");
    } catch (error) {
      return res.status(400).json(error);
    }
  } else {
    return res.status(400).json("id is not valid");
  }
};
const XLS = require("xlsx");

const createForm = async (req, res) => {
  if (!req.user.admin && req.user.role.includes("add"))
    return res.status(400).json("user is not authorized");

  if (req.file) {
    try {
      let workbook = XLS.read(req.file.buffer);
      let data = [];

      const sheets = workbook.SheetNames;

     // let size = await Form.find({}).sort({ formNumber: -1 }),
     //   num;

     // !size.length ? (num = 1) : (num = size[0].formNumber * 1 + 1);
       for (let i = 0; i < sheets.length; i++) {
        const temp = XLS.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[i]]
        );
        temp.forEach((res) => {
          let tmp = {};
          tmp.fullName = res["الاسم الكامل"];
          tmp.birthPlace = res["مسقط الراس"];
          tmp.birthDate = res["المواليد"];
          tmp.classType = res["الشريحه"];
          tmp.husbandName = res["اسم الزوج"];
          tmp.recordNumber = res["رقم السجل"];
          tmp.paperNumber = res["رقم الصحيفه"];
          tmp.department = res["دائرة الاحوال"];
          tmp.pieceNumber = res["رقم القطعه"];
          tmp.addressNubmer = res["المقاطعه"];
          tmp.area = res["المساحه"];
          tmp.assignDate = res["تاريخ التخصيص"];
          tmp.beneficiary = true
          tmp.formNumber = res['رقم معرف']
          data.push(tmp);
        });
      }
            console.log('xxxx filr ', data.length)

      
      try {
         Form.insertMany(data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      return res.status(400).json(err);
    }
    return res.json("x");
  }

  let {
    assignDate,
    area,
    pieceNumber,
    addressNubmer,
    department,
    paperNumber,
    recordNumber,
    husbandName,
    motherName,
    classType,
    birthDate,
    birthPlace,
    fullName,
    beneficiary,
  } = req.body;
  // if (!req.body.fullName && !req.file)
  //   return res.status(400).json("data is not completed");
  // console.log(req.body, req.file.path);

  try {
 let size = await Form.find({})
    if (department) {
      const temp = await Class.findOne({ name: department, type: "address" });
      if (!temp) {
        await Class.create({
          name: department,
          type: "address",
        });
      }
    }
    if (classType) {
      const temp2 = await Class.findOne({ name: classType, type: "classType" });
      if (!temp2) {
        await Class.create({
          name: classType,
          type: "classType",
        });
      }
    }

    let tmp = await Form.create({
      assignDate,
      area,
      pieceNumber,
      addressNubmer,
      department,
      paperNumber,
      recordNumber,
      husbandName,
      motherName,
      classType,
      birthDate,
      birthPlace,
      fullName,
      file: req.file ? req.file.path : null,
      formNumber: req.body.formNumber || size[0].formNumber * 1 + 1,
      beneficiary : req.body.b? false : true,
      createdBy: req.user.fullName,
    });
    if (!req.file) {
      await Log.create({
        type: "اضافه استماره",
        user: req.user.name,
        details: `أضافة استمارة جديد تحت اسم:${fullName}`,
        system: os.platform(),
        ip: IP.address(),
      });
    } else {
      await Log.create({
        type: "اضافه ملف excel",
        user: req.user.name,
        details: `اضافه ملف اكسل جديد`,
        system: os.platform(),
        ip: IP.address(),
      });
    }
    // console.log("tmm");
    // console.log(tmp._id);
    return res.status(200).json(tmp);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const getForms = async (req, res) => {
  console.log(req.query.page);
  let page = req.query.page ;
//   let limit = req.query.limit ;
  let start = (page - 1) * 30;
  let end = page * 30;
  try {
    let data = await Form.find({});
    return res.status(200).json({ len: data.length, data: data.slice(0, 30) });

    return res.status(200).json(data);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error);
  }
};

const deleteForm = async (req, res) => {
  if (!req.user.admin && (!req.user.role || req.user.role.includes("delete")))
    return res.status(400).json("user is not authorized");

  if (mongoose.isValidObjectId(req.params.id)) {
    const form = await Form.findById(req.params.id);
    if (req.user._id != form.createdBy && !req.user.admin)
      return res.status(400).json("you are not authorized");
    try {
      await Form.findByIdAndRemove(req.params.id);
      await Log.create({
        type: "حذف",
        user: req.user.name,
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
  console.log(String(req.params.id));
  try {
    const forms = await Form.findById(req.params.id);
    return res.status(200).json(forms);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const getNumberOfForms = async (req, res) => {
  console.log("dsk");
  return res.status(200).json(2);
  try {
    const result = await Form.find({});
    console.log("xss", result.length);
    return res.status(200).json(result.length + 1);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const filter = async (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 1000;
  let start = (page - 1) * limit;
  let end = page * limit;
  let searchType = req.body.searchType
  let searchValue = req.body.searchValue
  try {
    let filterData = await Form.find({}).sort({ createdAt: -1 });
    if (req.body.searchType == "user") {
      filterData = filterData.filter((form) => {
        if (form.createdBy == req.body.searchValue) return form;
      });
    }
    if (req.body.searchType == "assignDate") {
      filterData = filterData.filter((form) => {
        // let date1 = new Date(String(req.body.searchValue)).getTime();
        // let date2 = new Date(x).getTime();
        if (form.assignDate == req.body.searchValue) return form;
      });
    }
    if (req.body.searchType == "formNumber") {
      filterData = filterData.filter((form) => {
        if (
          String(form.formNumber).trim() == String(req.body.searchValue).trim()
        )
          return form;
      });
    }
    if (req.body.searchType == "husbandName") {
      filterData = filterData.filter((form) => {
        if (
          String(form.husbandName)
            .trim()
            .includes(String(req.body.searchValue).trim())
        )
          return form;
      });
    }
    if (req.body.searchType == "fullName") {
      filterData = filterData.filter((form) => {
        if (
          form.name == req.body.searchValue ||
          form.fullName.includes(req.body.searchValue)
        )
          return form;
      });
    }
  //   console.log(filterData);
    return res.status(200).json(filterData.slice(start,page * 30));
  } catch (error) {
    res.status(400).json(error);
  }
};
const getForms2 = async (req, res) => {
  console.log("xxxzzz", req.query.page, req.body);
  let page = req.query.page;
  let start = (page - 1) * 30;
  let { search } = req.body;
  try {
    let data = []
    if (req.body.search && req.body.search != "" &&  Object.keys(req.body.search).length != 0 ) {
       data = await Form.find({
        $or: [
          {
            husbandName: search,
          },
          { fullName: search },
          { area: search },
          { assignDate: search },
          { formNumber: search },
          { pieceNumber: search },
          { department: search },
          { paperNumber: search },
          { recordNumber: search },
          { motherName: search },
          { classType: search },
          { addressNubmer: search },
          { birthPlace: search },
        ]
      })
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(page * 30);
    }else{
      data = await Form.find({})
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(page * 30);

    }
  

    return res.status(200).json(data);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error);
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
  getForms2
};
