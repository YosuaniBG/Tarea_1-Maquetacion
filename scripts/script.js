window.onload = function(){
    document.querySelector('.cart-img').addEventListener('click',function(){
        document.querySelector('.cart-container').classList.toggle('hidden-cart-container');
        document.querySelector('body').classList.toggle('hidden-scroll');
    });
}