class Caja{

  cajas = []


  constructor(cajas){
    this.cajas = cajas
  }

  firsMetod(ruta){
    console.log(ruta)
    let cajasFiltradas = this.cajas.filter(caja => caja.ruta === ruta).reverse()
    console.log(cajasFiltradas)
    return cajasFiltradas.splice(0,5);
  }
}

module.exports = Caja;