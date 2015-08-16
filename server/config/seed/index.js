import mongoose from 'mongoose';
import Future from 'bluebird';
import _ from 'lodash';
import {Leads} from '../../api/leads/leads.model';
import {Brokers} from '../../api/brokers/brokers.model';

import leadData from './leads.json';
import brokerData from './brokers.json';
import {logger} from '../../util/logger';

const mockPairs = [
  {model: Leads, data: leadData},
  {model: Brokers, data: brokerData}
];

const clean = (...models) => {
  logger.log('...cleaning db');
  return Future.all(models.map(model => model.remove()));
};

const createDocuments = (pairs) => {
  return Future.all(pairs.map(pair => pair.model.create(pair.data)));
};

clean(Leads, Brokers)
.then(()=> {
  logger.log('so clean');
})
.then(removed => createDocuments(mockPairs))
.then(created => {
  logger.log('seeded');
});


