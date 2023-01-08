export class Carrito {
    //El carrito se construye a partir de un objeto derivado de un JSON
    constructor(productos) {
      this.productos = productos;
    }
  
    //Actualiza el valor quantity del objeto, si este no existe lo crea y le asigna el valor (units)
    actualizarUnidades(sku, units) {
      this.productos.products.find((elem) => {
        return elem.SKU === sku;
      }).quantity = units;
    }
  
    //Muestra la informacion de un producto determinado como un objeto
    obtenerInformacionProducto(sku) {
      return this.productos.products.find((elem) => {
        return elem.SKU === sku;
      });
    }
  
    obtenerCarrito() {
      this.productos.total = this.obtenerTotal();
      return this.productos;
    }
  
    //Ajustar bien para en el caso de que aun no tenga la propiedad quantity
    obtenerTotal() {
      let total = 0;
      this.productos.products.forEach((elem) => {
        total += elem.quantity * elem.price;
      });
      return total;
    }
  }
