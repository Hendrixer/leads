import mongoose from 'mongoose';
import Future from 'bluebird';
import _ from 'lodash';
import {Leads} from '../../api/leads/leads.model';
import {Brokers} from '../../api/brokers/brokers.model';
import {Orders} from '../../api/orders/orders.model';
import {Resolves} from '../../api/resolves/resolves.model';

// import leadData from './leads.json';
import brokerData from './brokers.json';
import {logger} from '../../util/logger';

const mockPairs = [
  {model: Brokers, data: brokerData}
];

const clean = (...models) => {
  logger.log('...cleaning db');
  return Future.all(models.map(model => model.remove()));
};

const createDocuments = (pairs) => {
  return Future.all(pairs.map(pair => {
    let data = pair.data;

    if (pair.format) {
      data = data.map(doc => {
        if (!doc.type) {
          doc.type = 'mortage';
        }

        return pair.format(doc);
      });
    }

    return pair.model.createAsync(data);
  }));
};

// clean(Brokers, Orders, Resolves)
// .then(()=> {
//   logger.log('so clean');
// })
// .then(removed => createDocuments(mockPairs))
// .then(created => {
//   logger.log(`seeded ${created[0].length} documents`);
// });
