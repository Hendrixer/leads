import {api} from './const';
import times from 'lodash/utility/times';
import flatten from 'lodash/array/flatten';
import sum from 'lodash/math/sum';

const LeadFactory = ($http, $q, $interval) => {
  let $leads = [];
  let activeFile = {};
  const getState = ()=> {
    return $leads || [];
  };

  const setActiveFile = (file={}) => {
    activeFile = file;
  };

  const getActiveFile = () => {
    return activeFile;
  };

  async function startJob(filename) {
    const resp = await $http.get(`${api}/jobs?filename=${filename}`);
    return resp.data;
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

  const checkForDupes = (numbers) => {
    return $http({
      url: `${api}/leads/supress`,
      method: 'POST',
      data: {numbers}
    })
    .then(({data}) => data.dupes);
  };

  const batchSupress = (numbers) => {

    const count = numbers.length;
    const numOfCalls = Math.ceil(count / 20000);
    const dupes = [];
    return $q.all(times(numOfCalls, i => {
      return checkForDupes(numbers.splice(0, 20000));
    }))
    .then(counts => sum(counts));
  };

  return {
    getLeads,
    getState,
    updateMany,
    search,
    getLeadsCount,
    remove,
    setActiveFile,
    getActiveFile,
    batchSupress,
    startJob
  };
};

LeadFactory.$inject = ['$http', '$q', '$interval'];
export {LeadFactory};
