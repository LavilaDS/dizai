"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Questionnaire extends Model {
    static associate(models) {
      Questionnaire.hasMany(models.Question, {
        foreignKey: "questionnaireId",
        as: "questions",
      });
    }
  }
  Questionnaire.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O título não pode ser vazio." },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Questionnaire",
      timestamps: true,
      // tableName: 'Questionnaires' // Sequelize pluraliza por padrão
    }
  );
  return Questionnaire;
};
