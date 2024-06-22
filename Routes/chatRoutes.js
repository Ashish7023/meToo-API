const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");
const router = express.Router();
//Route's
router.route("/").post(protect, accessChat);//this route for first time create a chat with the paticular user
router.route("/").get(protect, fetchChats);//this Route fatch all the chat for logged user
router.route("/group").post(protect, createGroupChat);//this route for create a gorup 
router.route("/rename").put(protect, renameGroup);//this route for rename the group name
router.route("/groupadd").put(protect, addToGroup);//this route for add a user to a exiting group 
router.route("/groupremove").put(protect, removeFromGroup);//this route for remove a uset from group

module.exports = router;
