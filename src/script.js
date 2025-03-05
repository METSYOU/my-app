let lastScrollTop = 0;
let homeSection = document.querySelector(".home");
let headerScrollbar = document.querySelector(".header-scrollbar");


window.addEventListener("scroll", function () {
    let scrollTop = document.documentElement.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollPercentage = (scrollTop / scrollHeight) * 100;

    headerScrollbar.style.width = scrollPercentage + "%";
});


window.addEventListener("scroll", function () {
    let stacks = document.querySelectorAll(".stack");
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    stacks.forEach((stack) => {
        if (scrollTop > lastScrollTop) {
            stack.classList.add("show");
        } else if (scrollTop <= homeSection.offsetTop + 150) {
            stack.classList.remove("show");
        }
    });

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
