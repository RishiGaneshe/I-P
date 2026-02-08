const router = require('express').Router()
const controller = require('../controllers/search.controller')


router.get('/projects', controller.getProjectsBySkill)

router.get('/skills/top', controller.getTopSkills)

router.get('/search', controller.globalSearch)



module.exports = router
