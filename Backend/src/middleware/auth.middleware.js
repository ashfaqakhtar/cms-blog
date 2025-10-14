import jwt from "jsonwebtoken"

export const isLoggedIn = async (req, res, next) => {

    try {

        // console.log("this is cookies", req.cookies);
        // const token = req.cookies?.token

        const token = req.cookies?.cookie;

        // console.log("Token Found :", token ? "yes" : "no");

        if (!token) {
            console.log("No token");
            return res.status(401).json({
                success: false,
                message: "Autentication failed"
            })

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded Data :", decoded);
        req.user = decoded
        next()

        // console.log(decoded)

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Internel server Error last "
        })
    }

    // next();
}