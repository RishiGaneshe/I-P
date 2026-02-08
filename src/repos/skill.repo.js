const db = require('../models/index')
const Skill = db.Skill


exports.bulkCreate = (rows, transaction) => {
  return Skill.bulkCreate(rows, { transaction })
}


exports.deleteByProfile = (profileId,transaction)=>{
  return Skill.destroy({
    where:{profileId},
    transaction
  })
}
