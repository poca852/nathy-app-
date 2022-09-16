const generarCredito = ( {
  valor_credito, 
  interes, 
  total_cuotas, 
  notas, 
  fecha, 
  idCliente,
  idRuta
} ) => {

  let total_pagar = (valor_credito * interes) / 100 + valor_credito;
  let valor_cuota = total_pagar / total_cuotas;

  return {
    total_pagar,
    valor_cuota,
    valor_credito,
    total_cuotas,
    interes,
    saldo: total_pagar,
    fecha_inicio: fecha,
    ruta: idRuta,
    cliente: idCliente,
    notas
  }

}

const updatedCredito = (valor_credito, interes, total_cuotas) => {
  let total_pagar = (valor_credito * interes) / 100 + valor_credito;
  let valor_cuota = total_pagar / total_cuotas; 

  return {
    total_pagar,
    valor_cuota
  }
}

module.exports = {
  generarCredito,
  updatedCredito
}