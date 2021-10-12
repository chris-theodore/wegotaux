const axios = require('axios');
module.exports = function(app){
    app.route('/family')
    .get(getAPI)
    .post(postAPI);
    
    app.route()
}



//API functions
function getAPI(request, response) {
    response.json(family);
}

function postAPI(request, response) {
    family[request.body.isbn] = {
        name: request.body.name,
        relationship: request.body.relationship,
        age: request.body.age
    }

    response.json({message: 'Success'});
}