import {element} from 'angular';
class ResolveController {
  constructor(Leads, Resolves, $state, $mdToast, $mdDialog) {
    this.Leads = Leads;
    this.Resolves = Resolves;
    this.$state = $state;
    this.modal = $mdDialog;
    this.$mdToast = $mdToast;
    this.selected = [];
    this.limit = 10;
    this.page = 1;
  }

  showConfirmation(ev) {
    const confirm = this.modal.confirm()
      .title('Are you finished here?')
      .content(
        `Selected leads will be overwritten by their respective duplicates.\n
        Leads not selected will be uneffected and the dupes will not be saved.`
      )
      .ariaLabel('Finished')
      .targetEvent(ev)
      .ok('Yes, I\'m done')
      .cancel('Not done yet');

    this.modal.show(confirm)
    .then(this.resolveDupes.bind(this), e => {
      console.debug('nooo');
    });
  }

  resolveDupes() {
    if (!this.selected.length) {
      this.cleanUp();
    }

    this.Leads.updateMany(this.selected.map(pair => pair.dupe))
    .then(this.cleanUp.bind(this))
    .catch(e => {
      console.error(e);
    });
  }

  cleanUp() {
    this.removeResolve()
    .then(this.allDone.bind(this));
  }

  allDone() {
    this.$mdToast.show(
      this.$mdToast.simple()
        .content(`Resolution complete`)
        .position('bottom right')
        .hideDelay(3000)
    );

    this.$state.go('leads');
  }

  removeResolve() {
    return this.Resolves.remove(this.resolution);
  }
}

ResolveController.$inject = ['Leads', 'Resolves', '$state', '$mdToast', '$mdDialog'];

export default ResolveController;
