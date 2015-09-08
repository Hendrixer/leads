import {api} from './const';

const LeadFactory = ($http) => {
  let leads = [];

  const getState = ()=> {
    return leads || [];
  };

  async function getLeads(params={}) {
    const resp = await $http({
      method: 'GET',
      url: `${api}/leads`,
      params
    });
    leads = leads.concat(resp.data);
  }

  return { getLeads, getState };
};


export {LeadFactory};
