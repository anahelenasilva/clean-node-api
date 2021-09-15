import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecases/save-survey-result';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(private readonly saveSurveyResultRepository: SaveSurveyResultRepository) { }

  save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return this.saveSurveyResultRepository.save(data);
  }
}