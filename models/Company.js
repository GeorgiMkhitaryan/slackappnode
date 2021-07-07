const { Schema, model } = require("mongoose");

const Company = new Schema({
  email: String,
  activationCode: Number,
  companyname: String,
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  activationStatus: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Company", Company);
