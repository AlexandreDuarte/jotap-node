window.onresize = () => {
    document.getElementById("nav-menu-left").style.left = document.getElementById("nav-button-left").offsetLeft + "px";
};

window.onload = () => {
    document.getElementById("nav-menu-left").style.height = document.getElementById("nav-menu-left-background").offsetHeight.toString() + "px";
    document.getElementById("nav-menu-left").style.left = document.getElementById("nav-button-left").offsetLeft + "px";

    let navLMenuButton = document.getElementById("nav-button-left");

    navLMenuButton.addEventListener('mouseout', e => {

        let navLMenuButton = document.getElementById("nav-button-left");
        
        console.log(e.offsetY, navLMenuButton.offsetTop, navLMenuButton.offsetHeight);

        if (e.offsetY >= navLMenuButton.offsetHeight + navLMenuButton.offsetTop) return;
    
        if(document.getElementById("nav-menu-left-background").className === "nav-extended") {
            collapseMenu();
        }
    });

    navLMenuButton.addEventListener('mouseenter', e => {
    
        if(document.getElementById("nav-menu-left-background").className !== "nav-extended") {
            extendMenu();
        }
    });

    document.getElementById("nav-bar").addEventListener('mouseleave', e => {
    
        if(document.getElementById("nav-menu-left-background").className === "nav-extended") {
            collapseMenu();
        }
    });
    
    let navLMenuButtonBG = document.getElementById("nav-menu-left");

    navLMenuButtonBG.addEventListener('mouseleave', e => {

        let navLMenuButtonBG = document.getElementById("nav-menu-left");

        console.log(e.offsetY, navLMenuButtonBG.offsetTop);

        if (e.offsetY <= 0) return;
    
        if(document.getElementById("nav-menu-left-background").className === "nav-extended") {
            collapseMenu();
        }
    });
};

var midAnimation = false;

var endAnimation = whichAnimationEvent();

function navButtonPress() {

    if (midAnimation) return;

    let el = document.getElementById("nav-bar");

    switch (el.className) {
        case "nav-closed":
            extend(el);
            break;
        default:
            collapse(el);
    }



}

function extend(elem) {
    if (midAnimation) return;
    elem.className = "nav-open";

    midAnimation = true;

    /*var c = elem.children;
    var i;
    for (i = 0; i < c.length; i++) {
        c[i].style.display = "block";
        c[i].className = "nav-button in"
    }*/

    let centerElement = document.getElementById("nav-center");

    centerElement.className = "nav-center-in";

    let navText = document.getElementById("nav-text");

    navText.className = "nav-text-in";

    let navMenuButton = document.getElementById("nav-arrow-button");

    navMenuButton.className = "rotate-2";

    var controller = new AbortController();

    elem.addEventListener(endAnimation, () => {
        midAnimation = false;
        controller.abort();
    }, { signal: controller.signal });
}

function collapse(elem) {
    if (midAnimation) return;
    midAnimation = true;

    let navLeftMenuButton = document.getElementById("nav-button-left");

    if (navLeftMenuButton.className === "selected") {
        collapseMenu(navLeftMenuButton);
    }

    elem.className = "nav-closed";

    let centerElement = document.getElementById("nav-center");

    centerElement.className = "nav-center-out";

    let navText = document.getElementById("nav-text");

    navText.className = "nav-text-out";

    let navMenuButton = document.getElementById("nav-arrow-button");

    navMenuButton.className = "rotate-1";


    /*var c = elem.children;
    var i;
    for (i = 0; i < c.length; i++) {
        c[i].className = "nav-button out"
    }*/

    var controller = new AbortController();

    elem.addEventListener(endAnimation, () => {
        /*var c = elem.children;
        var i;
        for (i = 0; i < c.length; i++) {
            c[i].style.display = "none";
        }*/
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
    if (midAnimation) return;
    midAnimation = true;

    document.getElementById("nav-button-left").className = "selected";

    let menuBG = document.getElementById("nav-menu-left-background");

    menuBG.className = "nav-extended";

    var controller = new AbortController();

    menuBG.addEventListener(endAnimation, () => {
        midAnimation = false;
        controller.abort();
    }, { signal: controller.signal });
}

function collapseMenu() {
    midAnimation = true;

    document.getElementById("nav-button-left").className = "";

    let menuBG = document.getElementById("nav-menu-left-background");

    menuBG.className = "nav-collapsed";

    var controller = new AbortController();

    menuBG.addEventListener(endAnimation, () => {
        /*var c = elem.children;
        var i;
        for (i = 0; i < c.length; i++) {
            c[i].style.display = "none";
        }*/
        midAnimation = false;
        controller.abort();
    }, { signal: controller.signal });

    
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