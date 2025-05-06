"use strict";
const { Model } = require("sequelize");

const QUESTION_TYPES = ["multiple-choice", "text", "rating-1-5", "yes-no"];

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Questionnaire, {
        foreignKey: "questionnaireId",
        as: "questionnaire",
        onDelete: "CASCADE",
      });
    }
  }
  Question.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O texto da pergunta não pode ser vazio." },
        },
      },
      type: {
        type: DataTypes.ENUM(QUESTION_TYPES),
        allowNull: false,
        validate: {
          isIn: {
            args: [QUESTION_TYPES],
            msg: "Tipo de pergunta inválido.",
          },
        },
      },
      options: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      questionnaireId: {
        // Chave Estrangeira
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Questionnaires",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Question",
      timestamps: true,
      // tableName: 'Questions'
    }
  );
  return Question;
};
