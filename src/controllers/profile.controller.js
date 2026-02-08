const ProfileService = require('../services/profile.service')
const { getPagination }= require('../helpers/parsing.pagination')


exports.createProfile = async (req, res, next) => {
  try {
    const result = await ProfileService.createProfile(req.body)

    return res.status(201).json({
      success: true,
      message: 'profile created',
      data: result
    })
  } catch (err) {
    next(err)
  }
}


exports.getProfile = async (req, res, next) => {
  try {
    const result = await ProfileService.getProfile()

    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}


exports.updateProfile = async (req,res,next)=>{
  try{
    const result = await ProfileService.updateProfile(req.body)

    return res.status(200).json({
      success:true,
      message:'profile updated',
      data:result
    })
  }catch(err){next(err)}
}

