import {api} from './const';
import merge from 'lodash/object/merge';
import times from 'lodash/utility/times';
import flatten from 'lodash/array/flatten';
import pluck from 'lodash/collection/pluck';
import {formatAndDownloadCsv} from '../components/app/preorder/csv';

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
    getOrderPairsByChunk(order._id, order.leadsOrdered)
    .then(leads => {
      const now = new Date().toLocaleDateString().replace(/\//g, '-');
      const name = `${leads.length}-${now}`;
      formatAndDownloadCsv(leads, name);
    });
  };

  async function getOrderPairsByChunk(orderId, leadsOrdered) {
    const cursor = {
      limit: 2000,
      skip: 0
    };

    const numOfCalls = Math.ceil(leadsOrdered / cursor.limit) + 1;
    let callsLeft = numOfCalls;

    const responses = await $q.all(times(numOfCalls, i => {
      const promise = $http({
        method: 'GET',
        url: `${api}/orders/pair/${orderId}`,
        params: {
          limit: cursor.limit,
          skip: cursor.skip
        }
      });

      callsLeft--;
      cursor.skip += cursor.limit;
      if (callsLeft === 1) {
        cursor.limit = ((numOfCalls - 1) * cursor.limit) - leadsOrdered;
      }

      return promise.then(({data}) => data);
    }));

    return flatten(responses);
  };

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

  async function createOrder(leadsOrdered, broker, opts={}) {
    const resp = await $http({
      method: 'POST',
      data: {broker, leadsOrdered},
      url: `${api}/orders`
    });
    const order = merge(resp.data, opts);
    return order;
  }

  const createLargeOrder = (leads, broker, opts={}) => {
    const numOfCalls = Math.ceil(leads.length / 5000);
    return createOrder(leads.length, broker, opts)
    .then(order => {
      return recursiveUpdate(numOfCalls, leads, order);
    });
  };

  const recursiveUpdate = (numOfCalls, leads, order) => {
    let callsLeft = numOfCalls;
    return createOrderPairs(order, pluck(leads.splice(0, 5000), '_id'))
    .then(pair => {
      callsLeft--;
      if (callsLeft && leads.length) {
        return recursiveUpdate(callsLeft, leads, order);
      }
    });
  };

  async function createOrderPairs(order, leads) {
    const resp = await $http({
      method: 'POST',
      url: `${api}/orders/batch/${order.broker}`,
      data: {
        leads,
        orderId: order._id
      }
    });
    return resp.data;
  }

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
