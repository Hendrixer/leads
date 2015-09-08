import {api} from './const';

const BrokerFactory = ($http) => {
  let $brokers = {};

  const getState = ()=> {
    return $brokers || {};
  };

  async function getBrokers(params={}) {
    const resp = await $http({
      method: 'GET',
      url: `${api}/brokers`,
      params
    });

    $brokers[params.nameStartsWith] = resp.data;
  }

  async function createBroker(broker) {
    const resp = await $http({
      method: 'POST',
      url: `${api}/brokers`,
      data: broker
    });

    const savedBroker = resp.data;
    const firstLetter = savedBroker.name[0].toLowerCase();

    $brokers[firstLetter] ?
      $brokers[firstLetter].push(savedBroker) :
      $brokers[firstLetter] = [savedBroker];
  }

  return { getBrokers, getState, createBroker };
};

BrokerFactory.$inject = ['$http'];

export {BrokerFactory};
