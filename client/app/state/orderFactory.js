import {api} from './const';
import merge from 'lodash/object/merge';
import times from 'lodash/utility/times';
import flatten from 'lodash/array/flatten';
import pluck from 'lodash/collection/pluck';

const OrderFactory = ($http, $window, $q, $timeout) => {
  let $orders = {};

  const getState = ()=> {
    return $orders || {};
  };

  async function getOrders(params={}) {
    const resp = await $http({
      method: 'GET',
      url: `${api}/orders/broker`,
      params
    });

    const orders = resp.data;
    $orders[params.broker] = orders;
  }

  const downloadOrder = (order) => {
    const token = window.localStorage.getItem('leads.token');
    $window.open(`${api}/orders/redownload?access_token=${token}&order=${order._id}&filetype=${order.filetype || 'csv'}`, '_blank', '');
  };

  // const createOrder = (broker)=> {
  //   const token = window.localStorage.getItem('leads.token');
  //   $window.open(`${api}/orders/create?access_token=${token}&broker=${broker._id}&filetype=${broker.downloadFileMime}`, '_blank', '');
  // };

  async function preorder(broker, {limit=1000, skip=0}) {
    const resp = await $http({
      method: 'GET',
      url: `${api}/orders/preorder`,
      params: {limit, skip, broker}
    });
    return resp.data;
  };

  async function getPreorderByChunk(broker, leadsSofar, totalLeads) {
    const cursor = {
      limit: 1000,
      skip: leadsSofar
    };
    const leadsLeft = totalLeads - leadsSofar;
    const numOfCalls = Math.ceil(leadsLeft / cursor.limit) + 1;
    let callsLeft = numOfCalls;
    const responses = await $q.all(times(numOfCalls, i => {
      const prom = preorder(broker, cursor);
      callsLeft--;
      cursor.skip += cursor.limit;
      if (callsLeft === 1) {
        cursor.limit = ((numOfCalls - 1) * 1000) - totalLeads;
      }

      return prom;
    }));

    const results = flatten(responses);
    return results;
  }

  async function getCountForPreorder(broker) {
    const resp = await $http({
      method: 'GET',
      url: `${api}/orders/preorder`,
      params: {count: true, broker}
    });

    return resp.data.count;
  };

  async function createOrder(leads, broker, opts={}) {
    const resp = await $http({
      method: 'POST',
      data: {leads, broker},
      url: `${api}/orders`
    });
    const order = merge(resp.data, opts);
    return order;
  }

  function createLargeOrder(leads, broker, opts={}) {
    const numOfCalls = Math.ceil(leads.length / 5000);
    return createOrder(pluck(leads.splice(0, 5000), '_id'), broker, opts)
    .then(order => {
      return recursiveUpdate(numOfCalls, leads, order);
    });
  };

  const recursiveUpdate = (numOfCalls, leads, order) => {
    let callsLeft = numOfCalls;
    return updateOrder(order._id,
      {leads: pluck(leads.splice(0, 5000), '_id')}
    )
    .then(order => {
      callsLeft--;
      if (callsLeft && leads.length) {
        return recursiveUpdate(callsLeft, leads, order);
      }
    });
  };

  async function updateOrder(orderId, updated) {
    const resp = await $http({
      method: 'PUT',
      url: `${api}/orders/batch/${orderId}`,
      data: updated
    });

    return resp.data;
  }

  return {
    updateOrder,
    createLargeOrder,
    getOrders,
    getState,
    createOrder,
    downloadOrder,
    preorder,
    getCountForPreorder,
    getPreorderByChunk
  };
};

OrderFactory.$inject = ['$http', '$window', '$q', '$timeout'];

export {OrderFactory};
