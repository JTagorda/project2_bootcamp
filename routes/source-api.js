var db = require("../models");

module.exports = function(app) {
  app.get("/api/sources", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.transaction
    db.Source.findAll({
      include: [db.Transaction]
    }).then(function(dbincomeSource) {
      res.json(dbincomeSource);
    });
  });

  app.get("/api/sources/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.transaction
    db.Source.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Transaction]
    }).then(function(dbincomeSource) {
      res.json(dbincomeSource);
    });
  });

  app.post("/api/sources", function(req, res) {
    db.Source.create(req.body).then(function(dbincomeSource) {
      res.json(dbincomeSource);
    });
    console.log("test");
  });

  app.delete("/api/sources/:id", function(req, res) {
    db.Source.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbincomeSource) {
      res.json(dbincomeSource);
    });
  });

};
