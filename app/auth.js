var jwt    = require('jsonwebtoken');

///JWT based token authentication.
module.exports = function()
{
    //Do not do this in real life. Storing passwords in plain text is not a viable solution for real-world applications.
    //You'd want to use something like bcrypt to securely store these passwords in MongoDB http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt.
    function verifyUser(req, user)
    {
        return user.password != req.body.password; 
    }

    function getToken(user, secret){
        return jwt.sign(user, secret, { expiresIn : '24h' });
    }

    function verifyToken(token, secret, verifiedCallback){
        jwt.verify(token, secret, (err, decoded) => {   
            if (err) {
                verifiedCallback({ success: false, message: 'Failed to authenticate token.' });
            } 
            else {
                verifiedCallback({ success: true, decoded: decoded});
            }
        });
    }

    function getUser(req){
        return req.decoded._doc;
    }

    return {
        verifyUser: verifyUser,
        getToken: getToken,
        verifyToken : verifyToken,
        getUser : getUser
    };

}();