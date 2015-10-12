import {api} from './const';
import isEmpty from 'lodash/lang/isEmpty';

const HeaderFactory = ['$http', $http => {
  const createHeader = (headers, broker, hasDefaultHeaders=false) => {
    return $http({
      url: `${api}/headers`,
      method: 'PUT',
      data: {
        hasDefaultHeaders,
        fileHeaders: headers,
        broker: broker._id
      },
      params: {broker: broker._id}
    })
    .then(resp => resp.data);
  };

  const getHeaderForBroker = (brokerId) => {
    return $http.get(`${api}/headers?broker=${brokerId}`)
    .then(resp => {
      if (!resp.data || isEmpty(resp.data)) {
        return false;
      } else {
        return resp.data;
      }
    });
  };

  return {
    getHeaderForBroker,
    createHeader
  };
}];

export {HeaderFactory};
