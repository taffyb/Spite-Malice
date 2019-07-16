var path = require('path');
 
var _root = path.resolve(__dirname, '..');
 
function root(args) {
  let rootPath="";
  args = Array.prototype.slice.call(arguments, 0);
  rootPath=path.join.apply(path, [_root].concat(args));
  console.log(`rootPath: ${rootPath}`);
  return rootPath;
}
 
exports.root = root;