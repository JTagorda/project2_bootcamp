var db = require("../models");

module.exports = function(app) {
  app.get("/api/incomeSources", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.transaction
    db.incomeSource.findAll({
      include: [db.transaction]
    }).then(function(dbincomeSource) {
      res.json(dbincomeSource);
    });
  });

  app.get("/api/incomeSources/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.transaction
    db.incomeSource.findOne({
      where: {
        id: req.params.id
      },
      include: [db.transaction]
    }).then(function(dbincomeSource) {
      res.json(dbincomeSource);
    });
  });

  app.post("/api/incomeSources", function(req, res) {
    db.incomeSource.create(req.body).then(function(dbincomeSource) {
      res.json(dbincomeSource);
    });
  });

  app.delete("/api/incomeSources/:id", function(req, res) {
    db.incomeSource.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbincomeSource) {
      res.json(dbincomeSource);
    });
  });

};
