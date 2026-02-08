const db = require('../models/index')
const Profile = db.Profile
const Skill = db.Skill
const Project = db.Project
const ProjectLink = db.ProjectLink
const Work = db.WorkExperience



exports.findByEmail = (email, transaction) => {
  return Profile.findOne({
    where: { email },
    transaction
  })
}


exports.create = (data, transaction) => {
  return Profile.create(data, { transaction })
}


exports.findFullProfile = async () => {
  return Profile.findOne({
    attributes: ['id','name','email','education','github','linkedin','portfolio','createdAt'],
    
    include: [
      {
        model: Skill,
        as: 'skills',
        attributes: ['id','name']
      },
      {
        model: Project,
        as: 'projects',
        attributes: ['id','title','description'],
        include: [
          {
            model: ProjectLink,
            as: 'links',
            attributes: ['id','label','url']
          }
        ]
      },
      {
        model: Work,
        as: 'workExperiences',
        attributes: ['id','company','role','description']
      }
    ],

    order: [
      [{ model: Skill, as: 'skills' }, 'name', 'ASC'],
      [{ model: Project, as: 'projects' }, 'createdAt', 'DESC']
    ]
  })
}


exports.findOne = (transaction)=>{
  return Profile.findOne({ transaction })
}

exports.update = (id,data,transaction)=>{
  return Profile.update(data,{
    where:{id},
    transaction
  })
}