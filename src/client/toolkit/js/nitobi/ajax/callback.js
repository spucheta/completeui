/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
// Can we get rid of this class?  Doesn't seem to be in use anywhere...

/**
 * Makes an XMLHttpRequest and processes the result.
 * <![CDATA[<P>Normally web forms post data back to the server when the user clicks the "SUBMIT" button. The nitobi Grid sends data to the server without the need for a form submission to occur. This means the browser does not navigate to a new page and the user can continue editing data on the current page. Some developers may wish to post data entered into the grid along with a form submission. This can be accomplished easily by copying the XML from the updategram into a hidden HTML form field before the form is submitted.</P><P>In addition some developers may wish to make the grid save "invisibly" or in other words, without the user clicking "Save". This is also easy to accomplish by calling the save() method during oncellmodified events or any other event you may wish to use.</P><P>The Grid transmits the updategrams to a "handler" which is a server-side script or program that accepts XML updates posted from the browser and processes the updates by updating a database, flat-file or external system. Many examples of handlers are included with the Grid but the developer may choose to implement his/her own custom handler to meet the specific needs of the application. </P>]]>
 * @private
 */
nitobi.ajax.Callback = function()
{
	/**
	 * This is the URL of the server resource that data is being posted to or
	 * retrieved from.
	 * @private
	 */
  	this.handler 		= '';
  	/**
  	 * This specifies if the requests should be made in an asynchronous or synchronous manner.
 	 * @private
  	 */
	this.asynchronous 	= true;
	/**
	 * This specifieds if XML data or general text data is being retrieved from the server.
	 * @private
	 */
	this.responseType	= "xml";
	/**
	 * This is the underlying XMLHttpRequest object.
	 * @private
	 */
	this.httpObj      	= nitobi.xml.createXmlHttp();
	/**
	 * This is the object on which the postComplete and getComplete functions should be executed.
	 * @private
	 */
	this.context	  	= null;
	/**
	 * This is a function reference to a function that is executed after data has been 
	 * posted to the server and the asynchronous request has returned.
	 * @private
	 */
	this.onPostComplete	= null;
	/**
	 * This is a function reference to a function that is executed after data has been 
	 * retrieved from the server through an asynchronous request.
	 * @private
	 */
	this.onGetComplete	= null;
	/**
	 * This is a parameter object that can contain any information needed to be passed
	 * to the postComplete or getComplete functions after an asynchronous request has returned.
	 * This can be used to maintain state across an asynchronous request.
	 * @private
	 */
	this.params			= null;
}

/**
 * This method takes the response from the server and checks the HTTP status 
 * to ensure that the server did not have any errors and returned valid XML.
 * @private
 */
nitobi.ajax.Callback.prototype.handleResponse = function()
{
  	var result = null;
    try{
	    nitobi.debug.assert((null != this.httpObj),"httpObj must not be null","",NTB_THROW);

    nitobi.debug.assert((500!=this.httpObj.status),
                       "500 occurred.\n"      + 
                       //this.httpObj.responseText.substring(0,100) + "..." +
                       "Request Header:"    +
                       this.httpObj.getAllResponseHeaders() + 
                       "\n Request URL [" + this.handler + "] ","",NTB_THROW);
    nitobi.debug.assert((405!=this.httpObj.status),
                      "405 occurred, your getHandler must accept HTTP POSTs.\n" +
                      //this.httpObj.responseText.substring(0,100) +  "..." +
                       "Request Header:"    +
                       this.httpObj.getAllResponseHeaders() + 
                       "\n Request URL [" + this.handler + "] ","",NTB_THROW);
    
    nitobi.debug.assert((404!=this.httpObj.status),
                      "404 occurred, your getHandler URL is incorrect.\n" +
                      //this.httpObj.responseText.substring(0,100) +  "..." +
                       "Request Header:"    +
                       this.httpObj.getAllResponseHeaders()   + 
                       "\n Request URL [" + this.handler + "] ","",NTB_THROW);

	if (this.responseType == "xml")
	{
		result = this.httpObj.responseXML;
	}
	else
	{
		result = this.httpObj.responseText;
	}
	// try to clean up mem for GC
	} 
	catch(err) 
	{
		var message = (err.description) || err;
		nitobi.debug.errorReport("Exception in nitobi.ajax.Callback.handleResponse()\n\n" + message, NTB_XHR_RESPONSE_ERROR, NTB_ERROR);		
	}
	finally 
	{
		callerContext = null;	
		return result;
	}
}


/**
 * This method posts some data to the given url using the XMLHttpRequest object.
 * Various parameters such as asynchronous and handler should have already been set.
 * @param {string} data The only argument passed to this method is some data to post
 * to the server. It can be in any format such as XML or JSON.
 * @returns {Object} 
 * @private
 */
nitobi.ajax.Callback.prototype.postData = function(data)
{

	nitobi.debug.assert((null != data),"data param must not be null.  Value : [" + data + "]","",NTB_WARN);
	nitobi.debug.assert((""   != this.handler),"handler must not be empty","",NTB_WARN);

	try{
	      this.httpObj.open("POST", this.handler, this.asynchronous, "", "");
	}
	catch(e){
	    nitobi.debug.assert(("Error: The update had failed, uncaught exception: Permission denied to call method XMLHttpRequest.open" != e),
	                        "Please ensure your handler has same domain and port number as the target HTML page.  Exception Details [" + e, NTB_ERROR);
	    //throw(e);
	    return;
	}
	
	if (this.asynchronous)
	{
	    var This   = this;
	    // Creating a inner function and assigning it to the ebaCallback instances httpObj.onreadystatechange
	    // This creates a closure (This is circular reference)
	    // 
	    this.httpObj.onreadystatechange = function()	{
	        //
	        // from: http://lxr.mozilla.org/mozilla1.8/source/extensions/xmlextras/base/public/nsIXMLHttpRequest.idl#213
	        //* The state of the request.
	        //*
	        //* Possible values:
	        //*   0 UNINITIALIZED open() has not been called yet.
	        //*   1 LOADING       send() has not been called yet.
	        //*   2 LOADED        send() has been called, headers and status are available.
	        //*   3 INTERACTIVE   Downloading, responseText holds the partial data.
	        //*   4 COMPLETED     Finished with all operations.
	        //
	
		    if(This.httpObj.readyState==4) {
		        try
		        {
		        	// if null then assume fire and forget
					if(null != This.onPostComplete)
					{
						This.onPostComplete.call(This.context, This.handleResponse(), This.params);
					}
				}
				catch(e)
				{
					throw e;
				}
				finally
				{
					This = null;
				}
		    }
	    };
	}
	if (this.responseType == "xml")
	{
	    this.httpObj.setRequestHeader("Content-Type","text/xml");    
	}

	this.httpObj.send(data);
}

/**
 * This does various assertions on XMLData then calls postData.
 * If xmlData is has no valid child nodes the just return
 * @param {XmlNode} xmlData The single argument passed to this method is a valid XML DOM object.
 * @private
 */
nitobi.ajax.Callback.prototype.post = function(xmlData)
{
    nitobi.debug.assert((xmlData !=null),"xmlData to be sent can not be null.");	
	// validate the XML data parameter
	if(("undefined" == typeof(xmlData.documentElement)) || 
	   (null == xmlData.documentElement) || 
	   ("undefined" == typeof(xmlData.documentElement.childNodes)) ||
	   (1 > xmlData.documentElement.childNodes.length))
	{
	    nitobi.debug.errorReport("updategram is empty. No request sent. xmlData[" + xmlData + "]\nxmlData.xml[" + xmlData.xml + "]");
	    // not sure that return is best here.
	    return; 
	}
	
	//  get data from xml (null == xmlData.xml)
	if(null == xmlData.xml)
	{
		// looks like we are not running IE
		// lets try to get xml data            
		var xmlSerializer = new XMLSerializer();
		xmlData.xml     = xmlSerializer.serializeToString(xmlData);
	}
	this.postData(xmlData.xml);
}

/**
 * This is used to retrieve data from the server.
 * It will retrieve data from the URL specified by the handler property of the Callback object.
 * @private
 */
nitobi.ajax.Callback.prototype.get = function()
{
	return this.getData();
}

/**
 * This is used to retrieve data from the server.
 * This is called by the get method directly ... not sure why
 * @private
 */
nitobi.ajax.Callback.prototype.getData = function()
{
	try
	{
		this.httpObj.open("GET", this.handler, this.asynchronous, "", "");
	}
	catch(e)
	{
		nitobi.debug.assert(("Error: The update had failed, uncaught exception: Permission denied to call method XMLHttpRequest.open" != e),
	                        "Please ensure your handler has same domain and port number as the target HTML page.  Exception Details [" + e, NTB_ERROR);
	    //throw(e);
	    return;
	}

	if (this.asynchronous)
	{
	    // Creating a inner function and assigning it to the ebaCallback instances httpObj.onreadystatechange
	    // This creates a closure (This is circular reference)
	    this.httpObj.onreadystatechange = nitobi.lang.close(this, this.onReadyStateChange);
	}
	
	if (this.responseType == "xml")
	{
	    this.httpObj.setRequestHeader("Content-Type","text/xml");    
	}
    this.httpObj.send(null);

	if (!this.asynchronous)
    {
		return this.handleResponse();
    }
}

/**
 * The OnReadyStateChange event is used internally for monitoring the 
 * readyState of the XMLHttpRequest when data is being retrieved from the server.
 * When the readyState is 4 then it will call the function pointer onGetComplete.
 * @private
 */
nitobi.ajax.Callback.prototype.onReadyStateChange = function()
{
    if(this.httpObj.readyState==4)
    {
        	// if null then assume fire and forget
			if(null != this.onGetComplete)
			{
				this.onGetComplete.call(this.context, this.handleResponse(), this.params);
			}
    }
}

/**
 * This method clears the state of the Callback object to its initial state.
 * @private
 */
nitobi.ajax.Callback.prototype.clear = function()
{
  	this.handler 		= '';
	this.asynchronous 	= true;
	this.context	  	= null;
	this.onPostComplete	= null;
	this.onGetComplete	= null;
	this.params = null;
}

/**
 * @private
 */
nitobi.ajax.Callback.prototype.dispose = function()
{
	this.httpObj = null;
  	this.handler = null;
	this.context = null;
	this.onGetComplete = null;
	this.params = null;
}