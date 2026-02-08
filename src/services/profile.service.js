const db = require('../models/index')
const { sequelize } = db


const ProfileRepo = require('../repos/profile.repo')
const SkillRepo = require('../repos/skill.repo')
const ProjectRepo = require('../repos/project.repo')
const WorkRepo = require('../repos/work.repo')


exports.createProfile = async (payload) => {
  const { name, email, education, links, skills = [], projects = [], work = [] } = payload

  if (!name || !email) throw new Error('name and email required')

  return sequelize.transaction(async (t) => {

    const existing = await ProfileRepo.findByEmail(email, t)
    if (existing) throw new Error('profile already exists with this email')

    const profile = await ProfileRepo.create({
      name,
      email,
      education,
      github: links?.github || null,
      linkedin: links?.linkedin || null,
      portfolio: links?.portfolio || null
    }, t)

    const profileId = profile.id

    if (skills.length) {
      const skillRows = skills.map(s => ({
        profileId,
        name: String(s).trim().toLowerCase()
      }))
      await SkillRepo.bulkCreate(skillRows, t)
    }

    for (const p of projects) {
      const project = await ProjectRepo.create({
        profileId,
        title: p.title,
        description: p.description
      }, t)

      if (p.links?.length) {
        const linkRows = p.links.map(l => ({
          projectId: project.id,
          label: l.label,
          url: l.url
        }))
        await ProjectRepo.bulkCreateLinks(linkRows, t)
      }
    }

    if (work.length) {
      const workRows = work.map(w => ({
        profileId,
        company: w.company,
        role: w.role,
        description: w.description
      }))
      await WorkRepo.bulkCreate(workRows, t)
    }

    return { profileId }
  })
}


exports.getProfile = async () => {
  const profile = await ProfileRepo.findFullProfile()

  if (!profile) throw new Error('profile not found')

  return profile
}


exports.updateProfile = async(payload)=>{

  return sequelize.transaction(async(t)=>{
    const profile = await ProfileRepo.findOne(t)
    if(!profile) throw new Error('profile not found')

    const profileId = profile.id

    const updateObj = {}

    if(payload.name !== undefined) updateObj.name = payload.name
    if(payload.email !== undefined) updateObj.email = payload.email
    if(payload.education !== undefined) updateObj.education = payload.education

    if(payload.links){
      if(payload.links.github !== undefined) updateObj.github = payload.links.github
      if(payload.links.linkedin !== undefined) updateObj.linkedin = payload.links.linkedin
      if(payload.links.portfolio !== undefined) updateObj.portfolio = payload.links.portfolio
    }

    if(Object.keys(updateObj).length){
      if(updateObj.email && updateObj.email !== profile.email){
        const exists = await ProfileRepo.findByEmail(updateObj.email,t)
        if(exists) throw new Error('email already in use')
      }

      await ProfileRepo.update(profileId,updateObj,t)
    }

    if(payload.skills){
      await SkillRepo.deleteByProfile(profileId,t)

      if(payload.skills.length){
        const rows = payload.skills.map(s=>({
          profileId,
          name:String(s).trim().toLowerCase()
        }))
        await SkillRepo.bulkCreate(rows,t)
      }
    }

    if(payload.projects){
      await ProjectRepo.deleteByProfile(profileId,t)

      for(const p of payload.projects){
        const project = await ProjectRepo.create({
          profileId,
          title:p.title,
          description:p.description
        },t)

        if(p.links?.length){
          const linkRows = p.links.map(l=>({
            projectId:project.id,
            label:l.label,
            url:l.url
          }))
          await ProjectRepo.bulkCreateLinks(linkRows,t)
        }
      }
    }

    if(payload.work){
      await WorkRepo.deleteByProfile(profileId,t)

      if(payload.work.length){
        const rows = payload.work.map(w=>({
          profileId,
          company:w.company,
          role:w.role,
          description:w.description
        }))
        await WorkRepo.bulkCreate(rows,t)
      }
    }

    return { profileId }
  })
}
