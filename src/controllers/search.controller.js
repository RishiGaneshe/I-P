const searchService = require('../services/search.service')
const { getPagination }= require('../helpers/parsing.pagination')



exports.getProjectsBySkill = async (req,res,next)=>{
  try{
    const { skill } = req.query
    if(!skill) throw new Error('skill query required')

    const { limit, offset, page } = getPagination(req.query)

    const data = await searchService.getProjectsBySkill(skill,{limit,offset})

    return res.json({
      success:true,
      page,
      count:data.count,
      data:data.rows
    })
  }catch(err){next(err)}
}


exports.getTopSkills = async (req, res, next) => {
  try {
    const data = await searchService.getTopSkills()

    return res.status(200).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}


exports.globalSearch = async (req,res,next)=>{
  try{
    const { q } = req.query
    if(!q) throw new Error('search query required')

    const { limit, offset, page } = getPagination(req.query)

    const data = await searchService.globalSearch(q,{limit,offset})

    return res.json({
      success:true,
      page,
      count:data.count,
      data:data.rows
    })
  }catch(err){next(err)}
}
