import {api} from './const';
import find from 'lodash/collection/find';
import findIndex from 'lodash/array/findIndex';

const BrokerFactory = ($http, $q) => {
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

  async function getOne(broker) {
    const firstLetter = broker.name[0].toLowerCase();
    const map = $brokers[firstLetter];
    const cachedBroker = find(map, {_id: broker._id});

    if (false) {
      return await $q.when(cachedBroker);

    } else {
      const resp = await $http({
        url: `${api}/brokers/${broker._id}`,
        method: 'GET'
      });

      const savedBroker = resp.data;
      const firstLetter = savedBroker.name[0].toLowerCase();

      $brokers[firstLetter] ?
        $brokers[firstLetter].push(savedBroker) :
        $brokers[firstLetter] = [savedBroker];

      return savedBroker;
    }
  }

  async function edit(broker) {
    const resp = await $http({
      url: `${api}/brokers/${broker._id}`,
      method: 'PUT',
      data: broker
    });

    const savedBroker = resp.data;
    const firstLetter = savedBroker.name[0].toLowerCase();
    const bucket = $brokers[firstLetter];

    const i = findIndex(bucket, {_id: broker._id});

    bucket[i] = savedBroker;
  };

  const search = (text) => {
    if (!text) {
      return $q.when(false);
    }

    return $http.get(`${api}/brokers/search?text=${text}`)
    .then(resp => resp.data);
  };

  return {
    getBrokers,
    getState,
    createBroker,
    getOne,
    edit,
    search
  };
};

BrokerFactory.$inject = ['$http', '$q'];

export {BrokerFactory};
