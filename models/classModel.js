const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    type:{ type: String, trim: true },
    name: { type: String, trim: true },
  },
  { timestamps: true }
);

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
