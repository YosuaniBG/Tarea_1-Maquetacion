import { Carrito } from "./cart.js";
const productRow = document.querySelector('.product-row')
const templateProductRow = document.getElementById('template-product-row').content

const productRowTotalTable = document.querySelector(".product-row-total-table");
const templateTotalTable = document.getElementById("template-total-table").content;

const fragment = document.createDocumentFragment()


document.addEventListener('DOMContentLoaded', () => {

  //Cambiar imagen del producto principal
  document.querySelector('.image-list').addEventListener('click', e => {
    if(e.target.classList.contains('image-list-item')){
      const url = e.target.getAttribute('src');
      document.querySelector('.product-main').setAttribute('src', url);
    }
  })

  //Mostar Display del Carrito
  document.querySelector('.cart-img').addEventListener('click', () => {
    if(document.querySelector(".navbar").classList.contains("navbar-show"))
      hiddenMenu();
    toggleCartDisplay();
  });

  //Ocultar Display del Carrito al hacer click en el backdrop o la flecha hacia arriba
  document.querySelector('.offcanvas-backdrop').addEventListener("click", toggleCartDisplay);
  document.querySelector('.fa-arrow-up-from-bracket').addEventListener("click", toggleCartDisplay);

  
  // Mostrar Menú al hacer click en las barras
  document.querySelector(".fa-bars").addEventListener("click", () => {
    if(document.querySelector('.cart-container').classList.contains('show-cart-container'))
      toggleCartDisplay();
    document.querySelector(".navbar").classList.toggle("navbar-show");

    if(document.querySelector(".navbar").classList.contains("navbar-show"))
      document.querySelector(".cart-img").setAttribute('src','images/cart_empty_white.png');
    else
      document.querySelector(".cart-img").setAttribute('src','images/cart_empty_blue.png');
  
    document.querySelector("main").classList.toggle("main-translate");
  });

  // Ocultar Menú al hacer scrolling
  document.addEventListener('scroll', hiddenMenu);

  // Ocultar Menú al dimensionar la ventana
  window.addEventListener('resize', () => {
    if(document.querySelector(".navbar").classList.contains("navbar-show"))
      hiddenMenu(); 
  });


  getProductAPI();

});

//----------------------------------------------------------  Esencia ---------------------
const getProductAPI = () => {
  try {
     fetch("https://jsonblob.com/api/1061116324926996480").then(
      (result) => {
        result.json().then((datos) => {
          const cart = new Carrito(datos);
 
          initializeCart(cart);

          //Acciones de los botones Incremento, Decremento, Delete e Input
          productRow.addEventListener('click', e =>{
            const sku = e.target.dataset.id

            if(e.target.classList.contains('count')){
              e.target.addEventListener('change', () => {
                const inputValue = parseInt(e.target.value)
                if(inputValue >= 0)
                  cart.actualizarUnidades(e.target.id, inputValue);                
                update(cart);
              })
            }
            if(e.target.classList.contains('inc')){
              cart.actualizarUnidades(sku, cart.obtenerInformacionProducto(sku).quantity + 1);
              update(cart);
            }
            if(e.target.classList.contains('dec')){
              if (cart.obtenerInformacionProducto(sku).quantity > 0) {
                cart.actualizarUnidades(sku, cart.obtenerInformacionProducto(sku).quantity - 1);
                update(cart);
              }
            }
            if(e.target.classList.contains('fa-trash-can')){
              cart.eliminarProducto(sku)
              if(cart.obtenerCarrito().products.length === 0){
                update(cart);
                productRow.innerHTML = '<span class="text-cart-empty">Todos los productos en el carrito han sido eliminados, por favor inserte nuevos productos</span>';
              }else
                update(cart);
            }
          })

          //Añadir producto al carrito (Teléfono)
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

              card.querySelector('.succefull').classList.toggle('show-succefull');
              window.setTimeout(() => {
                card.querySelector('.succefull').classList.toggle('show-succefull');
              }, 700)
            }
          })

          //Vaciar carrito
          document.querySelector('.btn-empty-cart').addEventListener('click', () =>{
            const productList = cart.obtenerCarrito().products;
            while (productList.length > 0) {
               cart.eliminarProducto(productList[0].SKU);
            }
            update(cart)
            productRow.innerHTML = '<span class="text-cart-empty">Todos los productos en el carrito han sido eliminados, por favor inserte nuevos productos</span>';
          })

        });
      }
    );
  } catch (error) {
    alert("El sitio lanzó el siguiente error: " + error + ", al parecer hubo algún problema a la hora de cargar la API");
  }
};

//-------------------------------------------------------- Función para Inicializar el Carrito ----------
const initializeCart = (cart) => {
  const productList = cart.obtenerCarrito().products;
 
  //Indicar la cantidad de productos existentes en el carrito
  document.querySelector(".full").textContent = productList.length;

  productList.forEach((elem) => {
    cart.actualizarUnidades(elem.SKU, 0);
  });

  printCart(cart.obtenerCarrito());
}

//------------------------------------------------------- Función para Actualizar ---------
const update = (cart) => {
  document.querySelector(".full").textContent = cart.obtenerCarrito().products.length;
  printCart(cart.obtenerCarrito());
}

//------------------------------------------------------- Función para Imprimir el carrito --------
const printCart = (cart) => {
  productRow.innerHTML = '';

  const productList = cart.products;
  productList.forEach((elem)=>{
    templateProductRow.querySelector('.table-product-name').textContent = elem.title
    templateProductRow.querySelector('.table-product-ref').textContent = 'Ref: ' + elem.SKU
    templateProductRow.querySelector('.count').value = elem.quantity
    templateProductRow.querySelector('.count').id = elem.SKU
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

//---------------------------------------------------------- Función para imprimir la tabla del Total --------
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

//------------------------------------------------------------ Funciones para los elementos offcanvas -----
const toggleCartDisplay = () => {
  document.querySelector('.cart-container').classList.toggle('show-cart-container');
  document.querySelector('body').classList.toggle('hidden-scroll-y');
  document.querySelector('.offcanvas-backdrop').classList.toggle('show-offcanvas-backdrop');
}

const hiddenMenu = () => {
  document.querySelector(".navbar").classList.remove("navbar-show");
  document.querySelector(".cart-img").setAttribute('src','images/cart_empty_blue.png');
  document.querySelector("main").classList.remove("main-translate");
}