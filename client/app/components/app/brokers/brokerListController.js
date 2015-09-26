class BrokerListController {
  constructor(brokers, Brokers, Orders) {
    this.brokers = brokers;
    this.search = '';
    this.Brokers = Brokers;
    this.Orders = Orders;
  }
}

BrokerListController.$inject = ['brokers', 'Brokers', 'Orders'];

export default BrokerListController;
