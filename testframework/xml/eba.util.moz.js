if (document.implementation.createDocument)
{
	HTMLElement.prototype.getBoundingClientRect = function() 
	{
		var td = document.getBoxObjectFor(this);
		return {top: td.y, left: td.x, bottom: (td.y + td.height), right: (td.x + td.width)};
	}

	//TODO: Do we need to take into account scrolling here?
	HTMLElement.prototype.getClientRects = function(sc) 
	{
		sc = sc || 0;
		var td = document.getBoxObjectFor(this);
		return new Array({top: (td.y - sc), left: td.x, bottom: (td.y + td.height - sc), right: (td.x + td.width)});
	}

	HTMLElement.prototype.insertAdjacentElement = function(pos,node)
	{
		switch (pos)
		{
			case "beforeBegin":
				this.parentNode.insertBefore(node,this)
				break;
			case "afterBegin":
				this.insertBefore(node,this.firstChild);
				break;
			case "beforeEnd":
				this.appendChild(node);
				break;
			case "afterEnd":
				if (this.nextSibling)
					this.parentNode.insertBefore(node,this.nextSibling);
				else
					this.parentNode.appendChild(node);
				break;
		}
	}

	HTMLElement.prototype.insertAdjacentHTML = function(pos,s)
	{
		var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var node = r.createContextualFragment(s);
		this.insertAdjacentElement(pos,node)
	}

	HTMLElement.prototype.insertAdjacentText = function(pos,s)
	{
		var node = document.createTextNode(s)
		this.insertAdjacentElement(pos,node)
	}
}