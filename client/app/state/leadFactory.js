import {api} from './const';

const LeadFactory = ($http, $q) => {
  let $leads = [];

  const getState = ()=> {
    return $leads || [];
  };

  async function getLeads(params={}) {
    const resp = await $http({
      method: 'GET',
      url: `${api}/leads`,
      params
    });

    $leads = $leads.concat(resp.data);
  };
  
  async function getLeadsCount() {
    const resp = await $http({
      url: `${api}/leads`,
      method: 'GET',
      params: {count: true}
    });

    return resp.data.count;
  }

  async function updateMany(leads) {
    const resp = await $http({
      url: `${api}/leads`,
      method: 'PUT',
      data: {multiple: true, leads}
    });

    return resp.data;
  }

  async function search(text) {
    if (!text) {
      return await $q.when(false);
    }

    const resp = await $http.get(`${api}/leads/search?text=${text}`);
    return resp.data;
  }

  return {
    getLeads,
    getState,
    updateMany,
    search,
    getLeadsCount
  };
};

LeadFactory.$inject = ['$http', '$q'];
export {LeadFactory};
