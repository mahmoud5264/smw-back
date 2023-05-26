const {setTime, getBackUp, } = require("../controllers/backupController");
const check = require("../guard/authGuard");
const router = require("express").Router();

router.post("/settime", check.validation, setTime);
router.get('/' , check.validation , getBackUp)
module.exports = router;
