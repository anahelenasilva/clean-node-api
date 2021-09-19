import { SaveSurveyResultRepository } from "@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/usecases/save-survey-result";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {

  constructor() { }

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveyResults')
    const res = await surveyCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true
    })

    const obj = {
      id: res?.value?._id,
      surveyId: res?.value?.surveyId,
      date: res?.value?.date,
      answer: res?.value?.answer,
      accountId: res?.value?.accountId
    }
    console.log('saveResultInserted', obj)

    return obj
  }
}