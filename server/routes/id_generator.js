const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

module.exports = function(app){
    app.route('/create/party')
    .get(makeID);
}



function makeID(request, response) {
    let result  = '';
    //ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
    const characters = '0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < process.env.ID_LENGTH; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
   }
   response.json({code: result});
}