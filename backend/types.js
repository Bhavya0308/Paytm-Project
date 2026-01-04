const zod = require("zod")

const SigninUser = zod.object({
    username: zod.string().min(3).max(30),
    password: zod.string().min(6)
})

const SignupUser = zod.object({
    username: zod.string().min(3).max(30),
    firstName: zod.string().max(50),
    lastName: zod.string().max(50),
    password: zod.string().min(6)
})

const UpdateUserDetails = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})



module.exports = {
    SigninUser,
    SignupUser,
    UpdateUserDetails
}