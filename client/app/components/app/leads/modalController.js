const getFileSize = (bytes, decimals) => {
  if (bytes === 0) {
    return '0 Byte';
  }

  const k = 1000;
  const dm = decimals + 1 || 3;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
};

class ModalController {
  constructor($mdDialog, $scope, Leads, $http, PubNub, $rootScope, Brokers, $state, $mdToast) {
    this.modal = $mdDialog;
    this.files = [];
    this.Leads = Leads;
    this.$state = $state;
    this.$mdToast = $mdToast;
    this.progress = 0;
    this.startingUpload = false;
    this.uploadSize = 0;
    this.$http = $http;
    this.$scope = $scope;
    this.PubNub = PubNub;
    this.global = $rootScope;
    this.searchText;
    this.broker;
    this.brokers = [];
    this.createBrokerObject = {name: 'create a broker', icon: 'add_circle'};
    this.Brokers = Brokers;
    this.hideBroker = true;
    $scope.$watch(()=> {
      return this.files;
    },

    (fresh, old) => {
      const totalSize = getFileSize(
        fresh.reduce((size, file) => {
          size += file.size;
          return size;
        }, 0)
      );

      this.uploadSize = totalSize;
    });
  }

  selected(broker) {
    if (broker === this.createBrokerObject) {
      this.cancel();
      this.$state.go('new-broker');
    }

    if (!broker.headersSet) {
      this.$mdToast.show(
        this.$mdToast.simple()
          .content(`${broker.name} doesn't have headers set`)
          .position('bottom right')
          .hideDelay(5000)
      );
      this.Leads.setActiveFile({
        file: this.files[0],
        broker
      });
      this.cancel();
      this.$state.go('headers', {broker: broker._id});
    }
  }

  queryBrokers(text) {
    if (!text) {
      return [this.createBrokerObject];
    }

    const reg = new RegExp(`^${text}`, 'i');
    const results = this.brokers.filter(broker => {
      return reg.test(broker.name);
    });

    if (results.length) {
      return [this.createBrokerObject, ...results];
    }

    return this.Brokers.search(text)
    .then(brokers => {
      this.brokers = [...this.brokers, ...brokers];
      return [this.createBrokerObject, ...brokers];
    });
  }

  hide() {
    this.startingUpload = false;
    this.modal.hide();
  }

  cancel() {
    this.startingUpload = false;
    this.modal.cancel();
  }

  sign() {
    const file = this.files[0];
    this.$http.get(`/api/leads/upload?filename=${file.name}&filetype=${file.type}`)
    .then(({data}) => {
      // console.log(data);
      this.upload(file, data);
    });
  }

  onProgress(e) {
    this.$scope.$apply(()=> {
      this.progress = Math.ceil((e.loaded / e.total) * 100);
    });
  }

  selectBroker() {
    this.hideBroker = false;
  }

  upload(file, data) {
    this.startingUpload = true;
    this.progressType = 'determinate';
    this.Leads.upload(file, data, this.onProgress.bind(this))
    .then(() => {
      this.hide();
      this.PubNub.sendTo(`${$pubnubPrefix}demjobs`, {
        name: 'csv',
        url: data.url,
        filename: data.filename
      });
    });
  }

  dropping($files) {
    this.files = this.files.concat($files);
  }
}

ModalController.$inject = ['$mdDialog', '$scope', 'Leads', '$http', 'PubNub', '$rootScope', 'Brokers', '$state', '$mdToast'];
export default ModalController;
