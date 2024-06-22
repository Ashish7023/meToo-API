const User = require("../Models/userModels");
const generateToken = require("../config/genrateToken");
//this function handle for resister User
const resgisterUser = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please Enter all the feilds");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exites");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("failed to create user");
  }
};
//this function haldle login request
const authUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401);
    throw new Error("please fill all fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    if (userExists.password == password) {
      res.status(201).json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        pic: userExists.pic,
        token: generateToken(userExists._id),
      });
    } else {
      res.status(404);
      throw new Error(" user password is wrong");
    }
  } else {
    res.status(404);
    throw new Error(" user is not exsist");
  }
};
//this function get all the user that are present in db
const allUsers = async (req, res) => {
  const users = await User.find({
    $or: [
      { name: new RegExp(req.query.search, "i") },
      { email: new RegExp(req.query.search, "i") },
    ],
  }).find({ _id: { $ne: req.user._id } });
  res.send(users);
};
module.exports = { resgisterUser, authUser, allUsers };
