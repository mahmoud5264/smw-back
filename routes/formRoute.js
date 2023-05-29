const router = require("express").Router();
const check = require("../guard/authGuard");
const upload = require("../assist/multer");
const {
  createForm,
  getForms,
  deleteForm,
  editForm,
  getMyForms,
  getNumberOfForms,
  filter,
} = require("../controllers/formController");
const Form = require("../models/formModel");
router.post("/create", check.validation, upload.single("file"), createForm);
router.get("/", check.validation, getForms);
router.delete("/delete/:id", check.validation, deleteForm);
router.post("/edit/:id", check.validation, editForm);
router.get("/:id", check.validation, getMyForms);

router.post("/filter", check.validation, filter);

module.exports = router;
