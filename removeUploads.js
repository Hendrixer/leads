var fs = require('fs-extra');

fs.emptyDir(__dirname + '/uploads', function(err) {
  console.error(err);
});
