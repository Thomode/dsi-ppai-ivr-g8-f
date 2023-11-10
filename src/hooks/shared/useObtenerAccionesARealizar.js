import {useEffect, useState} from 'react';
import axios from 'axios';

// funcion que obtiene los datos de la API: https://localhost:7110/api/acciones. Estas acciones son las correspondientes al combobox de SELECCIONE ACCION A REALIZAR
const useObtenerAccionesARealizar = () => {
    // declaro un estado react en el cual almacenare todas las acciones posibles, se inicializa como array vacio debido a que cada accion es una mera cadena de caracteres
    const [datosAccionesARealizar, setDatosAccionesARealizar] = useState([]);
    // se obtinenen las acciones posibles la primera vez que se renderice el componente, no cambian a lo largo del tiempo
    useEffect(() => {
        const fetchData = async () => {
            // esta sentencia lo que hace es, dentro del bloque try almacena los datos obtenidos (si es que se obtienen correctamente, en caso de que no se obtengan correctamente se deja de ejecutar el try y se ejecuta el catch, el cual simplemente muestra el error por consola) en una variable response, response va a ser un objeto de muchos datos, pero el que nos imprta debido a que tiene el contenido que buscamos es el .data de dicho response, ese .data sera el array con todas las acciones posibles que figuraran en el combobox
            try {
                const response = await axios.get(
                    "https://localhost:7110/api/acciones"
                );
                setDatosAccionesARealizar(response.data);
            } catch (error) {
                console.error(error);
            };
        };

        fetchData();
    }, []);
    return datosAccionesARealizar;
};

export {useObtenerAccionesARealizar};