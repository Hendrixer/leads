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
      return every(fileHeaders, header => {
        return headersMap[header];
      });
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

  const changeHeaders = (mainFile, headersToCheck) => {
    return getEntireFile(mainFile)
    .then(({result, file}) => {
      const headers = result.data.shift();
      const data = result.data;

      const correctHeaders = headers.map(fileHeader => {
        return headersToCheck[fileHeader];
      });

      const csv = Papa.unparse({
        data,
        fields: correctHeaders
      });

      const newFile = new Blob([csv], { type: 'text/csv' });
      const day = new Date().toLocaleDateString().replace(/\//g, '-');
      newFile.name =  mainFile.name;
      newFile.lastModifiedDate = new Date();
      return newFile;
    });
  };

  const createFileFromHeaders = (headers) => {
    const brokerHeaders = values(headers);
    const csv = Papa.unparse({
      data: [new Array(brokerHeaders.length)],
      fields: brokerHeaders
    });

    const newFile = new Blob([csv], { type: 'text/csv'});
    newFile.name = 'changeForBroker.csv';
    newFile.lastModifiedDate = new Date();
    return newFile;
  };

  return {
    getHeaders,
    getDefaultHeaders,
    areHeadersSafe,
    changeHeaders,
    createFileFromHeaders,
    getEntireFile
  };
}];

export {CsvFactory};
