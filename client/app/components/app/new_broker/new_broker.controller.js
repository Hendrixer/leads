class New_brokerController {
  constructor(Brokers, $mdToast, $state){
    this.broker = {
      address: {}
    };
    this.leadFilters = {
      basic: {
        creditRating: {},
        loanPurpose: {}
      }
    };

    this.Brokers = Brokers;
    this.$mdToast = $mdToast;
    this.$state = $state;
  }

  createBroker() {
    const broker = merge(this.broker, {leadFilters: this.leadFilters});

    this.Brokers.createBroker(broker)
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
