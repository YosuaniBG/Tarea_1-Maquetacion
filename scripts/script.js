window.onload = function(){
    document.querySelector('.cart-img').addEventListener('click',function(){
        document.querySelector('.cart-container').classList.toggle('show-cart-container');
        document.querySelector('body').classList.toggle('hidden-scroll');
        document.querySelector('.offcanvas-backdrop').classList.toggle('show-offcanvas-backdrop');
    });

}