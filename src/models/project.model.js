'use strict'

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      profileId: {
        type: DataTypes.UUID,
        allowNull: false
      },

      title: {
        type: DataTypes.STRING(200),
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'projects',
      timestamps: true,
      indexes: [
        { fields: ['profileId'] },
        { fields: ['title'] }
      ]
    }
  )

  Project.associate = models => {
    Project.belongsTo(models.Profile, { foreignKey: 'profileId', as: 'profile' })
    Project.hasMany(models.ProjectLink, { foreignKey: 'projectId', as: 'links', onDelete: 'CASCADE' })
  }

  return Project
}
