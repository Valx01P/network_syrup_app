import jwt from 'jsonwebtoken'

/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @example returns req.jwt_user with the decoded access token containing the 'userId' and 'email'
 */
const verifyJWT = (req, res, next) => {

    console.log("Req Headers", req.headers)
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    console.log("Token", token)

    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("Decoded Token",decodedToken)

        if (decodedToken.type !== 'access') {
            return res.status(401).json({ message: 'Not an access token' })
        }

        req.jwt_user = decodedToken

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' })
        }
        
        return res.status(400).json({ message: 'Invalid token' })
    }
}

export default verifyJWT