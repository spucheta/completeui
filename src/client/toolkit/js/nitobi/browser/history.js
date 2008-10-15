/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.browser");

/**
 * Creates a History object with which you can maintain back button support in your ajax application.
 * @class History is used to fix the back button in the web browser.
 * Current support is only for IE and MOZ browsers.
 * @constructor
 */
nitobi.browser.History = function()
{
	/**
	 * @private
	 */
	this.lastPage = "";
	/**
	 * @private
	 */
	this.currentPage = "";
	/**
	 * Fired when the back or forward button is pressed by the user.
	 * @type nitobi.base.Event
	 */
	this.onChange = new nitobi.base.Event();
	/**
	 * @private
	 */
	this.iframeObject = nitobi.html.createElement("iframe", {"name":"ntb_history","id":"ntb_history"}, {"display":"none"});

	document.body.appendChild(nitobi.xml.importNode(document, this.iframeObject, true));
	/**
	 * @private
	 */
	this.iframe = frames['ntb_history'];
	this.monitor();
}
/**
 * Adds a new URL to the back button history.
 * @param {String} path A URL with a "#" character that separates the web page from the fragment.
 * Either part (page name or fragment) can be used to retrieve the state.
 */
nitobi.browser.History.prototype.add = function(path)
{
	this.lastPage = this.currentPage = path.substr(path.indexOf("#")+1);
	this.iframe.location.href = path;
}
/**
 * Monitors the hidden IFRAME watching for changes to the location. When the location changes due to the
 * user pressing the back or forward buttons the OnChange event is fired.
 * @private
 */
nitobi.browser.History.prototype.monitor = function()
{
	var alocation = this.iframe.location.href.split("#");
	this.currentPage = alocation[1];
	if (this.currentPage != this.lastPage)
	{
		this.onChange.notify(alocation[0].substring(alocation[0].lastIndexOf("/")+1), this.currentPage);
		this.lastPage = this.currentPage;
	}
	window.setTimeout(nitobi.lang.close(this, this.monitor), 1500);
}
