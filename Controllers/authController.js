const User = require("../models/User");
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config");

const nodemailer = require("nodemailer");
const mailRegistration = require("../email/registration");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "suppoort444@gmail.com",
    pass: "8246951753g",
  },
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, secret, { expiresIn: "12h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(404).json({ message: "Registration error" });
      }
      const { username, password, companyId } = req.body;
      const candidate = await User.findOne({ username });

      if (candidate) {
        return res
          .status(404)
          .json({ message: "A user with the same name already exists" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ username, password: hashPassword });
      const company = await Company.findOne({ _id: companyId });
      if (company) {
        company.users.push(user._id);
        user.company = company._id;
        await user.save();
        company.save();

        return res
          .status(202)
          .json({ message: "User registered successfully" });
      }
      return res.status(404).json({ message: "User ne is registered" });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username }).populate("company");
      if (!user) {
        return res.status(404).json({ message: `User ${username} not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(404).json({ message: `Login error` });
      }
      const token = generateAccessToken(user._id);
      return res.status(200).json({ token });
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "Login error" });
    }
  }

  async emailverification(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({
        succses: false,
        message: "company name or email is not valid",
      });
    }
    try {
      const { email, companyname } = req.body;

      const activationCode = getRandomInt(999999);
      const candidate = await Company.findOne({ email });

      if (candidate) {
        return res
          .status(404)
          .json({ succses: false, message: "email already used" });
      }

      await transporter.sendMail(
        mailRegistration({
          to: email,
          from: "suppoort444@gmail.com",
          code: activationCode,
        }),
        async function (error, info) {
          if (error) {
            return res.status(404).json({ message: error });
          } else {
            const newCompany = new Company({
              email,
              activationCode,
              companyname,
            });
            await newCompany.save();
            return res.status(200).json({
              companyId: newCompany._id,
              message: "Activation code has been sent to your email",
            });
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  async activationCode(req, res) {
    try {
      const { activationCode, companyId } = req.body;
      const condidate = await Company.findOne({ _id: companyId });
      if (condidate && condidate.activationCode === parseInt(activationCode)) {
        condidate.activationStatus = true;
        await condidate.save();
        return res
          .status(200)
          .json({ succses: true, message: "Company is activ" });
      } else {
        return res
          .status(404)
          .json({ succses: false, message: "Active code is not valid" });
      }
    } catch (e) {
      return res.status(404).json({ message: "Login error" });
    }
  }
  async hasCompanyname(req, res) {
    try {
      const { companyname } = req.body;
      const reslutMessage = {
        companyname: companyname,
        condidateName: companyname,
      };
      let i = 0;
      const resultCorrectName = async (companyname) => {
        const candidate = await Company.findOne({ companyname: companyname });
        if (candidate) {
          if (req.user) {
          }
          reslutMessage.condidateName = `${companyname}${++i}`;
          resultCorrectName(reslutMessage.condidateName);
        } else {
          res.status(200).json(reslutMessage);
        }
      };
      resultCorrectName(companyname);
    } catch (e) {
      return res.status(404).json({ message: "company already used" });
    }
  }
  async hasLogined(req, res) {
    return res.status(200).json({ succes: true });
  }
}

module.exports = new authController();
