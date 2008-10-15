/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.templating");

if (false)
{
	/**
	 * @namespace Templating utility for building HTML strings from javascript objects.
	 * @constructor
	 * @private
	 */
	nitobi.templating = function(){};
}
	
/**
 * Returns a string from the template specified. context determines the object that will be 
 * queried when parameters appear in the template.  Parameters work like so: 
 * <CODE>"%(param)"</CODE> would be replaced by the value of <CODE>context.param</CODE>. Functions
 * can be applied to parameters. <CODE>"%(param|func)"</CODE> would be replaced by 
 * <CODE>extensions.func(context.param)</CODE>.  To query a seperate object for parameters, the 
 * parameter would use the "ext:" prefix: <CODE>"%(ext:param)"</CODE> would be replaced by 
 * <CODE>external.param</CODE>.  
 * @param {String} template the template string
 * @param {Object} context the object queried for parameters
 * @param {Object} extensions an object containing functions that can be applied to parameters
 * @param {Object} external a second object to query when parameters are prefixed by "ext:"
 * @type String
 */
nitobi.templating.applyTemplate = function(template, context, extensions, external)
{
	var builtin = {
		divIf: function(str)
		{
			if (str != null) 
			{
				return "<div>"+str+"</div>";
			} 
			else
			{
				return "";
			}
		},
		breakIf: function(str) {
			if (str != null) 
			{
				return str+"<br />";
			} 
			else
			{
				return "";
			}
		},
		btos: function(bool)
		{
			if (bool) 
			{
				return "true"
			}
			else
			{
				return "false";
			}
		}
	};
	for (var p in extensions)
	{
		builtin[p] = extensions[p];
	}
	
	var fn = function(w, g) {
		try
		{
			g = g.split("|");
			var ext = g[0].split(":");
			var cnt;
			if (ext[1])
			{
				var chain = ext[1].split(".");
				cnt = external[chain[0]];
				for (var i = 1; i < chain.length; i++)
				{
					cnt = cnt[chain[i]];
				}
			}
			else
			{
				var chain = g[0].split(".");
				cnt = context[chain[0]];
				for (var i = 1; i < chain.length; i++)
				{
					cnt = cnt[chain[i]];
				}
			}
			
			for(var i=1; i < g.length; i++)
			{
				cnt = builtin[g[i]].call({context:context,external:external},cnt);
			}
			if(cnt == 0 || cnt == -1)
				cnt += '';
			return cnt; //|| w;
		}
		catch(e)
		{
			alert(g + "\n" + e);
			return "!!ERROR!!";
		}
	};
	
	return template.replace(/%\(([A-Za-z0-9_|.:]*)\)/g, fn);
};


