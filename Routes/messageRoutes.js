const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");
const router = express.Router();
//route's
router.route("/").post(protect, sendMessage); //this route for send the message
router.route("/:chatId").get(protect, allMessages); //this route for get all the chat for a paticular user

module.exports = router;
