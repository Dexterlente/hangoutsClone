const express = require("express");
const { logout } = require("../controllers/auth.js");

const router = express.Router();


router.get("/logout", logout);

// export default router;
module.exports = router;