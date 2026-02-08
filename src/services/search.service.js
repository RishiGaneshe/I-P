const SearchRepo = require('../repos/search.repo')


exports.getProjectsBySkill = (skill,pagination)=>{
  const normalized = skill.trim().toLowerCase()
  return SearchRepo.findProjectsBySkill(normalized,pagination)
}


exports.getTopSkills = async () => {
  return SearchRepo.findTopSkills()
}


exports.globalSearch = (q,pagination)=>{
  return SearchRepo.searchEverywhere(q.trim().toLowerCase(),pagination)
}
