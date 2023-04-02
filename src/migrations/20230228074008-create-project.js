'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      team_name: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      person: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      recruit_deadline: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      project_start: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      project_end: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      tech_stack: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      recommend_level: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }
};