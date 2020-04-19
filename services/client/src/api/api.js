import data from '../data'

const urls = {
  PROJECT: 'api/projects',
  RUNPROJECT: 'api/projects/run', // use run to generate statement without persisting to DB
  INITPROJECT: 'api/projects/init',
  FETCHIS: 'api/projects/income_statement',
  IS: 'api/projects/{id}/is'
};

export default {
  getProjects() {
    return fetch(urls.PROJECT);
  },
  initProject(project) {
    return fetch(urls.INITPROJECT, {
      method: 'POST',
      body: project
    });
  },
  runProject(project) {
    return fetch(urls.RUNPROJECT, {
      method: 'POST',
      body: project
    });
  },
  makeIncomeStatement(project) {
    return fetch(urls.FETCHIS, {
      method: 'POST',
      body: project
    })
  },
  fetchIncomeStatement(id) {
    return fetch(urls.IS.replace('{id}', id));
  }
}
