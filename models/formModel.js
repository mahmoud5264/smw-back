const mongoose = require("mongoose");
const formSchema = mongoose.Schema(
  {
    assignDate: { type: Date, default: null },
    area: { type: String, default: null, trim: true },
    pieceNumber: { type: Number, default: null },
    paperNumber: { type: String, default: null, trim: true },
    department: { type: String, default: null, trim: true },
    addressNubmer: { type: String, default: null },
    recordNumber: { type: Number, default: null },
    husbandName: { type: String, default: null, trim: true },
    motherName: { type: String, default: null, trim: true },
    classType: { type: String, default: null, trim: true },
    birthDate: { type: Date, default: null },
    birthPlace: { type: String, default: null, trim: true },
    fullName: { type: String, default: null, trim: true },
    formNumber: { type: Number, default: null },
    file:{ type: String, default: null },
    beneficiary: { type: Boolean, default: false, trim: true },
    createdBy: {type: String, default: null },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);
module.exports = Form;
