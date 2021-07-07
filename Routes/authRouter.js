const Router = require("express");
const router = new Router();
const authController = require("../Controllers/authController");
const { body } = require("express-validator");
const authMiddleware = require("../middlewaree/authMiddleware");

router.post(
  "/registration",
  [body("username").notEmpty(), body("password").isLength({ min: 4, max: 10 })],
  authController.registration
);

router.post("/login", authController.login);
router.post("/hascompanyname", authController.hasCompanyname);

router.post(
  "/emailverification",
  body("email").isEmail(),
  authController.emailverification
);

router.post("/activationcode", authController.activationCode);
router.post("/haslogined", authMiddleware, authController.hasLogined);

module.exports = router;
