import {useState, useEffect} from "react";
import axios from "axios";

const useLlamadas = () => {
    // declaracion de estados necesarios para la gestion del caso de uso, estos estados no estan relacionados con la logica de negocio, solo sirven para las funcionalidades del sistema, por ejemplo que el boton validar en cada validacion este deshabilitado hasta que el usuario haya elegido alguna opcion
    const [datosLlamada, setDatosLlamada] = useState({}); // se almacenaran los datos de la llamada de turno
    const [mostrarValidacion, setMostrarValidacion] = useState(false); // booleano que indica si se debe renderizar el componente Validacion o no
    const [mostrarFormulario, setMostrarFormulario] = useState(false); // booleano que indica si se debe renderizar la parte del componente RegistrarRespuestaDeOperador en la que se escribe la descripción y se elige la accion a realizar, o no
    const [subopcionIndex, setSubopcionIndex] = useState(0); // Índice de la subopción actual
    const [validacionIndex, setValidacionIndex] = useState(0); // Índice de la validación actual
    const [descripcion, setDescripcion] = useState(""); // descripcion que escribe el operador
    const [accionSeleccionada, setAccionSeleccionada] = useState(""); // accion que escoge el operador
    const [confirmarHabilitado, setConfirmarHabilitado] = useState(false); // booleano que indica si se debe habilitar el boton de confirmacion o no
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(""); // la opcion que elige el usuario en cada validacion de cada subopcion, este estado se reinicia cada vez que se cambia de validacion
    const [confirmacionExitosa, setConfirmacionExitosa] = useState(null); // estado que se inicializa como nulo pero que al final de la ejecucion se volvera booleano con el fin de renderizado condicional del flujo alternativo: LA CONFIRMACION NO SE EJECUTO CON EXITO
    const [validacionExitosa, setValidacionExitosa] = useState(null); // estado que se inicializa como nulo pero que al final de la validacion de turno asumira un valor booleano, si dicho valor booleano es el de true, pasa a la siguiente validacion normalmente, si es false informa el error de validacion y vuelve al inicio

    // obteniendo los datos de la llamada desde el backend, se trae el nombre completo del cliente, la categoria de la llamada, la opcion escogida por el cliente, el conjunto de subopciones escogidas por el cliente y todas las validaciones correspondientes a cada subopcion elegida
    useEffect(() => {
        const mostrarDatosLlamada = async () => {
            try {
                const response = await axios.get(
                    "https://localhost:7110/api/datos-llamada"
                );
                setDatosLlamada(response.data);
            } catch (error) {
                console.error(error);
            };
        };

        mostrarDatosLlamada();
    }, []);

    // activa la renderizacion de los componentes de Validacion
    const pedirRespuestaValidacion = () => {
        setMostrarValidacion(true);
    };


    // corrobora por cada validacion, si la validacion es correcta o no
    const tomarRespuestaValidacion = async (opcionSeleccionada) => {
        const validacion = await axios.post('https://localhost:7110/api/validacion', {"descripcion": opcionSeleccionada.toString()});
        let validadoConExito = false;
        if (validacion.data === true) {
            validadoConExito = validacion.data;
        };
        setValidacionExitosa(validadoConExito);
        return validadoConExito;
    };


    // si el usuario pulsa cancelar en alguna validacion, vuelve al componente REGISTRAR RESPUESTA DE OPERADOR, sin mostrar el textarea ni el select de la accion a realizar
    const handleCancelarClick = () => {
        volverAInicio();
    };

    
    // Aqui lo que hace es el recorrido necesario para renderizar todas las validaciones, de a una por vez, por eso se ejecuta cada vez que se pulsa el boton VALIDAR dentro del componente VALIDACION
    const handleConfirmarClick = async () => {
        const subopcionActual = datosLlamada.subOpciones[subopcionIndex];
        const cantidadValidaciones = subopcionActual.validaciones.length;

        if (validacionIndex < cantidadValidaciones - 1) {
            setValidacionIndex(validacionIndex + 1);
        } else {
            if (subopcionIndex < datosLlamada.subOpciones.length - 1) {
                setSubopcionIndex(subopcionIndex + 1);
                setValidacionIndex(0);
                setMostrarValidacion(true);
            } else {
                setMostrarValidacion(false);
                setMostrarFormulario(true);
            };
        };
    };


    // va actualizando el estado de habilitacion del boton confirmar del componente REGISTRAR RESPUESTA DE OPERADOR, y dicho estado se actualiza cada vez que cambie el estado descripcion o bien el estado accionSeleccionada, el boton confirmado va a estar habilitado solamente si el usuario ingreso algo en alguno de los 2 valores
    useEffect(() => {
        checkConfirmarHabilitado();
    }, [descripcion, accionSeleccionada]);

    const checkConfirmarHabilitado = () => {
        if (descripcion !== "" || accionSeleccionada !== "") {
            setConfirmarHabilitado(true);
        } else {
            setConfirmarHabilitado(false);
        };
    };


    // funcion actualizadora de estado de la opcion elegida por el usuario en cada validacion
    const handleOpcionChange = (opcion) => {
        setOpcionSeleccionada(opcion);
    };


    // funcion que lleva a cabo la confirmacion del registro, en cuanto el usuario pulse el boton CONFIRMAR en el componente REGISTRAR RESPUESTA DE OPERADOR. lo que hace es inicialmente obtener el resultado del post de la descripcion y de la accion elegida, los cuales son booleans, en donde, si el usuario no ingreso nada es false, y si ingreso algo es true. Si ambos booleans son true, es decir, si el usuario ingreso algo en ambos elementos, entonces la confirmacion se lleva a cabo con exito, en caso contrario, surge un error y la confirmacion no se lleva a cabo.
    const pedirConfirmacionOperacion = async (descripcionPuesta, accionElegida) => {
        let confirmacion = false;
        const tomarDescripcionOperador = await axios.post(
        "https://localhost:7110/api/descripcion-operador",
            {'descripcion': descripcionPuesta.toString() }
        );

        const tomarAccionRequerida = await axios.post(
        "https://localhost:7110/api/accion-requerida",
            {'descripcion': accionElegida.toString() }
        );

        if (tomarDescripcionOperador.data && tomarAccionRequerida.data) {
            const respuestaAPI3 = await axios.post(
                "https://localhost:7110/api/confirmacion",
                    {'confirmacion': true }
            );
            confirmacion = respuestaAPI3.data;
        } else {
            const respuestaAPI3 = await axios.post(
                "https://localhost:7110/api/confirmacion",
                    {'confirmacion': false }
            );
        };
        setConfirmacionExitosa(confirmacion);
    };


    // reseta el sistema si la validacion no fue exitosa, o bien si el registro fue exitoso (es decir, la confirmacion se realizo con exito)
    const volverAInicio = () => {
        setMostrarValidacion(false);
        setMostrarFormulario(false);
        setSubopcionIndex(0);
        setValidacionIndex(0);
        setDescripcion("");
        setAccionSeleccionada("");
        setConfirmarHabilitado(false);
        setOpcionSeleccionada("");
        setConfirmacionExitosa(null);
        setValidacionExitosa(null);
    };


    // volver atras si hubo errror en la confirmacion, es decir si confirmacion exitosa es false
    const volverAtrasEnConfirmacion = () => {
        setMostrarValidacion(false);
        setMostrarFormulario(true);
        setDescripcion("");
        setAccionSeleccionada("");
        setConfirmarHabilitado(false);
        setConfirmacionExitosa(null);
    };

    
    // devuelvo todos los estados y funciones necesarias 
    return {
        datosLlamada,
        mostrarValidacion,
        mostrarFormulario,
        subopcionIndex,
        validacionIndex,
        descripcion,
        accionSeleccionada,
        confirmarHabilitado,
        opcionSeleccionada,
        confirmacionExitosa, 
        validacionExitosa,
        pedirRespuestaValidacion,
        handleCancelarClick,
        handleConfirmarClick,
        setDescripcion,
        setAccionSeleccionada,
        handleOpcionChange,
        tomarRespuestaValidacion,
        pedirConfirmacionOperacion,
        setConfirmacionExitosa,
        volverAInicio,
        volverAtrasEnConfirmacion,
        setValidacionExitosa
    };
};

export {useLlamadas};