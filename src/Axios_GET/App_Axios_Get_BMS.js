import axios from "axios";
import React from "react";

const baseURL = "https://bms.controldigital.mx/data2.php";
//const baseURL = "data.json";

export default function Axios_GET_BMS() {
  const [metadata, setMetadata] = React.useState([1])

  React.useEffect(() => {
    async function obtenerDatos(estado){
      const peticion = await axios.get(baseURL);
      estado(peticion.data);
    }
    obtenerDatos(setMetadata);
  }, []);

  if (!metadata) {
    return null;
  }

  return (
    <div>{
      metadata.map((res) => (
      <>
      <h1>Fecha del Registro: {res.TIMESTAMP}</h1>
      <p>Nombre del Registro: {res.HISTORY_ID} <br /> Valor del Registro: {res.VALUE}</p>
      <hr />
      </>
      ))
    }</div>
  );
}