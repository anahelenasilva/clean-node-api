import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result';
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/save-survey-result';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository) { }

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);
    return await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId, data.accountId)
  }
}