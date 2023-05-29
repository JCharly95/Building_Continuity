import "../Estilos/estilosGen.css"
import Copyright from "../Footer/pie";
import BarraNavega from '../Navbar/barraNav'
import { AlertTriangle } from 'react-feather';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, CardSubtitle, CardText, CardImg, Modal, ModalHeader, ModalBody, Alert } from "reactstrap";

export default function DashBoard(){
    // Contador temporal para inactividad
    //let timeoutID;
    // Constante de historial de navegacion
    const navegar = useNavigate();
    // Obteniendo la credencial del usuario logueado
    const usSession = localStorage.getItem("user");
    // Variable de estado para la apertura o cierre del modal de aviso de errores
    const [modalError, setModalError] = useState(false);
    // Variable de estado para el establecimiento del mensaje contenido en el modal de errores
    const [modalErrMsg, setModalErrMsg] = useState("Ocurrio un error en la accion solicitada");
    // Datos del usuario para la credencial del perfil
    let session, userVal, nomVal, contraVal ="", fechAcc = "";

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
//-----------------------------Codigo para el funcionamiento de Inactividad------------------------------------
    useEffect(() => {
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
    // Funcion para muestra del menu contextual
    function contextMenu(event){
        event.preventDefault()
        setModalErrMsg("Error: Accion no valida");
        AbrCerrError();
    }
//--------------Verificacion del local storage para ver si hay un usuario logueado-----------------------------
    // Si la credencial del usuario no esta almacenada en el localStorage, quiere decir que no ha iniciado sesion, por lo que se le retornara al login
    if(!usSession){
        navegar("/login");
    }else{
        // Invocacion del metodo de inactividad en cuanto se accede a la pagina en cuestion
        //SetupInacti()
        // Pasar hacia un objeto JSON los elementos del localStorage
        session = JSON.parse(usSession);
        // Obteniendo los valores del localStorage del usuario para mostrar en la credencial
        nomVal = session.nameUs;
        userVal = session.info;
        contraVal = contraVal.padEnd(session.passLen, "*");
        fechAcc = getFecha(session.acceso)

        return(
            <div className="pageSchema" onContextMenu={contextMenu}>
                <BarraNavega />
                <div className='container' style={{ padding: 50 }}>
                    <Card color="success">
                        <CardBody>
                            <div className='row align-items-center'>
                                <div className='col-md-auto'>
                                    <CardImg alt="Sample" src="https://picsum.photos/300/200" />
                                </div>
                                <div className='col-md-auto'>
                                    <CardTitle tag="h3">
                                        {nomVal}, ¿que desea hacer hoy?
                                    </CardTitle>
                                    <CardSubtitle className="mb-2" tag="h5" >
                                        Hoy es: {getFecha("")}
                                    </CardSubtitle>
                                    <CardText>
                                        <span>Direccion de correo: {userVal}</span><br />
                                        <span>Contraseña: {contraVal}</span><br />
                                        <span>Fecha de Acceso: {fechAcc}</span>
                                    </CardText>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
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

function getFecha(fechTransform){
    let fecha;

    if(fechTransform === ""){
        fecha = new Date()
        const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
        let dia = "";
    
        // Agregar un cero por si es antes del dia 10
        if(fecha.getDate().toString().length === 1)
            dia = "0" + fecha.getDate().toString()
        else
            dia = fecha.getDate()
            
        return(`${dia}/${meses[fecha.getMonth()]}/${fecha.getFullYear()}`);
    }else{
        fecha = new Date(fechTransform)
        const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
        let dia = "", hora = "", minuto = "";

        // Agregar un cero por si es antes del dia 10
        if(fecha.getDate().toString().length === 1)
            dia = "0" + fecha.getDate().toString()
        else
            dia = fecha.getDate()
        
        // Agregar un cero por si es antes de las 10 en horas
        if(fecha.getHours().toString().length === 1)
            hora = "0" + fecha.getHours().toString()
        else
            hora = fecha.getHours()

        // Agregar un cero por si es antes del dia 10
        if(fecha.getMinutes().toString().length === 1)
            minuto = "0" + fecha.getMinutes().toString()
        else
            minuto = fecha.getMinutes()

        return(`${dia}-${meses[fecha.getMonth()]}-${fecha.getFullYear()}; ${hora}:${minuto} hrs`);
    }
}