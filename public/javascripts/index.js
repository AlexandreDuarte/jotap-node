var pathPortuguese, pathEnglish;
var deltaPath = [];
var pathMod = 1;

var colorPort = [];
var coloreng = [];

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
    OTHER: "OTHER"
}
var currentTab = tabs.OTHER;
var portfolioPopulated = false;

var narrowListeners = false;
var wideListeners = false;

var narrowScreen;

var portfolioRequests = 0;
var portfolioWaitingHttpResponse = false;
var portfolioCategory = '';

var scrollbarWidth;

var searchParams = new URLSearchParams("");

var imagePageOverlay = false;

window.onpopstate = () => {

    requestCurrentPage();
};


window.onresize = () => {
    collapsableMenu.style.left = Math.round(collapsableMenuButton.offsetLeft) + "px";
    identifyCollapsableMenu();



    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    document.body.removeChild(scrollDiv);

    document.getElementById("content").style.marginRight = `-${scrollbarWidth}px`
    //document.getElementById("content").style.width = `calc(100vw - 2*${scrollbarWidth}px)`

};

window.onload = () => {

    pathPortuguese = document.querySelector("#language-select").contentDocument.querySelectorAll("path");
    pathEnglish = document.querySelector("#language-select-hidden").contentDocument.querySelectorAll("path");


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

        let portList = getCoords(pathPortuguese[i], true);
        let engList = getCoords(pathEnglish[i], true);

        colorPort.push(pathPortuguese[i].getAttribute('fill').split("(")[1].split(")")[0].split(","));
        coloreng.push(pathEnglish[i].getAttribute('fill').split("(")[1].split(")")[0].split(","));

        let deltaSub = [];

        for (let j = 0; j < portList.length; j++) {
            if (!isNaN(portList[j])) {
                deltaSub.push(engList[j] - portList[j]);
            }
        }

        deltaPath.push(deltaSub);

    }


    navCenter = document.getElementById("nav-center");
    navBar = document.getElementById("nav-bar");
    navText = document.getElementById("nav-text");
    navMenuButton = document.getElementById("nav-arrow-button");
    identifyCollapsableMenu();

    requestCurrentPage();

    document.getElementById('language-select-shell').addEventListener('mouseenter', _e => {
        if (!languageChangeAnim) document.getElementById('language-select').className = "";
        mouseLeftFlag = false;
    });

    document.getElementById('language-select-shell').addEventListener('mouseleave', _e => {
        if (!languageChangeAnim) document.getElementById('language-select').className = "b-and-w";
        mouseLeftFlag = true;
    });




    navOffset = 0;
    lastScrollTop = 0;

    document.getElementsByClassName("scrollable")[0].addEventListener('scroll', e => {

        let scrollTop = document.getElementsByClassName("scrollable")[0].scrollTop;

        if (!portfolioPopulated && !portfolioWaitingHttpResponse && currentTab == tabs.PORTFOLIO && scrollTop > document.getElementsByClassName("scrollable")[0].scrollHeight - window.screen.availHeight - 100) requestPortfolioItems();

        if (collapsableMenuBG.className === "nav-extended") return;

        if (scrollTop > lastScrollTop && scrollTop > 0) {
            if (show) {
                show = false;
                if (navOffset > -50) {
                    navOffset = -50;
                    navBar.style.top = `${navOffset}px`;
                    navBar.style.transition = "top 100ms";
                }
            }
        } else if (!show && scrollTop < lastScrollTop) {
            show = true;
            if (navOffset < 0) {
                navOffset = 0;
                navBar.style.top = `${navOffset}px`;
                navBar.style.transition = "top 100ms";
            }
        }

        lastScrollTop = scrollTop;
    });



    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    document.body.removeChild(scrollDiv);

    document.getElementById("content").style.marginRight = `-${scrollbarWidth}px`

    //document.getElementById("content").style.width = `calc(100vw - 2*${scrollbarWidth}px)`



    setTimeout(() => {
        if (!mouseLeftFlag) document.getElementById('language-select').className = "b-and-w";
    }, 3000);
};

function requestCurrentPage() {
    if (window.location.pathname === "/about") {
        requesteContentPage("aboutpage");
        currentTab = tabs.OTHER;
    } else if (window.location.pathname === "/expositions") {
        requesteContentPage("expositionspage");
        currentTab = tabs.OTHER;
    } else if (window.location.pathname === "/portfolio") {

        let params = new URLSearchParams(window.location.search);
        if (imagePageOverlay) {
            if (!params.get("id")) {
                document.getElementById("imageoverlay").outerHTML = "";
                imagePageOverlay = false;
            }
        }

        if (params.get("filter")) {
            portfolioCategory = params.get("filter");
        }
        requesteContentPage("portfoliopage" + `?filter=${portfolioCategory}`);
        if (params.get("id")) {
            openImagePage(params.get("id"));
        }

        currentTab = tabs.PORTFOLIO;
        portfolioRequests = 1;
        portfolioPopulated = false;
    } else {
        window.history.pushState({}, '', window.location.origin + "/");
        requesteContentPage("homepage");
        currentTab = tabs.OTHER;
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


            collapsableMenu.style.left = Math.round(collapsableMenuButton.offsetLeft) + "px";


            portfolioRequests += 1;
        }

        portfolioWaitingHttpResponse = false;

    };

    request.open("GET", `portfoliopage/griditems?page=${portfolioRequests * 5}` + (portfolioCategory != '' ? `&filter=${portfolioCategory}` : ''));

    request.send();



}

function identifyCollapsableMenu() {
    if (window.innerWidth <= 1015) {
        collapsableMenu = document.getElementById("nav-small-screen-menu");
        collapsableMenuBG = document.getElementById("nav-small-screen-menu-background");
        collapsableMenuButton = document.getElementById("nav-small-screen-button");

        collapsableMenu.style.display = "block";

        collapsableMenu.style.height = collapsableMenuBG.offsetHeight.toString() + "px";
        collapsableMenu.style.left = Math.round(collapsableMenuButton.offsetLeft) + "px";

        if (!narrowListeners) {
            setupNavListenersWideScreen();
            narrowListeners = true;
        }

        narrowScreen = true;
    } else {

        collapsableMenu = document.getElementById("nav-menu-left");
        collapsableMenuBG = document.getElementById("nav-menu-left-background");
        collapsableMenuButton = document.getElementById("nav-button-left");

        collapsableMenu.style.display = "block";

        collapsableMenu.style.height = collapsableMenuBG.offsetHeight.toString() + "px";
        collapsableMenu.style.left = Math.round(collapsableMenuButton.offsetLeft) + "px";
        if (!wideListeners) {
            setupNavListenersWideScreen();
            wideListeners = true;
        }

        narrowScreen = false;
    }
    collapsableMenu.style.display = "none";
}

function listener1(e) {
    if (e.offsetY >= collapsableMenuButton.offsetHeight + collapsableMenuButton.offsetTop) return;

    if (collapsableMenuBG.className === "nav-extended") {
        collapseMenu();
    }
}

function listener2(_e) {
    if (collapsableMenuBG.className !== "nav-extended") {
        extendMenu();
    }
}

function listener3(_e) {
    if (collapsableMenuBG.className === "nav-extended") {
        collapseMenu();
    }
}

function listener4(e) {
    if (e.offsetY <= 0) return;

    if (collapsableMenuBG.className === "nav-extended") {
        collapseMenu();
    }
}

function setupNavListenersWideScreen() {


    collapsableMenuButton.addEventListener('mouseleave', listener1);

    collapsableMenuButton.addEventListener('mouseenter', listener2);

    navBar.addEventListener('mouseleave', listener3);

    collapsableMenu.addEventListener('mouseleave', listener4);
}

function removeEventListeners() {
    collapsableMenuButton.removeEventListener('mouseleave', listener1);

    collapsableMenuButton.removeEventListener('mouseenter', listener2);

    navBar.removeEventListener('mouseleave', listener3);

    collapsableMenu.removeEventListener('mouseleave', listener4);
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

    for (const element of pathPortuguese) {
        if (element.id.includes("back")) {
            element.setAttribute('fill', 'rgba(0,0,0,0)');
        }
    }

    var intervalID = window.setInterval(() => {

        if (count == steps) {

            if (!english) {
                for (let i = 0; i < pathPortuguese.length; i++) {

                    pathPortuguese[i].setAttribute('fill', `rgb(${colorPort[i][0]}, ${colorPort[i][1]}, ${colorPort[i][2]})`);
                }
                currentLanguage = supportedLanguages.PT;
                hash = "";

            } else {
                for (let i = 0; i < pathPortuguese.length; i++) {

                    pathPortuguese[i].setAttribute('fill', `rgb(${coloreng[i][0]}, ${coloreng[i][1]}, ${coloreng[i][2]})`);

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

            let portList = getCoords(pathPortuguese[i], false);

            let offset = 0;

            for (let j = 0; j < portList.length; j++) {
                if (!isNaN(portList[j])) {
                    portList[j] += pathMod * deltaPath[i][j + offset] / steps;
                } else if (typeof portList[j] === 'string' && portList[j].includes(",")) {
                    if (portList[j].split(',').length != 1) {
                        let rest = portList[j].split(',');
                        let v1 = parseFloat(rest[0]);
                        let v2 = parseFloat(rest[1]);
                        v1 += pathMod * deltaPath[i][j + offset] / steps;
                        v2 += pathMod * deltaPath[i][j + offset + 1] / steps;
                        offset += 1;
                        portList[j] = `${v1},${v2}`;
                    }
                } else {
                    offset -= 1;
                }
            }


            pathPortuguese[i].setAttribute('d', portList.join(" "));

            if (!english) {


                for (let i = 0; i < pathPortuguese.length; i++) {
                    let color = pathPortuguese[i].getAttribute('fill').split("(")[1].split(")")[0].split(",");
                    let newColor = stepColor(color, colorPort[i], steps);

                    pathPortuguese[i].setAttribute('fill', `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`);
                }
            } else {
                for (let i = 0; i < pathPortuguese.length; i++) {
                    let color = pathPortuguese[i].getAttribute('fill').split("(")[1].split(")")[0].split(",");

                    let newColor = stepColor(color, coloreng[i], steps);

                    pathPortuguese[i].setAttribute('fill', `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`);
                }
            }
        }

        count++;
    }, 200 / steps);
}

function stepColor(color, targetColor, step) {
    return [parseInt(color[0]) + (targetColor[0] - parseInt(color[0])) / step, parseInt(color[1]) + (targetColor[1] - parseInt(color[1])) / step, parseInt(color[2]) + (targetColor[2] - parseInt(color[2])) / step];
}

function getCoords(element, countCommaAsSeparator) {
    var result = [];

    let d = element.getAttribute("d");
    var dList;
    if (countCommaAsSeparator) {
        dList = d.split(/[\s,]/g);
    } else {
        dList = d.split(' ');
    }

    for (const num of dList) {
        if (num != "")
            if (!isNaN(num)) {
                result.push(parseFloat(num));
            } else {
                result.push(num);
            }
    }

    return result;
}

var midAnimation, midAnimationCollapse, midAnimationExtend = false;

var endAnimation = whichAnimationEvent();

function navButtonPress() {

    if (midAnimation) return;

    if (navBar.className === "nav-closed") {
        extend();
    } else {
        collapse();
    }



}

function extend() {
    if (midAnimation) return;
    navBar.className = "nav-open";

    midAnimation = true;

    navCenter.className = "nav-center-in";

    navText.className = "nav-text-in";

    navMenuButton.className = "rotate-in";

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
        collapseMenu();
    }

    navBar.className = "nav-closed";

    navCenter.className = "nav-center-out";

    navText.className = "nav-text-out";

    navMenuButton.className = "rotate-out";

    var controller = new AbortController();

    navBar.addEventListener(endAnimation, () => {
        midAnimation = false;
        controller.abort();
    }, { signal: controller.signal });


}

function navMenuButtonPress(el) {
    if (midAnimation) return;

    if (el.className === "selected") {
        collapseMenu();
    } else {
        extendMenu();
    }
}

function extendMenu() {


    midAnimationExtend = true;

    collapsableMenu.style.display = "block";

    collapsableMenuButton.className = "selected";

    collapsableMenuBG.className = "nav-extended";

    var controller = new AbortController();

    collapsableMenuBG.addEventListener(endAnimation, () => {
        midAnimationExtend = false;
        collapsableMenu.style.display = "block";
        collapsableMenuButton.className = "selected";
        collapsableMenuBG.className = "nav-extended";
        controller.abort();
    }, { signal: controller.signal });
}

function collapseMenu() {
    midAnimationCollapse = true;

    collapsableMenuButton.className = "";

    collapsableMenuBG.className = "nav-collapsed";

    var controller = new AbortController();

    collapsableMenuBG.addEventListener(endAnimation, () => {
        collapsableMenuBG.className = "";
        collapsableMenu.style.display = "none";
        midAnimationCollapse = false;
        collapsableMenuButton.className = "";
        collapsableMenuBG.className = "nav-collapsed";
        controller.abort();
    }, { signal: controller.signal });


}

function requesteContentPage(contentIDs) {
    bannerPos = 0;
    portfolioRequests = 0;
    searchParams = new URLSearchParams(window.location.search);
    var request = new XMLHttpRequest();

    request.onload = function () {
        if(request.status == 404) {
            window.history.pushState({}, '', window.location.origin + "/");
            return;
        }
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

        collapsableMenu.style.left = Math.round(collapsableMenuButton.offsetLeft) + "px";



        navOffset = 0;
        lastScrollTop = 0;
        document.getElementsByClassName("scrollable")[0].scrollTo(0, 0);
    };

    request.open("GET", contentIDs);
    request.send();
}

function requesteContent(contentIDs, rootElement) {
    var request = new XMLHttpRequest();

    request.onload = function () {
        if (request.status == 404) {
            if (searchParams.has("id")) {
                searchParams.delete("id");
                window.history.pushState({}, '', window.location.origin + "/" + 'portfolio' + ((searchParams.toString() != "") ? `?${searchParams.toString()}` : "") + hash);
            }
            return;
        }

        let content = rootElement;
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


        collapsableMenu.style.left = Math.round(collapsableMenuButton.offsetLeft) + "px";
    };

    request.open("GET", contentIDs);
    request.send();
}



function centerTextButton() {
    if (window.location.href === window.location.origin) return;

    window.history.pushState({}, '', window.location.origin + "/" + hash);
    requesteContentPage("homepage");
    currentTab = tabs.OTHER;
}

function aboutButton() {
    if (window.location.pathname === "/about") return;


    if (narrowScreen) collapseMenu();

    window.history.pushState({}, '', window.location.origin + "/" + 'about' + hash);
    requesteContentPage("aboutpage");
    currentTab = tabs.OTHER;
}

function portfolioButton(category) {

    if (narrowScreen) collapseMenu();

    if (window.location.pathname === "/portfolio" && category === portfolioCategory) return;

    if (category) {
        portfolioCategory = category
    } else {
        portfolioCategory = '';
    }

    searchParams = new URLSearchParams("");

    if (portfolioCategory != '') {
        if (searchParams.has("filter")) {
            searchParams.set("filter", portfolioCategory);
        } else {
            searchParams.append("filter", portfolioCategory);
        }
    }
    window.history.pushState({}, '', window.location.origin + "/" + 'portfolio' + ((searchParams.toString() != "") ? `?${searchParams.toString()}` : "") + hash);
    requesteContentPage("portfoliopage" + (portfolioCategory != '' ? `?filter=${portfolioCategory}` : ''));
    currentTab = tabs.PORTFOLIO;
    portfolioRequests = 1;
    portfolioPopulated = false;



}

function expositionsButton() {

    if (narrowScreen) collapseMenu();

    if (window.location.pathname === "/expositions") return;

    window.history.pushState({}, '', window.location.origin + "/" + 'expositions' + hash);
    requesteContentPage("expositionspage");
    currentTab = tabs.OTHER;

    navOffset = 0;
    lastScrollTop = 0;
    window.scrollTo(0, 0);

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
        document.getElementById("arrow-right").style.display = "none";
    } else {
        document.getElementById("arrow-right").style.display = "block";
    }

    if (bannerPos == -1) {
        document.getElementById("arrow-left").style.display = "none";
    } else {
        document.getElementById("arrow-left").style.display = "block";
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

var copydelay = false;

function fallbackCopyTextToClipboard() {
    var textArea = document.createElement("textarea");
    textArea.value = window.location.toString();

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        let copiedpopup = document.getElementById("imageoverlay-copied");
        if (copiedpopup.classList.contains("fade-out")) {
            copiedpopup.classList.remove("fade-out");
        }
        copiedpopup.classList.add("fade-in");

        setTimeout(() => {
            let copiedpopup = document.getElementById("imageoverlay-copied");
            copiedpopup.classList.remove("fade-in");
            copiedpopup.classList.add("fade-out");
            copydelay = false;
        }, 1000);
    } catch (err) {
        console.error('Unable to copy to clipboard');
    }

    document.body.removeChild(textArea);
}

async function copy(values) {

    if (copydelay) {
        return;
    }
    if (navigator.share) {
        await navigator.share({
            title: values.title,
            text: values.text,
            url: window.location.toString()
        }).catch();
    } else {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard();
        } else {
            copydelay = true;

            navigator.clipboard.writeText(window.location.toString()).then(function () {
                console.log('Async: Copying to clipboard was successful!');
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });


        }
        let copiedpopup = document.getElementById("imageoverlay-copied");
        if (copiedpopup.classList.contains("fade-out")) {
            copiedpopup.classList.remove("fade-out");
        }
        copiedpopup.classList.add("fade-in");

        setTimeout(() => {
            let copiedpopup = document.getElementById("imageoverlay-copied");
            copiedpopup.classList.remove("fade-in");
            copiedpopup.classList.add("fade-out");
            copydelay = false;
        }, 1000);
    }
}



function closeImageoverlay() {
    searchParams.delete("id");
    window.history.pushState({}, '', window.location.origin + "/" + 'portfolio' + ((searchParams.toString() != "") ? `?${searchParams.toString()}` : "") + hash);
    document.getElementById("imageoverlay").outerHTML = "";
    imagePageOverlay = false;
}


function openImagePage(id) {
    if (!imagePageOverlay) {
        if (!searchParams.has("id")) {
            searchParams.append("id", id);
        }
        let params = new URLSearchParams(window.location.search);
        if (!params.get("id")) {
            window.history.pushState({}, '', window.location.origin + "/" + 'portfolio' + ((searchParams.toString() != "") ? `?${searchParams.toString()}` : "") + hash);
        }
        requesteContent(`portfoliopage/imageoverlay?id=${id}`, document.getElementById("overlay-items"));
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