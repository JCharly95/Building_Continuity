import axios from 'axios';
import { jsPDF } from 'jspdf';
import "../Estilos/estilosGen.css";
import Chart from 'react-apexcharts';
import Copyright from '../Footer/pie';
import html2canvas from 'html2canvas';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import BarraNavega from '../Navbar/barraNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar } from 'react-feather';
import SelFilBus from '../Listas/listaFilSelGraf';
import AddSensor from './Agregar_Sensor/form_Nue_Sensor';
import { AlertTriangle, AlertCircle } from 'react-feather';
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
    // Variable de estado para la apertura o cierre del modal de avisos
    const [modalAdv, setModalAdv] = useState(false);
    // Variable de estado para el establecimiento del mensaje contenido en el modal de errores
    const [modalErrMsg, setModalErrMsg] = useState("Ocurrio un error en la accion solicitada");
    // Variable de estado para el establecimiento del mensaje contenido en el modal de avisos
    const [modalAdvMsg, setModalAdvMsg] = useState("Esperando mensaje de advertencia");
    // Arreglo de valores para el promedio y para concatenacion de elementos en la grafica
    const arrVals = [], info = [];
    // Flatpickr; Preparacion de constantes de referencia para limpieza de campos input
    const fechIniSel = useRef(null), fechFinSel = useRef(null);
    // Flatpickr; Variables de referencia para la obtencion de fechas seleccionadas
    let fechIngreIni, fechIngreFin;
    // Obtencion de la lista de sensores actuales disponibles para la seleccion de busqueda en la lista
    const [listaFil, setListaFil] = useState(listaSenso.map(
        (sensor) => {
            if(`${sensor.VALUEFACETS}`.split(";")[1]!==''){
                if(`${sensor.VALUEFACETS}`.split(";")[1]==='V' || `${sensor.VALUEFACETS}`.split(";")[1]==='v'){
                    return {
                        nombre: `${sensor.Nombre}`, 
                        valor: `${sensor.ID_}`, 
                        unidad: 'Volts'
                    }
                }else if(`${sensor.VALUEFACETS}`.split(";")[1]==='%'){
                    return {
                        nombre: `${sensor.Nombre}`, 
                        valor: `${sensor.ID_}`, 
                        unidad: '% de Combustible'
                    }
                }else{
                    return {
                        nombre: `${sensor.Nombre}`, 
                        valor: `${sensor.ID_}`, 
                        unidad: `${sensor.VALUEFACETS}`.split(";")[1]
                    }
                }
            }else{
                if(`${sensor.ID_}`.includes("Incendio")){
                    return {
                        nombre: `${sensor.Nombre}`, 
                        valor: `${sensor.ID_}`, 
                        unidad: 'Detecciones de Humo'
                    }
                }else if(`${sensor.ID_}`.includes("Potable")){
                    return {
                        nombre: `${sensor.Nombre}`, 
                        valor: `${sensor.ID_}`, 
                        unidad: 'Litros'
                    }
                }else if(`${sensor.ID_}`.includes("Pluvial")){
                    return {
                        nombre: `${sensor.Nombre}`, 
                        valor: `${sensor.ID_}`,
                        unidad: 'Cantidad de Lluvia'
                    }
                }else if(`${sensor.ID_}`.includes("Starts")){
                    return {
                        nombre: `${sensor.Nombre}`, 
                        valor: `${sensor.ID_}`, 
                        unidad: 'Cantidad de Inicios'
                    }
                }else{
                    return {
                        nombre: `${sensor.Nombre}`, 
                        valor: `${sensor.ID_}`, 
                        unidad: 'No se detecta unidad'
                    }
                }
            }
        }
    ));
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
            if(event.key==="F12" || event.key==="ContextMenu"){
                event.preventDefault()
                setModalErrMsg("Error: Accion no valida");
                setModalError(!modalError);
            }
        }, true)

        // Buscar los elementos por classname para encontrar el texto de carga de informacion de la grafica
        let elementos = document.getElementsByClassName("apexcharts-text")
        for(const element of elementos){
            if(element.textContent === "Preparando información, aguarde por favor..."){
                break;
            }
        }
    }, [modalError])
//-----------------------------Codigo para el funcionamiento de Inactividad------------------------------------
    useEffect(() => {
        setModalAdv(true)
        setModalAdvMsg("NOTA: Si la consulta de datos que desea realizar contiene muchos registros, la grafica podria tardar en cargar. Gracias por su comprensión.")
        let contaInacti;
        function setupInacti(){     // Preparacion para el procedimiento de inactividad
            // Agregando los listener de los eventos en pantalla
            document.addEventListener('wheel', resetTimer, false);
            document.addEventListener('scroll', resetTimer, false);
            document.addEventListener('keydown', resetTimer, false);
            document.addEventListener('mousemove', resetTimer, false);
            document.addEventListener('mousedown', resetTimer, false);
            document.addEventListener('touchmove', resetTimer, false);
            document.addEventListener('touchstart', resetTimer, false);
            document.addEventListener('pointermove', resetTimer, false);
            document.addEventListener('pointerdown', resetTimer, false);
            document.addEventListener('pointerenter', resetTimer, false);
            iniciarConteo();
        }
        // Funciones de inactividad
        function iniciarConteo(){
            contaInacti = setTimeout(() => {    // Temporizador establecido a 5 minutos, en milisegundos
                alert("Aviso: \n- El sistema cerrará la sesion por inactividad. \nNOTA:\n- Este aviso puede salir en multiples ocasiones.");
                navegar("/login");
            }, 300000);
            // 300000 = 5 minutos, 60000 = 1 minuto, 30000 = 30 segundos
        }
        function resetTimer(e){
            clearTimeout(contaInacti);  // Limpiar/Eliminar valor actual del contador
            iniciarConteo();    // Reiniciar el contador
        }
        setupInacti();  // Arrancar mecanismo de inactividad    
    }, [navegar])
//-------------------------------------------------------------------------------------------------------------
    // Apertura/Cierre del modal de errores
    const AbrCerrError = () => {
        setModalError(!modalError);
    }
    const AbrCerAdv = () => {
        setModalAdv(!modalAdv);
    }
//--------------Verificacion del local storage para ver si hay un usuario logueado-----------------------------
    // Si la credencial del usuario no esta almacenada en el localStorage, quiere decir que no ha iniciado sesion, por lo que se le retornara al login
    if(!usSession){
        navegar("/login");
    }else{
        // Invocacion del metodo de inactividad en cuanto se accede a la pagina en cuestion
        //SetupInacti()
    //----Obtencion de todos los registros que coincidan con el nombre/identificador de busqueda-----------
        const regsBusqueda = [];
        metadata.map(
            (allData) => (
                (tipInfoBus.split(";")[0]!=="404") ?
                    (`${allData.HISTORY_ID}`.includes(tipInfoBus.split(";")[0])) ? 
                        regsBusqueda.push({
                            ID: parseInt(`${allData.ID}`),
                            DATE: (new Date(parseInt(`${allData.TIMESTAMP}`))),
                            VALUE: parseFloat(parseFloat(`${allData.VALUE}`).toFixed(2)),
                            STATUS: (`${allData.STATUS_TAG}`==="{ok}") ? "Activo" : (`${allData.STATUS_TAG}`==="{down}") ? "Inactivo" : "Indefinido"
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
    
            regsBusqueda.map(function(registro){
                const fecha = registro.DATE, valor = registro.VALUE;
                // Si se realizo la limpieza de seleccion de rangos de fechas no se tendran valores, por lo cual solo se retornara la funcion
                if(fechIni==="" || fechFin==="" || (fechIni==="" && fechFin===""))
                    return null;
                /* Ya que el promedio depende del resultado de la consulta solo en este punto se puede hacer el filtrado de datos junto con el parametro del promedio.
                Entonces si la fecha se comprende entre la inicial y la final, ademas de ser mayor al promedio (para que no haya tantos registros) se incoporara el registro al arreglo de valores para la grafica*/
                if((fecha > fechIni) && (fecha < fechFin) && (valor > promedio))
                    info.push([fecha, valor])
                return 0;
            });
        }
    //----------------------------------------------------------------------------------------------------
    //----------------Preparacion de las opciones de configuracion para la grafica------------------------
        const options = {
            chart: {
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
                                const areaExportar = document.getElementById("areaGraf");
                                const contePDF = await html2canvas(areaExportar);
                                const dataInfo = contePDF.toDataURL("image/png");
                                let ancho = areaExportar.clientWidth, alto = areaExportar.clientHeight, altoEspa, anchoEspa;
                                if(ancho > alto){
                                    let pdfArchi = new jsPDF('l', 'px', [ancho, alto]);
                                    ancho=pdfArchi.internal.pageSize.getWidth();
                                    alto=pdfArchi.internal.pageSize.getHeight();
                                    anchoEspa=ancho-20;
                                    altoEspa=alto-20;
                                    pdfArchi.addImage(dataInfo, 'PNG', 10, 10, anchoEspa, altoEspa);
                                    pdfArchi.save(`BMS Grafica de ${getFecha()}; Registros ${tipInfoBus.split(";")[1]}.pdf`);
                                }
                                else{
                                    let pdfArchi = new jsPDF('p','px', [alto, ancho]);
                                    ancho=pdfArchi.internal.pageSize.getWidth();
                                    alto=pdfArchi.internal.pageSize.getHeight();
                                    anchoEspa=ancho-20;
                                    altoEspa=alto-20;
                                    pdfArchi.addImage(dataInfo, 'PNG', 10, 10, anchoEspa, altoEspa);
                                    pdfArchi.save(`BMS Grafica de ${getFecha()}; Registros ${tipInfoBus.split(";")[1]}.pdf`);
                                }
                            }
                        }]
                    },
                    export: {
                        csv: {
                            headerCategory: "Fecha",
                            filename: `BMS Grafica de ${getFecha()}; Registros ${tipInfoBus.split(";")[1]}`
                        },
                        svg: {
                            filename: `BMS Grafica de ${getFecha()}; Registros ${tipInfoBus.split(";")[1]}`
                        }
                    }
                }
            },
            series: [{
                name: `Registro ${tipInfoBus.split(";")[1]}`,
                data: info
            }],
            xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false,
                }
            },
            yaxis: {
                title: {
                    text: (`${tipInfoBus.split(";")[2]}`==='undefined') ? `Esperando Seleccion` : `Unidad de Medición: ${tipInfoBus.split(";")[2]}`
                },
                labels: {
                    offsetX: 0,
                    offsetY: 0
                }
            },
            tooltip: {
                x: {
                    format: "dd MMM yyyy; HH:mm:ss"
                },
                custom: function({series, seriesIndex, dataPointIndex, w}){
                    for(let cont=0; cont<regsBusqueda.length; cont++){
                        const valor = regsBusqueda[cont].VALUE, status = regsBusqueda[cont].STATUS;
                        if(valor === series[seriesIndex][dataPointIndex]){
                            if(status === "Activo"){
                                return '<div class="arrow_box"><strong><span>' +
                                    w.config.series[seriesIndex].name + ':<br> Valor: ' + series[seriesIndex][dataPointIndex] +
                                    '; <br>Estado: <span class="text-success">Activo</span></span></strong></div>'
                            }else if(status === "Inactivo"){
                                return '<div class="arrow_box"><strong><span>' +
                                    w.config.series[seriesIndex].name + ':<br> Valor: ' + series[seriesIndex][dataPointIndex] +
                                    '; <br>Estado: <span class="text-danger">Inactivo</span></span></strong></div>'
                            }else{
                                return '<div class="arrow_box"><strong><span>' +
                                    w.config.series[seriesIndex].name + ':<br> Valor: ' + series[seriesIndex][dataPointIndex] +
                                    '; <br>Estado: <span class="text-secondary">Indefinido</span></span></strong></div>'
                            }
                        }
                    }
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            noData: {
                text: 'Preparando información, aguarde por favor...'
            }
        };
    //-------------------------------------------------------------------------------------------------
    //-------------Preparacion del filtro de busqueda de informacion para el usuario-------------------
        if(listaFil.length === 1){
            // Vaciando el arreglo
            listaFil.splice(0, listaFil.length);
            // Rellenando el arreglo con los elementos de la BD
            listaSenso.map(
                (sensor) => {
                    if(`${sensor.VALUEFACETS}`.split(";")[1]!==''){
                        if(`${sensor.VALUEFACETS}`.split(";")[1]==='V' || `${sensor.VALUEFACETS}`.split(";")[1]==='v'){
                            listaFil.push({
                                nombre: `${sensor.Nombre}`, 
                                valor: `${sensor.ID_}`, 
                                unidad: 'Volts'
                            });
                        }else if(`${sensor.VALUEFACETS}`.split(";")[1]==='%'){
                            listaFil.push({
                                nombre: `${sensor.Nombre}`, 
                                valor: `${sensor.ID_}`, 
                                unidad: '% de Combustible'
                            });
                        }else{
                            listaFil.push({
                                nombre: `${sensor.Nombre}`, 
                                valor: `${sensor.ID_}`, 
                                unidad: `${sensor.VALUEFACETS}`.split(";")[1]
                            });
                        }
                    }else{
                        if(`${sensor.ID_}`.includes("Incendio")){
                            listaFil.push({
                                nombre: `${sensor.Nombre}`, 
                                valor: `${sensor.ID_}`, 
                                unidad: 'Detecciones de Humo'
                            });
                        }else if(`${sensor.ID_}`.includes("Potable")){
                            listaFil.push({
                                nombre: `${sensor.Nombre}`, 
                                valor: `${sensor.ID_}`, 
                                unidad: 'Litros'
                            });
                        }else if(`${sensor.ID_}`.includes("Pluvial")){
                            listaFil.push({
                                nombre: `${sensor.Nombre}`, 
                                valor: `${sensor.ID_}`,
                                unidad: 'Cantidad de Lluvia'
                            });
                        }else if(`${sensor.ID_}`.includes("Starts")){
                            listaFil.push({
                                nombre: `${sensor.Nombre}`, 
                                valor: `${sensor.ID_}`, 
                                unidad: 'Cantidad de Inicios'
                            });
                        }else{
                            listaFil.push({
                                nombre: `${sensor.Nombre}`, 
                                valor: `${sensor.ID_}`, 
                                unidad: 'No se detecta unidad'
                            });
                        }
                    }
                    return 0;
                }
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
        return (
            <div className="pageSchema" onContextMenu={contextMenu}>
                <BarraNavega />
                <div className='container-fluid border mt-3'>
                    <div className='row align-items-center border pt-3 pb-3 text-center'>
                        <div className='col-md-auto'>
                            <div className='row align-items-center'>
                                <div className='col-md-auto'>
                                    <span className='textNoColor'>A</span>
                                    <div className='input-group mb-2'>
                                        <div className='input-group-prepend'>
                                            <div className='input-group-text'><Search/></div>
                                        </div>
                                        <SelFilBus selFilBus={solFilBus} elemSel={listaFil} title="Seleccione la categoria"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-auto'>
                            <div className='row align-items-center'>
                                <div className='col-md-auto'>
                                    <span>Seleccionar Fecha y Hora de Inicio:</span>
                                    <div className='input-group mb-2'>
                                        <div className='input-group-prepend'>
                                            <div className='input-group-text'><Calendar/></div>
                                        </div>
                                        <Flatpickr placeholder='Seleccionar Fecha y Hora de Inicio:' ref={fechIniSel} options={optionsInicial} />
                                        <button className='btn btn-danger' type="button" onClick={() => {
                                            if (!fechIniSel?.current?.flatpickr) return;
                                                fechIniSel.current.flatpickr.clear();
                                                setFechIni("");
                                            }
                                        }> Borrar
                                        </button>
                                    </div>
                                </div>
                                <div className='col-md-auto'>
                                    <span>Seleccionar Fecha y Hora de Fin:</span>
                                    <div className='input-group mb-2'>
                                        <div className='input-group-prepend'>
                                            <div className='input-group-text'><Calendar/></div>
                                        </div>
                                        <Flatpickr placeholder='Seleccionar Fecha y Hora de Fin:' ref={fechFinSel} options={optionsFinal} />
                                        <button className='btn btn-danger' type="button" onClick={() => {
                                            if (!fechFinSel?.current?.flatpickr) return;
                                                fechFinSel.current.flatpickr.clear();
                                                setFechFin("");
                                            }
                                        }> Borrar
                                        </button>
                                    </div>
                                </div>
                                <div className='col-md-auto'>
                                    <div className='row align-items-center'>
                                        <div className='col-md-auto'>
                                            <span className='textNoColor'>A</span>
                                            <div className='input-group mb-2'>
                                                <AddSensor senFunc={addSensBus} sensores={listaFil} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='areaGraf' className='row align-items-center border pt-3 pb-5 mb-3'>
                        <Chart options={options} series={options.series} type="line" width="100%" height="280%" />
                    </div>
                </div>
                <Copyright />
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
                <div id="ModalAdvice">
                    <Modal isOpen={modalAdv} toggle={AbrCerAdv}>
                        <ModalHeader toggle={AbrCerAdv}>
                            Advertencia <AlertCircle color="blue" size={30} />
                        </ModalHeader>
                        <ModalBody>
                            <Alert color="success">
                                {modalAdvMsg}
                            </Alert>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
    return 0;
}