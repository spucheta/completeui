if (typeof(Eba) == "undefined") {
  Eba = {};
}

if (typeof(Eba.Dom) == "undefined") {
  Eba.Dom = {};
}


Eba.Dom.getTop = function(elem) {
  return Number(elem.style.top.replace(/p.*/, ''));
}


Eba.Dom.getLeft = function(elem) {
  return Number(elem.style.left.replace(/p.*/, ''));
}

Eba.Dom.getUniqueId = function(elem) {
  if (elem.uniqueID) {
    return elem.uniqueID;
  } else {
    var t = (new Date()).getTime();
    // The element should remember the unique id since it is assigned once and based on time.
    elem.uniqueID = t;
    return t;
  }
}

Eba.Dom.getChildNodeById = function(elem, childId, deepSearch) {
  return Eba.Dom.getChildNodeByAttribute(elem, "id", childId, deepSearch);
}

Eba.Dom.getChildNodeByAttribute = function(elem, attName, attValue, deepSearch) {
  for (var i = 0; i < elem.childNodes.length; i++) {
    if (elem.nodeType != 3 && Boolean(elem.childNodes[i].getAttribute)) {
      if (elem.childNodes[i].getAttribute(attName) == attValue) {
        return elem.childNodes[i];
      } else {
        if (deepSearch) {
          var child = Eba.Dom.getChildNodeByAttribute(elem.childNodes[i], attName, attValue, deepSearch);
          if (child != null) return child;
        }
      }
    }
  }
  return null;
}

Eba.Dom.getParentNodeById = function(elem, parentId) {
  while (elem.parentNode != null) {
    if (elem.parentNode.getAttribute("id") == parentId) {
      return elem.parentNode;
    }
    elem = elem.parentNode;
  }
  return null;
}

try {
  Node.prototype.swapNode = function (node) {
    var nextSibling = this.nextSibling;
    var parentNode = this.parentNode;
    node.parentNode.replaceChild(this, node);
    parentNode.insertBefore(node, nextSibling);
  }
} catch (e) {
}