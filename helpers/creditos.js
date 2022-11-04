const generarCredito = ( {
  valor_credito, 
  interes, 
  total_cuotas, 
  notas, 
  fecha_inicio, 
} ) => {

  let total_pagar = Math.ceil((valor_credito * interes) / 100 + valor_credito);
  let valor_cuota = Math.ceil(total_pagar / total_cuotas);

  return {
    total_pagar,
    valor_cuota,
    valor_credito,
    total_cuotas,
    interes,
    saldo: total_pagar,
    fecha_inicio,
    notas
  }

}

const updatedCredito = (valor_credito, interes, total_cuotas) => {
  let total_pagar = Math.ceil((valor_credito * interes) / 100 + valor_credito);
  let valor_cuota = Math.ceil(total_pagar / total_cuotas); 

  return {
    total_pagar,
    valor_cuota
  }
}


module.exports = {
  generarCredito,
  updatedCredito
}