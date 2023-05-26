const upload = require("../assist/multer");
const getLogs = require("../controllers/logController");
const check = require("../guard/authGuard");
const router = require("express").Router();

router.post("/", check.validation, getLogs);

module.exports = router;
