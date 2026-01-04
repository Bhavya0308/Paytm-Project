const express = require('express')
const jwt = require("jsonwebtoken")
const {SigninUser, SignupUser, UpdateUserDetails} = require('../types');
const { isValid } = require('zod');
const { User } = require("../db");
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');

const userRouter = express.Router()

//Sign in User 
userRouter.post("/signup", async (req,res) => {
    const details = req.body;
    const isvalid = SignupUser.safeParse(details);
    if (!isValid){
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }
    userExists = await User.findOne({
            username: details.username 
    })
    if (!userExists){
        const user = await User.create({
            username: details.username,
            password: details.password,
            firstName: details.firstName,
            lastName: details.lastName
        })
        await Account.create({
            userId: user._id,
            balance: 1 + (Math.random() * 10000)
        })
        const token = jwt.sign(
            {userId: user._id},
            JWT_SECRET
        )
        res.status(200).json({
            message: "User createed successfully",
            token: token
        })
    }
    else {
        return res.status(411).json({
            message:"Email already taken/incorrect inputs"
        })
    }
})


//Sign up User
userRouter.post("/signin", async (req,res) => {
    const userDetails = req.body
    const isValid = SigninUser.safeParse(userDetails)
    if (!isValid.success){
        return res.status(411).json({
            message: "Invalid inputs"
        })
    }
    const user = await User.findOne({
        username: userDetails.username,
        password: userDetails.password
    })
    if (!user){
        return res.status(411).json({
            message: "Error while logging in"
        })
    }
    const token = jwt.sign(
        {userId: user._id},
        JWT_SECRET
    )
    res.status(200).json({
        message: "User Logged in sucessfully",
        token: token

    })
})


//Update user information
userRouter.put("/",authMiddleware, async (req,res) => {
    const updatedPayload = req.body
    const isValid = UpdateUserDetails.safeParse(updatedPayload)
    if (!isValid.success){
        return res.status(411).json({
            message: "password is too small"
        })
    }
    await User.updateOne({_id: req.userId}, req.body);

    res.status(200).json({
        message:"Updated Successfully"
    })
})

//get users from the backend
userRouter.get("/bulk", authMiddleware, async (req,res) => {
    const payload = req.query.filter;
    const users = await User.find({$or: [{'firstName': {"$regex": payload, "$options": "i"}}, {'lastName': {"$regex": payload, "$options": "i"}}]})
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
          }))
    })
})

module.exports = userRouter;
