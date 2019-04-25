module.exports = function(sequelize, DataTypes) {
    var Gigs = sequelize.define("Gig", {

      category: DataTypes.STRING,
      complete: DataTypes.BOOLEAN

    });
    return Gigs;
  };