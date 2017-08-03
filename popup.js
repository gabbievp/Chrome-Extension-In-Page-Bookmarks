var ul = document.getElementById('parent-list');
var bookmarkNum = "bookmark";
chrome.storage.sync.get("bookmarkArray", function(item) {
  if (item.bookmarkArray !== undefined) {
    for (var i = 1; i < item.bookmarkArray.length; i++) {
      var anchor = document.createElement('a');
      anchor.href = "";
      var li = document.createElement('li');
      li.innerText = (item.bookmarkArray[i]);
      li.id = i;
      anchor.appendChild(li);
      ul.appendChild(anchor);
    }
  }
});


chrome.storage.sync.get(null, function(item) {
  console.log(item);
});


