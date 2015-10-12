import {headers, headersMap} from './defaultHeaders';
import every from 'lodash/collection/every';
import values from 'lodash/object/values';
import reduce from 'lodash/collection/reduce';

const CsvFactory = ['$q', $q => {
  const config = {
    headers: {
      preview: 2,
      headers: true
    },
    whole: {
      headers: true
    }
  };

  const getDefaultHeaders = () => {
    return {headers, headersMap};
  };

  const getHeaders = (file) => {
    return $q((resolve, reject) => {
      const headerConfig = config.headers;

      headerConfig.complete = (results, file) => {
        resolve({results, file});
      };

      Papa.parse(file, headerConfig);
    });
  };

  const areHeadersSafe = (file, brokerHeaders) => {
    return getHeaders(file)
    .then(({results, file}) => {
      const fileHeaders = results.data[0];
      const setHeaders = values(brokerHeaders.fileHeaders);
      const hasDefault = every(fileHeaders, header => {
        return headersMap[header];
      });

      if (hasDefault) {
        return {hasDefault, areSafe: true};
      } else {
        const areSafe = every(fileHeaders, header => {
          return setHeaders.indexOf(header) !== -1;
        });

        return {areSafe, hasDefault};
      }
    });
  };

  const getEntireFile = (file) => {
    return $q((resolve, reject) => {
      const parseConfig = config.whole;
      parseConfig.complete = (result, file) => {
        resolve({result, file});
      };

      Papa.parse(file, parseConfig);
    });
  };

  const changeHeaders = (file, brokerHeaders) => {
    return getEntireFile(file)
    .then(({result, file}) => {
      const headers = result.data.shift();
      const data = result.data;
      const headersToCheck = reduce(brokerHeaders.fileHeaders, (map, val, key) => {
        map[val] = key;
        return map;
      }, {});

      const correctHeaders = headers.map(fileHeader => {
        return headersToCheck[fileHeader];
      });

      const csv = Papa.unparse({
        data,
        fields: correctHeaders
      });

      const newFile = new Blob([csv], { type: 'text/csv' });
      newFile.name = new Date().toLocaleDateString().replace(/\//g, '-') + '.csv';
      newFile.lastModifiedDate = new Date();
      return newFile;
    });
  };

  return {
    getHeaders,
    getDefaultHeaders,
    areHeadersSafe,
    changeHeaders
  };
}];

export {CsvFactory};
