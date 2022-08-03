const {response} = require ('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario =  async (req,res = response )=> {
        
    const { email, password } = req.body;
    
        try {

            let usuario = await Usuario.findOne ({email});
            
            if ( usuario ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya existe'
                });
            }

            usuario = new Usuario(req.body);

            //encriptar contraseña

            const salt =  bcrypt.genSaltSync(10);
            usuario.password =  bcrypt.hashSync(password, salt);
        
            await usuario.save();
        
            res.status(201).json({
                ok: true,
                name: usuario.name,
                mail: usuario.email
            });
        
        
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el admin',
            });
        }
}

const loginUsuario = async (req, res = response ) => {

    const { email, password } = req.body;
    

    try {
        
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }
        
        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
        
        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}


const revalidarToken = async (req, res = response ) => {

    const { uid, name } = req;

    // Generar JWT
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid,
        name,        
        token,
    })
}




module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}