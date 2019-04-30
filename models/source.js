module.exports = function(sequelize, DataTypes) {
  var Source = sequelize.define("Source", {
    // Giving the Source model a name of type STRING
    name: DataTypes.STRING
  });

  Source.associate = function(models) {
    // Associating Source with Posts
    // When an Source is deleted, also delete any associated Posts
    Source.hasMany(models.Transaction, {
      onDelete: "cascade"
    });
  };

  return Source;
};
