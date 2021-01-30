const express = require("express");
const authController = require("./../controllers/authController");
const webhookController = require("./../controllers/webhookController");

const router = express.Router();
router.get(
  "/twitter/state",
  authController.isLoggedIn,
  webhookController.registerWebhook,
  webhookController.subscribeUser
);
router.get("/twitter/callback", authController.getAccessToken);
//router.get("/logout", authController.logout);
//router.get("/state", authController.isLoggedIn);
//router.get("/verify", authController.verify);

module.exports = router;
