import pluck from 'lodash/collection/pluck';
import {makeDataReadyForCsv, headerKeys, startDownload} from './csv';

class PreorderController {
  constructor(Orders, $state, $filter, $mdDialog, $scope, $mdToast) {
    this.selected = [];
    $scope.filters = {
      orderBy: 'createdAt',
      page: 1,
      limit: 10,
      show: false,
      search: ''
    };
    this.$mdToast = $mdToast;
    this.$state = $state;
    this.Orders = Orders;
    this.selectionCount;
    this.$filter = $filter;
    this.modal = $mdDialog;
    this.$promise = null;
    const cursor = {
      limit: 1000,
      skip: 1000
    };
    $scope.leads = this.leads;
    $scope.broker = this.broker;
    let previousPage = 1;
    $scope.fetchMoreLeads = (page) => {
      if (page > previousPage && $scope.leads.length < $scope.totalLeads) {
        previousPage = page;
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
    this.$scope.allSelected = false;
    this.Orders = Orders;
    this.getCount();
  }

  getCount() {
    this.Orders.getCountForPreorder(this.broker._id)
    .then(count => {
      this.$scope.totalLeads = count;
      this.$scope.$apply();
    });
  }

  onDownloadClick() {
    let count = this.selected.length;
    if (this.$scope.allSelected) {
      count = this.$scope.totalLeads;
    }

    this.fetchAndDownloadCsv(count);
  }

  downloadCsv(leads) {
    const data = makeDataReadyForCsv(leads);

    const csv = Papa.unparse({
      data,
      fields: headerKeys,
    });

    const now = new Date().toLocaleDateString().replace(/\//g, '-');
    const brokerName = this.broker.name.replace(/\s/g, '');
    const filename = `${brokerName}-${now}.csv`;
    startDownload(csv, filename);
    return;
  }

  fetchAndDownloadCsv(count) {
    if (count > this.$scope.leads.length) {
      this.$mdToast.show(
        this.$mdToast.simple()
          .content('Gathering the leads to download')
          .position('bottom right')
          .hideDelay(4500)
      );
      this.$mdToast.show(
        this.$mdToast.simple()
          .content('Download will start automatically')
          .position('bottom right')
          .hideDelay(5500)
      );
      this.$promise = this.Orders.getPreorderByChunk(
        this.broker._id,
        this.$scope.leads.length,
        count
      )
      .then(leads => {
        this.$scope.leads = this.$scope.leads.concat(leads);

        this.downloadCsv(leads);
        return leads;
      })
      .then(leads => {
        this.updateOrder(leads);
      })
      .catch(e => {
        console.error(e);
      });
    } else {
      const leads = this.$scope.leads.slice(0, count);
      this.downloadCsv(leads);
      this.updateOrder(leads);
    }
  }

  updateOrder(leads) {
    this.$mdToast.show(
      this.$mdToast.simple()
        .content('Updating this brokers\' order history, wait')
        .position('bottom right')
        .hideDelay(3500)
    );
    this.$promise = this.Orders.createLargeOrder(leads, this.broker)
    .then(order => {
      this.$state.go('history', {
        broker: this.broker._id,
        name: this.broker.name
      });
    });
  }

  orderNumberOfleads(ev) {
    if (!this.selectionCount) return;
    if (this.selectionCount > this.$scope.totalLeads) {
      const alertModal = this.modal.alert()
        .title('Can\'t be done!')
        .content(
          `There are only ${this.$scope.totalLeads} available`
        )
        .ariaLabel('nope')
        .targetEvent(ev)
        .ok('ok');

      return this.modal.show(alertModal)
      .then(() => {
        this.selectionCount = null;
      }, e => {

      });
    }

    let word = this.selectionCount > 1 ? 'leads' : 'lead';

    const confirm = this.modal.confirm()
      .title(`Order ${this.selectionCount} ${word}?`)
      .content(
        `The first ${this.selectionCount} ${word} from the list below ordered by Created at are selected.`
      )
      .ariaLabel('order')
      .targetEvent(ev)
      .ok('Yes, download')
      .cancel('Nevermind');

    this.modal.show(confirm)
    .then(() => {
      this.fetchAndDownloadCsv(this.selectionCount);
    }, e => this.selectionCount = undefined);
  }
}

PreorderController.$inject = ['Orders', '$state', '$filter', '$mdDialog', '$scope', '$mdToast'];

export default PreorderController;
