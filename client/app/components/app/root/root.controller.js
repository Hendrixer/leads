class RootController {
  constructor(Auth, $rootScope) {
    this.Auth = Auth;
    this.isAuth = Auth.isAuth();
    this.global = $rootScope;
  }

  signout() {
    this.Auth.signout();
  }
}

RootController.$inject = ['Auth', '$rootScope'];
export {RootController};
