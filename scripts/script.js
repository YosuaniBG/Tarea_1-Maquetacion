import { Carrito } from "./cart.js";
const productRow = document.querySelector('.product-row')
const templateProductRow = document.getElementById('template-product-row').content

const productRowTotalTable = document.querySelector(".product-row-total-table");
const templateTotalTable = document.getElementById("template-total-table").content;

const fragment = document.createDocumentFragment()


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.cart-img').addEventListener('click', () => {
    toggleCartMenu();
  });

  document.querySelector('.offcanvas-backdrop').addEventListener("click", () => {
    toggleCartMenu();
  });

  const toggleCartMenu = () => {
    document.querySelector('.cart-container').classList.toggle('show-cart-container');
    document.querySelector('body').classList.toggle('hidden-scroll-y');
    document.querySelector('.offcanvas-backdrop').classList.toggle('show-offcanvas-backdrop');
  }

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

          //Acciones de los botones Incremento, Decremento y Delete
          productRow.addEventListener('click', e =>{
            if(e.target.classList.contains('inc')){
              cart.obtenerCarrito().products.find((elem) => {
                return elem.SKU === e.target.dataset.id;
              }).quantity++;
              update(cart);
            }
            if(e.target.classList.contains('dec')){
              if(cart.obtenerCarrito().products.find((elem) => { return elem.SKU === e.target.dataset.id}).quantity > 0){
                cart.obtenerCarrito().products.find((elem) => {
                  return elem.SKU === e.target.dataset.id;
                }).quantity--;
                update(cart);
              }
            }
            if(e.target.classList.contains('fa-trash-can')){
              cart.eliminarProducto(e.target.dataset.id)
              if(cart.obtenerCarrito().products.length === 0){
                update(cart);
                productRow.innerHTML = '<span class="text-cart-empty">Todos los productos en el carrito ha sido eliminados, por favor inserte nuevos productos</span>';
              }else
                update(cart);
            }
          })

          //Añadir producto al carrito
          document.querySelector('.producto-description').addEventListener('click', e =>{
            if(e.target.classList.contains('buy-btn')){
              const card = e.target.parentElement;
              const product = {
                SKU: card.querySelector('.buy-btn').dataset.id,
                title: "iFhone 13 Pro",
                price: parseFloat(card.querySelector('.cost').textContent),
                quantity: 1
              };
              cart.adicionarProducto(product);
              update(cart);
            }
          })
          
          //Añadir producto al carrito (Accesorios)
          document.querySelector('.accesories').addEventListener('click', e =>{
            if(e.target.classList.contains('add-cart-btn')){
              const card = e.target.parentElement;
              const product = {
                SKU: card.querySelector('.add-cart-btn').dataset.id,
                title: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.price').textContent),
                quantity: 1
              };
              cart.adicionarProducto(product);
              update(cart);
             

            }
          })

          //Vaciar carrito
          document.querySelector('.btn-empty-cart').addEventListener('click', () =>{
            cart.obtenerCarrito().products = [];
            update(cart)
            productRow.innerHTML = '<span class="text-cart-empty">Todos los productos en el carrito ha sido eliminados, por favor inserte nuevos productos</span>';
          })


        });
      }
    );
  } catch (error) {
    alert("El sitio lanzó el siguiente error: " + error + ", al parecer hubo algún problema a la hora de cargar la API");
  }
};

//-------------------------------------------------------- Método para Inicializar el Carrito ----------
const initializeCart = (cart) => {
  const productList = cart.obtenerCarrito().products;

  //Indicar la cantidad de productos existentes en el carrito
  document.querySelector(".full").textContent = productList.length;

  productList.forEach((elem) => {
    cart.actualizarUnidades(elem.SKU, 0);
  });

  printCart(cart.obtenerCarrito());
}

//------------------------------------------------------- Método para Actualizar ---------
const update = (cart) => {
  document.querySelector(".full").textContent = cart.obtenerCarrito().products.length;
  printCart(cart.obtenerCarrito())
}

//------------------------------------------------------- Método para Imprimir el carrito --------
const printCart = (cart) => {
  productRow.innerHTML = '';

  const productList = cart.products;
  productList.forEach((elem)=>{
    templateProductRow.querySelector('.table-product-name').textContent = elem.title
    templateProductRow.querySelector('.table-product-ref').textContent = 'Ref: ' + elem.SKU
    templateProductRow.querySelector('#amount').value = elem.quantity
    templateProductRow.querySelector('.dec').dataset.id = elem.SKU
    templateProductRow.querySelector('.inc').dataset.id = elem.SKU
    templateProductRow.querySelector('#product-price').textContent = elem.price + cart.currency
    templateProductRow.querySelector('#product-cost').textContent =  Math.round((elem.price * elem.quantity * 100))/ 100 + cart.currency
    templateProductRow.querySelector('.fa-trash-can').dataset.id = elem.SKU
    
    const clone = templateProductRow.cloneNode(true)
    fragment.appendChild(clone)
  });
  productRow.appendChild(fragment);

  printTotalTable(cart);
}

//--------------------------------------------------------------------------- Método para imprimir la tabla del Total --------
const printTotalTable = (cart) => {
  productRowTotalTable.innerHTML = '';
  document.querySelector('.last-ul span').textContent = Math.round((cart.total * 100))/ 100 + cart.currency;
  const productList = cart.products;
  productList.forEach((elem)=>{
    if(elem.quantity !== 0){
      templateTotalTable.querySelectorAll('li')[0].textContent = elem.title
      templateTotalTable.querySelector('span').textContent = Math.round((elem.price * elem.quantity * 100))/ 100 + cart.currency
   
      const clone = templateTotalTable.cloneNode(true)
      fragment.appendChild(clone)
    }
  });
  productRowTotalTable.appendChild(fragment)
}