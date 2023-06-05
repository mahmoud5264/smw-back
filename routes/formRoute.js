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
} = require("../controllers/formController");
const Form = require("../models/formModel");
router.post("/create", check.validation, upload2.single("file"), createForm);
router.get("/", check.validation, getForms);
router.post("/front", check.validation, getForms2);

router.delete("/delete/:id", check.validation, deleteForm);
router.post("/edit/:id", check.validation, editForm);
router.get("/:id", check.validation, getMyForms);

router.post("/filter", check.validation, filter);

module.exports = router;
