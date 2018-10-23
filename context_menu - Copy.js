

function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item created successfully");
    }
}

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "insert-bbCodeBold":
            browser.tabs.sendMessage(tab.id,{runwhat: "zzBBCode", ParseArg: "[b]{{selection}}[/b]"});
        break;
        case "test_clipboard":
            browser.tabs.sendMessage(tab.id,{ParseArg: "[b]{{selection}}[/b]"});
        break;
        case "insert-bbCodeUrlSelect":
            browser.tabs.sendMessage(tab.id, "zzBBCode");
        break;
    }
});


//Create context menu.

browser.menus.create({
            id: "test_clipboard",
            title: "Quick Clipboard",
            contexts: ["all"]
        }, onCreated);



function onError(error) {
    console.log(`Error: ${error}`);
}

function logStorageChange(e) {
    toggleContextMenu(e.context_menu.newValue);
}

browser.storage.onChanged.addListener(logStorageChange);


//Editor1.execCommand("Paste", "TextWithLineBreak", "style1", "Paste Text");

function ZZgetClipboard() {
    var pasteTarget = document.createElement("div");
    pasteTarget.contentEditable = true;
    var actElem = document.activeElement.appendChild(pasteTarget).parentNode;
    pasteTarget.focus();
    document.execCommand("Paste", null, null);
    var paste = pasteTarget.innerText;
console.log(paste);
    actElem.removeChild(pasteTarget);
    return paste;
};