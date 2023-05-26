const mongoose = require("mongoose");

const logsSchema = mongoose.Schema(
  {
    type: String,
    user: String,
    details: String,
    system: String,
    ip: String,
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", logsSchema);
module.exports = Log;
