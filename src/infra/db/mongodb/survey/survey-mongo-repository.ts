
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { AddSurveyModel, AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-protocols'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'

import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    const surveyModelList: SurveyModel[] = []
    for (const survey of surveys) {
      surveyModelList.push({
        id: survey._id,
        question: survey.question,
        answers: survey.answers,
        date: survey.date
      })
    }

    return surveyModelList
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: id })
    return {
      id: survey?._id,
      question: survey?.question,
      answers: survey?.answers,
      date: survey?.date
    }
  }
}
