const express = require('express')
const router = express.Router();
const uRouter = require("./userRouter")
const accountRouter = require("./accountRouter")


router.use('/user', uRouter)
router.use('/account', accountRouter);  

module.exports = router;
