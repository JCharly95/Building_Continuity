// ** Third Party Components
import axios from 'axios';
import './hideOptDown.css';
import { jsPDF } from 'jspdf';
import "../Estilos/estilosGen.css";
import Chart from 'react-apexcharts';
import Copyright from '../Footer/pie';
import html2canvas from 'html2canvas';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import BarraNavega from '../Navbar/barraNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AlertTriangle } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import SelFilBus from '../Listas/lista_Senso_Dbl';
import { Search, Calendar, Clock } from 'react-feather';
import AddSensor from './Agregar_Sensor/form_Nue_Sensor';
import React, { useEffect, useState, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";

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
    // Variable de estado para la apertura o cierre del modal de aviso de errores
    const [modalError, setModalError] = useState(false);
    // Variable de estado para el establecimiento del mensaje contenido en el modal de errores
    const [modalErrMsg, setModalErrMsg] = useState("Ocurrio un error en la accion solicitada");
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
    /* Variable de contador para inactividad
    let contActivi;*/
//-------------------------------------------------------------------------------------------------------------
//-------------------------Peticiones con Axios para obtener la informacion------------------------------------
    useEffect(() => {
        // Peticion para obtener los datos de historicrecord que se usaran en la grafica
        const obteInfo = async (estado) => {
            try {
                const peticion = await axios.get('https://app.buildingcontinuity.com.mx/php/data.php?tipo_consulta=historico');
                estado(peticion.data);
            } catch (error) {
                console.log("Error en los datos");
            }
        }
        obteInfo(setMetadata);
    }, []);

    useEffect(() => {
        //Peticion para obtener los valores de la tabla de registros de los sensores
        const obteSenso = async (estado) => {
            try {
                const peticion = await axios.get('https://app.buildingcontinuity.com.mx/php/data.php?tipo_consulta=sensor');
                estado(peticion.data);
            } catch (error) {
                console.log("Error en los datos");
            }
        }
        obteSenso(setListaSenso);
    }, []);

    useEffect(() => {
        // Agregando un listener para la deteccion de teclas al presionarse
        document.addEventListener('keydown', (event) => {
            if(event.key==="F12"){
                event.preventDefault()
                setModalErrMsg("Error: Accion no valida");
                setModalError(!modalError);
            }
            if(event.key==="ContextMenu"){
                event.preventDefault()
                setModalErrMsg("Error: Accion no valida");
                setModalError(!modalError);
            }
        }, true)
    }, [modalError])

    // Apertura/Cierre del modal de errores
    const AbrCerrError = () => {
        setModalError(!modalError);
    }
    /*function contaInacti(){
        clearTimeout(contActivi);
        contActivi = setTimeout(userInacti, 10000);
    }
    function userInacti(){
        //localStorage.clear()
        //navegar("/login");
        alert("Tiempo de sesion expirado")
    }*/
//-------------------------------------------------------------------------------------------------------------
//--------------Verificacion del local storage para ver si hay un usuario logueado-----------------------------
    // Si la credencial del usuario no esta almacenada en el localStorage, quiere decir que no ha iniciado sesion, por lo que se le retornara al login
    if(!usSession){
        navegar("/login");
    }else{
        //contaInacti();
    //----Obtencion de todos los registros que coincidan con el nombre/identificador de busqueda-----------
        // Por ejemplo: en este caso es la linea 3
        const regsBusqueda = [];
        metadata.map(
            (allData) => (
                (tipInfoBus.split(";")[0]!=="404") ?
                    (`${allData.HISTORY_ID}`.includes(tipInfoBus.split(";")[0])) ? 
                        regsBusqueda.push({
                            ID: parseInt(`${allData.ID}`),
                            DATE: (new Date(parseInt(`${allData.TIMESTAMP}`))),
                            VALUE: parseFloat(parseFloat(`${allData.VALUE}`).toFixed(2))
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
                },
                toolbar: {
                    tools: {
                        customIcons: [{
                            icon: 'PDF',
                            title: 'Exportar a PDF',
                            class: 'custom-icon',
                            click: async function exportPDF(){
                                // Obtener el area a exportar
                                const areaExportar = document.getElementById("areaGraf");
                                // Crear el objeto html2canvas para exportar
                                const contePDF = await html2canvas(areaExportar);
                                // Obtener el contenido del elemento canvas como una imagen para otros recursos
                                const dataInfo = contePDF.toDataURL("image/png");
                                // Obtener anchura y altura del div de la grafica, asi como variables para establecerle padding a la imagen con relacion a las dimensiones del div que la contiene
                                let ancho = areaExportar.clientWidth, alto = areaExportar.clientHeight, altoEspa, anchoEspa;

                                // Si la grafica es mas ancha que alta se creara un PDF con formato "landscape"/horizontal para su impresion y se establecera la unidad de dimensiones de la imagen en pixeles
                                // En caso contrario, se establecera la salida como "portrait"/vertical y la misma unidad de dimensiones
                                if (ancho > alto) {
                                    let pdfArchi = new jsPDF('l', 'px', [ancho, alto]);
                                    ancho=pdfArchi.internal.pageSize.getWidth();
                                    alto=pdfArchi.internal.pageSize.getHeight();
                                    anchoEspa=ancho-20;
                                    altoEspa=alto-20;
                                    pdfArchi.addImage(dataInfo, 'PNG', 10, 10, anchoEspa, altoEspa);
                                    pdfArchi.save(`BMS Grafica de ${getFecha()}; ${dataSeries[0].name}.pdf`);
                                }
                                else {
                                    let pdfArchi = new jsPDF('p','px', [alto, ancho]);
                                    ancho=pdfArchi.internal.pageSize.getWidth();
                                    alto=pdfArchi.internal.pageSize.getHeight();
                                    anchoEspa=ancho-20;
                                    altoEspa=alto-20;
                                    pdfArchi.addImage(dataInfo, 'PNG', 10, 10, anchoEspa, altoEspa);
                                    pdfArchi.save(`BMS Grafica de ${getFecha()}; ${dataSeries[0].name}.pdf`);
                                }
                            }
                        }]
                    },
                    export: {
                        csv: {
                            headerCategory: "Fecha",
                            filename: `BMS Grafica de ${getFecha()}; ${dataSeries[0].name}`
                        },
                        svg: {
                            filename: `BMS Grafica de ${getFecha()}; ${dataSeries[0].name}`
                        }
                    }
                }
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false,
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
                    format: "dd MMM yyyy; HH:mm:ss"
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
        // Funcion para muestra del menu contextual
        function contextMenu(event){
            event.preventDefault()
            setModalErrMsg("Error: Accion no valida");
            AbrCerrError();
        }
        function getFecha(){
            let fecha, dia="", mes="", hora="", min="";
            fecha = new Date()
        
            // Agregar un cero por si el dia tiene solo un digito
            if(fecha.getDate().toString().length === 1)
                dia="0"+fecha.getDate().toString()
            else
                dia=fecha.getDate()
            // Agregar un cero por si el mes tiene un solo digito
            if(fecha.getMonth().toString().length === 1)
                mes="0"+fecha.getMonth().toString()
            else
                mes=fecha.getMonth()
            // Agregar un cero por si la hora solo tiene un digito
            if(fecha.getHours().toString().length === 1)
                hora="0"+fecha.getHours().toString()
            else    
                hora=fecha.getHours()
            // Agregar un cero por si el minuto tiene un solo digito
            if(fecha.getMinutes().toString().length === 1)
                min="0"+fecha.getMinutes().toString()
            else
                min=fecha.getMinutes()
                
            return(`${fecha.getFullYear()}-${mes}-${dia}_${hora}.${min}`);
        }
        /*<div onMouseMove={contaInacti} onPointerMove={contaInacti} onKeyDown={contaInacti}>*/
        return (
            <div className="pageSchema" onContextMenu={contextMenu}>
                <BarraNavega />
                <div className='container-fluid border mt-3'>
                    <div className='row align-items-center border pt-3 pb-3 text-center'>
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
                                        }> Limpiar Seleccion
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
                        </div>
                    </div>
                    <div id='areaGraf' className='row align-items-center border pt-3 pb-5 mb-2'>
                        <Chart options={options} series={dataSeries} type="line" width="100%" height="280%" />
                    </div>
                </div>
                <div id="ModalError">
                    <Modal isOpen={modalError} toggle={AbrCerrError}>
                        <ModalHeader toggle={AbrCerrError}>
                            Error <AlertTriangle color="red" size={30} />
                        </ModalHeader>
                        <ModalBody>
                            <Alert color="danger">
                                {modalErrMsg}
                            </Alert>
                        </ModalBody>
                    </Modal>
                </div>
                <Copyright />
            </div>
        );
    }
    return 0;
}