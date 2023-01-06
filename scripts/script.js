window.onload = function(){
    document.querySelector('.cart-img').addEventListener('click', () => {
        document.querySelector('.cart-container').classList.toggle('show-cart-container');
        document.querySelector('body').classList.toggle('hidden-scroll');
        document.querySelector('.offcanvas-backdrop').classList.toggle('show-offcanvas-backdrop');
    });

    document.querySelector('.fa-bars').addEventListener('click', () => {
        document.querySelector('.navbar').classList.toggle('navbar-show');
        document.querySelector('main').classList.toggle('main-translate');
    });

}



