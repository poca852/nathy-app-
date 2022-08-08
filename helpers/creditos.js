const generarCredito = ( valor_credito, interes, total_cuotas ) => {
  let total_pagar = (valor_credito * interes) / 100 + valor_credito;
  let valor_cuota = total_pagar / total_cuotas;
  let saldo = total_pagar;
  let abonos = 0;

  return {
    valor_credito,
    interes,
    total_cuotas,
    total_pagar,
    valor_cuota,
    saldo,
    abonos
  }

}

module.exports = {
  generarCredito
}