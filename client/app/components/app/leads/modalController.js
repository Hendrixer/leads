import isEmpty from 'lodash/lang/isEmpty';

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
  constructor($mdDialog, $scope, Leads, $http, $rootScope, Brokers, $state, $mdToast, Headers, Csv, Admins) {
    this.modal = $mdDialog;
    this.safeToUpload = false;
    this.Admins = Admins;
    this.files = [];
    this.Leads = Leads;
    this.mainFile;
    this.Csv = Csv;
    this.Headers = Headers;
    this.$state = $state;
    this.$mdToast = $mdToast;
    this.progress = 0;
    this.startingUpload = false;
    this.uploadSize = 0;
    this.$http = $http;
    this.$scope = $scope;
    this.global = $rootScope;
    this.searchText;
    this.broker;
    this.brokers = [];
    this.createBrokerObject = {name: 'create a broker', icon: 'add_circle'};
    this.Brokers = Brokers;
    this.hideBroker = true;

    if (this.file || $scope.file) {
      this.resume(this.file || $scope.file);
    }

    const remove = $scope.$watch(()=> {
      return this.files;
    },

    (fresh, old) => {
      this.readyToUpload(fresh, remove);
    });
  }

  readyToUpload(files, remove) {
    const totalSize = getFileSize(
      files.reduce((size, file) => {
        size += file.size;
        return size;
      }, 0)
    );

    if (files.length) {
      this.uploadSize = totalSize;
      this.checkFile();
      remove && remove();
    }
  }

  resume(file) {
    const theFile = file;
    this.Leads.setActiveFile();
    this.files[0] = theFile;
    this.readyToUpload(this.files);
  }

  checkFile() {
    return this.Csv.areHeadersSafe(this.files[0])
    .then(areSafe => {
      if (areSafe) {
        this.headersAreSafe = true;
        return this.files[0];
      } else {
        this.headersAreSafe = false;
        return this.setAndGoToHeadersConfig();
      }
    })
    .then(file => {
      this.mainFile = file;
      this.safeToUpload = true;
    });
  }

  setAndGoToHeadersConfig() {
    this.$mdToast.show(
      this.$mdToast.simple()
        .content(`File doesn't have correct headers`)
        .position('bottom right')
        .hideDelay(2000)
    );
    this.Leads.setActiveFile({
      file: this.files[0]
    });
    this.cancel();
    this.$state.go('headers');
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
    if (!this.mainFile) return;
    const file = this.mainFile;
    this.Csv.sign(file.name, file)
    .then(({data}) => {
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
    this.Csv.upload(file, data, this.onProgress.bind(this))
    .then(() => {
      this.hide();
      return this.Admins.getMe();
    })
    .then(user => {
      this.Leads.setActiveFile();
    });
  }

  dropping($files) {
    this.files = [$files[0]];
  }
}

ModalController.$inject = ['$mdDialog', '$scope', 'Leads', '$http', '$rootScope', 'Brokers', '$state', '$mdToast', 'Headers', 'Csv', 'Admins'];
export default ModalController;
