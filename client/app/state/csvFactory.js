import {headers, headersMap} from './defaultHeaders';
import every from 'lodash/collection/every';
import values from 'lodash/object/values';
import reduce from 'lodash/collection/reduce';
import compact from 'lodash/array/compact';

const CsvFactory = ['$q', '$http', ($q, $http) => {
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
      return every(compact(fileHeaders), header => {
        return headersMap[header];
      });
    });
  };

  const getEntireFile = (file) => {
    return $q((resolve, reject) => {
      const parseConfig = config.whole;
      parseConfig.complete = (result) => {
        resolve({result, file});
      };

      console.log('before parse ', file);
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

  const getFileName = () => {
    return new Date().toLocaleDateString().replace(/\//g, '-') + '.csv';
  };

  const sign = (name=getFileName(), file) => {
    return $http.get(`/api/leads/upload?filename=${name}&filetype=${file.type}`);
  };

  function noop() {}

  const upload = (file, data, onProgress=noop) => {
    return $q((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve({status: xhr.status});
        } else {
          reject(new Error(xhr.status));
        }
      };

      xhr.onerror = (e) => {
        reject(new Error('Could not upload file', e));
      };

      xhr.upload.onprogress = (e) => {
        onProgress(e);
      };

      xhr.open('PUT', data.signed_request, true);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.send(file);
    });
  };

  return {
    upload,
    sign,
    getHeaders,
    getDefaultHeaders,
    areHeadersSafe,
    changeHeaders,
    createFileFromHeaders,
    getEntireFile
  };
}];

export {CsvFactory};
