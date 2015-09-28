import {api} from './const';

const AdminFactory = ($http) => {
  async function update(updates) {

    const resp = await $http.put(`${api}/admins/me`, updates);
    return resp.data;
  }

  async function getMe() {
    const resp = await $http.get(`${api}/admins/me`);
    return resp.data;
  }

  return {update, getMe};
};

export {AdminFactory};
