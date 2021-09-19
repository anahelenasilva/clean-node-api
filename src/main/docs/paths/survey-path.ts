export const surveyPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey'],
    summary: 'Get all surveys API',
    description: 'This route can only be accessed by **authenticated users**',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      204: {
        description: 'Success, but no data is shown'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  post: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Survey'],
    summary: 'Create Survey API',
    description: 'This route can only be accessed by **admins**',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Success, but no data is shown'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
