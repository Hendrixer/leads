class RootController {
  constructor(Auth, $rootScope) {
    this.Auth = Auth;
    this.isAuth = Auth.isAuth();
    this.global = $rootScope;
    this.global.theme = 'tron';
  }

  signout() {
    this.Auth.signout();
  }
}

RootController.$inject = ['Auth', '$rootScope'];
export {RootController};
