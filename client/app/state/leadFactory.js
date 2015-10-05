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
  };

  async function updateMany(leads) {
    const resp = await $http({
      url: `${api}/leads`,
      method: 'PUT',
      data: {multiple: true, leads}
    });

    return resp.data;
  };

  async function search(text) {
    if (!text) {
      return await $q.when(false);
    }

    const resp = await $http.get(`${api}/leads/search?text=${text}`);
    return resp.data;
  };

  async function remove(leads) {
    if (!Array.isArray(leads)) {
      leads = [leads];
    }

    const resp = await $http.delete(`${api}/leads?leads=${leads}`);
    return resp.data;
  };

  const upload = (file, data) => {
    console.log(data, file);
    return $q((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', data.signed_request);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve({status: xhr.status});
        } else {
          reject(new Error(xhr.status));
        }
      };

      xhr.onerror = (e) => {
        reject(new Error('Could not upload file', e));
      };

      xhr.send(file);
    });
  };

  return {
    upload,
    getLeads,
    getState,
    updateMany,
    search,
    getLeadsCount,
    remove
  };
};

LeadFactory.$inject = ['$http', '$q'];
export {LeadFactory};
