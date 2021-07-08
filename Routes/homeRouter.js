const Router = require("express");
const { body } = require("express-validator");
const router = new Router();
const homeController = require("../Controllers/homeController");
const authMiddleware = require("../middlewaree/authMiddleware");

router.post("/getsettings", authMiddleware, homeController.getSettings);
router.post("/changesettings", [body("email").isEmail(),authMiddleware], homeController.changeSettings);
router.post("/deleteuser", authMiddleware, homeController.deleteUser);




module.exports = router;
