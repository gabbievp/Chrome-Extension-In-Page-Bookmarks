chrome.storage.sync.clear();
chrome.contextMenus.create({
	id: "addInPageBookmark",
	title: "Add In-Page Bookmark",
	contexts: ["all"]
});

var count = 0;
var bookmark = [];
chrome.contextMenus.onClicked.addListener(function(info, tabs) {
		var selectedText = info.selectionText;
		count++;
		chrome.tabs.sendMessage(
			tabs.id,
			{from: "Background",
			subject: "Add a Bookmark",
			selectedText: selectedText,
			count: count},
			function(bookmarkName) {
				bookmark[count] = bookmarkName;
				chrome.storage.sync.set({bookmarkArray: bookmark}, function() {});
		});
});

chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {file: "popup.js"});
});

chrome.webNavigation.onCompleted.addListener(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true }, function (tabs) {
	    chrome.tabs.sendMessage(
	        tabs[0].id,
	        {from: "Background", 
	        subject: "Reload this page"},
	        function() {});
	  	});
});