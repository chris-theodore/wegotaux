const axios = require('axios');
module.exports = function(app){
    app.route('/family')
    .get(getAPI)
    .post(postAPI);
    
    app.route()
}


//post
//get



router.get("/test", async (req, res, next) => {
    console.log("'/test' call");
    try {
      const res = await axios.get("https://api.neoscan.io/api/main_net/v1/get_all_nodes");
      res.json(data);
    }
    catch (err) {
      next(err)
    }
  })