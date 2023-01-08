import { Carrito } from './cart.js';

window.onload = function(){
    
    document.querySelector('.cart-img').addEventListener('click', () => {
        document.querySelector('.cart-container').classList.toggle('show-cart-container');
        document.querySelector('body').classList.toggle('hidden-scroll-y');
        document.querySelector('.offcanvas-backdrop').classList.toggle('show-offcanvas-backdrop');
    });

    document.querySelector('.fa-bars').addEventListener('click', () => {
        document.querySelector('.navbar').classList.toggle('navbar-show');
        document.querySelector('main').classList.toggle('main-translate');
        document.querySelector('body').classList.toggle('hidden-scroll-x');
    });
}

const getProductAPI = async() => {
    await fetch('https://jsonblob.com/api/1061116324926996480').then(function (result) {
      result.json().then(function (datos) {
        const cart = new Carrito(datos);
        console.log(cart);
        cart.actualizarUnidades('0K3QOSOV4V', 3);
        cart.actualizarUnidades('TGD5XORY1L', 3);
        cart.actualizarUnidades('IOKW9BQ9F3', 3);
        console.log(cart);
        const productInf = cart.obtenerInformacionProducto('0K3QOSOV4V');
        console.log(productInf);
        const total = cart.obtenerTotal();
        console.log(total);
        const carrito = cart.obtenerCarrito();
        console.log(carrito);
      });
    });
  };
  
  getProductAPI();



