/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**************************************************************************/
/*					nitobi.base.Registry	     	      
/**************************************************************************/


nitobi.lang.defineNs("nitobi.base");

// This is unnecessary in most cases, but we do this to avoid problems if toolkit
// is included twice on a page which will be the case if .NET customers try to use
// the new components.
if (!nitobi.base.Registry)
{
/**
 * Stores information about classes.  This is a singleton. Do not create directly, but rather use the getInstance method.
 * @class The registry manages class information.  Registering a {@link nitobi.base.Profile} in the registry allows for
 * object creation via {@link nitobi.base.Factory}
 * @constructor
 */
nitobi.base.Registry = function() 
{
	/**
	 * Profiles keyed by class.
	 * @private
	 */
	this.classMap = {};
	/**
	 * Profiles keyed by tagname.
	 * @private
	 */
	this.tagMap = {};
}

if (!nitobi.base.Registry.instance)
{
	/**
	 * The singleton instance.
	 * @private
	 */
	nitobi.base.Registry.instance = null;
}


/**
 * Returns the single instance of this class.
 * @type nitobi.base.Registry
 */
nitobi.base.Registry.getInstance = function()
{
	if (nitobi.base.Registry.instance == null)
	{
		nitobi.base.Registry.instance = new nitobi.base.Registry();
	}
	return nitobi.base.Registry.instance;
}

/**
 * Returns a class's profile given its fully qualified name.
 * @param {String} className The classname of the profile we're looking for.
 * @type nitobi.base.Profile
 */
nitobi.base.Registry.prototype.getProfileByClass = function(className)
{
	return this.classMap[className];
}


/**
 * Given an instance of a class, return the class's profile.
 * @param {Object} instance The object instance who's profile we're interested in.
 * @type nitobi.base.Profile
 */
nitobi.base.Registry.prototype.getProfileByInstance = function(instance)
{
	// Get info about the first function in the instance.
	var fnInfo = nitobi.lang.getFirstFunction(instance);
	// Get the functions prototype.
	var p = fnInfo.value.prototype;
	
	var instanceClassName = null;
	var highScore = 0;
	for (var className in this.classMap)
	{
		// Get the class object.
		
		// DANGER: this will only work if the class you are looking for is registered.
		// Otherwise we will return the most similar class.
		var classObj = this.classMap[className].classObject;
		var score = 0;
		while (classObj && instance instanceof classObj)
		{
			classObj = classObj.baseConstructor;
			score++;
		}
		
		if (score > highScore)
		{
			highScore = score;
			instanceClassName = className;
		}
		// -------------------------------------------------------------------
		// LEAVING THE OLD CODE HERE IN CASE THE DANGER CASE BECOMES A PROBLEM
		// -------------------------------------------------------------------
		// The problem with this code below is that any expando's of type 'function' 
		// on an instance that are not found in that instance's class will muck things up.
		// -------------------------------------------------------------------
		// Get the prototype of the function of the same name  and compare
		// the two.
//		var o = classObj.prototype[fnInfo.name];
//		if (o != null)
//		{	
//			var cp = o.prototype;
//			if (cp == p)
//			{
//				// For added security, check the other fns.
//				var check=true;
//				for (fn in instance)
//				{
//					if (instance[fn] != null && typeof(instance[fn]) == "function")
//					{
//						if (classObj.prototype[fn] == null)
//						{
//							check=false;
//						}
//					}
//					
//				}
//				if (check == true)
//				{
//					return this.getProfileByClass(className);
//				}
//			}
//		}
	}
	if (instanceClassName)
	{
		return this.getProfileByClass(instanceClassName);
	}
	else
	{
		return null;
	}
}


/**
 * Returns a class's profile given its tagname.
 * @param {String} tagName  The tagname of the profile we're interested in.
 * @type nitobi.base.Profile
 */
nitobi.base.Registry.prototype.getProfileByTag = function(tagName)
{
	return this.tagMap[tagName];
}

/**
 * Returns a class's profile given a partially completed profile.
 * @param {nitobi.base.Profile} incompleteProfile A profile with one or more fields completed. 
 * @type nitobi.base.Profile
 */
nitobi.base.Registry.prototype.getCompleteProfile = function(incompleteProfile)
{
	if (nitobi.lang.isDefined(incompleteProfile.className) && incompleteProfile.className != null)
	{
		return this.classMap[incompleteProfile.className];
	}
	if (nitobi.lang.isDefined(incompleteProfile.tagName) && incompleteProfile.tagName != null)
	{
		return this.tagMap[incompleteProfile.tagName];
	}	
	nitobi.lang.throwError("A complete class profile could not be found. Insufficient information was provided.");
}

/**
 * Register a class with the registry.  <b>Registering a class enables it's creation by factory</b>.
 * @param {nitobi.base.Profile} profile A complete profile.
 */
nitobi.base.Registry.prototype.register = function(profile)
{
	//if (!nitobi.lang.isDefined(profile.schema) || null==profile.schema) nitobi.lang.throwError("Illegal to register a class without a schema.");
	if (!nitobi.lang.isDefined(profile.tagName) || null==profile.tagName) nitobi.lang.throwError("Illegal to register a class without a tagName.");
	if (!nitobi.lang.isDefined(profile.className) || null==profile.className) nitobi.lang.throwError("Illegal to register a class without a className.");
	this.tagMap[profile.tagName] = profile;
	this.classMap[profile.className] = profile;
}
}