import { Carrito } from "./cart.js";
const productRow = document.querySelector('.product-row')
const templateProductRow = document.getElementById('template-product-row').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".cart-img").addEventListener("click", () => {
    document
      .querySelector(".cart-container")
      .classList.toggle("show-cart-container");
    document.querySelector("body").classList.toggle("hidden-scroll-y");
    document
      .querySelector(".offcanvas-backdrop")
      .classList.toggle("show-offcanvas-backdrop");
  });

  document.querySelector(".fa-bars").addEventListener("click", () => {
    document.querySelector(".navbar").classList.toggle("navbar-show");
    document.querySelector("main").classList.toggle("main-translate");
    document.querySelector("body").classList.toggle("hidden-scroll-x");
  });

  getProductAPI();

});

const getProductAPI = async () => {
  try {
    await fetch("https://jsonblob.com/api/1061116324926996480").then(
      (result) => {
        result.json().then((datos) => {
          const cart = new Carrito(datos);
          carrito = cart;
          inicializarCarrito(carrito);

          productRow.addEventListener('click', e =>{
            if(e.target.classList.contains('inc')){
              cart.api.products.find((elem) => {
                return elem.SKU === e.target.dataset.id;
              }).quantity++;
              Actualizar(cart);
            }
            if(e.target.classList.contains('dec')){
              if(cart.api.products.find((elem) => { return elem.SKU === e.target.dataset.id}).quantity > 0){
                cart.api.products.find((elem) => {
                  return elem.SKU === e.target.dataset.id;
                }).quantity--;
                Actualizar(cart);
              }
              
            }

          })
        });
      }
    );
  } catch (error) {
    console.log("Esto lanzó el siguiente error:" + error);
  }
};

const inicializarCarrito = (carrito) =>{
  const productList = carrito.obtenerCarrito().products;

  //Indicar la cantidad de productos existentes en el carrito
  document.querySelector(".full").textContent = productList.length;

  // Optimizar este codigo
  productList.forEach((elem) => {
    carrito.actualizarUnidades(elem.SKU, 0);
  });

  //Pintar los productos
  printCart(productList);
}

function Actualizar(carrito){
  printCart(carrito.obtenerCarrito().products)
}

const printCart = (products) => {
  productRow.innerHTML = '';
  products.forEach((elem)=>{
    templateProductRow.querySelector('.table-product-name').textContent = elem.title
    templateProductRow.querySelector('.table-product-ref').textContent = 'Ref: ' + elem.SKU
    templateProductRow.querySelector('#product-price').textContent = elem.price + '€'
    templateProductRow.querySelector('#product-cost').textContent =  elem.price * elem.quantity + '€'
    templateProductRow.querySelector('#amount').value = elem.quantity
    templateProductRow.querySelector('.dec').dataset.id = elem.SKU
    templateProductRow.querySelector('.inc').dataset.id = elem.SKU
     
    const clone = templateProductRow.cloneNode(true)
    fragment.appendChild(clone)
    
  });
  productRow.appendChild(fragment);
}
 