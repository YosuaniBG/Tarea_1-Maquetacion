window.onload = function(){
    document.querySelector('.cart-img').addEventListener('click',function(){
        document.querySelector('.cart-container').classList.toggle('hidden-cart-container');
    });
}