export default class {
  constructor($mdDialog, $scope) {
    this.modal = $mdDialog;
    this.files = [];
  }

  cancel() {
    this.modal.hide();
  }

  dropping($files) {
    this.files = this.files.concat($files);
  }
}
