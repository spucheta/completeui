if (typeof(Qr) == "undefined") {
  Qr = {};
}
/**
 * The YAHOO tree ajaxed. Documentation is pending dep
 */
Qr.Tree = function(rootLabel, hostTagId, multiExpand, getHandlerUrl, xslUrl, root,onClick, context, isMultiSelect, onCheck) {
  this.tree = new YAHOO.widget.TreeView(hostTagId);
  this.hostTagId = hostTagId;
  this.getHandlerUrl = getHandlerUrl;
  var tmpNode = null;

  tmpNode = new YAHOO.widget.TextNode(rootLabel, this.tree.getRoot(), true);

  tmpNode.data = root;
  tmpNode.multiExpand = multiExpand;
  this.baseNode = tmpNode;
  var _this = this;
  tmpNode.setDynamicLoad(function(node, onCompleteCallback) {
    _this.onNodeRequest(node, onCompleteCallback)
  })
  tmpNode.qrOnClick = function(nodeId) {
    _this.onClickEvent(nodeId)
  };
//debugger;
  var treeXslDoc = declarationTranslatorXsl = Eba.Xml.createXslDoc();
  treeXslDoc.async = false;
  treeXslDoc.load(xslUrl);
  this.treeXslProc = Eba.Xml.createXslProcessor(treeXslDoc);
  this.context = context;
  this.onClick = onClick;
  this.onCheck = onCheck;
};

Qr.Tree.prototype.getBaseNode = function() {
  return this.baseNode;
};

Qr.Tree.prototype.onClickEvent = function(nodeId) {
  this.onClick.call(this.context, nodeId);
};

Qr.Tree.prototype.render = function() {
  this.tree.draw();
};

Qr.Tree.prototype.onNodeRequest = function(node, onCompleteCallback) {
	//.debugger;
  var url = this.getHandlerUrl;
  url += (url.indexOf("?") == -1 ? "?" : "");
  url += (url[url.length - 1] != "?" && url[url.length - 1] != "&" ? "" : "") + "parentNodeId=" + node.data;
  var callback = Eba.gCallbackPool.reserve();
  callback.handler = url;
  callback.asynchronous = true;
  callback.onGetComplete = this.renderNode;
  callback.context = this;
  callback.params = new Array(callback, node, url, onCompleteCallback);
  //callback.get();

  var nodes = Eba.Xml.createXmlDoc();
  nodes.async = false;
  nodes.load(url);
  this.renderNode(nodes,callback.params);
  
};

Qr.Tree.prototype.renderNode = function(data, params) {
//	debugger;
  var tmpNode;
  var xmlDoc = data;
  var node = params[1];
  var onCompleteCallback = params[3];
  //Eba.Error.assert(xmlDoc != null && xmlDoc.documentElement != null, "Tree couldn't load the XML from the url: "
   // + params[2]);
  this.treeXslProc.addParameter("tree-name", this.hostTagId, "");
  this.treeXslProc.addParameter("tree-id", this.getBaseNode().index, "");
  var code = Eba.Xml.transformToString(xmlDoc, this.treeXslProc, "text");
  eval(code);
};
