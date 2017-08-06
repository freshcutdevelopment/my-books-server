var auth = require('./app/auth.js');
var config = require('./config');

module.exports = function(router){
    router.use((req, res, next) => {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) { 
            auth.verifyToken(token, config.secret, (tokenResult) => {
                if (!tokenResult.success) return res.json(tokenResult);   
                else {
                    req.decoded = tokenResult.decoded;    
                    next();
                }
            });
        } 
        else {
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    });
}