'use strict'


module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    'Skill',
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

      name: {
        type: DataTypes.STRING(120),
        allowNull: false
      }
    },
    {
      tableName: 'skills',
      timestamps: true,
      indexes: [
        { fields: ['profileId'] },
        { fields: ['name'] }
      ]
    }
  )

  Skill.associate = models => {
    Skill.belongsTo(models.Profile, { foreignKey: 'profileId', as: 'profile' })
  }

  return Skill
}
