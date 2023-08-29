const router = require("express").Router();
const upload = require("../assist/multer");
const { add, search, get, getAll } = require("../controllers/archiveController");
const check = require("../guard/authGuard");

router.post('/add',upload.single("file"), check.validation, add)
router.post('/search',check.validation, search)
router.get('/get', check.validation , get)
router.get('/getAll', check.validation , getAll)
module.exports = router
