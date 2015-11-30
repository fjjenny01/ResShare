var emailExistence = require('email-existence');
emailExistence.check('jingxiagu1992@gmail.com', function(err,res){
    if (res)
        console.log('res: '+res);
});