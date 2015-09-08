import {api} from './const';
const tag = 'leads.token';

const Auth = ['$http', $http => {
  async function signin(credits) {
    const resp = await $http({
      url: `${api}/admins/signin`,
      method: 'POST',
      data: credits
    });

    window.localStorage.setItem(tag, resp.data.token);
  }

  async function signup(credits) {
    const resp = await $http({
      url: `${api}/admins`,
      method: 'POST',
      data: credits
    });

    window.localStorage.setItem(tag, resp.data.token);
  }

  const isAuth = ()=> {
    return !!window.localStorage.getItem(tag);
  };

  return {signup, signin, isAuth};
}];

export default Auth;
