import pluck from 'lodash/collection/pluck';
class PreorderController {
  constructor(Orders, $state, $filter, $mdDialog) {
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
    this.selectionCount;
    this.$filter = $filter;
    this.modal = $mdDialog;
  }

  changePage(page, limit) {
    return this.filters.page = page;
  }

  orderLeads(leads=pluck(this.selected, '_id')) {
    this.Orders.createOrder(
      leads,
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

  orderNumberOfleads(ev) {
    const leads = pluck(this.$filter('orderBy')(this.leads, this.filters.orderBy)
    .slice(0, this.selectionCount), '_id');

    let word = leads.length > 1 ? 'leads' : 'lead';

    const confirm = this.modal.confirm()
      .title(`Order ${leads.length} ${word}?`)
      .content(
        `The first ${leads.length} ${word} from the list below ordered by ${this.filters.orderBy} are selected.`
      )
      .ariaLabel('order')
      .targetEvent(ev)
      .ok('Yes, order')
      .cancel('Nevermind');

    this.modal.show(confirm)
    .then(() => {
      this.orderLeads(leads);
    }, e => this.selectionCount = undefined);
  }
}

PreorderController.$inject = ['Orders', '$state', '$filter', '$mdDialog'];

export default PreorderController;
