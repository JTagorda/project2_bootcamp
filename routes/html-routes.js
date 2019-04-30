// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  // transaction route loads transactions.html
  app.get("/transactions", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/transactions.html"));
  });

  // home route loads home.html
  app.get("/home", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  // source route loads author-manager.html
  app.get("/source", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/source.html"));
  });

};
