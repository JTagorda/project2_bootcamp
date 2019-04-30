module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define("Transaction", {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
      },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  Transaction.associate = function(models) {
    // We're saying that a Transaction should belong to an Source
    // A Transaction can't be created without an Source due to the foreign key constraint
    Transaction.belongsTo(models.Source, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Transaction;
};
