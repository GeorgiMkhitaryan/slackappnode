const Company = require("../models/Company");
const User = require("../models/User");

class homeController {
  async getSettings(req, res) {
    try {
      const { id } = req.user;
      const candidate = await User.findOne({ _id: id }).populate("company");
      if (candidate) {
        return res.status(200).json({
          succses: true,
          settings: {
            username: candidate.username,
            companyname: candidate.company.companyname,
            email: candidate.company.email,
          },
        });
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({ succes: false, message: "Session error" });
    }
  }

  async changeSettings(req, res) {
    try {
      const { id } = req.user;
      const { username, email, companyname } = req.body;
      const candidate = await User.findOne({ _id: id });
      const company = await Company.findOne({ _id: candidate.company });
      if (candidate) {
        candidate.username = username;
        company.email = email;
        company.companyname = companyname;

        await candidate.save();
        await company.save();
        return res.status(200).json({
          succses: true,
          message: "Succes Save",
        });
      }
    } catch (e) {
      res.status(404).json({ succes: false, message: "Save error" });
    }
  }
}

module.exports = new homeController();
