import _ from 'lodash';
import {logger} from '../util/logger';
const methodKeys = {
  limit: true,
  sort: true,
  populate: true,
  select: true
};

export const query = (action, qs={}, criteria={}) => {
  const filters = _.chain(qs)
  .map((arg, filter) => {
    if (methodKeys[filter]) {
      return {arg, filter}
    } else {
      return false;
    }
  })
  .compact()
  .value();

  filters.forEach(({filter}) => {
    delete qs[filter];
  });

  const searchCriteria = _.reduce(qs, (_criteria, val, prop) => {
    if (/StartsWith/.test(prop)) {
      prop = prop.split('Starts')[0];
      val = new RegExp(`^${val}`, 'i');
    }
    _criteria[prop] = val;
    return _criteria;
  }, criteria);

  let search = action(searchCriteria);

  filters.forEach(({arg, filter}) => {
    search = search[filter](arg);
  });

  return search.execAsync();
};
