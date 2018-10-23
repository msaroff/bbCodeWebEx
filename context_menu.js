

function onCreated() {
    if (browser.runtime.lastError) {
        console.log('Error: ${browser.runtime.lastError}');
    } else {
        console.log("Item created successfully");
    }
}

/*
function invokeClick(zzarg){
console.log("Clicked on this: "+zzarg);
} */


const defMenuURL = chrome.runtime.getURL('data/DefMenu.json');

var defaultMenu = [];

fetch(defMenuURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(defaultMenu) {
        window.defMenu = defaultMenu; //create variable with global scope
        for (i = 0; i < defaultMenu.length; i++) {
            info = {
                id: defaultMenu[i].menuId,
                title: defaultMenu[i].menuTitle, //eventually this becomes an i18n call
                contexts: ["all"]
            };
            if (defaultMenu[i].icons != "") {
                info.icons = defaultMenu[i].icons;
            }
            if (defaultMenu[i].parentId != "") {
                info.parentId = defaultMenu[i].parentId;
            }
            //    if (defaultMenu[i].menuArg != "") {
            //        info.onclick = defaultMenu[i].menuArg;
            //info.onclick = defaultMenu[i].parentId;
            //    }
            browser.menus.create(
                info
            );
        }
    })

browser.menus.onClicked.addListener((info, tab, defaultMenu) => {
    if (info.menuItemId.substring(0, 6) == "bbcwbx") {
        console.log(info.menuItemId);
        for (i = 0; i < defMenu.length; i++) {
            if (info.menuItemId == defMenu[i].menuId) {
                var clickArg = defMenu[i].menuArg;
                console.log("Argument: " + clickArg);
                browser.tabs.sendMessage(tab.id, clickArg); // send argument to content script for execution
            }
        }
    }
});






