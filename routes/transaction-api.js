// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the transactions
  app.get("/api/transactions", function(req, res) {
    var query = {};
    if (req.query.incomeSource_id) {
      query.AuthorId = req.query.incomeSource_id;
    }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Source
    db.Transaction.findAll({
      where: query,
      include: [db.Source]
    }).then(function(dbTransaction) {
      res.json(dbTransaction);
    });
  });

  // Get route for retrieving a single post
  app.get("/api/transactions/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Source
    db.Transaction.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Source]
    }).then(function(dbTransaction) {
      res.json(dbTransaction);
    });
  });

  // POST route for saving a new post
  app.post("/api/transactions", function(req, res) {
    db.Transaction.create(req.body).then(function(dbTransaction) {
      res.json(dbTransaction);
    });
  });

  // DELETE route for deleting transactions
  app.delete("/api/transactions/:id", function(req, res) {
    db.Transaction.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbTransaction) {
      res.json(dbTransaction);
    });
  });

  // PUT route for updating transactions
  app.put("/api/transactions", function(req, res) {
    db.Transaction.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbTransaction) {
      res.json(dbTransaction);
    });
  });
};
