import pluck from 'lodash/collection/pluck';
class PreorderController {
  constructor(Orders, $state) {
    this.selected = [];
    this.filters = {
      orderBy: 'firstName',
      page: 1,
      limit: 10,
      show: false,
      search: ''
    };
    this.$state = $state;
    this.Orders = Orders;
  }

  changePage(page, limit) {
    return this.filters.page = page;
  }

  orderLeads() {
    this.Orders.createOrder(
      pluck(this.selected, '_id'),
      this.broker,
      {filetype: 'csv'}
    )
    .then(() => {
      this.$state.go('history', {
        broker: this.broker._id,
        name: this.broker.name
      });
    });
  }
}

PreorderController.$inject = ['Orders', '$state'];

export default PreorderController;
