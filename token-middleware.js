var auth = require('./app/auth.js');
var config = require('./config');

module.exports = function(router){

    router.use((req, res, next) => {
        if(req.path == '/token'){
            next();
        } 
        else{
            let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
            
            if (token && token.indexOf(" " !== -1)) { 
                let bearerToken = token.split(" ")[1];
                auth.verifyToken(bearerToken, config.secret, (tokenResult) => {
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
        }
    });
}