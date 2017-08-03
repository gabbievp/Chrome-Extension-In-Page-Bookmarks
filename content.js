var selections = [];

function createRange(startOffset, endOffset, startNodeData, endNodeData, 
		startParentTag, endParentTag, startParentHTML, endParentHTML) {
	//find start node
	var startParentList = document.getElementsByTagName(startParentTag);
	var startParent = null;

	for (var i = 0; i < startParentList.length; i++) {
		if (startParentList.item(i).innerHTML == startParentHTML)
			startParent = startParentList.item(i);
	}

	var startNodeList = startParent.childNodes;
	var startNode = null;

	for (var i = 0; i < startNodeList.length; i++) {
		if (startNodeList.item(i).data == startNodeData)
			startNode = startNodeList.item(i);
	}

	//find end node
	var endParentList = document.getElementsByTagName(endParentTag);
	var endParent = null;

	for (var i = 0; i < endParentList.length; i++) {
		if (endParentList.item(i).innerHTML == endParentHTML)
			endParent = endParentList.item(i);
	}

	var endNodeList = endParent.childNodes;
	var endNode = null;

	for (var i = 0; i < endNodeList.length; i++) {
		if (endNodeList.item(i).data == endNodeData)
			endNode = endNodeList.item(i);
	}

	//create new range object

	var range = document.createRange();
	range.setStart(startNode, startOffset);
	range.setEnd(endNode, endOffset);

	return range;
}

function goToBookmark(id) {
	document.getElementById(id).click();
}


function storeRange(range, count) {
	var selectionProperties = [];
    selectionProperties[0] = range.startOffset;
    selectionProperties[1] = range.endOffset;
    selectionProperties[2] = range.startContainer.data;
    selectionProperties[3] = range.endContainer.data;
    selectionProperties[4] = range.startContainer.parentElement.tagName;
    selectionProperties[5] = range.endContainer.parentElement.tagName;
    selectionProperties[6] = range.startContainer.parentElement.innerHTML;
    selectionProperties[7] = range.endContainer.parentElement.innerHTML;
    selections[count] = selectionProperties;
    chrome.storage.sync.set({selections: selections}, function() {});
}

function wrapSelectedText(range) {      
	console.log(range); 
    var span = document.createElement("span");
    var anchor = document.createElement("a");
    span.style.display = "inline";
    span.style.backgroundColor = "lightblue";
    var id = range.startOffset + "" + range.endOffset;
    span.id = id;
    anchor.href = "#" + id;
    var id2 = range.startOffset + "" + range.endOffset + "" + range.startContainer.data;
    anchor.id =  id2;
    //anchor.innerText = "hey";
    var selectedText = range.extractContents();
    span.appendChild(selectedText);
    range.insertNode(span);
    document.body.appendChild(anchor);
    //window.scrollTo(0,document.body.scrollHeight);
    //goToBookmark(id2);
}

function reloadBookmarks() {
	chrome.storage.sync.get("selections", function(item) {
		if (item.selections !== undefined) {
		for (var i = 1; i < item.selections.length; i++) {
		    /*var newRange = createRange(range.startOffset, range.endOffset, range.startContainer.data, 
		    	range.endContainer.data, range.startContainer.parentElement.tagName, range.endContainer.parentElement.tagName,
		    	range.startContainer.parentElement.innerHTML, range.endContainer.parentElement.innerHTML); */
		    var newRange = createRange((item.selections[i])[0], (item.selections[i])[1], (item.selections[i])[2], (item.selections[i])[3], 
		    		(item.selections[i])[4], (item.selections[i])[5], (item.selections[i])[6], (item.selections[i])[7]);
		    var newSelection = window.getSelection();
		    newSelection.removeAllRanges();
		    newSelection.addRange(newRange);
		    wrapSelectedText(newRange);
		}
	}
	});
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.from === "Background" && msg.subject === "Add a Bookmark") {
	var bookmarkName = prompt("Please enter name of this bookmark", msg.selectedText);
	var range = window.getSelection().getRangeAt(0);
    storeRange(range, msg.count);
	wrapSelectedText(range, msg.count);
    sendResponse(bookmarkName);
	}
	else if (msg.from === "Background" && msg.subject === "Reload this page") {
		reloadBookmarks();
	}
});