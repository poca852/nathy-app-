const jwt = require('jsonwebtoken');
const {UsuarioModel, RutaModel} = require('../models');

const validarJWT = async( req, res, next ) => {
    const token = req.header('x-token');
    if ( !token ) {
        return res.status( 401 ).json( {
            msg: 'No hay token en la petición'
        } );
    }
    try {   
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        // leer el usuario que corresponde al uid
        const usuario = await UsuarioModel.findById( uid )
            .populate('rol', 'rol')
            .populate('rutas')

        
        // preguntar si la ruta esta abierta dependiendo si es cobrador o no
        if(usuario.ruta){
            const rutaUser = await RutaModel.findById(usuario.ruta);
            if(!rutaUser.status){
                return res.status(404).json({
                    msg: 'La ruta es encuentra cerrada'
                })
            }
        }

        if( !usuario ) {
            return res.status( 401 ).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }
        
        if(!usuario.estado){
            return res.status(401).json({
                ok: false,
                msg: 'Acceso denegado'
            })
        }
        
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}