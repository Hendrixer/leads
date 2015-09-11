import {api} from './const';

const ResolveFactory = ($http) => {
  let $resolves = {}

  const getState = ()=> {
    return $resolves || {};
  };

  async function getOne(id) {
    const resp = await $http({
      url: `${api}/resolves/${id}`,
      method: 'GET'
    });

    const resolve = resp.data;

    $resolves[resolve._id] = resolve;
  };

  async function remove(resolve) {
    const resp = await $http({
      url: `${api}/resolves/${resolve._id}`,
      method: 'DELETE'
    });

    return resp.data;
  };

  return { getState, getOne, remove };
};

ResolveFactory.$inject = ['$http'];
export {ResolveFactory};
