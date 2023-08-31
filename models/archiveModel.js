const mongoose = require("mongoose");
const archiveSchema = mongoose.Schema(
    {
      image:{ type: String, trim: true },
      region: { type: String, trim: true },
      number: { type: String, trim: true },
      bookNumber: { type: String, trim: true },
      date: { type: String, trim: true },
      date2: { type: String, trim: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
  );
  
  const Archive = mongoose.model("Archive", archiveSchema);
  module.exports = Archive;
