import { SurveyModel } from "../../presentation/controllers/survey/load-surveys/load-surveys-controller-protocols";

export interface LoadSurveys {
  load: () => Promise<SurveyModel[]>
}
