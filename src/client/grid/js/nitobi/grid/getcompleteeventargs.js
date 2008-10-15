nitobi.data.GetCompleteEventArgs = function(firstRow, lastRow, startXi, pageSize, ajaxCallback, dataTable, obj, callback, numRowsReturned)
	{
		//	This is the first row to be rendered by the RowRenderer
		this.firstRow = firstRow;
		//	This is the last row to be rendered by the RowRenderer
		this.lastRow = lastRow;
		//	This is the callback to be called once the data is all ready
		this.callback = callback;
		//	This is the datatable on which the get was requested
		this.dataSource = dataTable;
		//	This is the context (ie the object) of the callback method
		this.context = obj;
		//	This is the nitobi.ajax.HttpRequest object handling the request
		this.ajaxCallback = ajaxCallback;
		//	This is the xi of the first record that is returned such that we can integrate returned data that has no xi values
		this.startXi = startXi;
		this.pageSize = pageSize;
		/**
		 * True if the request page was the last page.
		 */
		this.lastPage=false;
		/**
		 * The number of rows returned by the get request.
		 */
		this.numRowsReturned = numRowsReturned;
		/**
		 * The lastRowReturned is updated by the DataTable when the data is returned if it is not the expected lastRow.
		 */
		 this.lastRowReturned = lastRow;
	}


nitobi.data.GetCompleteEventArgs.prototype.dispose = function()
{
	this.callback = null;
	this.context = null;
	this.dataSource = null;
  	this.ajaxCallback.clear();
	this.ajaxCallback == null;
}
