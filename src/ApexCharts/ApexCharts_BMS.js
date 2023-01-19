import axios from "axios";
import React from "react";
import Chart from "react-apexcharts";

function Axios_GET_BMS() {
    const [metadata, setMetadata] = React.useState([1])
    // URL de donde se extraera la informacion
    //const baseURL = "https://bms.controldigital.mx/data2.php";
    const baseURL = "data.json";

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

    console.log(metadata.length);

    const info = metadata.map((reg, index) => (
        (index < 10) ? [new Date(`${reg.TIMESTAMP}`.substring(0, `${reg.TIMESTAMP}`.length - 3) * 1000), parseFloat(`${reg.VALUE}`).toFixed(2)] : 0
    ));
    
    const dataSeries = [
        {
            name: "Registros BMS",
            data: info
        }
    ];

    const options = {
        chart: {
            height: "70%",
            type: "area",
            animations: {
                initialAnimation: {
                    enabled: false
                }
            }
        },
        xaxis: {
            type: 'datetime'
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