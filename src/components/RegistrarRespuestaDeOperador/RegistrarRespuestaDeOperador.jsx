import React, { useEffect, useState } from "react";
import "./RegistrarRespuestaDeOperador.css";
import { Validacion } from "../Validacion/Validacion.jsx";
import { useLlamadas } from "../../hooks/shared/useLlamadas.js";
import { useObtenerAccionesARealizar } from "../../hooks/shared/useObtenerAccionesARealizar.js";

const RegistrarRespuestaDeOperador = () => {
  // importacion de los datos y funciones necesarias para el funcionamiento del sistema, tanto del custom hook useLlamadas como del custom hook useObtenerAccionesARealizar
  const {
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
    setValidacionExitosa,
  } = useLlamadas();

  const datosAccionesARealizar = useObtenerAccionesARealizar();

  // actualizando el estado de confirmacion exitosa en cuanto el usuario le de click al boton confirmar, como la actualizacion de estado es asincrona, se usa useEffect
  useEffect(() => {
    if (confirmacionExitosa !== null) {
      setConfirmacionExitosa(confirmacionExitosa);
    }
  }, [confirmacionExitosa]);

  // si el estado mostrar validacion es TRUE, se renderiza el componente Validacion, enviandole ciertas propiedades (en react son conocidas como props), si no es verdadero este estado,muestra el componente RegistrarRespuestaDeOperador, que es el return debajo de este if
  if (mostrarValidacion) {
    const subopcionActual = datosLlamada.subOpciones[subopcionIndex];
    const validacionActual = subopcionActual.validaciones[validacionIndex];

    return (
      <div className="container section">
        <Validacion
          handleCancelar={handleCancelarClick}
          handleValidar={handleConfirmarClick}
          nombreValidacion={validacionActual.nombre}
          nombreSubopcion={subopcionActual.nombre}
          opcionesValidacion={validacionActual.opcionesValidacion}
          opcionSeleccionada={opcionSeleccionada}
          handleOpcionChange={handleOpcionChange}
          tomarRespuestaValidacion={tomarRespuestaValidacion}
          validacionExitosa={validacionExitosa}
          volverAInicio={volverAInicio}
          setValidacionExitosa={setValidacionExitosa}
        />
      </div>
    );
  }

  return (
    <>
      <div className="container section">
        {confirmacionExitosa === null && (
          <form>
            {/* Datos de la llamada traidos del backend */}
            <div className=" col s12 center">
              <h4 id="encabezado-principal">DATOS DE LA LLAMADA</h4>
              <p className="dato-llamada">
                Nombre del Cliente: {datosLlamada.nombreCliente}
              </p>
              <p className="dato-llamada">
                Categoría previamente seleccionada: {datosLlamada.categoria}
              </p>
              <p className="dato-llamada">
                Opción seleccionada: {datosLlamada.opcion}
              </p>
            </div>
            <table id="tabla-subopciones-elegidas" className="z-depth-4">
              <thead>
                <tr>
                  <th className="encabezado-tabla">Subopción</th>
                  <th className="encabezado-tabla">Número de Orden</th>
                </tr>
              </thead>
              <tbody>
                {/* recorre el array de las subopciones elegidas por el cliente y genera una fila de tabla por cada subopcion traida del backend, con2 datos, el nombre de la subopcion y el numero de orden de la misma */}
                {datosLlamada.subOpciones &&
                  datosLlamada.subOpciones.map((subOpcion, index) => (
                    <tr key={index}>
                      <td>{subOpcion.nombre}</td>
                      <td>{subOpcion.nroOrden}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* si el estado mostrarFormulario es false que renderice el boton VALIDAR, si es true, que renderice el textarea y el combobox */}
            {!mostrarFormulario && (
              <div className="col s12 center">
                <button
                  type="button"
                  onClick={pedirRespuestaValidacion}
                  className="btn waves-effect waves-light"
                >
                  Validar
                </button>
              </div>
            )}

            {mostrarFormulario && (
              <>
                <div className="col s12">
                  <label className="labels-registro">
                    Ingresar Descripción
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    id="textarea-registro"
                    className="z-depth-4"
                  />
                </div>

                <div className="col s12" id="combobox-container">
                  <label className="labels-registro">
                    Seleccione acción a realizar:
                  </label>
                  <select
                    className="browser-default z-depth-4"
                    value={accionSeleccionada}
                    onChange={(e) => setAccionSeleccionada(e.target.value)}
                  >
                    <option value="" disabled>
                      Elija opcion
                    </option>
                    {/* por cada elemento dentro del array datosAccionesARealizar, renderiza una opcion posible que el usuario puede elegir en el combobox */}
                    {datosAccionesARealizar &&
                      datosAccionesARealizar.map((accion, index) => (
                        <option key={index} value={accion}>
                          {accion}
                        </option>
                      ))}
                  </select>
                </div>
              </>
            )}
            {/* El boton CONFIRMAR se encontrara deshabilitado hasta que el usuario hayao bien ingresado algo en el textarea, o bien elegido alguna opcion en el combobox */}
            <div className="col s12 center">
              <button
                type="button"
                disabled={!confirmarHabilitado}
                onClick={async () => {
                  await pedirConfirmacionOperacion(
                    descripcion,
                    accionSeleccionada
                  );
                }}
                className="btn waves-effect waves-light botones-finales green darken-2"
              >
                CONFIRMAR
              </button>
              <button
                type="button"
                className="btn waves-effect waves-light botones-finales red darken-4"
                onClick={volverAInicio}
              >
                CANCELAR
              </button>
            </div>
          </form>
        )}
        {confirmacionExitosa === true && (
          <div className="col s12 center">
            <h4 id="encabezado-de-confirmacion-exito">
              REGISTRO DE LLAMADA EXITOSO
              <i className="material-icons small">mood</i>
            </h4>
            <button
              onClick={volverAInicio}
              className="btn waves-effect waves-light light-blue darken-4"
            >
              VOLVER A INICIO
            </button>
          </div>
        )}
        {confirmacionExitosa === false && (
          <div className="col s12 center">
            <h4 id="encabezado-de-confirmacion-fallo">
              REGISTRO ERRONEO, SE CANCELA EL REGISTRO DE LA LLAMADA{" "}
              <i className="material-icons small">mood_bad</i>
            </h4>
            <button
              onClick={volverAtrasEnConfirmacion}
              className="btn waves-effect waves-light light-blue darken-4"
            >
              VOLVER ATRAS
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export { RegistrarRespuestaDeOperador };
