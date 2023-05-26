const router = require("express").Router();
const check = require("../guard/authGuard");
const {
  createForm,
  getForms,
  deleteForm,
  editForm,
  getMyForms,
  getNumberOfForms,
  filter,
} = require("../controllers/formController");

router.post("/create", check.validation, createForm);
router.get("/", check.validation, getForms);
router.delete("/delete/:id", check.validation, deleteForm);
router.post("/edit/:id", check.validation, editForm);
//router.get("/forms", check.validation, getMyForms);
router.get("/numbers", check.validation, getNumberOfForms);
router.post("/filter", check.validation, filter);

module.exports = router;
