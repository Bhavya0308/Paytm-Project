const express = require('express');
const { authMiddleware } = require('../middleware');
const accountRouter = express.Router();
const { Account, User } = require('../db');
const mongoose = require('mongoose');

accountRouter.get('/balance', authMiddleware, async (req, res) => {
    const user_id = req.userId;
    const account = await Account.findOne({ userId: user_id });
    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }
    res.status(200).json({
        balance: account.balance
    });
});

accountRouter.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {toUser, amount} = req.body;
        const fromUser_id = req.userId;
        console.log(toUser, amount, fromUser_id);
        const fromAccount = await Account.findOne({ userId: fromUser_id });
        if (!fromAccount || fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }
        const toUserObj = await User.findOne({ _id : toUser });
        if (!toUserObj) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Recipient user not found"
            });
        }
        const toAccount = await Account.findOne({ userId : toUserObj._id });
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Recipient account not found"
            });
        }
        await Account.updateOne({
            userId: fromUser_id
        }, {
            $inc: { balance: -amount }
        });
        await Account.updateOne({
            userId: toUserObj._id
        }, {
            $inc: { balance: amount }
        });
        await session.commitTransaction();
        res.status(200).json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            message: "Transfer failed",
            error: error.message
        });
    }
});

module.exports = accountRouter;