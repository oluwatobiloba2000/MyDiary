const jwt = require('jsonwebtoken');

const checkToken = (req, res, next)=>{
    try {
        const header = req.headers['authorization'];
        if(typeof header !== 'undefined'){
            const bearer = header.split(' ');
            const token = bearer[1] || req.token;
            const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KET);
            req.user = decodedToken;
            req.token = token;
            next();
        }else{
             // if header is undefined , return bad request
           return res.sendStatus(403).json({
                code: 403,
                message: 'Not Authorized',
            });
        }
    } catch (error) {
        next(error);
    }
}

module.exports =  checkToken;