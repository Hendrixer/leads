import every from 'lodash/collection/every';
import uniq from 'lodash/array/uniq';
import values from 'lodash/object/values';
import reduce from 'lodash/collection/reduce';
import sortBy from 'lodash/collection/sortBy';
import forEach from 'lodash/collection/forEach';
import random from 'lodash/number/random';

class HeadersController {
  constructor(Leads, $mdToast, $scope, Headers, Csv, $state) {
    const {headers, headersMap} = Csv.getDefaultHeaders();
    this.headers = headers;
    this.headersMap = headersMap;
    this.$scope = $scope;
    this.active = Leads.getActiveFile();
    this.brokerHeaders = [];
    if (!this.active.file && active.broker) {
      return $state.go('leads');
    }

    this.$state = $state;
    this.parseConfig = {
      preview: 2,
      headers: true,
      complete: this.onComplete.bind(this)
    };
    this.defaultHeaders = angular.copy(headers.sort());
    this.selectedHeaders = {};
    this.$mdToast = $mdToast;
    this.hasDupes = false;
    this.activeHeader;
    this.Headers = Headers;
    this.Csv = Csv;
    if (process.env.NODE_ENV === 'development') {
      this.showDevtools = true;
    }

    this.Leads = Leads;
    this.parseFile();
  }

  randomAssign() {
    forEach(this.brokerHeaders, brokerHeader => {
      if (this.buckets[brokerHeader].length) {
        return;
      }

      const index = random(0, this.defaultHeaders.length - 1);
      const header = this.defaultHeaders.splice(index, 1)[0];
      this.buckets[brokerHeader].push(header);
    });
  }

  onDrop(index, item, list, limit) {
    if (list.indexOf(item) !== -1) {
      return false;
    }

    if (limit && list.length === limit) {
      return false;
    }

    return item;
  }

  areAllBucketsFilled() {
    return every(this.buckets, bucket => {
      return bucket.length;
    });

  }

  save() {
    if (!this.areAllBucketsFilled()) {
      return this.$mdToast.show(
        this.$mdToast.simple()
          .content(`All file headers must be mapped`)
          .position('bottom right')
          .hideDelay(3000)
      );
    }

    const configMap = reduce(this.buckets, (map, bucket, fileHeader) => {
      map[bucket[0]] = fileHeader;
      return map;
    }, {});

    this.Headers.createHeader(configMap, this.active.broker)
    .then(headerConfig => {
      this.Leads.setActiveFile();
      this.$state.go('leads');
    });

  }

  parseFile() {
    this.Csv.getHeaders(this.active.file)
    .then(({results, file}) => {
      this.onComplete(results, file);
    });
  }

  onComplete(results, file) {
    console.log(results);
    this.brokerHeaders = results.data[0].sort();
    this.showHeadersMap = true;
    this.buckets = reduce(this.brokerHeaders, (map, header) => {
      map[header] = [];
      return map;
    }, {});
    this.presetBuckets();
  }

  presetBuckets() {
    this.brokerHeaders.forEach(brokerHeader => {
      const index = this.defaultHeaders.indexOf(brokerHeader);
      if (index !== -1) {
        const header = this.defaultHeaders.splice(index, 1);
        this.buckets[brokerHeader].push(header[0]);
      }
    });
  }
}

HeadersController.$inject = ['Leads', '$mdToast', '$scope', 'Headers', 'Csv', '$state'];

export default HeadersController;
