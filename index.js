if (process.env.NODE_ENV === 'production') {
  // require('newrelic');
}

var pm2 = require('pm2');
var instances = process.env.WEB_CONCURRENCY || -1;
var maxMem = process.env.WEB_MEMORY || 512;

pm2.connect(function() {
  pm2.start({
    script: 'server/index.js',
    name: 'leads-app',
    exec_mode: 'cluster',
    instances: instances,
    max_memory_restart: maxMem + 'M',
    watch: true,
    env: {
      PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
      PUSHER_APP_ID: process.env.PUSHER_APP_ID,
      PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
      RAYGUN_APIKEY: process.env.RAYGUN_APIKEY
    }
  }, function(err) {
    if (err) {
      return console.error('Error while lauching app', err.stack || err);
    }

    console.log('PM2 started apps perfectly');

    // Display logs in standard output
    pm2.launchBus(function(err, bus) {
      console.log('[PM2] Log streaming started');

      bus.on('log:out', function(packet) {
        console.log('[App:%s] %s', packet.process.name, packet.data);
      });

      bus.on('log:err', function(packet) {
        console.error('[App:%s][Err] %s', packet.process.name, packet.data);
      });
    });
  });
});
