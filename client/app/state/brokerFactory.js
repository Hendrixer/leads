import {api} from './const';

const BrokerFactory = ($http) => {
  let brokers = {};

  const getState = ()=> {
    return brokers || {};
  };

  async function getBrokers(params={}) {
    const resp = await $http({
      method: 'GET',
      url: `${api}/brokers`,
      params
    });

    brokers[params.nameStartsWith] = resp.data;
  }

  return { getBrokers, getState };
};

export {BrokerFactory};
