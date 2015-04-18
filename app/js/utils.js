'use strict'  ;

module.exports = {
  // from http://youmightnotneedjquery.com
  extend: function (out) {
    /*jshint -W073 */
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) { continue; }

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          out[key] = arguments[i][key];
        }
      }
    }

    return out;
    /*jshint +W073 */
  },

  spawnSprite: function (group, klass, x, y, options) {
    var instance = group.getFirstExists(false);
    // reuse existing slot if available
    if (instance) {
      instance.reset(x, y);
      if (instance.init) { instance.init(options); }
    }
    // if there is no slot available, create a new sprite
    else {
      /*jshint -W055 */
      group.add(new klass(group.game, x, y, options));
      /*jshint +W055 */
    }
  }
};
