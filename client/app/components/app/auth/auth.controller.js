class AuthController {
  constructor(Auth, $state, $mdToast) {
    this.name = 'auth';
    this.Auth = Auth;
    this.user = {};
    this.$state = $state;
    this.$mdToast = $mdToast;
  }

  signin() {
    this.Auth.signin(this.user)
      .then(()=> {
        this.$state.go('leads');
      })
      .catch(e => {
        this.user = {};
        this.$mdToast.show(
          this.$mdToast.simple()
          .content('Incorrect email and or password')
          .position('bottom right')
          .hideDelay(5000)
        );
      });
  }

  signup() {
    this.Auth.signup(this.user)
      .then(()=> {
        this.$state.go('leads');
      })
      .catch(e => {
        this.user = {};
        this.$mdToast.show(
          this.$mdToast.simple()
          .content('Email taken or Secret is wrong')
          .position('bottom right')
          .hideDelay(5000)
        );
      });
  }
}

AuthController.$inject = ['Auth', '$state', '$mdToast'];

export {AuthController};
