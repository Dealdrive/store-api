const router  = require("express").Router();
const User = require("../model/User")
const cryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")


//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  function isTokenExpired(token) {
    try {
        const decoded = jwt.decode(token);
        if (!decoded.exp) {
            return false;
        }
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return !(date.valueOf() > new Date().valueOf());
    } catch (err) {
        return false;
    }
}

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json("Wrong credentials");
    }
    const hashedPassword = cryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

    const originalpassword = hashedPassword.toString(cryptoJS.enc.Utf8);
    if (originalpassword !== req.body.password) {
      return res.status(401).json("Wrong credentials");
    }
    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SEC,
    {expiresIn: "3d"})
    const refreshToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SEC_REFRESH,
    {expiresIn: "30d"})
    const {password, ...others} = user._doc;
    return res.status(200).json({...others, accessToken, refreshToken});
  } catch (err) {
    return res.status(500).json(err);
  }
});

// REFRESH TOKEN
router.post("/refresh", async (req, res) => {
  try {
  // Verify the provided refresh token
  const refreshToken = req.body.refresh_token;
  if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
  }
  if (isTokenExpired(refreshToken)) {
    return res.status(401).json("Refresh token expired");
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SEC_REFRESH);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
    return res.status(401).json("User not found");
    }

  // Issue a new access token
  const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
  }, process.env.JWT_SEC, { expiresIn: '3d' });

  // Return the new access token
  return res.status(200).json({ access_token: accessToken });
} catch (err) {
  return res.status(500).json(err);
  }
});



module.exports = router;