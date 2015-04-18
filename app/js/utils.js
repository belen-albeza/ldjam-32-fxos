'use strict'  ;

module.exports= {
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
