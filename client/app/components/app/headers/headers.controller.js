import filter from 'lodash/collection/filter';
import uniq from 'lodash/array/uniq';
import values from 'lodash/object/values';
import reduce from 'lodash/collection/reduce';
import sortBy from 'lodash/collection/sortBy';
import forEach from 'lodash/collection/forEach';
import random from 'lodash/number/random';
import size from 'lodash/collection/size';

class HeadersController {
  constructor(Leads, $mdToast, $scope, Headers, Csv, $state) {
    const {headers} = Csv.getDefaultHeaders();
    this.headers = headers;
    this.$scope = $scope;
    this.active = Leads.getActiveFile();
    this.brokerHeaders = [];
    if (!this.active.file) {
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
    this.fileIsFixed = false;
    const undoRoutes = $scope.$on('$stateChangeStart', e => {
      if (!this.fileIsFixed) {
        this.Leads.setActiveFile({file: false});
      }
    });

    const undoDestroy = $scope.$on('$destroy', () => {
      undoRoutes();
      undoDestroy();
    });
  }

  randomAssign() {
    forEach(this.brokerHeaders, brokerHeader => {
      if (this.buckets[brokerHeader].length) {
        return;
      }

      const index = random(0, this.defaultHeaders.length - 1);
      const header = this.defaultHeaders.splice(index, 1)[0];
      header && this.buckets[brokerHeader].push(header);
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
    const bucketsWithMaps =  filter(this.buckets, bucket => {
      return bucket.length;
    }).length;
    return bucketsWithMaps === size(this.headers);
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
      map[fileHeader] = bucket[0];
      return map;
    }, {});

    this.Csv.changeHeaders(this.active.file, configMap)
    .then(file => {
      this.Leads.setActiveFile({file});
      this.fileIsFixed = true;
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
