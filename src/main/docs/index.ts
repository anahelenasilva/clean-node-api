import paths from './paths'
import components from './components'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Voting System',
    description: 'A voting system API for developers, made with  Typescript, TDD, Clean Architecture e following SOLIDs principles and Design Patterns',
    version: '1.0.0',
    contact: {
      name: 'Ana Helena',
      email: 'anahelenarp@hotmail.com',
      url: 'https://www.linkedin.com/in/anahelenasilvasssssss'
    },
    license: {
      name: 'GPL-3.0-or-later',
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    }
  },
  servers: [{
    url: '/api',
    description: 'Main Server'
  }],
  tags: [{
    name: 'Login',
    description: 'Login releated APIs'
  }, {
    name: 'Survey',
    description: 'Survey related APIs'
  }],
  paths,
  schemas,
  components
}
