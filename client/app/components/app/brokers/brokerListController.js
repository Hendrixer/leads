class BrokerListController {
  constructor(brokers, Brokers, Orders) {
    this.brokers = brokers;
    this.search = '';
    this.Brokers = Brokers;
    this.Orders = Orders;
  }

  // deleteBroker(broker) {
  //   this.Brokers.remove(broker)
  //
  // }
}

BrokerListController.$inject = ['brokers', 'Brokers', 'Orders'];

export default BrokerListController;
