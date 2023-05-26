const mongoose = require("mongoose");

const logoSchema = mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

const Logo = mongoose.model("Logo", logoSchema);
module.exports = Logo;
