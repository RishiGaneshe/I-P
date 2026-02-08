const router = require('express').Router()
const controller = require('../controllers/view.controller')


router.get('/', controller.loadProfilePage)


module.exports = router
