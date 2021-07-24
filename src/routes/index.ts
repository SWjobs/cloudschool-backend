import { Router } from 'express'
import auth from './auth'
import classrooms from './classrooms'

const router = Router({ mergeParams: true })
router.use('/auth', auth)
router.use('/classrooms', classrooms)

export default router