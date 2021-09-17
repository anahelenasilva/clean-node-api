import { InvalidParamError } from "@/presentation/errors";
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-controller-protocols";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey || !survey.id) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const { answer } = httpRequest.body;
      const answers = survey.answers.map(a => { a.answer })
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      return new Promise(resolve => resolve({} as HttpResponse));
    } catch (error) {
      return serverError(error)
    }
  }
}