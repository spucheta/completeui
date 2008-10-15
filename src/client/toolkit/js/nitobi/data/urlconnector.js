/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.data');

nitobi.data.UrlConnector = function(url, transformer)
{
	/**
	 * The URL that is used as the data provider.
	 * @type String 
	 */
	this.url = url || null;
	/**
	 * The XSL processor that is used to transform the data returned from the provider. Can also be a function
	 * whose input and outputs are XML Documents. Can also be a XSLTProcessor.
	 * @type Function 
	 */
	this.transformer = transformer || null;
	/**
	 * Whether the request to the server will be a blocking or asynchronous request
	 * @type Boolean
	 */
	this.async = true;
};

/**
 * Returns the XML document from the connector's url, transformed by the connector's <CODE>transformer</CODE>. 
 * @type XMLDocument
 */
nitobi.data.UrlConnector.prototype.get = function(params, dataReadyCallback)
{
	this.request = nitobi.data.UrlConnector.requestPool.reserve();
	var handler = this.url;
	for (var p in params)
	{
		handler = nitobi.html.Url.setParameter(handler,p,params[p]);
	}
	this.request.handler = handler;
	this.request.async = this.async;
	this.request.responseType = "xml";
	this.request.params = {dataReadyCallback: dataReadyCallback};
	this.request.completeCallback = nitobi.lang.close(this,this.getComplete);
	this.request.get();
};

/**
 * @ignore
 */
nitobi.data.UrlConnector.prototype.getComplete = function(eventArgs)
{
	if (eventArgs.params.dataReadyCallback)
	{
		var response = eventArgs.response;
		var dataReadyCallback = eventArgs.params.dataReadyCallback;
		// response should be an xml doc.
		var result = response;
		if (this.transformer)
		{
			if (typeof(this.transformer) === 'function')
			{
				result = this.transformer.call(null, response);
			}
			else
			{
				result = nitobi.xml.transform(response,this.transformer,'xml');
			}
		}
		
		if (dataReadyCallback)
		{
			dataReadyCallback.call(null, {result: result, response: eventArgs.response});
		}
	}
	
	nitobi.data.UrlConnector.requestPool.release(this.request);
	
};

/**
 * @ignore
 */
nitobi.data.UrlConnector.requestPool = new nitobi.ajax.HttpRequestPool();


