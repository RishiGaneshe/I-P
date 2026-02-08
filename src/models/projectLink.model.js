'use strict'

module.exports = (sequelize, DataTypes) => {
  const ProjectLink = sequelize.define(
    'ProjectLink',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      projectId: {
        type: DataTypes.UUID,
        allowNull: false
      },

      label: {
        type: DataTypes.STRING(120),
        allowNull: false
      },

      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isUrl: true }
      }
    },
    {
      tableName: 'project_links',
      timestamps: true,
      indexes: [
        { fields: ['projectId'] }
      ]
    }
  )

  ProjectLink.associate = models => {
    ProjectLink.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' })
  }

  return ProjectLink
}
