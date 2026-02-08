const { Op, fn, col, literal } = require('sequelize')
const db = require('../models/index')


const Project = db.Project
const Skill = db.Skill
const ProjectLink = db.ProjectLink
const Profile = db.Profile



exports.findProjectsBySkill = async (skill,{limit,offset})=>{
    return Project.findAndCountAll({
      limit,
      offset,
      distinct:true,
  
      attributes:['id','title','description'],
  
      include:[
        {
          model:Profile,
          as:'profile',
          attributes:['id','name','email'],
          required:true,
          include:[
            {
              model:Skill,
              as:'skills',
              attributes:[],
              where:{name:skill},
              required:true
            }
          ]
        },
        {
          model:ProjectLink,
          as:'links',
          attributes:['label','url']
        }
      ]
    })
}
  

exports.findTopSkills = async () => {
  return Skill.findAll({
    attributes: [
      'name',
      [fn('COUNT', col('name')), 'count']
    ],
    group: ['name'],
    order: [[literal('count'), 'DESC']],
    limit: 10
  })
}


exports.searchEverywhere = async (q,{limit,offset})=>{
    const like = `%${q}%`
  
    return Project.findAndCountAll({
      limit,
      offset,
      distinct:true,
  
      attributes:['id','title','description'],
  
      include:[
        { model:Profile, as:'profile', attributes:['name','email'] },
        { model:ProjectLink, as:'links', attributes:['label','url'] }
      ],
  
      where:{
        [Op.or]:[
          literal(`LOWER("Project"."title") LIKE '${like}'`),
          literal(`LOWER("Project"."description") LIKE '${like}'`)
        ]
      }
    })
}
