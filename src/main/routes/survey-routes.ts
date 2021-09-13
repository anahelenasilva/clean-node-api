import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-routes-adapter'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlewares-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
