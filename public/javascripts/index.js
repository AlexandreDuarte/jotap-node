
var pathPortuguese, pathAmerican;
var deltaPath = [];
var pathMod = 1;

var english;

var collapsableMenu;
var collapsableMenuBG;
var collapsableMenuButton;
var navCenter;
var navBar;
var navText;
var navMenuButton;

var lastScrollTop;

var navOffset;

var mouseLeftFlag = false;

var animationIntervalID;

var show = true;

var supportedLanguages = {
    PT: {
        pt: "",
        en: "hide"
    },
    EN: {
        pt: "hide",
        en: ""
    }
}

var currentLanguage;
var hash;

var tabs = {
    PORTFOLIO: "PORTFOLIO",
    ALL: "ALL"
}
var currentTab = tabs.ALL;
var portfolioPopulated = false;

var narrowListeners = false;
var wideListeners = false;

var narrowScreen;

var portfolioRequests = 0;
var portfolioWaitingHttpResponse = false;
var portfolioCategory = '';

window.onpopstate = () => {

    requestCurrentPage();
};


window.onresize = () => {
    collapsableMenu.style.left = collapsableMenuButton.offsetLeft + "px";

    identifyCollapsableMenu();

};

window.onload = () => {


    pathPortuguese = document.querySelector("#language-select").contentDocument.querySelectorAll("path");
    pathAmerican = document.querySelector("#language-select-hidden").contentDocument.querySelectorAll("path");


    if (window.location.hash == "#en") {
        triggerLanguageChange();

        english = true;

        let ptTextFields = document.querySelectorAll('[lang="pt"]');

        ptTextFields.forEach(function (value) {
            value.className = "hide";
        });

        currentLanguage = supportedLanguages.EN;
        hash = "#en"
    } else {

        english = false;

        let enTextFields = document.querySelectorAll('[lang="en"]');

        enTextFields.forEach(function (value) {
            value.className = "hide";
        });

        currentLanguage = supportedLanguages.PT;
        hash = "";
    }

    for (let i = 0; i < pathPortuguese.length; i++) {

        let portList = getCoords(pathPortuguese[i]);
        let amerList = getCoords(pathAmerican[i]);

        let deltaSub = [];

        for (let j = 0; j < portList.length; j++) {
            deltaSub.push(amerList[j] - portList[j]);
        }

        deltaPath.push(deltaSub);

    }


    navCenter = document.getElementById("nav-center");
    navBar = document.getElementById("nav-bar");
    navText = document.getElementById("nav-text");
    navMenuButton = document.getElementById("nav-arrow-button");
    identifyCollapsableMenu();


    setupNavListenersWideScreen();


    requestCurrentPage();

    document.getElementById('language-select-shell').addEventListener('mouseenter', e => {
        if (!languageChangeAnim) document.getElementById('language-select').className = "";
        mouseLeftFlag = false;
    });

    document.getElementById('language-select-shell').addEventListener('mouseleave', e => {
        if (!languageChangeAnim) document.getElementById('language-select').className = "bandw";
        mouseLeftFlag = true;
    });

    
    

    navOffset = 0;
    lastScrollTop = 0;

    window.addEventListener('scroll', e => {

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (!portfolioPopulated && !portfolioWaitingHttpResponse && currentTab == tabs.PORTFOLIO && scrollTop > document.scrollingElement.scrollHeight - window.screen.availHeight - 50) requestPortfolioItems(); 

        if (collapsableMenuBG.className === "nav-extended") return;


        if (scrollTop > lastScrollTop) {
            if (show) {
                show = false;
                if (navOffset > -50) {
                    navOffset = -50;
                    navBar.style.top = `${navOffset}px`;
                    navBar.style.transition = "top 100ms";
                }
            }
        }
        else if (!show) {
            show = true;
            if (navOffset < 0) {
                navOffset = 0;
                navBar.style.top = `${navOffset}px`;
                navBar.style.transition = "top 100ms";
            }
        }

        lastScrollTop = scrollTop;
    });



    setTimeout(() => {
        if (!mouseLeftFlag) document.getElementById('language-select').className = "bandw";
    }, 3000);
};

function requestCurrentPage() {
    if (window.location.pathname === "/about") {
        requesteContentPage("aboutpage");
        currentTab = tabs.ALL;
    } else if (window.location.pathname === "/exhibitions") {
        requesteContentPage("exhibitionspage");
        currentTab = tabs.ALL;
    } else if (window.location.pathname === "/portfolio") {
        portfolioCategory = window.location.search;
        requesteContentPage("portfoliopage" + portfolioCategory);
        currentTab = tabs.PORTFOLIO;
        portfolioRequests = 1;
        portfolioPopulated = false;
    } else {
        requesteContentPage("homepage");
        currentTab = tabs.ALL;
    }
}


function requestPortfolioItems() {

    portfolioWaitingHttpResponse = true;

    var request = new XMLHttpRequest();

    request.onload = function () {

        if (this.responseText === "") portfolioPopulated = true;

        else {
            let content = document.getElementById("portfolio-items-container");
            content.innerHTML += this.responseText;


            let enTextFields = content.querySelectorAll('[lang="en"]');
            let ptTextFields = content.querySelectorAll('[lang="pt"]');

            enTextFields.forEach(function (value) {
                value.className = currentLanguage.en;
            });

            ptTextFields.forEach(function (value) {
                value.className = currentLanguage.pt;
            });


            collapsableMenu.style.left = collapsableMenuButton.offsetLeft + "px";

            
            portfolioRequests+=1;
        }

        portfolioWaitingHttpResponse = false;

    };
    
    request.open("GET", `portfoliopage/griditems?page=${portfolioRequests*5}` + (portfolioCategory != '' ? `&filter=${portfolioCategory}` : ''));
    
    request.send();



}

function identifyCollapsableMenu() {
    if (window.innerWidth <= 1015) {
        collapsableMenu = document.getElementById("nav-small-screen-menu");
        collapsableMenuBG = document.getElementById("nav-small-screen-menu-background");
        collapsableMenuButton = document.getElementById("nav-small-screen-button");
        
        collapsableMenu.style.display = "block";

        collapsableMenu.style.height = collapsableMenuBG.offsetHeight.toString() + "px";
        collapsableMenu.style.left = collapsableMenuButton.offsetLeft + "px";
        
        if (!narrowListeners) {
            setupNavListenersWideScreen(true);
            narrowListners = true;
        }

        narrowScreen = true;
    }
    else {

        collapsableMenu = document.getElementById("nav-menu-left");
        collapsableMenuBG = document.getElementById("nav-menu-left-background");
        collapsableMenuButton = document.getElementById("nav-button-left");

        collapsableMenu.style.display = "block";

        collapsableMenu.style.height = collapsableMenuBG.offsetHeight.toString() + "px";
        collapsableMenu.style.left = collapsableMenuButton.offsetLeft + "px";
        if (!wideListeners) {
            setupNavListenersWideScreen(false);
            wideListeners = true;
        }

        narrowScreen = false;
    }
    collapsableMenu.style.display = "none";
}

function setupNavListenersWideScreen(narrowScreen) {


        collapsableMenuButton.addEventListener('mouseleave', e => {

            if (e.offsetY >= collapsableMenuButton.offsetHeight + collapsableMenuButton.offsetTop) return;

            if (collapsableMenuBG.className === "nav-extended") {
                collapseMenu();
            }
        });

        collapsableMenuButton.addEventListener('mouseenter', e => {

            if (collapsableMenuBG.className !== "nav-extended") {
                extendMenu();
            }
        });

    

    navBar.addEventListener('mouseleave', e => {

        if (collapsableMenuBG.className === "nav-extended") {
            collapseMenu();
        }
    });

    collapsableMenu.addEventListener('mouseleave', e => {

        if (e.offsetY <= 0) return;

        if (collapsableMenuBG.className === "nav-extended") {
            collapseMenu();
        }
    });
}

var languageChange = false;
var languageChangeAnim = false;

var endAnimTimeout;

var steps = 15;

function triggerLanguageChange() {

    if (languageChange) return;

    if (languageChangeAnim) {
        window.clearTimeout(endAnimTimeout);
    }

    english = !english;

    languageChange = true;
    languageChangeAnim = true;

    var count = 0;
    var colorRed = [255, 0, 0];
    var colorGreen = [0, 102, 0];
    var colorDre = [206, 51, 49];
    var colorBlue = [54, 87, 120];

    for (let i = 0; i < pathPortuguese.length; i++) {
        if (pathPortuguese[i].id.includes("back")) {
            pathPortuguese[i].setAttribute('fill', 'rgba(0,0,0,0)');
        }
    }

    var intervalID = window.setInterval(() => {

        if (count == steps) {

            if (!english) {
                for (let i = 0; i < pathPortuguese.length; i++) {
                    if (pathPortuguese[i].id == "back-0") {
                        pathPortuguese[i].setAttribute('fill', 'rgb(0,102,0)');
                    } else if (pathPortuguese[i].id == "back-1") {
                        pathPortuguese[i].setAttribute('fill', 'rgb(255,0,0)');
                    } else if (pathPortuguese[i].id == "back-2") {
                        pathPortuguese[i].setAttribute('fill', 'rgba(0,0,0,0)');
                    } else if (pathPortuguese[i].id.includes('red')) {
                        pathPortuguese[i].setAttribute('fill', `rgb(${colorRed[0]}, ${colorRed[1]}, ${colorRed[2]})`);
                    } else if (pathPortuguese[i].id.includes('green')) {
                        pathPortuguese[i].setAttribute('fill', `rgb(${colorGreen[0]}, ${colorGreen[1]}, ${colorGreen[2]})`);
                    }
                }
                currentLanguage = supportedLanguages.PT;
                hash = "";

            } else {
                for (let i = 0; i < pathPortuguese.length; i++) {
                    if (pathPortuguese[i].id.includes("back")) {
                        pathPortuguese[i].setAttribute('fill', 'rgba(0,0,0,0)');
                    } else if (pathPortuguese[i].id.includes('dre')) {
                        pathPortuguese[i].setAttribute('fill', `rgb(${colorDre[0]}, ${colorDre[1]}, ${colorDre[2]})`);
                    } else if (pathPortuguese[i].id.includes('blue')) {
                        pathPortuguese[i].setAttribute('fill', `rgb(${colorBlue[0]}, ${colorBlue[1]}, ${colorBlue[2]})`);
                    }
                }
                currentLanguage = supportedLanguages.EN;
                hash = "#en";
            }

            window.history.pushState({}, '', location.href.replace(location.hash, "") + hash);

            let enTextFields = document.querySelectorAll('[lang="en"]');
            let ptTextFields = document.querySelectorAll('[lang="pt"]');

            enTextFields.forEach(function (value) {
                value.className = currentLanguage.en;
            });

            ptTextFields.forEach(function (value) {
                value.className = currentLanguage.pt;
            });

            endAnimTimeout = setTimeout(() => {
                languageChangeAnim = false;
                if (mouseLeftFlag) document.getElementById('language-select').className = "bandw";
            }, 2000);



            languageChange = false;
            pathMod = -pathMod;
            window.clearInterval(intervalID);
            return;
        }

        for (let i = 0; i < pathPortuguese.length; i++) {

            let portList = getCoords(pathPortuguese[i]);

            for (let j = 0; j < portList.length; j++) {
                portList[j] += pathMod * deltaPath[i][j] / steps;
            }

            pathPortuguese[i].setAttribute('d', ` M ${portList[0]} ${portList[1]} L ${portList[2]} ${portList[3]} L ${portList[4]} ${portList[5]} L ${portList[6]} ${portList[7]} Z `);

            if (!english) {
                for (let i = 0; i < pathPortuguese.length; i++) {
                    let color = pathPortuguese[i].getAttribute('fill').split("(")[1].split(")")[0].split(",");

                    if (pathPortuguese[i].id.includes('red')) {
                        let newColor = stepColor(color, colorRed, steps);
                        pathPortuguese[i].setAttribute('fill', `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`);
                    } else if (pathPortuguese[i].id.includes('green')) {
                        let newColor = stepColor(color, colorGreen, steps);
                        pathPortuguese[i].setAttribute('fill', `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`);
                    }
                }
            } else {
                for (let i = 0; i < pathPortuguese.length; i++) {
                    let color = pathPortuguese[i].getAttribute('fill').split("(")[1].split(")")[0].split(",");

                    if (pathPortuguese[i].id.includes('dre')) {
                        let newColor = stepColor(color, colorDre, steps);
                        pathPortuguese[i].setAttribute('fill', `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`);
                    } else if (pathPortuguese[i].id.includes('blue')) {
                        let newColor = stepColor(color, colorBlue, steps);
                        pathPortuguese[i].setAttribute('fill', `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`);
                    }
                }
            }
        }

        count++;
    }, 200 / steps);
}

function stepColor(color, targetColor, step) {
    return [parseInt(color[0]) + (targetColor[0] - parseInt(color[0])) / step, parseInt(color[1]) + (targetColor[1] - parseInt(color[1])) / step, parseInt(color[2]) + (targetColor[2] - parseInt(color[2])) / step];
}

function getCoords(element) {
    var result = [];

    let d = element.getAttribute("d");
    var dList = d.split(" ");

    for (let j = 0; j < dList.length; j++) {
        if (dList[j] != "" && !isNaN(dList[j]))
            result.push(parseFloat(dList[j]));
    }

    return result;
}

var midAnimation, midAnimationCollapse, midAnimationExtend = false;

var endAnimation = whichAnimationEvent();

function navButtonPress() {

    if (midAnimation) return;

    switch (navBar.className) {
        case "nav-closed":
            extend();
            break;
        default:
            collapse();
    }



}

function extend() {
    if (midAnimation) return;
    navBar.className = "nav-open";

    midAnimation = true;

    /*var c = elem.children;
    var i;
    for (i = 0; i < c.length; i++) {
        c[i].style.display = "block";
        c[i].className = "nav-button in"
    }*/

    navCenter.className = "nav-center-in";

    navText.className = "nav-text-in";

    navMenuButton.className = "rotate-2";

    var controller = new AbortController();

    navBar.addEventListener(endAnimation, () => {
        midAnimation = false;
        controller.abort();
    }, { signal: controller.signal });
}

function collapse() {
    if (midAnimation) return;
    midAnimation = true;

    let navLeftMenuButton = collapsableMenuButton;

    if (navLeftMenuButton.className === "selected") {
        collapseMenu(navLeftMenuButton);
    }

    navBar.className = "nav-closed";

    navCenter.className = "nav-center-out";

    navText.className = "nav-text-out";

    navMenuButton.className = "rotate-1";

    var controller = new AbortController();

    navBar.addEventListener(endAnimation, () => {
        midAnimation = false;
        controller.abort();
    }, { signal: controller.signal });


}

function navMenuButtonPress(el) {
    if (midAnimation) return;

    switch (el.className) {
        case "selected":
            collapseMenu();
            break;
        default:
            extendMenu();
    }
}

function extendMenu() {
    console.log("extend Animation start");


    midAnimationExtend = true;
    
    collapsableMenu.style.display = "block";

    collapsableMenuButton.className = "selected";

    collapsableMenuBG.className = "nav-extended";

    var controller = new AbortController();

    collapsableMenuBG.addEventListener(endAnimation, () => {
        midAnimationExtend = false;
        console.log("extend Animation end");
        if (!midAnimationCollapse && !midAnimationExtend) {
            controller.abort();
        }
    }, { signal: controller.signal });
}

function collapseMenu() {
    
    console.log("collapse Animation start");

    midAnimationCollapse = true;

    collapsableMenuButton.className = "";

    collapsableMenuBG.className = "nav-collapsed";

    var controller = new AbortController();

    collapsableMenuBG.addEventListener(endAnimation, () => {
        collapsableMenuBG.className = "";
        collapsableMenu.style.display = "none";
        midAnimationCollapse = false;
        console.log("collapse Animation end");
        if (!midAnimationCollapse && !midAnimationExtend) {
            controller.abort();
        }
    }, { signal: controller.signal });


}

function requesteContentPage(contentIDs) {
    bannerPos = 0;
    portfolioRequests = 0;
    imagePageOverlay = false;
    var request = new XMLHttpRequest();

    request.onload = function () {
        let content = document.getElementById("content");
        content.innerHTML = this.responseText;

        let enTextFields = content.querySelectorAll('[lang="en"]');
        let ptTextFields = content.querySelectorAll('[lang="pt"]');

        enTextFields.forEach(function (value) {
            value.className = currentLanguage.en;
        });

        ptTextFields.forEach(function (value) {
            value.className = currentLanguage.pt;
        });

        collapsableMenu.style.left = collapsableMenuButton.offsetLeft + "px";
    };

    request.open("GET", contentIDs);
    request.send();
}

function requesteContent(contentIDs) {
    var request = new XMLHttpRequest();

    request.onload = function () {
        let content = document.getElementById("content");
        content.innerHTML += this.responseText;

        let child = content.lastChild;

        let enTextFields = child.querySelectorAll('[lang="en"]');
        let ptTextFields = child.querySelectorAll('[lang="pt"]');

        enTextFields.forEach(function (value) {
            value.className = currentLanguage.en;
        });

        ptTextFields.forEach(function (value) {
            value.className = currentLanguage.pt;
        });


        collapsableMenu.style.left = collapsableMenuButton.offsetLeft + "px";
    };

    request.open("GET", contentIDs);
    request.send();
}



function centerTextButton() {
    if (window.location.href === window.location.origin) return;

    window.history.pushState({}, '', window.location.origin + "/" + hash);
    requesteContentPage("homepage");
    currentTab = tabs.ALL;

}

function aboutButton() {
    if (window.location.pathname === "/about") return;

    if (narrowScreen) collapseMenu();

    window.history.pushState({}, '', window.location.origin + "/" + 'about' + hash);
    requesteContentPage("aboutpage");
    currentTab = tabs.ALL;

}

function portfolioButton(category) {

    if (narrowScreen) {
        collapsableMenuButton.className = "";

        collapsableMenuBG.className = "nav-collapsed";
    }
    if (window.location.pathname === "/portfolio" && category === portfolioCategory) return;

    if (category) {
        portfolioCategory = category
    } else {
        portfolioCategory = '';
    };

    window.history.pushState({}, '', window.location.origin + "/" + 'portfolio' + (portfolioCategory != '' ? `?filter=${portfolioCategory}` : '') + hash);
    requesteContentPage("portfoliopage" + (portfolioCategory != '' ? `?filter=${portfolioCategory}` : ''));
    currentTab = tabs.PORTFOLIO;
    portfolioRequests = 1;
    portfolioPopulated = false;


}

function exhibitionsButton() {
    if (window.location.pathname === "/exhibitions") return;
    
    if (narrowScreen) collapseMenu();

    window.history.pushState({}, '', window.location.origin + "/" + 'exhibitions' + hash);
    requesteContentPage("exhibitionspage");
    currentTab = tabs.ALL;

}

var bannerPos = 0;

function leftBannerButton() {
    if (bannerPos == -1) return;

    bannerPos -= 1;



    updateBannerElements();

}

function rightBannerButton() {
    if (bannerPos == 1) {
        return;
    }

    bannerPos += 1;

    updateBannerElements();
}

function selectorBannerButton(value) {
    bannerPos = value;

    updateBannerElements();
}

function updateBannerElements() {

    if (bannerPos == 1) {
        document.getElementById("arrow-right").style.opacity = "0";
    } else {
        document.getElementById("arrow-right").style.opacity = "0.7";
    }

    if (bannerPos == -1) {
        document.getElementById("arrow-left").style.opacity = "0";
    } else {
        document.getElementById("arrow-left").style.opacity = "0.7";
    }

    let elements = document.getElementsByClassName("banner-background");

    for (let i = 0; i < 3; i++) {
        elements[i].style.transform = `translateX(${(-bannerPos - 1) * 100}%)`;
        elements[i].style.transition = 'transform 100ms';
    }

    let bar = document.getElementById("selected-bar");


    bar.style.transform = `translateX(${(-0.5 + bannerPos) * 100}%)`;
    bar.style.transition = 'transform 100ms';
}


var imagePageOverlay;

function closeImageoverlay() {
    document.getElementById("imageoverlay").outerHTML = "";
    imagePageOverlay = false;
}


function openImagePage(id) {
    if (!imagePageOverlay) {
        requesteContent(`portfoliopage/imageoverlay?id=${id}`);
        imagePageOverlay = true;
    }
}


function whichAnimationEvent() {
    var t,
        el = document.createElement("fakeelement");

    var animations = {
        "animation": "animationend",
        "OAnimation": "oAnimationEnd",
        "MozAnimation": "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    };

    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}