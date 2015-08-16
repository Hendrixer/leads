import {api} from './const';

const BrokerFactory = ($http) => {
  let brokers = [];

  const getState = ()=> {
    return brokers || [];
  };

  async function getBrokers(query={}, params={}) {
    const resp = await $http({
      method: 'GET',
      url: `${api}/brokers`,
      params
    });
    brokers = brokers.concat(resp.data);
    console.log(brokers);
  }

  return { getBrokers, getState };
};

export {BrokerFactory};
