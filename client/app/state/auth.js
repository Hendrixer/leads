import {api} from './const';
const tag = 'leads.token';

const Auth = ['$http', '$state', ($http, $state) => {
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

  const signout = ()=> {
    window.localStorage.removeItem(tag);
    $state.go('auth.signin');
  };


  return {signup, signin, isAuth, signout};
}];



export default Auth;
