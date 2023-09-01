const router = require("express").Router();
const check = require("../guard/authGuard");
const upload2 = require('../assist/fileUploader')
const {
  createForm,
  getForms,
  deleteForm,
  editForm,
  getMyForms,
  getNumberOfForms,
  filter,
  getForms2,
  editPrintNumber,
  getMshMostafidForms,
  getMostafidForms,
  deleteAll
} = require("../controllers/formController");
const Form = require("../models/formModel");
router.post("/create", check.validation, upload2.single("file"), createForm);
router.get("/", check.validation, getForms);
router.get("/mostafid", check.validation, getMostafidForms);
router.get("/mshmostafid", check.validation, getMshMostafidForms);
router.post("/front", getForms2);

router.delete("/delete/:id", check.validation, deleteForm);
router.delete('/',check.validation, deleteAll);
router.post("/edit/:id", check.validation, editForm);
router.get("/:id", getMyForms);

router.post("/filter", check.validation, filter);
router.post("/editPrint", check.validation, editPrintNumber);


module.exports = router;
