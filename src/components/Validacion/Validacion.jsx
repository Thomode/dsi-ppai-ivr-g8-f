import React, { useEffect } from "react";
import "./Validacion.css";

const Validacion = ({
  nombreValidacion,
  nombreSubopcion,
  opcionesValidacion,
  handleCancelar,
  handleValidar,
  opcionSeleccionada,
  handleOpcionChange,
  tomarRespuestaValidacion,
  validacionExitosa,
  volverAInicio,
  setValidacionExitosa,
}) => {
  useEffect(() => {
    handleOpcionChange(""); // Reiniciar la opción seleccionada en cada renderizado
  }, [nombreValidacion]);
  useEffect(() => {
    if (validacionExitosa !== null) {
      setValidacionExitosa(validacionExitosa);
    }
  }, [validacionExitosa]);
  return (
    <>
      {(validacionExitosa === null || validacionExitosa === true) && (
        <>
          <div className="col s12">
            <div className="col s12 center">
              <h4 className="center" id="encabezado-principal-validacion">
                VALIDACIÓN
              </h4>
            </div>
            <p className="dato-validacion">
              Nombre Validación: {nombreValidacion}
            </p>
            <p className="dato-validacion">
              Nombre Subopcion: {nombreSubopcion}
            </p>
          </div>
          <form>
            {opcionesValidacion.map((opcion, index) => (
              <p key={index}>
                <input
                  type="radio"
                  value={opcion.descripcion}
                  name="opcionesValidacion"
                  checked={opcion.descripcion === opcionSeleccionada}
                  onChange={() => handleOpcionChange(opcion.descripcion)}
                  id={index + 1}
                />

                <label htmlFor={index + 1} className="label-opcion-validacion">
                  {opcion.descripcion}
                </label>
              </p>
            ))}

            <div id="botones-validacion-container">
              <button
                type="button"
                onClick={() => {
                  handleValidar();
                  tomarRespuestaValidacion(opcionSeleccionada);
                }}
                disabled={opcionSeleccionada === ""}
                className="btn waves-effect waves-light botones-validacion"
              >
                Validar
              </button>
              <button
                type="button"
                onClick={handleCancelar}
                className="btn waves-effect waves-light botones-validacion red darken-4"
              >
                Cancelar
              </button>
            </div>
          </form>
        </>
      )}
      {validacionExitosa === false && (
        <div className="col s12 center">
          <h4 id="encabezado-error-validacion">
            ERROR EN LA VALIDACION!!! SE CANCELA EL REGISTRO DE LA LLAMADA!!!
          </h4>
          <button
            onClick={volverAInicio}
            className="btn waves-effect waves-light light-blue darken-4"
            id="boton-error-validacion"
          >
            VOLVER A INICIO
          </button>
        </div>
      )}
    </>
  );
};

export { Validacion };
