import { Router } from 'express'

import * as homeController from './home.controller'

import handle from '../../middleware/asyncHandler'

const router = Router()

router.get('/', handle(homeController.renderHome))

export default router
