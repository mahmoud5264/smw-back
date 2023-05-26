const router = require("express").Router();
const {
  signIn,
  signUp,
  editProfile,
  getAll,
  changeSign,
  changeRole,
  getLogo,
} = require("../controllers/authController");
const upload = require("../assist/multer");
const check = require("../guard/authGuard");

router.post("/signin", signIn);
router.post("/signup", upload.single("image"), signUp);
router.post("/edit/:id", upload.single("image"), check.validation, editProfile);
router.get("/all", getAll);
router.post("/logo", upload.single("image"), check.validation, changeSign);
router.post("/changerole", check.validation, changeRole);
router.get('/logo', check.validation , getLogo)
module.exports = router;
