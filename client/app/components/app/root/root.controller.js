class RootController {
  constructor(Auth){
    this.Auth = Auth;
    this.isAuth = Auth.isAuth();
  }

  signout(){
    this.Auth.signout();
  }
}

RootController.$inject = ['Auth'];
export {RootController};
