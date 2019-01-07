function onCreated() {
    if (browser.runtime.lastError) {
        console.log('Error: ${browser.runtime.lastError}');
    } else {
        console.log("Item created successfully");
    }
}

// Create listener to update the menus when they are changed in the settings pages
browser.storage.onChanged.addListener(invokeDefaultMenus);

// when you are changing menus in settings, first remove the existing menus before regenerating the menu
//	var removing = browser.menus.removeAll();


//read the custom menus from local storage:
customMenus = JSON.parse(localStorage.getItem('customMenus'));

const defMenuURL = browser.runtime.getURL('data/DefMenu.json'); // location of default menu storage

const custMenuURL = browser.runtime.getURL('data/customMenuTest.json'); //location of initial tutorial custom menu

const initialize = async () => {
// load the default menu settings in JSONn and save to local storage
    localStorage.setItem('defaultMenu',await fetch(defMenuURL));
//check if custom menus are in local storage, if no, load local JSON and save to local storage
if (localStorage.getItem('customMenus') == null){
    localStorage.setItem('customMenus',await fetch(custMenuURL));
// set the falue to the defaults, or the saved value if it exists
if (localStorage.getItem("activeMenus") === null) { //if menu settings not stored, 
    activeMenus = {
        enablebbCode: true,
        enableHTML: true,
        enableVbulletin: true,
        enableXHTML: true,
        enableMarkDown: true,
        enableCustom: true,
        enableSymbol: false
    };
    localStorage.setItem('activeMenus',JSON.stringify(defaultMenus)); //store default in local storage
    } else {
    activeMenus = JSON.parse(localStorage.getItem('activeMenus')); // load activemenus
}
generateMenu();
}

initialize();

browser.storage.onChanged.addListener(generateMenu);