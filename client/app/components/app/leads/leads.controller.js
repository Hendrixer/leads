import {element} from 'angular';
import modalController from './modalController';
import modalTemplate from './modalTemplate.html';

class LeadsController {
  constructor(Leads, $mdDialog){
    this.Leads = Leads;
    this.modal = $mdDialog;
    this.leads = [];
    this.getLeads();
  }

  getLeads() {
    this.Leads.getLeads()
      .then(()=> {
        this.leads = this.Leads.getState();
      });
  }

  showUploadModal(ev) {
    this.modal.show({
      clickOutsideToClose: true,
      parent: element(document.body),
      targetEvent: ev,
      controllerAs: 'vm',
      template: modalTemplate,
      controller: modalController
    })
    .then(()=> {
      console.log('doone');
    }, ()=> {
      console.log('nooope');
    })
  }
}


export {LeadsController};
