var User = require('./app/models/user');
var auth = require('./app/auth.js');
var config = require('./config');

module.exports = function(router){

    router.get('/', (req, res) =>{ 
        res.json({ message: 'Welcome to the my-books API.' });   
    });

    router.route('/token').post((req, res) =>{
            User.findOne({
                name: req.body.name
            }, 
            (err, user) => {
                if(err) res.send(err);

                const authFailedMessage = 'Authentication failed. Invalid user name or password.';

                if (!user) {
                    res.json({ success: false, message: authFailedMessage });
                } 
                else if (user) {

                    if (auth.verifyUser(req, user)) {
                        res.json({ success: false, message: authFailedMessage});
                    } else {
                        
                        let token = auth.getToken(user, config.secret);

                        // return the information including token as JSON
                        res.json({
                            success: true,
                            message: 'Successfully issued token',
                            token: token
                        });
                    }
                }
        });
    });
}