const express = require("express");
const {
  resgisterUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
//Route's of user 
router.route("/").post(resgisterUser).get(protect, allUsers);//this is the route for resister the user and find all of the user that are present in database
router.post("/login", authUser);//this is the route for the login the user
module.exports = router;
