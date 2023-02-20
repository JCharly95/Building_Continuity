// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'
import LogoutForm from '../Login/logout'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'
import SelFilBus from '../Listas/lista_Senso_Dbl'
import { Search, Calendar, Clock } from 'react-feather'
import AddSensor from './Agregar_Sensor/form_Nue_Sensor'
import React, { useEffect, useState, useRef } from 'react';

export default function BombLine_BMS(){
//------------------------------Estableciendo las variables de trabajo-----------------------------------------
    // Variable de estado para la obtencion de registros
    const [metadata, setMetadata] = useState([1]);
    // Establecer las variables de las fechas
    const [fechIni, setFechIni] = useState(Date.now());
    const [fechFin, setFechFin] = useState(Date.now());
    // Establecer la variable de busqueda de datos (el filtro que se usara con la lista desplegable)
    const [tipInfoBus, setTipInfoBus] = useState("404");
    // Los registros suelen estar desde el 15 de marzo hasta el 14 de julio
    const [listaSenso, setListaSenso] = useState([1]);
    // Constante de historial de navegacion
    const navegar = useNavigate();
    // Obteniendo la credencial del usuario logueado
    const usSession = localStorage.getItem("user");
    // Arreglo de valores para el promedio y para concatenacion de elementos en la grafica
    const arrVals = [], info = [];
    // Flatpickr; Preparacion de constantes de referencia para limpieza de campos input
    const fechIniSel = useRef(null), fechFinSel = useRef(null);
    // Flatpickr; Variables de referencia para la obtencion de fechas seleccionadas
    let fechIngreIni, fechIngreFin;
    // Obtencion de la lista de sensores actuales disponibles para la seleccion de busqueda en la lista
    const [listaFil, setListaFil] = useState(listaSenso.map((sensor) => ({
        nombre: `${sensor.Nombre}`,
        valor: `${sensor.ID_}`
    })));       
//-------------------------------------------------------------------------------------------------------------
//-------------------------Peticiones con Axios para obtener la informacion------------------------------------
    useEffect(() => {
        // Peticion para obtener los datos de historicrecord que se usaran en la grafica
        const obteInfo = async (estado) => {
            try {
                const peticion = await axios.get('https://bms.controldigital.mx/data3.php?tipo_consulta=historico');
                //const peticion = await axios.get('https://bms.controldigital.mx/data2.php');
                estado(peticion.data);
            } catch (error) {
                console.log("Hubo un problema en la obtencion de datos con axios");
            }
        }
        obteInfo(setMetadata);
    }, []);

    useEffect(() => {
        //Peticion para obtener los valores de la tabla de registros de los sensores
        const obteSenso = async (estado) => {
            try {
                const peticion = await axios.get('https://bms.controldigital.mx/data3.php?tipo_consulta=sensor');
                estado(peticion.data);
            } catch (error) {
                console.log("Hubo un problema en la obtencion de sensores con axios");
            }
        }
        obteSenso(setListaSenso);
    }, []);

    if (!metadata)
        console.log("Ocurrio un problema en la obtencion de la informacion");

    if (!listaSenso)
        console.log("Ocurrio un problema en la obtencion de la informacion de los sensores registrados");
//-------------------------------------------------------------------------------------------------------------
//--------------Verificacion del local storage para ver si hay un usuario logueado-----------------------------
    // Si la credencial del usuario no esta almacenada en el localStorage, quiere decir que no ha iniciado sesion, por lo que se le retornara al login
    if(!usSession){
        navegar("/login");
    }else{
        //----Obtencion de todos los registros que coincidan con el nombre/identificador de busqueda-----------
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
        //--------------------------Preparacion de Flatpickr------------------------------------------------
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
        //----------------------------------------------------------------------------------------------------
        //----------------Calculando el valor promedio de los registros---------------------------------------
            // Obteniendo el valor promedio de valores
            regsBusqueda.map((reg) => (arrVals.push(reg.VALUE)));
            
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
        //----------------------------------------------------------------------------------------------------
        //----------------Preparacion de las opciones de configuracion para la grafica------------------------
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
        //-------------------------------------------------------------------------------------------------
        //-------------Preparacion del filtro de busqueda de informacion para el usuario-------------------
            if(listaFil.length === 1){
                // Vaciando el arreglo
                listaFil.splice(0, listaFil.length);
                // Rellenando el arreglo con los elementos de la BD
                listaSenso.map((sensor) => (
                    listaFil.push({
                            nombre: `${sensor.Nombre}`,
                            valor: `${sensor.ID_}`
                        }
                    ))
                );
            }
        
            // Funcion para establecer los sensores a buscar; Esta funcion se usara junto con el modal de agregar sensor
            const addSensBus = (nueLista) => {
                setListaFil(nueLista);
            }
            
            // Funcion para setear el tipo de dato a buscar en la grafica; Este dato es retornado por la lista de seleccion
            const solFilBus = (filBus) => {
                setTipInfoBus(filBus);
            }

            const expirarSession = () => {
                setTimeout(function(){
                    const itemStr = usSession
                    // if the item doesn't exist, return null
                    if (!itemStr) {
                        return null
                    }
                    const item = JSON.parse(itemStr)
                    const now = new Date()
                    // compare the expiry time of the item with the current time
                    if (now.getTime() > item.expiracion) {
                        // If the item is expired, delete the item from storage
                        // and return null
                        localStorage.clear()
                        navegar("/login");
                    }
                }, 5000);
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
        //--------------------------------------------------------------------------------------------------
            return (
                <div onMouseOver={expirarSession}>
                    <div className='container-fluid border mt-3'>
                        <div className='row align-items-center border pt-3 pb-3'>
                            <div className='col-md-auto'>
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
                                <div className='row align-items-center mb-2'>
                                    <div className='col-md-auto'>
                                        <AddSensor senFunc={addSensBus} sensores={listaFil} />
                                    </div>
                                </div>
                                <div className='row align-items-center mb-2'>
                                    <div className='col-md-auto'>
                                        <LogoutForm />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row align-items-center border pt-3 pb-3'>
                            <Chart options={options} series={dataSeries} type="line" width="100%" height="280%" />
                        </div>
                    </div>
                </div>
            );
    }
    return 0;
}