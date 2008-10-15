/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.data");
/**
 * This class provides information about the size and nature of the 
 * datasource. It does not provide any data.  It's single purpose is
 * to perform reflection on the table datasource.
 * @param {Boolean} estimateRowCount If true, the descriptor will try to leap ahead to find the end of the table.
 */
nitobi.data.DataTableDescriptor = function(table, tableProjectionUpdatedEvent, estimateRowCount)
{
	/**
	 * Items that are destroyed when this object is destroyed.
	 * @private
	 */
	this.disposal = [];
	
	/**
	 * The number of rows thought to be in the database. 
	 * This is equal to, or larger than, the last known row.
	 * @private
	 */
	this.estimatedRowCount=0;
	/**
	 * The amount by which the projected database size is adjusted.
	 * @private
	 */
	this.leapMultiplier=2;
	/**
	 * If true, the descriptor will try to leap ahead to find the end of the table.
	 */
	this.estimateRowCount = (estimateRowCount == null ? true : estimateRowCount);
	/**
	 * The index of the greatest last known row in the db.
	 * @private
	 */
	this.lastKnownRow=0;
	/**
	 * Indicates whether or not the end of table is known.
	 * @private
	 */
	this.isAtEndOfTable = false;
	
	/**
	 * The table that this descriptor describes.
	 * @private
	 */
	this.table = table;
	
	/**
	 * The Edge of (un)known space. This will be set if you do a leap and no results are returned
	 * then the lowestEmptyRow becomes the lowest index of that get request.
	 * @private
	 */
	this.lowestEmptyRow = 0;
	
	/**
	 * Fires when the descriptor finds new information
	 * about the datasource and updates its knowledge.
	 */ /* How does closelater and context work here?*/
	this.tableProjectionUpdatedEvent = tableProjectionUpdatedEvent;
	this.disposal.push(this.tableProjectionUpdatedEvent);
}


/*************************************************************/
/*				           PEEK MODE     					 */
/*************************************************************/

/**
 * Starts the peek process whereby the descriptor asks for a single
 * record farther into the table in an attempt to find the end of the
 * table.
 * Peek actually uses DataTable.get to do its thing and so update
 * on the Descriptor is called from DataTable which will stop the peek
 * action (see update logic).
 */
nitobi.data.DataTableDescriptor.prototype.startPeek = function()
{
	this.enablePeek = true;
	this.peek();
}

nitobi.data.DataTableDescriptor.prototype.peek = function()
{
	var indexToPeekAt;
	if (this.lowestEmptyRow > 0)
	{
		var blankRows = this.lowestEmptyRow - this.lastKnownRow;
		// Peek at the halfway point between the lastKnownRow and the last row we peeked at unsuccessfully
		indexToPeekAt = this.lastKnownRow + Math.round(blankRows/2);
	}
	else
	{
		// If this is the first time we are peeking (ie lowestEmptyRow is 0)
		// then increase the peek position to some estimated amount
		indexToPeekAt = (this.estimatedRowCount * this.leapMultiplier);
	}
	// Do a get through the datatable at the peek index for a single row
	this.table.get(Math.round(indexToPeekAt), 1, this, this.peekComplete);
	//alert(this.startPeek);

	// IF we got any response then increase the last known good row to the xi we looked for
/*	if (evtArgs.startXi == this.lastKnownRow)
	{
		this.isAtEndOfTable = true;
		this.fireProjectionUpdatedEvent();
		return;
	}
	if (evtArgs.pageSize == 1)
	{
		// +1 to get the number of rows from the final row index
		this.estimatedRowCount = Math.max(evtArgs.startXi+1,this.estimatedRowCount);
		// -1 to get the row index from the length
		this.lastKnownRow = this.estimatedRowCount-1;
		this.fireProjectionUpdatedEvent();
	}
	else 
	{
		this.leapMultiplier = 1 + ((this.leapMultiplier - 1 )/2);
	}*/
	
}

nitobi.data.DataTableDescriptor.prototype.peekComplete = function(evtArgs)
{
	if (this.enablePeek)
	{
		window.setTimeout(nitobi.lang.close(this,this.peek),1000);
	}
}
/**
 * Stops the peek process.
 */
nitobi.data.DataTableDescriptor.prototype.stopPeek = function()
{
	this.enablePeek = false;
}

/*************************************************************/
/*				           LEAP MODE	 		     		 */
/*************************************************************/

/**
 * Recomputes the estimated row count based on a multiplier and an offset.
 * @param {Number} multiplier A number by which to multiply the estimated row count.
 * @param {Number} adjustment A number by which to increase the estimated row count.
 */
nitobi.data.DataTableDescriptor.prototype.leap = function(multiplier,adjustment)
{
	if (this.lowestEmptyRow > 0)
	{
		var blankRows = this.lowestEmptyRow - this.lastKnownRow;
		this.estimatedRowCount = this.lastKnownRow + Math.round(blankRows/2);
	}
	else if (multiplier == null || adjustment == null)
	{
		this.estimatedRowCount = 0;
	}
	else if (this.estimateRowCount)
	{
		this.estimatedRowCount = (this.estimatedRowCount * multiplier) + adjustment;
	}

//	window.status+="["+this.estimatedRowCount+"]";
//	alert("LEAP ERC: " + this.estimatedRowCount);
	this.fireProjectionUpdatedEvent();	
}

/**
 * Updates the descriptor's knowledge about the table.
 * @param {nitobi.components.grid.OnGetCompleteEventArgs} evtArgs A hash consisting of a lastPage boolean, pageSize, firstRow, lastRow, and startXi.
 * @param {Boolean} needLeap A boolean that can be used to force the estimated row count to be adjusted.
 */

nitobi.data.DataTableDescriptor.prototype.update = function(evtArgs, needLeap)
{
	// There a few cases we can have here.
	// We need to check the eventArgs for the lastPage parameter and the numRowsReturned

//alert("update"+this.estimatedRowCount+" : "+evtArgs.pageSize)
	if (null == needLeap)
	{
		needLeap = false;
	}
	if (this.isAtEndOfTable && !needLeap)
	{
		return false;
	}

	// Check if the database is empty.
	var emptyDb = (evtArgs!=null && evtArgs.numRowsReturned == 0 && evtArgs.startXi == 0);

	// Check if the data returned doesnt match what we wanted - ie we got to the end of the data.
	// What about the case where the lastRow is == lastRowReturned and this IS the last row of data ... 
	var lastPage = (evtArgs!=null && evtArgs.lastRow != evtArgs.lastRowReturned); // || !this.estimateRowCount;

	if (null == evtArgs)
	{
		evtArgs = {lastPage:false,pageSize:1,firstRow:0, lastRow:0,startXi:0};
	}

	var foundLastPage = (emptyDb) || (lastPage) || (this.isAtEndOfTable) || ((this.lastKnownRow == this.estimatedRowCount -1) && (this.estimatedRowCount == this.lowestEmptyRow));

//	alert(this.lastKnownRow+":"+this.lowestEmptyRow+" - "+evtArgs.pageSize+" - "+foundLastPage+"PgSize:"+evtArgs.pageSize)
  	if (evtArgs.pageSize == 0 && !foundLastPage)
  	{
  		// We've let the user page into a completely empty area and 
  		// we don't know the last page.
		// Set the highest row we will ever try to get
		this.lowestEmptyRow = this.lowestEmptyRow > 0 ? Math.min(evtArgs.startXi, this.lowestEmptyRow) : evtArgs.startXi;
//		alert("LOWEST EMPTY ROW: " + this.lowestEmptyRow);

		this.leap();

/*		// Step back a small amount to see the page just loaded.
		this.leap(1,-1*blankRows/2);
		// From now on, we'll need to start leaping smaller so that
		// we don't expand the whitespace.
  		this.leapMultiplier = 1 + ((this.leapMultiplier - 1 )/2);*/
  		return true;
  	}

	// Does this codeneed to be moved here?
	/*if (!scrollAtTop && evtArgs.pageSize == 0 && this.owner.getPagingMode().toLowerCase() != "standard")
	{
		return
	}*/
//	this.lastKnownRow = Math.max(evtArgs.lastRow,this.lastKnownRow);
	this.lastKnownRow = Math.max(evtArgs.lastRowReturned, this.lastKnownRow);
//  	alert(("UPDATE is setting the last known row to: "+this.lastKnownRow))

  	if (foundLastPage && !needLeap)
	{
		if (evtArgs.lastRowReturned>=0) // ie we know the exact last row (we are not in no-mans-land)
		{
			this.estimatedRowCount = evtArgs.lastRowReturned+1;//evtArgs.startXi + evtArgs.pageSize;

			 // This is the first time that we've hit the end of the table.
			this.isAtEndOfTable = true;
		}
		else // ie we have either got no data or we way past the end of our data
		{
			if (emptyDb) // this.lastKnownRow < 0- ie we have never had nor will get any data
			{
				this.estimatedRowCount = 0;

				 // This is the first time that we've hit the end of the table.
				this.isAtEndOfTable = true;
			}
			else // ie we are in no-mans-land so back off a bit
			{
				this.estimatedRowCount = this.lastKnownRow + Math.ceil((evtArgs.lastRow-this.lastKnownRow)/2);
			}
		}

		// TODO: this needs to be merged with the setRowCountKnown stuff in DataTable.
		this.fireProjectionUpdatedEvent();
		this.stopPeek();
		return true;
	}

	if (!this.estimateRowCount)
	{
		this.estimatedRowCount = this.lastKnownRow+1;
	}
	if (this.estimatedRowCount==0)
	{
		// First page we've ever seen.
		// Estimate the remote row count to be the lastRow we received 
		// (plus 1 cause rows are zero based and rowCounts are 1 based) and double it.
		this.estimatedRowCount = (evtArgs.lastRow+1) * (this.estimateRowCount ? 2 : 1);
	}

	// Uses evtArgs.last+1 since it is a row index compared to a rowCount
  	if ((this.estimatedRowCount > (evtArgs.lastRow+1) && !needLeap) || !this.estimateRowCount)
  	{
  		// We got a page for which there is space.

  		return false;
  	}
	if (!this.isAtEndOfTable)
	{
		this.leap(this.leapMultiplier,0);
		return true;
	}
	return false;
}

/*************************************************************/
/*				           ALL MODES     					 */
/*************************************************************/

/**
 * Resets the descriptor back to its initial state. In this state,
 * the descriptor knows nothing about the table.
 */
nitobi.data.DataTableDescriptor.prototype.reset = function()
{
	this.estimatedRowCount=0;
	this.leapMultiplier=2;
	this.lastKnownRow=0;
	this.isAtEndOfTable = false;
	this.lowestEmptyRow = 0;
	this.fireProjectionUpdatedEvent();
}

nitobi.data.DataTableDescriptor.prototype.fireProjectionUpdatedEvent = function(evtArgs)
{
	if (this.tableProjectionUpdatedEvent != null)
	{
		this.tableProjectionUpdatedEvent(evtArgs);
	} 
}

/**
 * Javascript destructor
 * 
 * @private
 */
nitobi.data.DataTableDescriptor.prototype.dispose = function()
{
	nitobi.lang.dispose(this, this.disposal);
}
