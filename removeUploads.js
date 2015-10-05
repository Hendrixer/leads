var fs = require('fs-extra');
var path = require('path');

fs.emptyDir('uploads', function(err) {
  console.error(err);
});
