class BrokerListController {
  constructor(brokers, Brokers, Orders) {
    this.brokers = brokers;
    this.search = '';
    this.Brokers = Brokers;
    this.Orders = Orders;
  }

  orderLeads(broker) {
    this.Orders.createOrder(order)
      .then(() => {
        console.log('done');
      })
      .catch(console.error.bind(console));
  }
}

BrokerListController.$inject = ['brokers', 'Brokers', 'Orders'];

export default BrokerListController;
