class AuthController {
  constructor(Auth, $state){
    this.name = 'auth';
    this.Auth = Auth;
    this.user = {};
    this.$state = $state;
  }

  signin(){
    this.Auth.signin(this.user)
      .then(()=> {
        this.$state.go('leads');
      })
      .catch(e => {

      })
  }

  signup() {
    this.Auth.signup(this.user)
      .then(()=> {
        this.$state.go('leads');
      })
      .catch(e => {

      });
  }
}

AuthController.$inject = ['Auth', '$state'];

export {AuthController};
