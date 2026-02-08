const db = require('../models/index')
const Work = db.WorkExperience


exports.bulkCreate = (rows, transaction) => {
  return Work.bulkCreate(rows, { transaction })
}


exports.deleteByProfile = (profileId,transaction)=>{
  return Work.destroy({
    where:{profileId},
    transaction
  })
}