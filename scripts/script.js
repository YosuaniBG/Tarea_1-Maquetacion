import { Carrito } from "./cart.js";
const productRow = document.querySelector('.product-row')
const templateProductRow = document.getElementById('template-product-row').content

const productRowTotalTable = document.querySelector(".product-row-total-table");
const templateTotalTable = document.getElementById("template-total-table").content;

const fragment = document.createDocumentFragment()
const fragment2 = document.createDocumentFragment()


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

          initializeCart(cart);

          //Acciones de los botones Incremento y Decremento
          productRow.addEventListener('click', e =>{
            if(e.target.classList.contains('inc')){
              cart.api.products.find((elem) => {
                return elem.SKU === e.target.dataset.id;
              }).quantity++;
              update(cart);
            }
            if(e.target.classList.contains('dec')){
              if(cart.api.products.find((elem) => { return elem.SKU === e.target.dataset.id}).quantity > 0){
                cart.api.products.find((elem) => {
                  return elem.SKU === e.target.dataset.id;
                }).quantity--;
                update(cart);
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

//------------------------------------------------------------------------- Método para Inicializar el Carrito ----------
const initializeCart = (cart) =>{
  const productList = cart.obtenerCarrito().products;

  //Indicar la cantidad de productos existentes en el carrito
  document.querySelector(".full").textContent = productList.length;

  productList.forEach((elem) => {
    cart.actualizarUnidades(elem.SKU, 0);
  });

  printCart(cart.obtenerCarrito());
}

//-------------------------------------------------------------------------- Método para Actualizar ---------
const update = (cart) => {
  printCart(cart.obtenerCarrito())
}

//--------------------------------------------------------------------------- Método para Imprimir el carrito --------
const printCart = (cart) => {
  productRow.innerHTML = '';
  const productList = cart.products;
  //console.log(cart.total)
  productList.forEach((elem)=>{
    templateProductRow.querySelector('.table-product-name').textContent = elem.title
    templateProductRow.querySelector('.table-product-ref').textContent = 'Ref: ' + elem.SKU
    templateProductRow.querySelector('#product-price').textContent = elem.price + cart.currency
    templateProductRow.querySelector('#product-cost').textContent =  Math.round((elem.price * elem.quantity * 100))/ 100 + cart.currency
    templateProductRow.querySelector('#amount').value = elem.quantity
    templateProductRow.querySelector('.dec').dataset.id = elem.SKU
    templateProductRow.querySelector('.inc').dataset.id = elem.SKU
    
    const clone = templateProductRow.cloneNode(true)
    fragment.appendChild(clone)
  });

  document.querySelector('.last-ul span').textContent = Math.round((cart.total * 100))/ 100 + cart.currency;
  updateTotalTable(cart)

  productRow.appendChild(fragment);
}

const updateTotalTable = (cart) =>{
  productRowTotalTable.innerHTML = '';
  const productList = cart.products;
  productList.forEach((elem)=>{
    if(elem.quantity !== 0){
      templateTotalTable.querySelectorAll('li')[0].textContent = elem.title
      templateTotalTable.querySelector('span').textContent = Math.round((elem.price * elem.quantity * 100))/ 100 + cart.currency
   
      const clone2 = templateTotalTable.cloneNode(true)
      fragment2.appendChild(clone2)
    }
  });
  productRowTotalTable.appendChild(fragment2);

}