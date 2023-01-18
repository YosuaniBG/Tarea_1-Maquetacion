export class Carrito {
  #api
  //El carrito se construye a partir de un objeto derivado de un JSON
  constructor(api) {
    this.#api = api;
  }

  //Actualiza el valor quantity del objeto, si este no existe lo crea y le asigna el valor (units)
  actualizarUnidades(sku, units) {
    this.#api.products.find((elem) => {
      return elem.SKU === sku;
    }).quantity = units;
  }

  //Muestra la informacion de un producto determinado como un objeto
  obtenerInformacionProducto(sku) {
    return this.#api.products.find((elem) => {
      return elem.SKU === sku;
    });
  }

  obtenerCarrito() {
    if(isNaN(this.obtenerTotal()))
      this.#api.total = 0
    else
      this.#api.total = this.obtenerTotal()
    return this.#api; 
  }

  // Permite obtener el total a pagar en el carrito, si no se actualizan
  // las unidades antes, el método lanza un valo NaN que luego se tomará
  // como 0 en el método obtenerCarrito().
    obtenerTotal() {
    const productList = this.#api.products;
    const suma = productList.reduce((acc, elem) => {
      return acc + elem.quantity * elem.price;
    }, 0);
    
    return suma;
  }

  adicionarProducto(producto){
    const productList = this.#api.products;
    let exist = false;
    for (let i = 0; i < productList.length; i++) {
      const elem = productList[i];
      if (elem.SKU === producto.SKU) {
        elem.quantity++;
        exist = true;
        break;      
      }      
    }
    if (!exist)
      this.#api.products.push(producto);    
  }

  eliminarProducto(sku){
    const productList = this.#api.products;
    for (let i = 0; i < productList.length; i++) {
      const elem = productList[i];
      if (elem.SKU === sku) {
        productList.splice(i,1);
        break;      
      }   
    }
  }

}
