import pluck from 'lodash/collection/pluck';

class PreorderController {
  constructor(Orders, $state, $filter, $mdDialog, $scope) {
    this.selected = [];
    $scope.filters = {
      orderBy: 'createdAt',
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
    const cursor = {
      limit: 1000,
      skip: 1000
    };
    $scope.leads = this.leads;
    $scope.broker = this.broker;
    $scope.fetchMoreLeads = (page) => {
      if (page > $scope.filter.page && $scope.leads < this.totalLeads) {
        Orders.preorder($scope.broker._id, {
          limit: cursor.limit,
          skip: cursor.skip
        })
        .then(leads => {
          $scope.leads = $scope.leads.concat(leads);
          cursor.skip += cursor.limit;
          $scope.$apply();
        });
      }
    };

    this.$scope = $scope;
    this.Orders = Orders;
    this.totalLeads = 0;

    this.getCount();
  }

  getCount() {
    this.Orders.getCountForPreorder(this.broker._id)
    .then(count => {
      this.totalLeads = count;
      this.$scope.$apply();
    });
  }

  changePage(page, limit) {
    return this.$scope.filters.page = page;
  }

  orderLeads(leads=this.selected) {
    const csv = Papa.unparse({
      fields: [
        'createdAt',
        'firstName',
        'lastName',
        'creditRating',
        'LTV',
        'CLTV'
      ],
      data: leads
    });

    var pom = document.createElement('a');
    pom.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
    pom.setAttribute('download', 'test.csv');
    pom.click();

    // this.Orders.createOrder(
    //   leads,
    //   this.broker,
    //   {filetype: 'csv'}
    // )
    // .then(() => {
    //   this.$state.go('history', {
    //     broker: this.broker._id,
    //     name: this.broker.name
    //   });
    // });
  }

  orderNumberOfleads(ev) {
    const leads = pluck(this.$filter('orderBy')(this.leads, this.filters.orderBy)
    .slice(0, this.selectionCount));

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

PreorderController.$inject = ['Orders', '$state', '$filter', '$mdDialog', '$scope'];

export default PreorderController;
