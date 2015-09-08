class BrokerListController {
  constructor(brokers, Brokers, Orders) {
    this.brokers = brokers.map(broker => {
      broker.downloadFileMime = 'csv';
      return broker;
    });
    this.search = '';
    this.Brokers = Brokers;
    this.Orders = Orders;
  }

  orderLeads(broker) {
    this.Orders.createOrder(broker);
  }
}

BrokerListController.$inject = ['brokers', 'Brokers', 'Orders'];

export default BrokerListController;
