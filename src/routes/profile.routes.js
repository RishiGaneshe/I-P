const router = require('express').Router()
const controller = require('../controllers/profile.controller')
const { authenticate }= require('../middlewares/auth.middleware')


router.get('/profile', controller.getProfile)

router.post('/profile', authenticate, controller.createProfile)

router.put('/profile', controller.updateProfile)


module.exports = router
