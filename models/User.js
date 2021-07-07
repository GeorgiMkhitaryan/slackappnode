const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: String,
  avatarImg: String,
  company: { type: Schema.Types.ObjectId, ref: "Company" },
});

module.exports = model("User", User);
