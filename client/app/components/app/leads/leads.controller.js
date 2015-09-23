import {element} from 'angular';
import modalController from './modalController';
import modalTemplate from './modalTemplate.html';

class LeadsController {
  constructor(Leads, $mdDialog, $mdToast, $scope) {
    this.Leads = Leads;
    this.modal = $mdDialog;
    this.leads = [];
    this.page = 1;
    this.limit = 10;
    this.orderBy = 'firstName';
    this.selected = [];
    this.$mdToast = $mdToast;
    this.$scope = $scope;
    this.$scope.search = '';
    this.showLoader = false;
    this.$promise = null;

    $scope.$watch('search', (fresh, stale) => {
      if (fresh && (fresh !== stale)) {
        this.$promise = this.searchLeads(fresh);
      }
    });

  }

  trigger() {
    console.log(arguments);
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

  getLeads(query) {
    this.Leads.getLeads(query)
      .then(()=> {
        this.makeCards(this.Leads.getState(), 'total leads', 'count');
      })
      .catch(e => {

      });
  }

  showUploadModal(ev) {
    this.modal.show({
      clickOutsideToClose: true,
      parent: element(document.body),
      targetEvent: ev,
      controllerAs: 'vm',
      template: modalTemplate,
      controller: modalController,
    })
    .then(()=> {
      this.$mdToast.show(
        this.$mdToast.simple()
          .content('You\'ll be emailed when files are done')
          .position('bottom right')
          .hideDelay(5000)
      );
    }, ()=> {
      console.log('nooope');
    });
  }
}

LeadsController.$inject = ['Leads', '$mdDialog', '$mdToast', '$scope'];
export {LeadsController};
