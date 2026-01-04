const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("./config");
const { User } = require("./db");

const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403).json({
            message: "Authorization header missing or malformed"
        })
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            const user = await User.findById(decoded.userId);
            if (!user){
                return res.status(401).json({
                    message: "User no longer exist"
                })
            }
            next();
        } else {
            return res.status(403).json({
                "message": "Inside else"
            })
        }
    }
    catch(err){
        return res.status(403).json({
            error: err
        })
    }
}

module.exports = {
    authMiddleware
}