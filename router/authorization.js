const jwt = require("jsonwebtoken");
const JWT_SECRFT = process.env.ACCESS_TOKEN_SECRET;

function tokenVerifty(req, res, next) {
    console.log("autofile=======================================",req.headers["authorization"])
    const authorizationHeader = req.headers["authorization"];
    const token = authorizationHeader.split(" ")[1];
    const user = jwt.verify(token, JWT_SECRFT, (err, res) => {
        if (err) {
            return "token Expired";
        }
        return res;
    });
    if (user == "token Expired") {
        return res.send({ status: "error", data: "Token Expired" });
    } else {
        req.token = token;
        next();
    }
}



module.exports = tokenVerifty;

