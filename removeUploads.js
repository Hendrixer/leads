var fs = require('fs-extra');
import path from 'path';
fs.emptyDir(path.join(process.cwd(), 'uploads'), function(err) {
  console.error(err);
});
