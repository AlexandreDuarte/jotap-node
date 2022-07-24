class CollapsableMenuHandler {

    collapsableMenuItemsIds = {
        smallScreen: {
            collapsableMenu: "nav-small-screen-menu",
            collapsableMenuBG: "nav-small-screen-menu-background",
            collapsableMenuButton: "nav-small-screen-button"
        },
        screen: {
            collapsableMenu: "nav-menu-left",
            collapsableMenuBG: "nav-menu-left-background",
            collapsableMenuButton: "nav-button-left"
        }
    }

    constructor(isNarrowScreen) {
        let ids = isNarrowScreen ? this.collapsableMenuItemsIds.smallScreen : this.collapsableMenuItemsIds.screen;
        this.collapsableMenu = document.getElementById(ids.collapsableMenu);
        this.collapsableMenuBG = document.getElementById(ids.collapsableMenuBG);
        this.collapsableMenuButton = document.getElementById(ids.collapsableMenuButton);

        this.collapsableMenu.style.display = "block";

        this.collapsableMenu.style.height = this.collapsableMenuBG.offsetHeight.toString() + "px";
        this.collapsableMenu.style.left = Math.round(this.collapsableMenuButton.offsetLeft) + "px";



        this.narrowScreen = isNarrowScreen;

        this.collapsableMenu.style.display = "none";
    }

    get isNarrowScreen() {
        return this.narrowScreen;
    }
}

class LanguageHandler {
    supportedLanguages = {
        EN: "#en",
        PT: ""
    }
    animationTimeout;
    currentLanguage;

    constructor() {

        this.pathMod = 1;

        this.steps = 15;

        this.pathPortuguese = document.querySelector("#language-select").contentDocument.querySelectorAll("path");
        this.pathEnglish = document.querySelector("#language-select-hidden").contentDocument.querySelectorAll("path");

        this.colorPort = [];
        this.coloreng = [];
        this.deltaPath = [];

        this.mouseLeftFlag = true;

        this.languageChangeAnim = false;

        document.getElementById('language-select-shell').addEventListener('mouseenter', _e => {
            if (!this.languageChangeAnim) document.getElementById('language-select').className = "";
            this.mouseLeftFlag = false;
        });

        document.getElementById('language-select-shell').addEventListener('mouseleave', _e => {
            if (!this.languageChangeAnim) document.getElementById('language-select').className = "b-and-w";
            this.mouseLeftFlag = true;
        });

        for (let i = 0; i < this.pathPortuguese.length; i++) {

            let portList = this.animation.getCoords(this.pathPortuguese[i], true);
            let engList = this.animation.getCoords(this.pathEnglish[i], true);

            this.colorPort.push(this.pathPortuguese[i].getAttribute('fill').split("(")[1].split(")")[0].split(","));
            this.coloreng.push(this.pathEnglish[i].getAttribute('fill').split("(")[1].split(")")[0].split(","));

            let deltaSub = [];

            for (let j = 0; j < portList.length; j++) {
                if (!isNaN(portList[j])) {
                    deltaSub.push(engList[j] - portList[j]);
                }
            }

            this.deltaPath.push(deltaSub);

        }
    }

    triggerLanguageChange(language) {

        if (language == this.supportedLanguages.EN) {

            document.documentElement.setAttribute("lang", "en");
            let ptTextFields = document.body.querySelectorAll('[lang="pt"]');
            let enTextFields = document.body.querySelectorAll('[lang="en"]');

            enTextFields.forEach(function(value) {
                value.className = "";
            });
            ptTextFields.forEach(function(value) {
                value.className = "hide";
            });

            this.currentLanguage = language;
            this.english = true;
        } else {

            document.documentElement.setAttribute("lang", "pt");
            let enTextFields = document.body.querySelectorAll('[lang="en"]');
            let ptTextFields = document.body.querySelectorAll('[lang="pt"]');

            enTextFields.forEach(function(value) {
                value.className = "hide";
            });
            ptTextFields.forEach(function(value) {
                value.className = "";
            });
            this.english = false;
            this.currentLanguage = language;
        }
    }

    scopedLanguageChange(scope) {

        if (this.currentLanguage == this.supportedLanguages.EN) {

            let ptTextFields = scope.querySelectorAll('[lang="pt"]');
            let enTextFields = scope.querySelectorAll('[lang="en"]');

            enTextFields.forEach(function(value) {
                value.className = "";
            });
            ptTextFields.forEach(function(value) {
                value.className = "hide";
            });
        } else {
            let enTextFields = scope.querySelectorAll('[lang="en"]');
            let ptTextFields = scope.querySelectorAll('[lang="pt"]');

            enTextFields.forEach(function(value) {
                value.className = "hide";
            });
            ptTextFields.forEach(function(value) {
                value.className = "";
            });
        }
    }



    triggerLanguageChangeAnimation() {

        if (this.languageChange) return false;

        if (this.languageChangeAnim) {
            window.clearTimeout(this.endAnimTimeout);
        }

        this.english = !this.english;

        this.languageChange = true;
        this.languageChangeAnim = true;

        for (const element of this.pathPortuguese) {
            if (element.id.includes("back")) {
                element.setAttribute('fill', 'rgba(0,0,0,0)');
            }
        }

        this.animation.step = 0;

        this.intervalID = setInterval(this.animationCallback.bind(this), 200 / this.steps);
    }

    animation = {
        step: 0,
        stepColor: function(color, targetColor, step) {
            return [parseInt(color[0]) + (targetColor[0] - parseInt(color[0])) / step, parseInt(color[1]) + (targetColor[1] - parseInt(color[1])) / step, parseInt(color[2]) + (targetColor[2] - parseInt(color[2])) / step];
        },

        getCoords: function(element, countCommaAsSeparator) {
            let result = [];

            let d = element.getAttribute("d");
            let dList;
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
    }

    animationCallback = () => {

        if (this.animation.step == this.steps) {

            if (this.currentLanguage === this.supportedLanguages.PT) {
                for (let i = 0; i < this.pathPortuguese.length; i++) {

                    this.pathPortuguese[i].setAttribute('fill', `rgb(${this.colorPort[i][0]}, ${this.colorPort[i][1]}, ${this.colorPort[i][2]})`);
                }

            } else {
                for (let i = 0; i < this.pathPortuguese.length; i++) {

                    this.pathPortuguese[i].setAttribute('fill', `rgb(${this.coloreng[i][0]}, ${this.coloreng[i][1]}, ${this.coloreng[i][2]})`);

                }
            }
            window.history.pushState({}, '', (location.hash ? location.href.replace(location.hash, '') : location.href) + this.currentLanguage);

            this.endAnimTimeout = setTimeout(() => {
                this.languageChangeAnim = false;
                if (this.mouseLeftFlag) document.getElementById('language-select').className = "bandw";
            }, 2000);

            this.languageChange = false;
            this.pathMod = -this.pathMod;
            clearInterval(this.intervalID);
            return;
        }

        for (let i = 0; i < this.pathPortuguese.length; i++) {

            let portList = this.animation.getCoords(this.pathPortuguese[i], false);

            let offset = 0;

            for (let j = 0; j < portList.length; j++) {
                if (!isNaN(portList[j])) {
                    portList[j] += this.pathMod * this.deltaPath[i][j + offset] / this.steps;
                } else if (typeof portList[j] === 'string' && portList[j].includes(",")) {
                    if (portList[j].split(',').length != 1) {
                        let rest = portList[j].split(',');
                        let v1 = parseFloat(rest[0]);
                        let v2 = parseFloat(rest[1]);
                        v1 += this.pathMod * this.deltaPath[i][j + offset] / this.steps;
                        v2 += this.pathMod * this.deltaPath[i][j + offset + 1] / this.steps;
                        offset += 1;
                        portList[j] = `${v1},${v2}`;
                    }
                } else {
                    offset -= 1;
                }
            }


            this.pathPortuguese[i].setAttribute('d', portList.join(" "));

            if (this.currentLanguage === this.supportedLanguages.PT) {


                for (let k = 0; k < this.pathPortuguese.length; k++) {
                    let color = this.pathPortuguese[k].getAttribute('fill').split("(")[1].split(")")[0].split(",");
                    let newColor = this.animation.stepColor(color, this.colorPort[k], this.steps);

                    this.pathPortuguese[k].setAttribute('fill', `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`);
                }
            } else {
                for (let k = 0; k < this.pathPortuguese.length; k++) {
                    let color = this.pathPortuguese[k].getAttribute('fill').split("(")[1].split(")")[0].split(",");

                    let newColor = this.animation.stepColor(color, this.coloreng[k], this.steps);

                    this.pathPortuguese[k].setAttribute('fill', `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`);
                }
            }
        }

        this.animation.step++;
    }
}

class NavigatorHandler {

    collapsableMenuInitializedListeners = {
        narrowListeners: false,
        wideListeners: false
    }



    constructor() {

        this.collapsableMenuHandler = new CollapsableMenuHandler(this.collapsableMenuInitializedListeners, window.innerWidth <= 1015);



        this.navCenter = document.getElementById("nav-center");
        this.navBar = document.getElementById("nav-bar");
        this.navText = document.getElementById("nav-text");
        this.navMenuButton = document.getElementById("nav-arrow-button");
        this.navOffset = 0;
        this.lastScrollTop = 0;

        document.getElementsByClassName("scrollable")[0].addEventListener('scroll', _e => {

            let scrollTop = document.getElementsByClassName("scrollable")[0].scrollTop;

            if (!tabHandler.portfolioPopulated && !tabHandler.portfolioWaitingHttpResponse && tabHandler.currentTab == tabHandler.tabs.PORTFOLIO && scrollTop > document.getElementsByClassName("scrollable")[0].scrollHeight - window.screen.availHeight - 100) tabHandler.requestPortfolioItems();

            if (this.collapsableMenuHandler.collapsableMenuBG.className === "nav-extended") return;

            if (scrollTop > this.lastScrollTop && scrollTop > 0) {
                if (this.show) {
                    this.show = false;
                    if (this.navOffset > -50) {
                        this.navOffset = -50;
                        this.navBar.style.top = `${this.navOffset}px`;
                        this.navBar.style.transition = "top 100ms";
                    }
                }
            } else if (!this.show && scrollTop < this.lastScrollTop) {
                this.show = true;
                if (this.navOffset < 0) {
                    this.navOffset = 0;
                    this.navBar.style.top = `${this.navOffset}px`;
                    this.navBar.style.transition = "top 100ms";
                }
            }

            this.lastScrollTop = scrollTop;
        });



        let scrollDiv = document.createElement("div");
        scrollDiv.className = "scrollbar-measure";
        document.body.appendChild(scrollDiv);

        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

        document.body.removeChild(scrollDiv);

        document.getElementById("content").style.marginRight = `-${scrollbarWidth}px`
    }

    recreateCollapsableMenu() {
        this.collapsableMenuHandler = new CollapsableMenuHandler(this.collapsableMenuInitializedListeners, window.innerWidth <= 1015);
        if (!(this.collapsableMenuHandler.isNarrowScreen ? this.collapsableMenuInitializedListeners.narrowListeners : this.collapsableMenuInitializedListeners.wideListeners)) {
            this.setupCollapsableMenuListeners();
            (this.collapsableMenuHandler.isNarrowScreen ? this.collapsableMenuInitializedListeners.narrowListeners = true : this.collapsableMenuInitializedListeners.wideListeners = true);
        }
    }

    navigationListeners = {
        listener1: function(e) {
            if (e.offsetY >= this.collapsableMenuHandler.collapsableMenuButton.offsetHeight + this.collapsableMenuHandler.collapsableMenuButton.offsetTop) return;

            if (this.collapsableMenuHandler.collapsableMenuBG.className === "nav-extended") {
                collapseMenu();
            }
        },

        listener2: function(_e) {
            if (this.collapsableMenuHandler.collapsableMenuBG.className !== "nav-extended") {
                extendMenu();
            }
        },

        listener3: function(_e) {
            if (this.collapsableMenuHandler.collapsableMenuBG.className === "nav-extended") {
                collapseMenu();
            }
        },

        listener4: function(e) {
            if (e.offsetY <= 0) return;

            if (this.collapsableMenuHandler.collapsableMenuBG.className === "nav-extended") {
                collapseMenu();
            }
        }
    }

    resize() {
        this.collapsableMenuHandler.collapsableMenu.style.left = Math.round(this.collapsableMenuHandler.collapsableMenuButton.offsetLeft) + "px";
    }

    setupNavigationListeners() {
        this.navBar.addEventListener('mouseleave', this.navigationListeners.listener3.bind(this));
        this.setupCollapsableMenuListeners();
    }

    setupCollapsableMenuListeners() {
        this.collapsableMenuHandler.collapsableMenuButton.addEventListener('mouseleave', this.navigationListeners.listener1.bind(this));
        this.collapsableMenuHandler.collapsableMenuButton.addEventListener('mouseenter', this.navigationListeners.listener2.bind(this));
        this.collapsableMenuHandler.collapsableMenu.addEventListener('mouseleave', this.navigationListeners.listener4.bind(this));
    }

    midAnimation = false;
    midAnimationCollapse = false;
    midAnimationExtend = false;

    endAnimation = whichAnimationEvent();

    navButtonPress() {

        if (this.midAnimation) return;

        if (this.navBar.className === "nav-closed") {
            extend();
        } else {
            collapse();
        }



    }

    extend() {
        if (this.midAnimation) return;
        this.navBar.className = "nav-open";

        this.midAnimation = true;

        this.navCenter.className = "nav-center-in";

        this.navText.className = "nav-text-in";

        this.navMenuButton.className = "rotate-in";

        let controller = new AbortController();

        this.navBar.addEventListener(this.endAnimation, () => {
            this.midAnimation = false;
            controller.abort();
        }, { signal: controller.signal });
    }

    collapse() {
        if (this.midAnimation) return;
        this.midAnimation = true;

        let navLeftMenuButton = this.collapsableMenuHandler.collapsableMenuButton;

        if (navLeftMenuButton.className === "selected") {
            collapseMenu();
        }

        this.navBar.className = "nav-closed";

        this.navCenter.className = "nav-center-out";

        this.navText.className = "nav-text-out";

        this.navMenuButton.className = "rotate-out";

        let controller = new AbortController();

        this.navBar.addEventListener(this.endAnimation, () => {
            this.midAnimation = false;
            controller.abort();
        }, { signal: controller.signal });


    }

    navMenuButtonPress(el) {
        if (this.midAnimation) return;

        if (el.className === "selected") {
            this.collapseMenu();
        } else {
            this.extendMenu();
        }
    }

    extendMenu() {


        this.midAnimationExtend = true;

        this.collapsableMenuHandler.collapsableMenu.style.display = "block";

        this.collapsableMenuHandler.collapsableMenuButton.className = "selected";

        this.collapsableMenuHandler.collapsableMenuBG.className = "nav-extended";

        let controller = new AbortController();

        this.collapsableMenuHandler.collapsableMenuBG.addEventListener(this.endAnimation, () => {
            this.midAnimationExtend = false;
            this.collapsableMenuHandler.collapsableMenu.style.display = "block";
            this.collapsableMenuHandler.collapsableMenuButton.className = "selected";
            this.collapsableMenuHandler.collapsableMenuBG.className = "nav-extended";
            controller.abort();
        }, { signal: controller.signal });
    }

    collapseMenu() {
        this.midAnimationCollapse = true;

        this.collapsableMenuHandler.collapsableMenuButton.className = "";

        this.collapsableMenuHandler.collapsableMenuBG.className = "nav-collapsed";

        let controller = new AbortController();

        this.collapsableMenuHandler.collapsableMenuBG.addEventListener(this.endAnimation, () => {
            this.collapsableMenuHandler.collapsableMenuBG.className = "";
            this.collapsableMenuHandler.collapsableMenu.style.display = "none";
            this.midAnimationCollapse = false;
            this.collapsableMenuHandler.collapsableMenuButton.className = "";
            this.collapsableMenuHandler.collapsableMenuBG.className = "nav-collapsed";
            controller.abort();
        }, { signal: controller.signal });


    }
}

class TabHandler {

    searchParams = new URLSearchParams("");
    portfolioRequests = 0;
    portfolioWaitingHttpResponse = false;
    portfolioCategory = '';
    bannerPos = 0;

    tabs = {
        PORTFOLIO: "PORTFOLIO",
        OTHER: "OTHER"
    }
    currentTab = this.tabs.OTHER;
    portfolioPopulated = false;


    requestCurrentPage() {
        if (window.location.pathname === "/about") {
            this.requestContentPage("aboutpage");
            this.currentTab = this.tabs.OTHER;
        } else if (window.location.pathname === "/expositions") {
            this.requestContentPage("expositionspage");
            this.currentTab = this.tabs.OTHER;
        } else if (window.location.pathname === "/portfolio") {

            let params = new URLSearchParams(window.location.search);
            if (imagePageOverlay) {
                if (!params.get("id")) {
                    document.getElementById("imageoverlay").outerHTML = "";
                    imagePageOverlay = false;
                }
            }

            if (params.get("filter")) {
                this.portfolioCategory = params.get("filter");
            }
            this.requestContentPage("portfoliopage" + `?filter=${this.portfolioCategory}`);
            if (params.get("id")) {
                openImagePage(params.get("id"));
            }

            this.currentTab = this.tabs.PORTFOLIO;
            this.portfolioRequests = 1;
            this.portfolioPopulated = false;
        } else {
            window.history.pushState({}, '', window.location.origin + "/");
            this.requestContentPage("homepage");
            this.currentTab = this.tabs.OTHER;
        }
    }


    requestContentPage(contentIDs) {
        this.bannerPos = 0;
        this.portfolioRequests = 0;
        this.searchParams = new URLSearchParams(window.location.search);
        let request = new XMLHttpRequest();

        request.onload = function() {
            if (request.status == 404) {
                window.history.pushState({}, '', window.location.origin + "/");
                return;
            }
            let content = document.getElementById("content");
            content.innerHTML = this.responseText;


            languageHandler.scopedLanguageChange(content);

            //collapsableMenu.style.left = Math.round(collapsableMenuButton.offsetLeft) + "px";



            navigatorHandler.navOffset = 0;
            navigatorHandler.lastScrollTop = 0;
            document.getElementsByClassName("scrollable")[0].scrollTo(0, 0);
        };

        request.open("GET", contentIDs);
        request.send();
    }

    requestContent(contentIDs, rootElement, reject) {
        let request = new XMLHttpRequest();

        request.onload = function() {
            if (request.status == 404) {
                reject();
                return;
            }

            let content = rootElement;
            content.innerHTML += this.responseText;

            let child = content.lastChild;
            languageHandler.scopedLanguageChange(child);


            //collapsableMenu.style.left = Math.round(collapsableMenuButton.offsetLeft) + "px";
        };

        request.open("GET", contentIDs);
        request.send();
    }


    requestPortfolioItems() {

        this.portfolioWaitingHttpResponse = true;

        let request = new XMLHttpRequest();

        request.onload = function() {

            if (this.responseText === "") this.portfolioPopulated = true;

            else {
                let content = document.getElementById("portfolio-items-container");
                content.innerHTML += this.responseText;



                languageHandler.scopedLanguageChange(content);


                this.collapsableMenuHandler.collapsableMenu.style.left = Math.round(this.collapsableMenuHandler.collapsableMenuButton.offsetLeft) + "px";


                this.portfolioRequests += 1;
            }

            this.portfolioWaitingHttpResponse = false;

        };

        request.open("GET", `portfoliopage/griditems?page=${this.portfolioRequests * 5}` + (this.portfolioCategory != '' ? `&filter=${this.portfolioCategory}` : ''));

        request.send();



    }

}

let languageHandler;
let navigatorHandler;
let tabHandler;

window.onpopstate = () => {

    tabHandler.requestCurrentPage();
};

window.onresize = () => {
    navigatorHandler.resize();
    navigatorHandler.recreateCollapsableMenu();
};


window.onload = () => {

    tabHandler = new TabHandler();
    languageHandler = new LanguageHandler(document);
    //languageHandler.triggerLanguageChangeAnimation();
    navigatorHandler = new NavigatorHandler();

    languageHandler.triggerLanguageChange(window.location.hash);
    tabHandler.requestCurrentPage();

    let scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    document.body.removeChild(scrollDiv);

    document.getElementById("content").style.marginRight = `-${scrollbarWidth}px`
};


function navButtonPress() {
    navigatorHandler.navButtonPress();
}

function extend() {
    navigatorHandler.extend();
}

function collapse() {
    navigatorHandler.collapse();
}

function navMenuButtonPress(el) {
    navigatorHandler.navMenuButtonPress(el);
}

function extendMenu() {
    navigatorHandler.extendMenu();
}

function collapseMenu() {
    navigatorHandler.collapseMenu();
}


function centerTextButton() {
    if (window.location.href === window.location.origin) return;

    window.history.pushState({}, '', window.location.origin + "/" + languageHandler.currentLanguage);
    tabHandler.requestContentPage("homepage");
    tabHandler.currentTab = tabHandler.tabs.OTHER;
}

function aboutButton() {
    if (window.location.pathname === "/about") return;


    if (navigatorHandler.collapsableMenuHandler.narrowScreen) collapseMenu();

    window.history.pushState({}, '', window.location.origin + "/" + 'about' + languageHandler.currentLanguage);
    tabHandler.requestContentPage("aboutpage");
    tabHandler.currentTab = tabHandler.tabs.OTHER;
}

function portfolioButton(category) {

    if (navigatorHandler.collapsableMenuHandler.narrowScreen) collapseMenu();

    if (window.location.pathname === "/portfolio" && category === tabHandler.portfolioCategory) return;

    if (category) {
        tabHandler.portfolioCategory = category
    } else {
        tabHandler.portfolioCategory = '';
    }

    tabHandler.searchParams = new URLSearchParams("");

    if (tabHandler.portfolioCategory != '') {
        if (tabHandler.searchParams.has("filter")) {
            tabHandler.searchParams.set("filter", tabHandler.portfolioCategory);
        } else {
            tabHandler.searchParams.append("filter", tabHandler.portfolioCategory);
        }
    }
    window.history.pushState({}, '', window.location.origin + "/" + 'portfolio' + ((tabHandler.searchParams.toString() != "") ? `?${tabHandler.searchParams.toString()}` : "") + languageHandler.currentLanguage);
    tabHandler.requestContentPage("portfoliopage" + (tabHandler.portfolioCategory != '' ? `?filter=${tabHandler.portfolioCategory}` : ''));
    tabHandler.currentTab = tabHandler.tabs.PORTFOLIO;
    tabHandler.portfolioRequests = 1;
    tabHandler.portfolioPopulated = false;



}

function expositionsButton() {

    if (navigatorHandler.collapsableMenuHandler.narrowScreen) collapseMenu();

    if (window.location.pathname === "/expositions") return;

    window.history.pushState({}, '', window.location.origin + "/" + 'expositions' + languageHandler.currentLanguage);
    tabHandler.requestContentPage("expositionspage");
    tabHandler.currentTab = tabHandler.tabs.OTHER;

    navigatorHandler.navOffset = 0;
    navigatorHandler.lastScrollTop = 0;
    window.scrollTo(0, 0);

}

function leftBannerButton() {
    if (tabHandler.bannerPos == -1) return;

    tabHandler.bannerPos -= 1;



    updateBannerElements();

}

function rightBannerButton() {
    if (tabHandler.bannerPos == 1) {
        return;
    }

    tabHandler.bannerPos += 1;

    updateBannerElements();
}

function selectorBannerButton(value) {
    tabHandler.bannerPos = value;

    updateBannerElements();
}

function updateBannerElements() {

    if (tabHandler.bannerPos == 1) {
        document.getElementById("arrow-right").style.display = "none";
    } else {
        document.getElementById("arrow-right").style.display = "block";
    }

    if (tabHandler.bannerPos == -1) {
        document.getElementById("arrow-left").style.display = "none";
    } else {
        document.getElementById("arrow-left").style.display = "block";
    }

    let elements = document.getElementsByClassName("banner-background");

    for (let i = 0; i < 3; i++) {
        elements[i].style.transform = `translateX(${(-tabHandler.bannerPos - 1) * 100}%)`;
        elements[i].style.transition = 'transform 100ms';
    }

    let bar = document.getElementById("selected-bar");


    bar.style.transform = `translateX(${(-0.5 + tabHandler.bannerPos) * 100}%)`;
    bar.style.transition = 'transform 100ms';
}


let copydelay = false;

function fallbackCopyTextToClipboard() {
    let textArea = document.createElement("textarea");
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

            navigator.clipboard.writeText(window.location.toString()).then(function() {
                console.log('Async: Copying to clipboard was successful!');
            }, function(err) {
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

let imagePageOverlay = false;

function closeImageoverlay() {
    tabHandler.searchParams.delete("id");
    window.history.pushState({}, '', window.location.origin + "/" + 'portfolio' + ((tabHandler.searchParams.toString() != "") ? `?${tabHandler.searchParams.toString()}` : "") + languageHandler.currentLanguage);
    document.getElementById("imageoverlay").outerHTML = "";
    imagePageOverlay = false;
}


function openImagePage(id) {
    if (!imagePageOverlay) {
        if (!tabHandler.searchParams.has("id")) {
            tabHandler.searchParams.append("id", id);
        }
        let params = new URLSearchParams(window.location.search);
        if (!params.get("id")) {
            window.history.pushState({}, '', window.location.origin + "/" + 'portfolio' + ((tabHandler.searchParams.toString() != "") ? `?${tabHandler.searchParams.toString()}` : "") + languageHandler.currentLanguage);
        }

        tabHandler.requestContent(`portfoliopage/imageoverlay?id=${id}`, document.getElementById("overlay-items"), () => {
            if (tabHandler.searchParams.has("id")) {
                tabHandler.searchParams.delete("id");
                window.history.pushState({}, '', window.location.origin + "/" + 'portfolio' + ((tabHandler.searchParams.toString() != "") ? `?${tabHandler.searchParams.toString()}` : "") + languageHandler.currentLanguage);
                imagePageOverlay = false;
            }
        });
        imagePageOverlay = true;
    }
}

function triggerLanguageChange() {
    languageHandler.triggerLanguageChangeAnimation();
    if (languageHandler.currentLanguage == languageHandler.supportedLanguages.EN) {
        languageHandler.triggerLanguageChange(languageHandler.supportedLanguages.PT);
    } else {
        languageHandler.triggerLanguageChange(languageHandler.supportedLanguages.EN);
    }

}


function whichAnimationEvent() {
    let el = document.createElement("fakeelement");

    let animations = {
        "animation": "animationend",
        "OAnimation": "oAnimationEnd",
        "MozAnimation": "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    };

    for (let t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}