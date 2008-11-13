/// <class name="Callback" access="public">
/// <summary>Makes an async XMLHttprequest and process the result.</summary>
/// <remarks><![CDATA[<P>Normally web forms post data back to the server when the user clicks the "SUBMIT" button. The EBA:Grid sends data to the server without the need for a form submission to occur. This means the browser does not navigate to a new page and the user can continue editing data on the current page. Some developers may wish to post data entered into the grid along with a form submission. This can be accomplished easily by copying the XML from the updategram into a hidden HTML form field before the form is submitted.</P><P>In addition some developers may wish to make the grid save "invisibly" or in other words, without the user clicking "Save". This is also easy to accomplish by calling the save() method during oncellmodified events or any other event you may wish to use.</P><P>The Grid transmits the updategrams to a "handler" which is a server-side script or program that accepts XML updates posted from the browser and processes the updates by updating a database, flat-file or external system. Many examples of handlers are included with the Grid but the developer may choose to implement his/her own custom handler to meet the specific needs of the application. </P>]]></remarks>
/// </class>

Eba.CallbackPool_MAXCONNECTIONS = 10;

//	NOTE: No need for global variables here since the JS memory problem is
//	only with ciruclar references between JS and the DOM

Eba.Callback = Class.create();
Eba.Callback.prototype = {

  initialize: function() {

    this.handler = '';
    this.asynchronous = true;
    this.httpObj = Eba.Xml.createXmlHttp();
    this.context = null;
    this.onPostComplete = null;
    this.onGetComplete = null;
    this.params = null;
  },
// process the response from a post request
// errors to be handled
// assert httpObj is not null
// assert httpObj.status is 200
// assert httpObj.contains valid XML (do we want this assertion?)
  handleResponse: function() {
    var result = null;
    try {
      // Eba.Error.assert((null != this.httpObj), "httpObj must not be null", "", Eba.Error.THROW);
/*
      // Eba.Error.assert((500 != this.httpObj.status), "500 occurred:" + this.httpObj.responseText.substring(0, 100)
        + "..." + "Request Header:" + this.httpObj.getAllResponseHeaders() + "]\n request URL ["
        + this.handler + "] ", "", Eba.Error.THROW);
      // Eba.Error.assert((405 != this.httpObj.status), "405 occurred your handler must accept HTTP POSTs:"
        + this.httpObj.responseText.substring(0, 100) + "..." + "Request Header:"
        + this.httpObj.getAllResponseHeaders() + "]\n request URL [" + this.handler
        + "] ", "", Eba.Error.THROW);

      // Eba.Error.assert((404 != this.httpObj.status), "404 occurred your handler URL is correct:"
        + this.httpObj.responseText.substring(0, 100) + "..." + "Request Header:"
        + this.httpObj.getAllResponseHeaders() + "]\n request URL [" + this.handler
        + "] ", "", Eba.Error.THROW);*/

      result = this.httpObj.responseXML;
      // try to clean up mem for GC
    } catch(err) {
      var message = (err.description) || err;
      ebaErrorReport("handleResponse Exception " + message, Eba.Error.XHR_RESPONSE_ERROR, Eba.Error.ERROR);
    } finally {
      callerContext = null;
      return result;
    }
  },


// XML data is not required
  postData: function(data, target) {

    /*// Eba.Error.assert((null != data), "data param must not be null.  Value : [" + data
      + "]", "", Eba.Error.WARN);
    // Eba.Error.assert((null != target), "target param must not be null.  Value : ["
      + target + "]", "", Eba.Error.WARN);
    // Eba.Error.assert(("" != this.handler), "handler must not be empty", "", Eba.Error.WARN);*/

    try {
      this.httpObj.open("POST", this.handler, this.asynchronous, "", "");
    } catch(e) {
      /*// Eba.Error.assert(("Error: The update had failed, uncaught exception: Permission denied to call method XMLHttpRequest.open"
        != e), "Please ensure your handler has same domain and port number as the target HTML page.  Exception Details ["
        + e, Eba.Error.ERROR);*/
      //throw(e);
      return;
    }
    // this may be a memory leak
    var This = this;
    var Target = target;
    // TODO: investigate why 'This.target' does not work
    // Creating a inner function and assigning it to the ebaCallback instances httpObj.onreadystatechange
    // This creates a closure (This is circular reference)
    //
    this.httpObj.onreadystatechange = function() {
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

      if (This.httpObj.readyState == 4) {
        try {
          // if null then assume fire and forget
          if (null != This.onPostComplete) {
            This.onPostComplete.call(This.context, This.handleResponse(), This.params);
          }
        } catch(e) {
          throw e;
        } finally {
          Target = null;
          This = null;
        }
      }
    };

    this.httpObj.setRequestHeader("Content-Type", "text/xml");
    this.httpObj.send(data);
  },
/// <function name="post" access="public">
/// <summary>This does various assertions on XMLData then calls postData</summary>
/// <remarks>If xmlData is has no valid child nodes the just return</remarks>
/// </function>
  post: function(xmlData, target) {
    // Eba.Error.assert((xmlData != null), "xmlData to be sent can not be null.");
    // validate the XML data parameter
    if (("undefined" == typeof(xmlData.documentElement)) || (null == xmlData.documentElement)
      || ("undefined" == typeof(xmlData.documentElement.childNodes)) || (1 > xmlData.documentElement.childNodes.length)) {
      ebaErrorReport("updategram is empty. No request sent. xmlData[" + xmlData
        + "]\nxmlData.xml[" + xmlData.xml + "]");
      // not sure that return is best here.
      return;
    }

    //  get data from xml (null == xmlData.xml)
    if (null == xmlData.xml) {
      // looks like we are not running IE
      // lets try to get xml data
      var xmlSerializer = new XMLSerializer();
      xmlData.xml = xmlSerializer.serializeToString(xmlData);
    }
    this.postData(xmlData.xml, target);
  },
  get: function() {
    return this.getData();
  },
  getData: function() {
    var url = (this.handler.indexOf("?") == -1 ? "?" : "");
    url = (this.handler.substr(this.handler.length - 1) != "&" && (url != "?") ? "&" : url);
    url += "cacheBuster=" + (new Date()).getTime();
    try {
      this.httpObj.open("GET", this.handler + url, this.asynchronous, "", "");
    } catch(e) {
/*      // Eba.Error.assert(("Error: The update had failed, uncaught exception: Permission denied to call method XMLHttpRequest.open"
        != e), "Please ensure your handler has same domain and port number as the target HTML page.  Exception Details ["
        + e, Eba.Error.ERROR);*/
      //throw(e);
      return;
    }
    // this may be a memory leak
    var This = this;
    // Creating a inner function and assigning it to the ebaCallback instances httpObj.onreadystatechange
    // This creates a closure (This is circular reference)
    //
    this.httpObj.onreadystatechange = function() {
      if (This.httpObj.readyState == 4) {
        // if null then assume fire and forget
        if (null != This.onGetComplete) {
          This.onGetComplete.call(This.context, This.handleResponse(), This.params);
        }
      }
    };

    this.httpObj.setRequestHeader("Content-Type", "text/xml");
    this.httpObj.send(null);
    if (!this.asynchronous) {
      return this.httpObj.responseXML;
    }
  }
}// end of class


Eba.CallbackPool = Class.create();
Eba.CallbackPool.prototype = {

  initialize: function(maxObjects) {
    this.inUse = new Array();
    this.free = new Array();
    this.max = maxObjects || Eba.CallbackPool_MAXCONNECTIONS;
    this.locked = false;
    this.context = null;
  },
// Reserves an HttpObject for use by the caller
  reserve: function() {
    // A blocking lock for thread safety
    //	TODO: This should be changed into a callback to prevent user interface locking ...
    //		while (this.locked) {}

    this.locked = true;

    var reservedObj;

    if (this.free.length) {
      reservedObj = this.free.pop();
      this.inUse.push(reservedObj);
    } else if (this.inUse.length < this.max) {
      try {
        reservedObj = new Eba.Callback();
      } catch(e) {
        reservedObj = null;
      }

      this.inUse.push(reservedObj);
    } else {
      // Eba.Error.assert(false, "Too many concurrent Callback objects", "", Eba.Error.THROW);
    }

    this.locked = false;
    // Eba.Error.assert(this.inUse.length > 0, "inUse > 0");
    return reservedObj;
  },
  release: function(resource) {

    // Eba.Error.assert(resource != null, "resource == null");
    // Eba.Error.assert(this.inUse.length > 0, "None in use");

    var found = false;
    // A blocking lock for thread safety - necessary in javascript?
    while (this.locked) {
    }
    this.locked = true;
    if (null != resource) {
      for (var i = 0; i < this.inUse.length; i++) {
        if (resource == this.inUse[i]) {
          // Ensure that onGetComplete doesn't get
          // inadvertently called for the next call.
          resource.onGetComplete = null;
          resource.context = null;
          resource.params = null;
          this.free.push(this.inUse[i]);
          this.inUse.splice(i, 1);
          found = true;
          break;
        }
      }
    }
    this.locked = false;

    // Eba.Error.assert(found, "Tried to release an unreserved resource", Eba.Error.THROW);

    return null;
  }
};

Eba.gCallbackPool = new Eba.CallbackPool(100);