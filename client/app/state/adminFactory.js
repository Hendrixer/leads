import {api} from './const';

const AdminFactory = ($http, $q) => {
  let user;

  async function update(updates) {

    const resp = await $http.put(`${api}/admins/me`, updates);
    return resp.data;
  }

  async function getMe() {
    if (user) {
      return await $q.when(user);
    } else {
      const resp = await $http.get(`${api}/admins/me`);
      user = resp.data;
      return user;
    }
  }

  return {update, getMe};
};

AdminFactory.$inject = ['$http', '$q'];
export {AdminFactory};
