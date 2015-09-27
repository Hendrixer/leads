class SettingsController {
  constructor($rootScope, $mdToast, Admins, $scope) {
    this.themes = [
      'default',
      'sunrise',
      'tron',
      'cotton-candy',
      'plum',
      'fire',
      'forest',
      'sea-life'
    ];
    this.global = $rootScope;
    this.global.theme = this.admin.settings.theme;
    this.toast = $mdToast;
    this.Admins = Admins;
    this.$scope = $scope;
  }

  save() {
    this.Admins.update(this.admin)
    .then(admin => {
      this.global.theme = admin.settings.theme;
      this.showToast();
      this.$scope.$apply();
    });
  }

  showToast() {
    this.toast.show(
      this.toast.simple()
        .content('Settings updated')
        .position('bottom right')
        .hideDelay(3000)
    );
  }
}

SettingsController.$inject = ['$rootScope', '$mdToast', 'Admins', '$scope'];

export default SettingsController;
