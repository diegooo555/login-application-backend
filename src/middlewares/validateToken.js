import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if(!token) return res.status(401).json({message: "No token provided, unauthorized"});
    
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) return res.status(401).json({message: "Invalid Token, Unauthorized"});
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
};
