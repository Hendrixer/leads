class HistoryController {
  constructor(Orders) {
    this.name = 'history';
    this.Orders = Orders;
    this.orderList = this.orders.map(order => {
      order.filetype = 'csv';
      return order;
    });
  }

  redownload(order) {
    this.Orders.downloadOrder(order);
  }
}

HistoryController.$inject = ['Orders'];

export default HistoryController;
