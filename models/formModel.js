const mongoose = require("mongoose");
const formSchema = mongoose.Schema(
  {
    assignDate: { type: String, default: null },
    area: { type: String, default: null, trim: true },
    pieceNumber: { type: String, default: null },
    paperNumber: { type: String, default: null, trim: true },
    department: { type: String, default: null, trim: true },
    addressNubmer: { type: String, default: null },
    recordNumber: { type: String, default: null },
    husbandName: { type: String, default: null, trim: true },
    husbandName2: { type: String, default: null, trim: true },
    motherName: { type: String, default: null, trim: true },
    classType: { type: String, default: null, trim: true },
    birthDate: { type: String, default: null },
    birthPlace: { type: String, default: null, trim: true },
    fullName: { type: String, default: null, trim: true },
    formNumber: { type: String, default: null },
    file:{ type: String, default: null },
    beneficiary: { type: Boolean, default: false, trim: true },
    createdBy: {type: String, default: null },
    note: { type: String, default: "", trim: true },
    number: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);
module.exports = Form;
