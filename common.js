
const ElementLocaorType = {
    XPATH: "Xpath",
    Selector: "Selector"
}
const ElementOperateType = {
    Click: "Click",
    Input: "Input"
}
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
//获取元素集合
function getAllElementByXpath(xpath) {
    var xresult = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }
    return xnodes;
}

function getAllElementByClass(className) {
    var elements = document.getElementsByClassName(className);
    return Array.from(elements); // 将HTMLCollection转换为数组
}

function elementLocatorAwait(elementLocaorType, elementLocaorPath) {
    console.log("elementLocatorAwait by "+elementLocaorType +", "+elementLocaorPath);
    switch(elementLocaorType){
        case ElementLocaorType.XPATH:
            return new Promise(resolve => {

                if (document.evaluate(elementLocaorPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                    return resolve(document.evaluate(elementLocaorPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
                }

                const observer = new MutationObserver(mutations => {
                    if (document.evaluate(elementLocaorPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                        resolve(document.evaluate(elementLocaorPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
            break;
        case ElementLocaorType.Selector:
            return new Promise(resolve => {

                if (document.querySelector(elementLocaorPath)) {
                    return resolve(document.querySelector(elementLocaorPath));
                }

                const observer = new MutationObserver(mutations => {
                    if (document.querySelector(elementLocaorPath)) {
                        resolve(document.querySelector(elementLocaorPath));
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
            break;
    }
}


function SmElementOpreate(elementDesc){
    console.log("conncuiElementOpreate "+elementDesc);
    switch(elementDesc[1]){
        case ElementOperateType.Click:
            elementDesc[0].click();
            break;
        case ElementOperateType.Input:
            elementDesc[0].innerHTML=elementDesc[4]
            break;
    }
}

function SmChainEvent(element_desc_list){
    element_desc_list.forEach(click);
    function click(value, index, array) {
        console.log("wait "+value);
        elementLocatorAwait(value[2],value[3]).then((elm) => {
            console.log(value+' is ready');
            element_desc_list[index][0]=elm
            SmElementOpreate(value)
        });
    }
}