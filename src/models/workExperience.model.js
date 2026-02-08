'use strict'

module.exports = (sequelize, DataTypes) => {
  const WorkExperience = sequelize.define(
    'WorkExperience',
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

      company: {
        type: DataTypes.STRING(180),
        allowNull: false
      },

      role: {
        type: DataTypes.STRING(180),
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'work_experiences',
      timestamps: true,
      indexes: [
        { fields: ['profileId'] }
      ]
    }
  )

  WorkExperience.associate = models => {
    WorkExperience.belongsTo(models.Profile, { foreignKey: 'profileId', as: 'profile' })
  }

  return WorkExperience
}
