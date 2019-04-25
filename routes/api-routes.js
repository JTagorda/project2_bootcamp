var db = require("../models");

module.exports = function(app) {
  app.get("/api/gigs", function(req, res) {

    // db.Gigs.findAll({}).then(function(data) {

    // res.json(data);
    // })
    
    res.send("worked");
  });
}
