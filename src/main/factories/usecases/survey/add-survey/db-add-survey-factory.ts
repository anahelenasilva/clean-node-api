import { DbAddSurvey } from '../../../../../data/usecases/add-Survey/db-add-Survey'
import { AddSurvey } from '../../../../../domain/usecases/add-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/Survey/Survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
