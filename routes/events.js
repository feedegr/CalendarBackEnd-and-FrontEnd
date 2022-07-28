const events = require('../controllers/events');
const {Router} = require ('express');

const {check} = require ('express-validator');
const {validarJWT} = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

//pasan todos por jwt
router.use(validarJWT);

const { 
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento 
} = require ('../controllers/events');



// obtener evento

router.get('/', getEventos)


// crear evento

router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos,    
    ],
    crearEvento
    )

// actualizar event

router.put('/:id', actualizarEvento)

// borrar evento

router.delete('/:id', eliminarEvento)


module.exports = router;