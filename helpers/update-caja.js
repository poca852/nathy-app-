const {CajaModel, CreditoModel, PagoModel, InversionModel, GastoModel, RetiroModel} = require('../models')

const actualizarCaja = async (ruta, fecha_inicio) => {

  if(!ruta || !fecha_inicio) throw new Error('la ruta y la fecha son necesarios');

  const [caja, allCreditos, todayCreditos, pagos, inversiones, gastos, retiros, totalClientesPagos] = await Promise.all([
    CajaModel.findOne({ruta, fecha: fecha_inicio}),
    CreditoModel.find({ruta, status: true}),
    CreditoModel.find({ruta, fecha_inicio})
      .populate('pagos'),
    PagoModel.find({ruta, fecha: new RegExp(fecha_inicio, 'i')})
      .populate("credito"),
    InversionModel.find({ruta, fecha: fecha_inicio}),
    GastoModel.find({ruta, fecha: fecha_inicio}),
    RetiroModel.find({ruta, fecha: fecha_inicio}),
    PagoModel.countDocuments({ruta, fecha: new RegExp(fecha_inicio, 'i')})
  ]);

  let extra = 0;

  if(!caja) throw new Error('Esta intentando actualizar una caja que no existe')

  // primero verificar que pagos se han echo por encima de su valor de cutoa;
  pagos.forEach(p => {
    if(p.valor > p.credito.valor_cuota){
      extra += p.valor - p.credito.valor_cuota
    }
  })

  todayCreditos.forEach(c => {
    if(c.pagos.length > 0){
      extra += c.pagos[0].valor;
    }
  })


  let base = caja.base;
  let inversion = 0;
  let retiro = 0;
  let gasto = 0;
  let cobro = 0;
  let prestamo = 0;
  let total_clientes = 0;
  let pretendido = 0;
  let renovaciones = 0;

  inversiones.forEach(inves => {
    inversion += inves.valor;
  })

  retiros.forEach(re => {
    retiro += re.valor;
  })

  allCreditos.forEach(credito => {
    total_clientes += 1;
    pretendido += Math.ceil(credito.valor_cuota)
  })

  gastos.forEach(g => {
    gasto += g.valor;
  })

  pagos.forEach(pago => {
    cobro += pago.valor;
  })

  todayCreditos.forEach(credito => {
    prestamo += credito.valor_credito;
    renovaciones += 1;
  })

  caja.base = base;
  caja.inversion = inversion;
  caja.retiro = retiro;
  caja.gasto = gasto;
  caja.cobro = cobro;
  caja.prestamo = prestamo;
  caja.total_clientes = total_clientes,
  caja.pretendido = pretendido,
  caja.clientes_pendientes = total_clientes - totalClientesPagos
  caja.renovaciones = renovaciones,
  caja.extra =  extra;
  caja.caja_final = (base + inversion + cobro) - (retiro + gasto + prestamo)

  await caja.save()
  return true;


}

module.exports = actualizarCaja;