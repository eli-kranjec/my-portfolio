console.log("Test");

function $$ (selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}
let navLinks = $$("nav a");




// let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
// currentLink?.classList.add("current");
// console.log(currentLink);

let pages = [
    {url: "", title :"Home"},
    {url: "projects", title: "Projects"},
    {url: "contact", title: "Contact"},
    {url: "https://github.com/TardiCoder/", title: "Github Page"}
];

let nav = document.createElement("nav");
document.body.prepend(nav);


for (let p of pages) {
    
    let url = p.url;
    let title = p.title;
    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add("current");
    } else if (a.pathname === location.pathname) {
        a.target = "_blank";
    
    }


}


document.body.insertAdjacentHTML("afterbegin", "<label> <select class='theme'> <option value = 'dark'>Dark Mode</option> <option value = 'light'>Light Mode</option> </select> </label>");

var select = document.querySelector(".theme");

if (select.value != null || select.value != undefined){
    select.value = localStorage.colorScheme;
} else {
    select.value = 'dark';
}
select.addEventListener("input", function (event)  {

    console.log("color scheme change detected ->" + event.target.value);
    document.documentElement.style.setProperty("color-scheme", event.target.value);
    localStorage.colorScheme = event.target.value;
    
});



