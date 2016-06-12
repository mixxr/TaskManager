var utils = {};
utils.extractField = function(items, field){
    return items.map(function(e){return e[field];});
};
utils.extractUnique = function(xs){
  return xs.filter(function(x, i) {
    return (xs.indexOf(x) === i);
  });
};   