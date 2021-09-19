import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/save-survey-result';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(private readonly saveSurveyResultRepository: SaveSurveyResultRepository) { }

  save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return this.saveSurveyResultRepository.save(data);
  }
}