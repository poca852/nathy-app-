const generarCredito = ( valor_credito, interes, total_cuotas ) => {
  let total_pagar = (valor_credito * interes) / 100 + valor_credito;
  let valor_cuota = total_pagar / total_cuotas;

  return {
    total_pagar,
    valor_cuota,
  }

}

module.exports = {
  generarCredito
}