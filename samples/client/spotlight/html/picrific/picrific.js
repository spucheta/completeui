function switchPhotoStreamState() {
	var myC = nitobi.html.getCoords($('photoStreamBox'));

	myOv = $('photosOverlay').style;	
	if ((myOv.display == '') || (myOv.display == 'none')) {
		myOv.display = 'block';	
	
		myOv.top = (myC.y+6) + 'px';
		myOv.left = (11+myC.x) + 'px';
	} else {
		myOv.display = 'none';	
	
		myOv.top = '0px';
		myOv.left = '0px';
		
	}
	
}

var tagsData = Array("vancouver","forest","hiking","machinery");


function drawTags() {
	var myC = nitobi.html.getCoords($('tagstitle'));

	myOv = $('tags').style;	

	myOv.display = 'block';	

	myOv.top = (myC.y+175) + 'px';
	myOv.left = (18+myC.x) + 'px';

	var innerContents = '';
	var count = 0;
	for (var i in tagsData) {
		innerContents += '<img src=images/globe.gif align=absmiddle> ' + tagsData[i] + ' <font color="#CCCCCC"><a href="#" id="deli' + count + '" onclick="delTag(' + count + ');" class=killItem>[x]</a></font><br>';
		count++;
	}
	$('tags').innerHTML = innerContents;
	
	drawAddTag();
}

function drawAddTag() {
	var myC = nitobi.html.getCoords($('tags'));

	myOv = $('addTag').style;	
	myOv.display = 'block';	

	myOv.top = (myC.y+$('tags').offsetHeight+10) + 'px';
	myOv.left = (myC.x) + 'px';

}

function addTag(tagname) {
	if (tagname.length > 0) {
	tagsData.length +=1;
	tagsData[tagsData.length-1] = tagname;
	drawTags();
	document.forms['addTagForm']['addTagField'].value = '';
	}

}

function delTag(tagNum){
	tagsData.splice(tagNum,1);
	drawTags();
	
}

function makeEditable(itemID, blowContentsAway){
	var g = $(itemID);
	g.onmousedown = function() {editItem(g, blowContentsAway)}
	
}

function makeGrowEditable(itemID){
	var g = $(itemID);
	g.onmousedown = function() {editItem(this, true)}
	
}

function editItem(obj, blowContentsAway) {
	
	obj.onmousedown = function() {}
	var s = obj.style;
	var itemContents = obj.innerHTML;
	obj.innerHTML = '';
	var c = nitobi.html.getCoords(obj);
	var me = nitobi.html.createElement('input', {"name":"field_" + obj.id, "id":"field_" + obj.id, "class":obj.className}, {"position":"absolute","top":c.y + "px","left":c.x + "px","height":obj.offsetHeight + "px","width":obj.offsetWidth + "px",  "color":"#000000", "margin":"0px", "border":"2px inset"});
	obj.parentNode.appendChild(me);
	me.onblur = function() {}
	me.value = itemContents;
	me.select();
	me.focus();
	me.select();
	setTimeout(function() {me.select();me.focus();me.onblur = function() {blurItem(me, blowContentsAway, obj)}}, 100);

	if (blowContentsAway) {
		
		var myNewHeight = parseInt((me.style.height.replace('px', '')))*2 + 'px';
		me.style.height = myNewHeight;
		me.style.backgroundColor = '#ffffff';
		me.value = '';
		//console.log(me.style.height);
	}
	return false;
	
}

function blurItem(obj, blowContentsAway, parentObj) {
	
	obj.onmousedown = function() {}
	var s = obj.style;
	var itemContents = obj.value;
	parentObj.innerHTML = itemContents;
	makeEditable(parentObj.id, blowContentsAway);

	obj.parentNode.removeChild(obj);
	
	if (blowContentsAway) {
		
	}
	return false;
	
}

function setupPage() {
	drawTags(); 
	makeEditable('titleBox');
	makeEditable('descBox');
	makeEditable('commentsBox', true);
	
}