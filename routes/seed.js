const { Router, request, response } = require('express');
const dataSeed = require('../database/seed');
const { RolModel, UsuarioModel, RutaModel, Gasto } = require('../models');
const bcryptjs = require('bcryptjs');

const router = Router();

router.get('/', async (req = request, res = response) => {
  try {
    await RolModel.deleteMany();
    await UsuarioModel.deleteMany();
    await RutaModel.deleteMany();
    await Gasto.deleteMany();

    const arregloRoles = [];
    dataSeed.roles.forEach((rol) => {
      arregloRoles.push(RolModel.create({ rol }))
    })

    await Promise.all(arregloRoles)

    const [{id: idAdmin}, {id: idCobrador}, rutaDB] = await Promise.all([
      RolModel.findOne({rol: dataSeed.user.rol}),
      RolModel.findOne({rol: dataSeed.empleado.rol}),
      RutaModel.create(dataSeed.ruta),
    ])

    const listaGastos = [];
    dataSeed.gastos.forEach(gasto => {
      listaGastos.push(Gasto.create({gasto}));
    });
    
    await Promise.all(listaGastos);

    const [adminUser, empleado] = await Promise.all([
      UsuarioModel.create({
        ...dataSeed.user,
        password: bcryptjs.hashSync(dataSeed.user.password, 10),
        rol: idAdmin
      }),
      UsuarioModel.create({
        ...dataSeed.empleado,
        password: bcryptjs.hashSync(dataSeed.empleado.password, 10),
        rol: idCobrador,
        ruta: rutaDB.id
      })
    ]);

    adminUser.rutas.push(rutaDB);
    await adminUser.save();

    res.json({
      ok: true,
      adminUser,
      msg: 'seed execute'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: error.message
    })
  }
})

module.exports = router;