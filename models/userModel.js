const mongoose = require("mongoose");

const userShema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true,
    maxLength: 20,
  },
  fullName: {
    type: String,
    required: true,
    trim:true,
    maxLength: 40,
  },
  phone: {
    type: String,
    maxLength: 20,
  },
  image: {
    type: String,
    default:"https://res.cloudinary.com/dbymvhk8x/image/upload/v1684949619/unknown_wm4koi.png"
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
 //   required: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  role: [{ type: String }],
});
const User = mongoose.model("User", userShema);
module.exports = User;
