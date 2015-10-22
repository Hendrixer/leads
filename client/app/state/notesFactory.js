import {api} from './const';

const NotesFactory = ['$http', ($http)=> {
  const getForBroker = (id) => {
    return  $http({
      url: `${api}/notes`,
      method: 'GET',
      params: {
        broker: id
      }
    })
    .then(resp => resp.data);
  };
  
  const create = (note) => {
    return $http({
      url: `${api}/notes`,
      method: 'POST',
      data: note
    })
    .then(resp => resp.data);
  };
  
  return {
    create,
    getForBroker
  };
}];

export {NotesFactory};
