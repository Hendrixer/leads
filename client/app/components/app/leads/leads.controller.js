import {element} from 'angular';
import modalController from './modalController';
import modalTemplate from './modalTemplate.html';
import pluck from 'lodash/collection/pluck';

class LeadsController {
  constructor(Leads, $mdDialog, $mdToast, $scope, $rootScope) {
    this.Leads = Leads;
    this.modal = $mdDialog;
    this.leads = [];
    this.$rootScope = $rootScope;
    this.page = 1;
    this.limit = 10;
    this.orderBy = 'firstName';
    this.selected = [];
    this.$mdToast = $mdToast;
    this.$scope = $scope;
    this.$scope.search = '';
    this.showLoader = false;
    this.$promise = null;
    this.getLeadsCount();
    $scope.$watch('search', (fresh, stale) => {
      if (fresh && (fresh !== stale)) {
        this.$promise = this.searchLeads(fresh);
      }
    });

    let soFar = 0;

    const file = this.Leads.getActiveFile().file;
    if (file) {
      this.showUploadModal(new Event('click'), file);
    }
  }

  checkBeforeDelete(ev) {
    const {length} = this.selected;
    if (!length) {
      return;
    }

    let word = length > 1 ? 'leads' : 'lead';

    const confirm = this.modal.confirm()
      .title(`Delete ${this.selected.length} ${word}?`)
      .content(
        `Selected leads will be deleted forever.`
      )
      .ariaLabel('deleted leads')
      .targetEvent(ev)
      .ok('Yes, I\'m sure')
      .cancel('nevermind');

    this.modal.show(confirm)
    .then(this.remove.bind(this), e => {
      console.debug('nooo');
    });
  }

  remove() {
    this.$promise = this.Leads.remove(pluck(this.selected, '_id'))
    .then(() => {
      const ids = pluck(this.selected, '_id');
      this.leads = this.leads.filter(lead => {
        return ids.indexOf(lead._id) === -1;
      });
    })
    .then(this.getLeadsCount.bind(this));
  }

  searchLeads(text) {
    this.showLoader = true;
    return this.Leads.search(text)
    .then(leads => {
      this.leads = leads;
      this.$scope.search = '';
      this.showLoader = false;
      this.$scope.$apply();
      return true;
    })
    .catch(e => {
      console.error(e);
    });
  }

  getLeadsCount() {
    this.Leads.getLeadsCount()
      .then(count => {
        this.leadsCount = count;
        this.$scope.$apply();
      })
      .catch(e => {

      });
  }

  showUploadModal(ev, file) {
    const config = {
      clickOutsideToClose: true,
      parent: element(document.body),
      targetEvent: ev,
      controllerAs: 'vm',
      template: modalTemplate,
      controller: modalController
    };

    if (file) {
      const $scope = this.$rootScope.$new(true);
      $scope.file = file;
      config.scope = $scope;
    }

    this.modal.show(config)
    .then(success => {
      this.$mdToast.show(
        this.$mdToast.simple()
          .content('You\'ll be emailed when files are done')
          .position('bottom right')
          .hideDelay(5000)
      );
    }, ()=> {

    });
  }
}

LeadsController.$inject = ['Leads', '$mdDialog', '$mdToast', '$scope', '$rootScope'];
export {LeadsController};
