import merge from 'lodash/object/merge';

class New_brokerController {
  constructor(Brokers, $mdToast, $state){
    this.broker = {
      address: {},
      leadFilters: {
        states: {},
        basic: {
          creditRating: {},
          loanPurpose: {},
          propertyType: {}
        }
      }
    };

    this.Brokers = Brokers;
    this.$mdToast = $mdToast;
    this.$state = $state;
  }

  createBroker() {
    // const broker = merge(this.broker, {leadFilters: this.leadFilters});

    this.Brokers.createBroker(this.broker)
      .then(()=> {
        this.$mdToast.show(
          this.$mdToast.simple()
            .content(`${this.broker.name} created!`)
            .position('bottom right')
            .hideDelay(5000)
        );

        this.$state.go('brokers');
      });
  }
}


New_brokerController.$inject = ['Brokers', '$mdToast', '$state'];

export {New_brokerController};
