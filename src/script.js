document.addEventListener("DOMContentLoaded", function () {
    let lastScrollTop = 0;
    const headerScrollbar = document.querySelector(".header-scrollbar");
    const stacks = document.querySelectorAll(".stack .card, .stack .card1, .stack .card2");

    function onScroll() {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrollPercentage = (scrollTop / scrollHeight) * 100;


        if (headerScrollbar) {
            headerScrollbar.style.width = scrollPercentage + "%";
        }


        stacks.forEach((stack, index) => {
            let stackPosition = stack.offsetTop - window.innerHeight / 1.2;
            if (scrollTop > stackPosition) {
                stack.classList.add("show");
            } else {
                stack.classList.remove("show");
            }
        });

        lastScrollTop = Math.max(scrollTop, 0);
    }


    window.addEventListener("scroll", () => {
        requestAnimationFrame(onScroll);
    });


    onScroll();
});
