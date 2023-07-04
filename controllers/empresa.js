const { request, response } = require("express");
const { EmpresaModel } = require('../models');


const createEmpresa = async(req = request, res = response) => {
   console.log(req.body)
   const empresa = await EmpresaModel.create(req.body)

   return res.status(200).json(empresa)

}

const findAll = async(req = request, res = response) => {
   return res.status(200).json({
      empresas: await EmpresaModel.find()
   })
}

const findOne = async(req = request, res = response) => {
   const {id} = req.params;
   const empresa = await EmpresaModel.findById(id);
   return res.status(200).json({
      empresa: await EmpresaModel.findById(id)
   })
}

module.exports = {
   createEmpresa,
   findAll,
   findOne
}