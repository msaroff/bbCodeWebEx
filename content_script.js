(function(global) {

    const {
        readFromClipboard,
    } = global.es6lib_dom

    var clickedElement = null;

    document.addEventListener("mousedown", function(event) {
        //right click
        if (event.button == 2) {
            clickedElement = event.target;
        }
    }, true);

    browser.runtime.onMessage.addListener(function(commandString, sendResponse) {
        CommandParse(commandString);
//        getColor();
    });


function removeElement(id) { //generic remove element by ID function
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

// check out code from NilkasGNiklas Gollenstede

function clickElement(element) {
	const evt = document.createEvent('MouseEvents');
	evt.initEvent('click', true, true);
	element.dispatchEvent(evt);
	return element;
}

function pickColor() { return new Promise(resolve => {
	const input = document.createElement('input'); input.type = 'color';
console.log("input "+input);
	input.addEventListener('change', () => resolve(input.value));
	clickElement.call(window, input);
}); }
/*
someElement.onclick = async () => {
	const color = (await pickColor());
	console.log(color);
}; */

//end of code from NilkasGNiklas Gollenstede


/*
Popup has the format of {{zzppopup,title,unique text string to change,text before, text after}}
text before and text after omitted if empty answer given. (use double quotes"" if not used)
Use unique text so that we can set order of dialogue boxes independent of the order of 
Argument.

So, quote paste is: {{zzpopup,i18n.INS_AUTHOR,zzzquote,=","}}][quote]zzquote{{clipboard}}][/quote]
This will give [quote]CLIPBOARD[/QUOTE] if no author given and [quote="AUTHOR"] CLIPBOARD[/QUOTE]
if author given.
and url wizard is 
{{zzpopup,i18n.URLCOMPOSTO_STEP1,zzTitle,"",""}}{{zzpopup,i18n.URLCOMPOSTO_STEP2,zzURL,"",""}}[url=zzURL]zzTitle[/url]
It will prompt for title, and then for url, and the result will be
[url=URL]TITLE[/url]
This will generate as many popup dialogues as you would want.
*/
    function popThisUp(popArg) {
        popStartIdx = popArg.indexOf("{{zzpopup"); // start of popup argument in commend string
        popEndIdx = popArg.indexOf("}}", popStartIdx) + 2; // end of popup argument in command string
        popWork = popArg.substring(popStartIdx, popEndIdx); // extract the portion of the argument that has to do with making the popup
console.log(popWork);
        popWork = popWork.substring(10, popWork.length - 2); //remove the "{{zzpopup," from the beginning of  argument, and "}}" from the end.
        popTitle = popWork.substring(0, popWork.indexOf(",")); // popup title, possibly including i18n localization tag
console.log(popTitle);
            if (popTitle.includes("i18n")) { //if there is a localization tag
                popTitle = browser.i18n.getMessage(popTitle.substring(5));  // replace with i18n value
console.log(popTitle);
            }
        popWork = popWork.substring(popWork.indexOf(",") + 1) //drop title from popwork
        popupBefore = popWork.substring(0, popWork.indexOf(",")) //text to be added before entered text
        popupAfter = popWork.substring(popWork.lastIndexOf(",")) //text to be added before entered text
        let popupResp = prompt(popTitle);
        if (popupResp === null || popupResp === "") { // if the prompt is left blank, produce empty response
            popupResp = "";
            popupBefore = "";
            popupAfter = "";
        }
        popArg = popArg.substring(0, popStartIdx) + popupBefore + popupResp + popupAfter + popArg.substring(popEndIdx); 
//add in whatever you got from         the dialog box
        return popArg;
    }

    /*
    List has the format of {{makeList,thing to make into list,type of list}}
    */
    function listMake (listArg) {
        let listStartIdx = listArg.indexOf("{{makeList"); // start of list argument in commend string
        let listEndIdx = listArg.indexOf("}}", listStartIdx); // end of list argument in command string
        let listWork = listArg.substring(listStartIdx, listEndIdx);; // extract the portion of the argument that has to do with making the list
        listWork = listWork.substring(10, listWork.length -1 ); //remove the "{{makeList," from the beginning of the argument, and the "}}" from the end.
        let listType = listWork.substring(listWork.lastIndexOf(",") +2, (listWork.length)) // the type of list is after the last comma
        let listWhat = listWork.substring(0, listWork.lastIndexOf(",")) // the text to which the list would be attached
        let listResult = createList(listWhat, listType); //return the properly formatted list to put into the list argument
        return listArg.substring(0, listStartIdx) + listResult + listArg.substring(listEndIdx +2); //send the parsed list in the back
    }


    async function CommandParse(argString) {
        //       Get Info About Textbox
        // check out document.activeElement
        var selectedTextArea = document.activeElement;
        let TextBoxName = clickedElement.getAttribute('name');
        // some text boxes do not have an id assigned, but they do have a name assigned, if so, use the name
        if (clickedElement.getAttribute('id') == null || clickedElement.getAttribute('id') == "") {
            TextBoxID = TextBoxName;
        } else {
            TextBoxID = clickedElement.getAttribute('id');
        }
        let FocusInfo = document.activeElement;
        let txtcont = document.getElementById(TextBoxID).value; //contents of edit box
        let selstart = clickedElement.selectionStart; // index of selectin start
        let selend = clickedElement.selectionEnd; //index of selection end
        let selcont = txtcont.substring(selstart, selend); // selected text content
        let firsttext = txtcont.substring(0, selstart); //stuff before the selection
        let lasttext = txtcont.substring(selend); // stuff after the selection
        if (argString.includes("{{clipboard}}")) { // Replace clipboard tag with clipboard contents
            const clipcont = await readFromClipboard('text/plain');
            argString = argString.replace(/{{clipboard}}/g, clipcont);
//console.log(argString);
        }
        if (argString.includes("{{selection}}")) { // Replace selection tag with selection value 
            argString = argString.replace(/{{selection}}/g, selcont);
        }
        if (argString.includes("{{zzpopup")) { // Invoke popup query function
            argString = popThisUp(argString);
        }
        if (argString.includes("{{makeList")) { // Invoke list creation function
console.log(argString);
            argString = listMake(argString);
        }
        if (argString.includes("fontzcol")) { // Invoke font color wheel
//            argString = await getColor(argString);
            argString = getColor(argString);
              
        }



        clickedElement.value = firsttext + argString + lasttext;

    }

})(this);

/* this is pretty much a copy of the function from bbCodeXtra by flod (Francesco Lodolo)
which is under an MIT free and open-source software (FOSS) license.
*/

function createList(originalText, listType) {
console.log("createList running");
    var startBlock, endBlock, startItem, endItem, formattedText;

    // Make sure only \n is used as line ending
    originalText = originalText.replace(/[\r|\n|\r\n]/g, '\n');
    // Split lines based on \n
    lines = originalText.split('\n');
    // Ignore empty lines
    lines = lines.filter(function(n) {
        return n !== '';
    });
console.log(listType);
    switch (listType) {
        case 'bbcode':
console.log("bbcode tripped");
            startBlock = '[list]\n';
            startItem = '[*]';
            endItem = '\n';
            endBlock = '[/list]';
            break;
        case 'bbcodeord':
            startBlock = '[list=1]\n';
            startItem = '[*]';
            endItem = '\n';
            endBlock = '[/list]';
            break;
        case 'bbcodeordalf':
            startBlock = '[list=a]\n';
            startItem = '[*]';
            endItem = '\n';
            endBlock = '[/list]';
            break;
        case 'html':
            startBlock = '<ul>\n';
            startItem = '<li>';
            endItem = '</li>\n';
            endBlock = '</ul>';
            break;
        case 'htmlord':
            startBlock = '<ol>\n';
            startItem = '<li>';
            endItem = '</li>\n';
            endBlock = '</ol>';
            break;
        case 'htmlordalf':
            startBlock = '<ol type=a>\n';
            startItem = '<li>';
            endItem = '</li>\n';
            endBlock = '</ol>';
            break;
        case 'markdown':
            startBlock = endBlock = '';
            startItem = '- ';
            endItem = '\n';
            break;
        case 'markdownord':
            startBlock = endBlock = '';
            startItem = '';
            endItem = '\n';
            break;
        default:
            startBlock = '';
            startItem = '';
            endItem = '\n';
            endBlock = '';
            break;
    }

    formattedText = startBlock;
    for (var i = 0; i < lines.length; i++) {
        if (listType == 'markdownord') {
            var linenumber = i + 1;
            formattedText += linenumber + '. ' + lines[i] + endItem;
        } else {
            formattedText += startItem + lines[i] + endItem;
        }
    }
    formattedText += endBlock;
    return formattedText;
}

// Use document.activeElement, it is supported in all major browsers.
// https://stackoverflow.com/questions/497094/how-do-i-find-out-which-dom-element-has-the-focus