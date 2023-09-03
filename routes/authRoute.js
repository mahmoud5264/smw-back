const router = require("express").Router();
const {
  signIn,
  signUp,
  editProfile,
  getAll,
  changeSign,
  changeRole,
  getLogo,
  getUser,
  deleteUser,
  numOfForms,
} = require("../controllers/authController");
const upload = require("../assist/multer");
const check = require("../guard/authGuard");

router.post("/signin", signIn);
router.post("/signup", upload.single("file"),check.validation, signUp);
router.post("/edit/:id", upload.single("file"), check.validation, editProfile);
router.get("/all", getAll);
router.post("/logo", upload.single("file"), check.validation, changeSign);
router.post("/changerole", check.validation, changeRole);
router.get('/logo', check.validation , getLogo)
router.get('/:id', check.validation , getUser)
router.delete('/:id'  , check.validation,deleteUser)
module.exports = router;
