require('babel/register');
require('./worker');
var instances = process.env.WEB_CONCURRENCY;
var maxMem = process.env.WEB_MEMORY;
console.log('worker => instances %s : memory %s', instances, maxMem);
