//const { loadConfigFromFile } = require("vite");


// function $$ (selector, context = document) {
//     return Array.from(context.querySelectorAll(selector));
// }
// let navLinks = $$("nav a");




// let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
// currentLink?.classList.add("current");
// console.log(currentLink);

// let pages = [
//     {url: "", title :"Home Page"},
//     {url: "projects", title: "Projects Page"},
//     {url: "contact", title: "Contact Me"},
//     {url: "https://github.com/TardiCoder/", title: "Github Page"}
// ];

// let nav = document.createElement("nav");
// document.body.prepend(nav);


// function onPageLoad() { 
//     a.classList.remove("current");
//     for (let p of pages) {
    
//         let url = p.url;
//         let title = p.title;
//         let a = document.createElement("a");
//         a.href = url;
//         a.textContent = title;
//         nav.append(a);
//         if (a.host === location.host && a.pathname === location.pathname) {
//             a.classList.add("current");
//             console.log("current page: " + a);
//         } else if (a.pathname === location.pathname) {
//             a.target = "_blank";
        
//         }
//     }
// }


// var select = document.querySelector(".theme");

// if (localStorage.colorScheme != null || localStorage.colorScheme != undefined){
//     document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme);
//     select.value = localStorage.colorScheme;
// } else{
//     select.value = 'dark';
//     document.documentElement.style.setProperty("color-scheme", select.value);
//     localStorage.colorScheme  = select.value;
// }
    
// select.addEventListener("input", function (event)  {

//     document.documentElement.style.setProperty("color-scheme", event.target.value);
//     localStorage.colorScheme = event.target.value;
    
    
    
// });

// document.addEventListener('DOMContentLoaded', onPageLoad);
// document.addEventListener('load', onPageLoad);



