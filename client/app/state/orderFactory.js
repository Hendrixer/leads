import {api} from './const';
import merge from 'lodash/object/merge';

const OrderFactory = ($http, $window) => {
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
    downloadOrder(order);
  }

  return {
    getOrders,
    getState,
    createOrder,
    downloadOrder,
    preorder,
    getCountForPreorder
  };
};

OrderFactory.$inject = ['$http', '$window'];

export {OrderFactory};
