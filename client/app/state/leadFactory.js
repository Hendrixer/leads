import {api} from './const';

const LeadFactory = ($http) => {
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
  }

  async function updateMany(leads) {
    const resp = await $http({
      url: `${api}/leads`,
      method: 'PUT',
      data: {multiple: true, leads}
    });

    return resp.data;
  }

  return { getLeads, getState, updateMany };
};

LeadFactory.$inject = ['$http'];
export {LeadFactory};
