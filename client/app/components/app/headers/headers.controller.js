import every from 'lodash/collection/every';
import {headers, headersMap} from './defaultHeaders';

class HeadersController {
  constructor(Leads) {
    this.name = 'headers';
    this.active = Leads.getActiveFile();
    this.parseConfig = {
      preview: 2,
      headers: true,
      complete: this.onComplete.bind(this)
    };
    this.defaultHeaders = headers;
    this.hasDefaultHeaders = false;
    this.parseFile();
  }

  parseFile() {
    console.log('parsing');
    Papa.parse(this.active.file, this.parseConfig);
  }

  onComplete(results, file) {
    this.hasDefaultHeaders = every(results.data[0], header => {
      return header in headersMap;
    });

    if (!this.hasDefaultHeaders) {
      this.brokerHeaders = results.data[0];
      this.showHeadersMap = true;
    }
  }
}

HeadersController.$inject = ['Leads'];

export default HeadersController;
