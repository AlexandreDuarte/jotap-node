
var pathPortuguese, pathAmerican;
var deltaPath = [];
var pathMod = 1;

var english = false;

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

window.onpopstate = () => {
    if (window.location.href.split('/')[3] === "sobre") {
        requestContent("sobrepage");
    } else requestContent("homepage");
}


window.onresize = () => {
    collapsableMenu.style.left = collapsableMenuButton.offsetLeft + "px";
};

window.onload = () => {


    pathPortuguese = document.querySelector("#language-select").contentDocument.querySelectorAll("path");
    pathAmerican = document.querySelector("#language-select-hidden").contentDocument.querySelectorAll("path");

    for (let i = 0; i < pathPortuguese.length; i++) {

        let portList = getCoords(pathPortuguese[i]);
        let amerList = getCoords(pathAmerican[i]);

        let deltaSub = [];

        for (let j = 0; j < portList.length; j++) {
            deltaSub.push(amerList[j] - portList[j]);
        }

        deltaPath.push(deltaSub);

    }

    collapsableMenu = document.getElementById("nav-menu-left");
    collapsableMenuBG = document.getElementById("nav-menu-left-background");
    collapsableMenuButton = document.getElementById("nav-button-left");
    navCenter = document.getElementById("nav-center");
    navBar = document.getElementById("nav-bar");
    navText = document.getElementById("nav-text");
    navMenuButton = document.getElementById("nav-arrow-button");

    setupNavListeners();

    if (window.location.href.split('/')[3] === "sobre") {
        requestContent("sobrepage");
    } else requestContent("homepage");


    navOffset = 0;
    lastScrollTop = 0;

    window.addEventListener('scroll', e => {

        if (collapsableMenuBG.className === "nav-extended") return;

        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            if (show) {
                show = false;
                window.clearInterval(animationIntervalID);
                animationIntervalID = setInterval(() => {
                    if (navOffset > -50) {
                        navOffset -= 5;
                        navBar.style.top = `${navOffset}px`;
                    } else {
                        window.clearInterval(animationIntervalID);
                    }
                }, 20);
            }
        }
        else if (!show) {
            show = true;
            window.clearInterval(animationIntervalID);
            animationIntervalID = setInterval(() => {
                if (navOffset < 0) {
                    navOffset += 5;
                    navBar.style.top = `${navOffset}px`;
                } else {
                    window.clearInterval(animationIntervalID);
                }
            }, 20);
        }

        lastScrollTop = scrollTop;
    });

    setTimeout(() => {
        if (!mouseLeftFlag) document.getElementById('language-select').className = "bandw";
    }, 3000);
};

function setupNavListeners() {
    collapsableMenu.style.height = collapsableMenuBG.offsetHeight.toString() + "px";
    collapsableMenu.style.left = collapsableMenuButton.offsetLeft + "px";

    collapsableMenuButton.addEventListener('mouseout', e => {

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

    let collapsableMenuButtonBG = collapsableMenu;

    collapsableMenuButtonBG.addEventListener('mouseleave', e => {

        if (e.offsetY <= 0) return;

        if (collapsableMenuBG.className === "nav-extended") {
            collapseMenu();
        }
    });

    document.getElementById('language-select-shell').addEventListener('mouseenter', e => {
        if (!languageChangeAnim) document.getElementById('language-select').className = "";
        mouseLeftFlag = false;
    });

    document.getElementById('language-select-shell').addEventListener('mouseleave', e => {
        if (!languageChangeAnim) document.getElementById('language-select').className = "bandw";
        mouseLeftFlag = true;
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
            }

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

var midAnimation = false;

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
    midAnimation = true;

    collapsableMenuButton.className = "selected";

    collapsableMenuBG.className = "nav-extended";

    var controller = new AbortController();

    collapsableMenuBG.addEventListener(endAnimation, () => {
        midAnimation = false;
        controller.abort();
    }, { signal: controller.signal });
}

function collapseMenu() {
    midAnimation = true;

    collapsableMenuButton.className = "";

    collapsableMenuBG.className = "nav-collapsed";

    var controller = new AbortController();

    collapsableMenuBG.addEventListener(endAnimation, () => {
        midAnimation = false;
        controller.abort();
    }, { signal: controller.signal });


}

function requestContent(contentIDs) {
    var request = new XMLHttpRequest();

    request.onload = function () {
        console.log(this.responseText);
        document.getElementById("content").innerHTML = this.responseText;

        collapsableMenu.style.left = collapsableMenuButton.offsetLeft + "px";
    };

    request.open("GET", contentIDs);
    request.send();
}

function centerTextButton() {
    if (window.location.href.split('/').length == 3) return;

    window.history.pushState({}, '', window.location.href.split('/')[0] + '/' + window.location.href.split('/')[1] + '/' + window.location.href.split('/')[2]);
    requestContent("homepage");

}

function sobreButton() {
    if (window.location.href.split('/')[3] === "sobre") return;

    window.history.pushState({}, '', window.location.href + 'sobre');
    requestContent("sobrepage");

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