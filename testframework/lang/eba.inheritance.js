if (typeof(Eba) == "undefined")
{
	Eba = {};
}

/**
 * Allows support for inheritance.
 * @param subClass {object} The class that will inherit from the base.
 * @param baseClass {object} The class that will be inherited from.
 */
Eba.extend = function(subClass, baseClass) {
   function inheritance() {}
   inheritance.prototype = baseClass.prototype;

   subClass.prototype = new inheritance();
   subClass.prototype.constructor = subClass;
   subClass.baseConstructor = baseClass;
   if (baseClass.base)
   {
	   baseClass.prototype.base = baseClass.base;
   }
   subClass.base = baseClass.prototype;
}

// legacy
var Class = {
  create: function() {
    return function() { 
      this.initialize.apply(this, arguments);
    }
  }
}