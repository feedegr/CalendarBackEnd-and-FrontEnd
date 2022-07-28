const { response } = require ('express');
const Evento = require ('../models/Evento');

//populate para traer los datos del usuario (solo el name)

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate('user','name');

    res.json({
        ok: true,
        eventos
    });

}


const crearEvento = async (req, res = response ) => {

    const evento = new Evento ( req.body );  //crear evento

    try {
        evento.user = req.uid;

        const eventoGuardado = await evento.save();    //guardar evento 

        res.json({
            ok: true,
            evento: eventoGuardado
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
            error
        })
    }
        
}



const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if(!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado'
            });
        }

        if ( evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permiso para actualizar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        
        res.json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
            error
        });
    }
}

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if(!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado'
            });
        }

        if ( evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permiso para eliminar este evento'
            });
        }

        const eliminarEvento = await Evento.findByIdAndDelete( eventoId );

        
        res.json({
            ok: true,
            evento: 'evento eliminado',
            eliminarEvento
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
            error
        });
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}