function initNavbar() {

    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('#navMenu a');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function () {

        navMenu.classList.toggle('active');
        this.classList.toggle('active');

    });

    navLinks.forEach(link => {

        link.addEventListener('click', () => {

            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');

        });

    });

}

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
});




// =========================
// CATEGORY SLIDER
// =========================

const slider = document.querySelector(".category-slider");
const track = document.querySelector(".category-track");

if (slider && track) {

    // Duplicate cards with JavaScript (only once)
    track.innerHTML += track.innerHTML;

    const cards = [...track.children];

    let position = 0;
    let speed = 0.6;

    let animationId;

    let isDragging = false;
    let startX = 0;
    let startPosition = 0;

    function getLoopWidth() {

        return track.scrollWidth / 2;

    }

    function animate() {

        if (!isDragging) {

            position -= speed;

            const loopWidth = getLoopWidth();

            // Going left
            if (-position >= loopWidth) {

                position += loopWidth;

            }

            // Going right
            if (position > 0) {

                position -= loopWidth;

            }

            track.style.transform = `translateX(${position}px)`;

        }

        animationId = requestAnimationFrame(animate);

    }

    animate();

    // Save variables globally for next part

    window.categorySlider = {

        slider,
        track,
        cards,

        get position() {
            return position;
        },

        set position(value) {
            position = value;
        },

        get speed() {
            return speed;
        },

        set speed(value) {
            speed = value;
        },

        get startX() {
            return startX;
        },

        set startX(value) {
            startX = value;
        },

        get startPosition() {
            return startPosition;
        },

        set startPosition(value) {
            startPosition = value;
        },

        get isDragging() {
            return isDragging;
        },

        set isDragging(value) {
            isDragging = value;
        }

    };

}
const sliderData = window.categorySlider;

if (sliderData) {

    const slider = sliderData.slider;

    // Pause on hover
    slider.addEventListener("mouseenter", () => {

        sliderData.speed = 0;

    });

    // Resume
    slider.addEventListener("mouseleave", () => {

        if (!sliderData.isDragging) {

            sliderData.speed = 0.6;

        }

    });

    slider.addEventListener("mousedown", (e) => {

        sliderData.isDragging = true;

        slider.classList.add("dragging");

        sliderData.startX = e.clientX;

        sliderData.startPosition = sliderData.position;

    });

    window.addEventListener("mousemove", (e) => {

        if (!sliderData.isDragging) return;

        const walk = e.clientX - sliderData.startX;

        sliderData.position = sliderData.startPosition + walk;

        const loopWidth = sliderData.track.scrollWidth / 2;

        // Dragging too far right
        if (sliderData.position > 0) {

            sliderData.position -= loopWidth;

        }

        // Dragging too far left
        if (-sliderData.position >= loopWidth) {

            sliderData.position += loopWidth;

        }

        sliderData.track.style.transform =
        `translateX(${sliderData.position}px)`;

    });

    window.addEventListener("mouseup", () => {

        if (!sliderData.isDragging) return;

        sliderData.isDragging = false;

        slider.classList.remove("dragging");

        sliderData.speed = 0.6;

    });

}













function testimonialSlider() {

    new Swiper(".testimonialSwiper", {

        loop: true,

        autoplay: {

            delay: 3000,

            disableOnInteraction: false,

        },

        speed: 800,

        spaceBetween: 30,

        grabCursor: true,

        pagination: {

            el: ".swiper-pagination",

            clickable: true,

        },

        breakpoints: {

            0: {

                slidesPerView: 1,

            },

            768: {

                slidesPerView: 2,

            },

            1200: {

                slidesPerView: 3,

            }

        }

    });

}

testimonialSlider();






function initShopFilter() {

    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const materialFilter = document.getElementById("materialFilter");
    const sortFilter = document.getElementById("sortFilter");

    const productGrid = document.getElementById("productGrid");

    // const productCards = [...document.querySelectorAll(".product-card")];
    let productCards = [...document.querySelectorAll(".product-card")];


    const showingProducts = document.getElementById("showingProducts");
    const totalProducts = document.getElementById("totalProducts");

    /* ==========================
            PAGINATION
    ========================== */

    const productsPerPage = 8;

    let currentPage = 1;

    let filteredProducts = [];


    totalProducts.textContent = productCards.length;

    function filterProducts() {

        const category = categoryFilter.value.toLowerCase();
        const price = priceFilter.value;
        const material = materialFilter.value.toLowerCase();
        const sort = sortFilter.value;

        let visibleProducts = [];

        productCards.forEach(function (card) {

            let show = true;

            const productCategory = card.dataset.category;
            const productPrice = Number(card.dataset.price);
            const productMaterial = card.dataset.material;

            // Category Filter
            if (category !== "all categories") {

                if (productCategory !== category) {

                    show = false;

                }

            }

            // Price Filter
            if (price !== "Price") {

                if (price === "Under $200" && !(productPrice < 200))
                    show = false;

                if (price === "$200 - $500" && !(productPrice >= 200 && productPrice <= 500))
                    show = false;

                if (price === "$500 - $1000" && !(productPrice > 500 && productPrice <= 1000))
                    show = false;

                if (price === "$1000+" && !(productPrice > 1000))
                    show = false;

            }

            // Material Filter
            if (material !== "material") {

                if (productMaterial !== material) {

                    show = false;

                }

            }

            if (show) {

                card.style.display = "";

                visibleProducts.push(card);

            }

            else {

                card.style.display = "none";

            }

        });

        // Sort Products

        if (sort !== "Sort By") {

            visibleProducts.sort(function (a, b) {

                const priceA = Number(a.dataset.price);
                const priceB = Number(b.dataset.price);

                if (sort === "Price: Low to High") {

                    return priceA - priceB;

                }

                if (sort === "Price: High to Low") {

                    return priceB - priceA;

                }

                return 0;

            });

            visibleProducts.forEach(function (card) {

                productGrid.appendChild(card);

            });

        }

        
        filteredProducts = visibleProducts;

        currentPage = 1;

        showCurrentPage();

        renderPagination();

    }


    function renderPagination() {

        const pageNumbers = document.getElementById("pageNumbers");

        pageNumbers.innerHTML = "";

        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

        if (currentPage > totalPages)
            currentPage = totalPages || 1;

        for (let i = 1; i <= totalPages; i++) {

            const button = document.createElement("button");

            button.className = "page-number";

            button.textContent = i;

            if (i === currentPage)
                button.classList.add("active");

            button.addEventListener("click", function () {

                currentPage = i;

                showCurrentPage();

                renderPagination();

            });

            pageNumbers.appendChild(button);

        }

    }

    function showCurrentPage() {

        productCards.forEach(function(card){

            card.style.display = "none";

        });

        const start = (currentPage - 1) * productsPerPage;

        const end = start + productsPerPage;

        filteredProducts
            .slice(start,end)
            .forEach(function(card){

                card.style.display = "";

            });

        const showing = Math.min(end, filteredProducts.length);

        showingProducts.textContent = showing;

    }



    categoryFilter.addEventListener("change", filterProducts);

    priceFilter.addEventListener("change", filterProducts);

    materialFilter.addEventListener("change", filterProducts);

    sortFilter.addEventListener("change", filterProducts);

    filterProducts();

    document
    .getElementById("prevPage")
    .addEventListener("click",function(){

        if(currentPage>1){

            currentPage--;

            showCurrentPage();

            renderPagination();

        }

    });

    document
    .getElementById("nextPage")
    .addEventListener("click",function(){

        const totalPages =
            Math.ceil(filteredProducts.length/productsPerPage);

        if(currentPage<totalPages){

            currentPage++;

            showCurrentPage();

            renderPagination();

        }

    });

}

document.addEventListener("DOMContentLoaded", function () {

    initShopFilter();

});

















function backToTop() {

    const button = document.querySelector(".back-top");

    button.addEventListener("click", function () {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

backToTop();