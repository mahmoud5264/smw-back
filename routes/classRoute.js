const { add, get, delet } = require("../controllers/classController");
const check = require("../guard/authGuard");
const router = require("express").Router();

router.post("/", check.validation, add);
router.get("/", check.validation, get);
router.delete("/:id", check.validation, delet);
module.exports = router;
