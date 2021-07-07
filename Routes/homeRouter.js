const Router = require("express");
const router = new Router();
const homeController = require("../Controllers/homeController");
const authMiddleware = require("../middlewaree/authMiddleware");

router.post("/getsettings", authMiddleware, homeController.getSettings);
router.post("/changesettings", authMiddleware, homeController.changeSettings);




module.exports = router;
