import { ObjectId } from 'mongodb';
import round from 'mongo-round'

import { SaveSurveyResultRepository }
  from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result';
import { MongoHelper } from '../helpers/mongo-helper';
import { QueryBuilder } from '@/infra/db/mongodb/helpers';
import { LoadSurveyResult } from '@/domain/usecases/load-survey-result';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResult {

  constructor() { }

  async save(data: SaveSurveyResultParams): Promise<void> {
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
    console.log('saveResultInserted', res?.value)
    console.log('data.accountId', data.accountId.toString())

    const surveyResult = await this.loadBySurveyId(data.surveyId/*, data.accountId*/)

    const obj: SurveyResultModel = {
      surveyId: surveyResult.surveyId,
      date: surveyResult.date,
      answers: surveyResult.answers,
      question: surveyResult.question
    }

    const obj2: SurveyResultModel = {
      surveyId: res?.value?.surveyId,
      date: res?.value?.date,
      answers: [{
        answer: res?.value?.answer,
        count: 0,
        percent: 0
      }],
      question: ''
    }

    //return obj2
  }

  async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: {
          $sum: 1
        },
        currentAccountAnswer: {
          $push: {
            $cond: [{ $eq: ['$data.accountId', 'accountId'] }, '$data.answer', '$invalid']
          }
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: ['$$item', {
                count: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: '$count',
                    else: 0
                  }
                },
                percent: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: {
                      $multiply: [{
                        $divide: ['$count', '$_id.total']
                      }, 100]
                    },
                    else: 0
                  }
                },
                isCurrentAccountAnswerCount: {
                  $cond: [{
                    $eq: ['$$item.answer', {
                      $arrayElemAt: ['$currentAccountAnswer', 0]
                    }]
                  }, 1, 0]
                }
              }]
            }
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({
        path: '$answers'
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        },
        isCurrentAccountAnswerCount: {
          $sum: '$answers.isCurrentAccountAnswerCount'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: round('$count'),
          percent: round('$percent'),
          isCurrentAccountAnswer: {
            $eq: ['$isCurrentAccountAnswerCount', 1]
          }
        }
      })
      .sort({
        'answer.count': -1
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answer'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()

    const surveyResult = await surveyResultCollection.aggregate(query).toArray()

    const obj: SurveyResultModel = {
      surveyId: surveyResult[0]?.surveyId,
      date: surveyResult[0]?.date,
      answers: surveyResult[0]?.answers,
      question: surveyResult[0]?.question
    }

    console.log('surveyResult', surveyResult)
    console.log('obj-load', obj)

    return obj
  }
}