import merge from 'lodash/object/merge';

class EditBrokerController {
  constructor(Brokers, $mdToast, $state) {
    this.Brokers = Brokers;
    this.$mdToast = $mdToast;
    this.$state = $state;

    if (this.broker.website && !/^http/.test(this.broker.website)) {
      this.broker.website = `http://${this.broker.website}`;
    }
  }

  saveBroker() {
    this.Brokers.edit(this.broker)
      .then(()=> {
        this.$mdToast.show(
          this.$mdToast.simple()
            .content(`${this.broker.name} updated!`)
            .position('bottom right')
            .hideDelay(5000)
        );
      });
  }
}

EditBrokerController.$inject = ['Brokers', '$mdToast', '$state'];

export default EditBrokerController;
