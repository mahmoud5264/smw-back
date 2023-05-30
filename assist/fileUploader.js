const multer = require('multer')
require('dotenv').config()

const upload2 = multer({ storage: multer.memoryStorage() });

module.exports = upload2