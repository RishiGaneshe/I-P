'use strict'


module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    'Profile',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: { len: [2,120] }
      },

      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },

      education: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      github: {
        type: DataTypes.STRING,
        allowNull: true
      },

      linkedin: {
        type: DataTypes.STRING,
        allowNull: true
      },

      portfolio: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'profiles',
      timestamps: true,
      indexes: [
        { fields: ['email'], unique: true }
      ]
    }
  )

  Profile.associate = models => {
    Profile.hasMany(models.Skill, { foreignKey: 'profileId', as: 'skills', onDelete: 'CASCADE' })
    Profile.hasMany(models.Project, { foreignKey: 'profileId', as: 'projects', onDelete: 'CASCADE' })
    Profile.hasMany(models.WorkExperience, { foreignKey: 'profileId', as: 'workExperiences', onDelete: 'CASCADE' })
  }

  return Profile
}
