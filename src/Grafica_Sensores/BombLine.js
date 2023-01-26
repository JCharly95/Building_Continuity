// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import SelFilBus from './Listas/Lista_Senso_Dbl'
import { Search, Calendar, Clock } from 'react-feather'
import AddSensor from './Agregar_Sensor/Form_Nue_Sensor'
import React, { useEffect, useState, useRef } from 'react';

export default function BombLine_BMS (){
    const arrVals = [], info = [];
//------------------------------Estableciendo las variables de trabajo-----------------------------------------
    // Variable de estado para la obtencion de registros
    const [metadata, setMetadata] = useState([1]);
    // Establecer las variables de las fechas
    const [fechIni, setFechIni] = useState(Date.now());
    const [fechFin, setFechFin] = useState(Date.now());
    // Establecer la variable de busqueda de datos (el filtro que se usara con la lista desplegable)
    const [tipInfoBus, setTipInfoBus] = useState("404");
    // Los registros suelen estar desde el 15 de marzo hasta el 14 de julio
//-------------------------------------------------------------------------------------------------------------
//-------------------------Peticion con Axios para obtener la informacion--------------------------------------
    useEffect(() => {
        const obteInfo = async (estado) => {
            const peticion = await axios.get('https://bms.controldigital.mx/data2.php');
            estado(peticion.data);
        }
        obteInfo(setMetadata);
    }, []);
    
    if (!metadata)
        console.log("Ocurrio un problema en la obtencion de la informacion");
//-------------------------------------------------------------------------------------------------------------
//-----------Obtencion de todos los registros que coincidan con el nombre/identificador de busqueda------------
    // Por ejemplo: en este caso es la linea 3
    const regsBusqueda = [];
    metadata.map(
        (info) => (
            (tipInfoBus.split(";")[0]!=="404") ?
                (`${info.HISTORY_ID}`.includes(tipInfoBus.split(";")[0])) ? regsBusqueda.push(
                    {
                        ID: parseInt(`${info.ID}`),
                        DATE: (new Date(parseInt(`${info.TIMESTAMP}`))),
                        VALUE: parseFloat(parseFloat(`${info.VALUE}`).toFixed(2))
                    }
                ) : null
            : null
        )
    );
//-------------------------------------Preparacion de Flatpickr------------------------------------------------
    const fechIniSel = useRef(null), fechFinSel = useRef(null);
    let fechIngreIni, fechIngreFin;
    const optionsInicial = {
        altInput: true,
        enableTime: true,
        altFormat: "Y/m/d; H:i",
        dateFormat: 'Y-m-d H:i',
        defaultDate: Date.now(),
        onClose: function(selectedDates, dateSel) {
            fechIngreIni=new Date(dateSel);
            setFechIni(fechIngreIni);
        }
    };
    const optionsFinal = {
        altInput: true,
        enableTime: true,
        altFormat: "Y/m/d; H:i",
        dateFormat: "Y-m-d H:i",
        defaultDate: Date.now(),
        onClose: function(selectedDates, dateSel) {
            fechIngreFin=new Date(dateSel);
            setFechFin(fechIngreFin);
        }
    };
//-------------------------------------------------------------------------------------------------------------
//-------------------------Calculando el valor promedio de los registros---------------------------------------
    // Obteniendo el valor promedio de valores
    regsBusqueda.map((reg) => ( arrVals.push(reg.VALUE) ));
    
    if(arrVals.length > 0){
        const promedio = parseFloat((arrVals.reduce((valPrev, valAct) => valAct += valPrev) / arrVals.length).toFixed(2));

        regsBusqueda.map(function(registro) {
            const fecha = registro.DATE, valor = registro.VALUE;
            // Si se realizo la limpieza de seleccion de rangos de fechas no se tendran valores, por lo cual solo se retornara la funcion
            if(fechIni==="" || fechFin==="" || (fechIni==="" && fechFin===""))
                return null;
            /* Ya que el promedio depende del resultado de la consulta solo en este punto se puede hacer el filtrado de datos junto con el parametro del promedio.
            Entonces si la fecha se comprende entre la inicial y la final, ademas de ser mayor al promedio (para que no haya tantos registros) se incoporara el registro al arreglo de valores para la grafica*/
            if(fecha > fechIni && fecha < fechFin && valor > promedio)
                info.push([fecha, valor])

            return 0;
        });
    }
//-------------------------------------------------------------------------------------------------------------
//-------------------------Preparacion de las opciones de configuracion para la grafica------------------------
    const dataSeries = [
        {
            name: `Registros ${tipInfoBus.split(";")[1]}`,
            data: info
        }
    ];

    const options = {
        chart: {
            type: "line",
            animations: {
                initialAnimation: {
                    enabled: false
                }
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false
            }
        },
        yaxis: {
            labels: {
                offsetX: 24,
                offsetY: -5
            },
            tooltip: {
                enabled: true
            }
        },
        tooltip: {
            x: {
                format: "dd MMM yyyy; HH:ss"
            },
        },
        noData: {
            text: 'Informacion no disponible'
        }
    };
//-------------------------------------------------------------------------------------------------------------
//----------------------Preparacion del filtro de busqueda de informacion para el usuario----------------------
    const [listaFil, setListaFil] = useState([
        {
            nombre: "Bateria",
            valor: "/niagaratest/Engine$20Battery"
        },
        {
            nombre: "Combustible",
            valor: "/niagaratest/Fuel$20Level"
        },
        {
            nombre: "Linea de Energia 1",
            valor: "/niagaratest/L3$20$2d$20L1"
        },
        {
            nombre: "Linea de Energia 2",
            valor: "/niagaratest/L1$20$2d$20N"
        },
        {
            nombre: "Linea de Energia 3",
            valor: "/niagaratest/L1$20$2d$20L2"
        },
        {
            nombre: "Linea de Energia 4",
            valor: "/niagaratest/L2$20$2d$20L3"
        },
        {
            nombre: "Linea de Energia 5",
            valor: "/niagaratest/L3$20$2dN"
        },
        {
            nombre: "Cantidad de Incendios",
            valor: "/niagaratest/mmH2O$20Contra$20Incendio1"
        },
        {
            nombre: "Nivel de Drenaje",
            valor: "/niagaratest/mmH2O$20Pluvial1"
        },
        {
            nombre: "Nivel de Agua",
            valor: "/niagaratest/mmH2O$20Potable1"
        },
        {
            nombre: "Nivel de Piso",
            valor: "/niagaratest/Number$20of$20Starts"
        }
    ]);

    // Funcion para establecer los sensores a buscar; Esta funcion se usara junto con el modal de agregar sensor
    const addSensBus = (nueLista) => {
        setListaFil(nueLista);
    }
    
    // Funcion para setear el tipo de dato a buscar en la grafica; Este dato es retornado por la lista de seleccion
    const solFilBus = (filBus) => {
        setTipInfoBus(filBus);
    }

    /* Explicacion rapida para pasar valores entre componentes react (hijo a padre)
        Primero se crea una funcion vacia en el componente padre y una variable de estado (useState) vacia o con un valor por defecto.
        La funcion puede ser como la funcion flecha previa a esta explicacion o como el siguiente ejemplo:
            const [datos, estableceDatos] = useState('');
            const hijoAPadre = () => {
            
            }
        Luego se pasa esta funcion como propiedad a la invocacion al componente hijo como esta en SelFilBus debajo. 
            <Hijo hijoAPadre={hijoAPadre}/>
        Nota: La propiedad puede tener el nombre que sea, por ejemplo.
            <SelFilBus selFilBus={solFilBus}/>
        Despues en el componente hijo se acepta la funcion, PERO con el nombre de la propiedad enviada (parametro si se usa function), 
        como es para este caso:
            function menuDropdown({ selFilBus }) {
                ...
            }
        Y dentro del hijo se crea algun elemento que genere un evento donde se pueda establecer el nuevo valor de la propiedad ingresada;
        para este caso, se hicieron botones de la lista desplegable
            <DropdownItem onClick={()=>selFilBus("/niagaratest/Engine$20Battery")}>Bateria</DropdownItem>
        Donde en el evento onClick, se invoca una arrowFunction para establecer el nuevo valor de la prop ingresada en el componente hijo
        con lo cual el valor de retorno al componente padre sera "modificado" (pero mucho ojo, se estan trabajando con propiedades, no con
        metodos remotos como se creia al inicio).
        Finalmente, en la funcion vacia del componente padre se aceptan los datos procesados como parametro y se establece el estado creado,
        por ejemplo:
            const hijoAPadre = (datoshijo) => {
                estableceDatos(datoshijo);
            }
        O como quedo al final el metodo solFilBus previo a esta explicacion.
        Finalmente para ver si es efectivo este elemento, se imprime el valor del estado en el componente padre usando el estado entre llaves.
        Por ejemplo: el resultado del ejemplo teorico seria { datos }, ya que asi se nombro el useState inicial. */
//-------------------------------------------------------------------------------------------------------------
    return (
        <div>
            <div className='container-fluid border mt-3'>
                <div className='row align-items-center border pt-3 pb-3'>
                    <div className='col-md-3'>
                        <div className='row align-items-center'>
                            <div className='col-md-auto'>
                                <Search size={30} />
                            </div>
                            <div className='col-md-auto'>
                                <div className='row align-items-center mb-2'>
                                    <SelFilBus selFilBus={solFilBus} elemSel={listaFil} title="Seleccione la categoria"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-auto'>
                        <div className='row align-items-center'>
                            <div className='col-md-auto'>
                                <Calendar size={30} />
                                <Clock size={30} />
                            </div>
                            <div className='col-md-auto'>
                                <div className='row align-items-center mb-2'>
                                    <span>Seleccionar Fecha y Hora de Inicio:</span>
                                </div>
                                <div className='row align-items-center mb-2'>
                                    <Flatpickr ref={fechIniSel} options={optionsInicial} />
                                </div>
                                <div className='row align-items-center mb-2'>
                                    <button className='btn btn-danger' type="button" onClick={() => {
                                        if (!fechIniSel?.current?.flatpickr) return;
                                            fechIniSel.current.flatpickr.clear();
                                            setFechIni("");
                                        }
                                    }>
                                        Limpiar Seleccion
                                    </button>
                                </div>
                            </div>
                            <div className='col-md-auto'>
                                <Calendar size={30} />
                                <Clock size={30} />
                            </div>
                            <div className='col-md-auto'>
                                <div className='row align-items-center mb-2'>
                                    <span>Seleccionar Fecha y Hora de Fin:</span>
                                </div>
                                <div className='row align-items-center mb-2'>
                                    <Flatpickr ref={fechFinSel} options={optionsFinal} />
                                </div>
                                <div className='row align-items-center mb-2'>
                                    <button className='btn btn-danger' type="button" onClick={() => {
                                        if (!fechFinSel?.current?.flatpickr) return;
                                            fechFinSel.current.flatpickr.clear();
                                            setFechFin("");
                                        }
                                    }>
                                        Limpiar Seleccion
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-auto'>
                        <AddSensor senFunc={addSensBus} sensores={listaFil} elemsBD={metadata} />
                    </div>
                </div>
                <div className='row align-items-center border pt-3 pb-3'>
                    <Chart options={options} series={dataSeries} type="line" width="100%" height="280%" />
                </div>
            </div>
        </div>
    );
}