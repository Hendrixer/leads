import {api} from './const';

const OrderFactory = ($http) => {
  let $orders = {};

  const getState = ()=> {
    return $orders || {};
  };

  async function getOrders(params={}) {
    const resp = await $http({
      method: 'GET',
      url: `${api}/orders`,
      params
    });
  }

  async function createOrder(broker) {
    const resp = await $http({
      method: 'POST',
      url: `${api}/order`,
      data: broker
    });

    const order = resp.data;

    $orders[broker._id] ?
      $orders[broker_.id].push(order) :
      $order[broker_.id] = [order];
  }

  return { getOrders, getState, createOrder };
};

export {OrderFactory};
