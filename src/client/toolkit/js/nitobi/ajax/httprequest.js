/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.ajax");


/**
 * Creates an HttpRequest object.  After calling the constructor you can set up the object by setting
 * particular fields to the values you desire. 
 * @class Makes a cross browser XMLHttpRequest object and processes responses from the server.
 * @example
 * var xhr = new nitobi.ajax.HttpRequest();
 * xhr.handler = path + "data.xml";
 * xhr.async = true; // async is true by default
 * xhr.responseType = "xml"; // by default the appropriate responseType will be used - ie XML if the data is valid XML otherwise "text".
 * xhr.onGetComplete.subscribeOnce(function(evtArgs) {alert("In onGetComplete:\n" + nitobi.xml.serialize(evtArgs.response))});
 * xhr.completeCallback = function(evtArgs) {alert("In completeCallback:\n" + nitobi.xml.serialize(evtArgs.response))};
 * xhr.get();
 * @constructor
 * @extends nitobi.Object
 */
nitobi.ajax.HttpRequest = function()
{
	/**
	 * This is the URL of the server resource that data is being posted to or
	 * retrieved from.
	 * @type String
	 */
  	this.handler 		= '';
  	/**
  	 * This specifies if the requests should be made in an asynchronous or synchronous manner.
  	 * @type Boolean
  	 */
	this.async 	= true;
	/**
	 * This specifies if XML data or general text data is being retrieved from the server. 
	 * Valid values are "xml", "text" or "". Using "text" can be used for returning JSON data or any other
	 * data format including XML. The data passed to the callback method will be an XMLDocument if "xml" is
	 * specified as the responseType, it will be a String if "text" is specified.
	 * @type String
	 */
	this.responseType	= null;
	/**
	 * This is the underlying XMLHttpRequest object.
	 * @type XMLHttpRequest
	 * @private
	 */
	this.httpObj      	= nitobi.ajax.createXmlHttp();
	/**
	 * This is the Event that is fired when a POST request returns from the server.
	 * @type nitobi.base.Event
	 */
	this.onPostComplete	= new nitobi.base.Event();
	/**
	 * This is the Event that is fired when a GET request returns from the server.
	 * @type nitobi.base.Event
	 */
	this.onGetComplete	= new nitobi.base.Event();
	/**
	 * This is the Event that is fired when any request returns from the server.
	 * @type nitobi.base.Event
	 */
	this.onRequestComplete	= new nitobi.base.Event();
	/**
	 * This is a function reference to a function that is executed if there is an error during or after the request.
	 * @type nitobi.base.Event
	 */	
	this.onError		= new nitobi.base.Event();
	/**
	 * The length of time that can pass before the request is cancelled. A value of 0 indicates there is no timeout.
	 * @type Number
	 */
	this.timeout = 0;
	/**
	 * The ID of the window.setTimeout registration.
	 * @type Number
	 */
	this.timeoutId = null;
	/**
	 * This is a parameter object that can contain any information needed to be passed
	 * to the postComplete or getComplete functions after an asynchronous request has returned.
	 * This can be used to maintain state across an asynchronous request.
	 * @type Object
	 */
	this.params			= null;
	/**
	 * A copy of the data that is sent to the server in a post
	 * @type String
	 */
	this.data		= "";
	/**
	 * A function to execute when the request completes.
	 * @type Function
	 */
	this.completeCallback = null;
	/**
	 * The status. Either 'pending' or 'complete'.
	 * @type String
	 */
	this.status = "complete";
	/**
	 * Specifies if a unique querystring value should be sent with GET requests to prevent page caching.
	 * Default value is true.
	 */
	this.preventCache = true;

	/**
	 * The username to be sent to the server with the HTTP request.
	 */
	this.username = "";

	/**
	 * The password to be sent to the server with the HTTP request.
	 */
	this.password = "";

	/**
	 * This is used for keeping track of the method used when the HttpRequest open and send methods are used.
	 * @private
	 */
	this.requestMethod = "get";

	/**
	 * @private
	 */
	this.requestHeaders = {};
}

nitobi.lang.extend(nitobi.ajax.HttpRequest, nitobi.Object);

/**
 * Maximum number of concurrent connections. The default is 64.
 * @type Number
 */
nitobi.ajax.HttpRequestPool_MAXCONNECTIONS=64;

/**
 * This method takes the response from the server and checks the HTTP status 
 * to ensure that the server did not have any errors and returned valid XML.
 * @type {String | XMLDocument}
 * @private
 */
nitobi.ajax.HttpRequest.prototype.handleResponse = function()
{
  	var result = null;
  	var error = null;

   
	if ((this.httpObj.responseXML != null && this.httpObj.responseXML.documentElement != null) && this.responseType != "text")
	{
		result = this.httpObj.responseXML;
	}
	else if(this.responseType == "xml")
    {
    	result = nitobi.xml.createXmlDoc(this.httpObj.responseText);
    } 
    else
    {
        result = this.httpObj.responseText;
    }
    
	if (this.httpObj.status != 200)
	{
		this.onError.notify({"source":this,"status":this.httpObj.status,"message":"An error occured retrieving the data from the server. " +
				"Expected response type was '"+this.responseType+"'."});
	}

	return result;
}

/**
 * This method posts some data to the given url using the XMLHttpRequest object.
 * Various parameters such as asynchronous and handler should have already been set.
 * @param {String} data The only argument passed to this method is some data to post
 * to the server. It can be in any format such as XML or JSON.
 * @param {String} [url] The URL where the data is to be posted to. This is optional and can also be 
 * specified using the handler property.
 * @return If the request is synchronous, the content of the server response is 
 * returned as either XML data or plain text, depending on the response type
 * @type XMLDocument|String
 */
nitobi.ajax.HttpRequest.prototype.post = function(data, url)
{
	this.data = data;
	return this._send("POST", url, data, this.postComplete);
}

/**
 * This is used to retrieve data from the server.
 * It will retrieve data from the URL specified by the handler property of the Callback object.
 * @return If the request is synchronous, the content of the server response is 
 * returned as either XML data or plain text, depending on the response type
 * @param {String} url The URL to request the data from. This is an alternative to setting the handler parameter.
 * @type String|XMLDocument
 */
nitobi.ajax.HttpRequest.prototype.get = function(url)
{
	return this._send("GET", url, null, this.getComplete)
}

/**
 * @ignore
 */
nitobi.ajax.HttpRequest.prototype.postComplete = function()
{
    if(this.httpObj.readyState==4)
    {
    	this.status = "complete";
    	var callbackParams = {'response':this.handleResponse(),'params':this.params};
    	this.responseXml = this.responseText = callbackParams.response;
    	this.onPostComplete.notify(callbackParams);
    	this.onRequestComplete.notify(callbackParams);
    	if (this.completeCallback)
    	{
    		this.completeCallback.call(this, callbackParams);
    	}
	}
}

/**
 * This does various assertions on XMLData then calls postData.
 * If xmlData is has no valid child nodes the just return
 * @param {XmlNode} xmlData The single argument passed to this method is a valid XML DOM object.
 * @return If the request is synchronous, the content of the server response is 
 * returned as either XML data or plain text, depending on the response type
 * @type XMLDocument|String
 */
nitobi.ajax.HttpRequest.prototype.postXml = function(xmlData)
{
	this.setTimeout();

    // validate the XML data parameter
    if(("undefined" == typeof(xmlData.documentElement)) || 
       (null == xmlData.documentElement) || 
       ("undefined" == typeof(xmlData.documentElement.childNodes)) ||
       (1 > xmlData.documentElement.childNodes.length))
    {
        ebaErrorReport("updategram is empty. No request sent. xmlData[" + xmlData + "]\nxmlData.xml[" + xmlData.xml + "]");
        // not sure that return is best here.
        return; 
    }

    //  get data from xml (null == xmlData.xml)
    if(null == xmlData.xml)
	{
            // looks like we are not running nitobi.browser.IE
            // lets try to get xml data            
            var xmlSerializer = new XMLSerializer();
            xmlData.xml     = xmlSerializer.serializeToString(xmlData);
	}
	return this.post(xmlData.xml);
}

/**
 * @private
 * Actually makes the Ajax request whether it is called through 
 * <code>post</code>, <code>get</code>, or <code>send</code>.
 */
nitobi.ajax.HttpRequest.prototype._send = function(method, url, data, completeHandler)
{
	this.handler = url || this.handler;
	this.setTimeout();

	this.status = "pending";

	this.httpObj.open(method, (this.preventCache?this.cacheBust(this.handler):this.handler), this.async, this.username, this.password);

    if (this.async)
	    this.httpObj.onreadystatechange = nitobi.lang.close(this, completeHandler);

	for (var item in this.requestHeaders) {
		this.httpObj.setRequestHeader(item, this.requestHeaders[item]);
	}

	if (this.responseType == "xml")
	    this.httpObj.setRequestHeader("Content-Type","text/xml");
	else if (method.toLowerCase() == "post")
		this.httpObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

	// TODO: check if the data is a form. if so then serialize it
	/*
	if (data.tagName == "form") {
		var s = "";
		for (var i=0; i<data.elements; i++) {
			var e = data.elements[i];
			s += e.name + "=" + e.value + "&";
		}
		data = s;
	}
	 */

    this.httpObj.send(data);

	if (!this.async)
		return this.handleResponse();
	return this.httpObj;
}

/**
 * Compatibility with the native XMLHttpRequest object. Opens the connection to the server.
 * After calling open headers can be set and the request can be sent using the <code>send</code> method.
 * @param {String} method The method for fetching data, either "get" or "post"
 * @param {String} url The url of the connection to open.
 * @param {Boolean} async Whether or not make the connection asynchronous.
 * @param {String} [username] The username for the connection.
 * @param {String} [password] The password for the connection.
 */
nitobi.ajax.HttpRequest.prototype.open = function(method, url, async, username, password) {
	this.requestMethod = method;
	this.async = async;
	this.username = username;
	this.password = password;
	this.handler = url;
}

/**
 * Compatible with the native XMLHttpRequest object. Sends the request to the server.
 * @param {String} data The data to send to the server, if the request method is "post".
 */
nitobi.ajax.HttpRequest.prototype.send = function(data) {
	// TODO: Do we want to ensure that the url is specified?
	var response = null;
	switch (this.requestMethod.toUpperCase())
	{
		case "POST":
			response = this.post(data);
			break;
		default:
			response = this.get();
			break
	}
	this.responseXml = this.responseText = response;
}

/**
 * @private
 */
nitobi.ajax.HttpRequest.prototype.setTimeout = function()
{
	if (this.timeout > 0)
	{
		this.timeoutId = window.setTimeout(nitobi.lang.close(this, this.abort), this.timeout);
	}
}

/**
 * The onReadyStateChange event is used internally for monitoring the 
 * readyState of the XMLHttpRequest when data is being retrieved from the server.
 * When the readyState is 4 then it will call the function pointer onGetComplete.
 * @private
 */
nitobi.ajax.HttpRequest.prototype.getComplete = function()
{
    if(this.httpObj.readyState==4)
    {
    	this.status = "complete";

    	var callbackParams = {'response':this.handleResponse(),'params':this.params,'status':this.httpObj.status,'statusText':this.httpObj.statusText};
    	this.responseXml = this.responseText = callbackParams.response;
    	this.onGetComplete.notify(callbackParams);
    	this.onRequestComplete.notify(callbackParams);
    	if (this.completeCallback)
    	{
    		this.completeCallback.call(this, callbackParams);
    	}
	}
}

/**
 * Sets a request header on the XMLHttpRequest. The header name-value pair is added to the <code>requestHeaders</code> hash.
 * @param {String} header The header name.
 * @param {String} val The header value.
 */
nitobi.ajax.HttpRequest.prototype.setRequestHeader = function(header, val)
{
	this.requestHeaders[header] = val;
}

/**
 * Indicates whether or not the specified status code indicates an error.
 * @param {Number} code The status code.
 * @type Boolean
 */
nitobi.ajax.HttpRequest.prototype.isError = function(code)
{
	return (code >= 400 && code < 600);
}

/**
 * Cancels the server request.
 */
nitobi.ajax.HttpRequest.prototype.abort = function()
{
	this.httpObj.onreadystatechange = function () {};
	this.httpObj.abort();
}

/**
 * This method clears the state of the Callback object to its initial state.
 * @private
 */
nitobi.ajax.HttpRequest.prototype.clear = function()
{
  	this.handler 		= '';
	this.async 	= true;
	this.onPostComplete.dispose();
	this.onGetComplete.dispose();
	this.params = null;
}

/**
 * Adds a cache-busting querystring parameter to the request.
 * @private
 */
nitobi.ajax.HttpRequest.prototype.cacheBust = function(url)
{
	var urlArray = url.split('?');
	var param = 'nitobi_cachebust=' + (new Date().getTime());
	if (urlArray.length == 1)
		url += '?' + param;
	else
		url += '&' + param;
	return url;
}