const express = require("express");
const { login } = require("../controllers/auth.js");

const router = express.Router();
// login route
router.post("/login", login);


// export default router;
module.exports = router;