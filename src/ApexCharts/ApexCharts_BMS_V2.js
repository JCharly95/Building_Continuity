import axios from "axios";
import React from "react";
import Chart from "react-apexcharts";

function Axios_GET_BMS() {
    const [metadata, setMetadata] = React.useState([1])
    // URL de donde se extraera la informacion
    //const baseURL = "https://bms.controldigital.mx/data2.php";
    const baseURL = "https://jsonplaceholder.typicode.com/photos";

  React.useEffect(() => {
    async function obtenerDatos(estado){
      const peticion = await axios.get(baseURL);
      estado(peticion.data);
    }
    obtenerDatos(setMetadata);
  }, []);

  if (!metadata) {
    console.log("Ocurrio un problema en la obtencion de la informacion");
    return null;
  }

  return (metadata);
}

export default function ApexCharts_BMS (){
    const metadata = Axios_GET_BMS();

    console.log(metadata);

    const datos = metadata.map((reg) => (
        reg.id
    ));
    
    const etiquetas = metadata.map((reg) => (
        reg.albumId
    ));

    const dataSeries = [
        {
            name: "Fotos JSONPlaceholder",
            data: datos
        }
    ];
    
    const options = {
        chart: {
            height: "70%",
            type: "line",
            animations: {
                initialAnimation: {
                    enabled: false
                }
            }
        },
        xaxis: {
            type: etiquetas
        },
        noData: {
            text: 'Cargando Informacion'
        }
    };

    return (
        <div id="chart">
            <Chart options={options} series={dataSeries} type="line" />
        </div>
    );
}