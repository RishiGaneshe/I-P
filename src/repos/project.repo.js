const db = require('../models')
const Project = db.Project
const ProjectLink = db.ProjectLink


exports.create = (data, transaction) => {
  return Project.create(data, { transaction })
}


exports.bulkCreateLinks = (rows, transaction) => {
  return ProjectLink.bulkCreate(rows, { transaction })
}


exports.deleteByProfile = async(profileId,transaction)=>{
  const projects = await Project.findAll({
    where:{profileId},
    attributes:['id'],
    transaction
  })

  const ids = projects.map(p=>p.id)

  if(ids.length){
    await ProjectLink.destroy({
      where:{projectId:ids},
      transaction
    })
  }

  return Project.destroy({
    where:{profileId},
    transaction
  })
}
