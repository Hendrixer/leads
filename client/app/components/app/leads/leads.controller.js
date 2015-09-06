import {element} from 'angular';
import modalController from './modalController';
import modalTemplate from './modalTemplate.html';

class LeadsController {
  constructor(Leads, $mdDialog, $scope, $mdToast) {
    this.Leads = Leads;
    this.modal = $mdDialog;
    this.leads = [];
    this.$mdToast = $mdToast;
    this.$scope = $scope;
    this.getLeads({count: true});
    this.cards = [];
  }

  makeCards(data=[], title, type) {
    data = data.map(_data => {
      _data.title = title;
      return {type, data: _data};
    });

    this.cards = this.cards.concat(data);
    this.$scope.$apply();
  }

  getLeads(query) {
    this.Leads.getLeads(query)
      .then(()=> {
        this.makeCards(this.Leads.getState(), 'total leads', 'count');
      });
  }

  getBrokers(query) {
    this.Brokers.getBrokers(query)
      .then(()=> {
        // this.makeCards(this.Brokers.)
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
          .content('You\'ll be notified when files are done')
          .position('bottom right')
          .hideDelay(5000)
      );
    }, ()=> {
      console.log('nooope');
    });
  }
}

LeadsController.$inject = ['Leads', '$mdDialog', '$scope', '$mdToast'];
export {LeadsController};
