
const initialize = async () => {
// load the default menu settings in JSONn and save to local storage
     localStorage.setItem('defaultMenu',await fetch(defMenuURL));
//check if custom menus are in local storage, if no, load local JSON and save to local storage
if (localStorage.getItem('customMenus') == null){
    localStorage.setItem('defaultMenu',await fetch(custMenuURL));
}
generateMenu();
browser.storage.onChanged.addListener(invokeDefaultMenus);
}

initialize();
