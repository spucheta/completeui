/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**************************************************************************/
/*					nitobi.lang.Compiler	     	      
/**************************************************************************/


nitobi.lang.defineNs("nitobi.lang");

 /**
 * @private
 * @constructor
 * @extends	nitobi.Object
 */
nitobi.lang.Compiler = function() 
{
}


nitobi.lang.extend(nitobi.lang.Compiler,nitobi.Object);

/**
 * 
 * @param profile {Profile} 
 * @param schema {Schema} 
 * @returns {Profile}
 * 
 */
nitobi.lang.Compiler.compile = function(profile)
{
	var classObj = eval(profile.className);
	if (classObj.compiled == null)
    {
		// Create Accessors
        var classDef =	profile.schema.selectSingleNode("//class[@name='"+profile.className+"']");
		if (null == classDef) nitobi.lang.throwError("Could not compile the class: " + profile.className);
        // this creates some code that says MyType.prototype.setProperty = function() { ? };
        eval(nitobi.xml.transformToString(classDef, nitobi.lang.compilerProc));
		classObj.compiled = true;
    }
    return profile;
}