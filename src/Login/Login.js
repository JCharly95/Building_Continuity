import axios from "axios";
import "../Estilos/estilosGen.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import RecuperContra from "./ForgotPass/recuContra";
import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";
import { AlertTriangle, AlertCircle, Eye, EyeOff } from 'react-feather';

export default function LoginForm(){
    // Banderas de verificacion de los campos
    let busUserBD= false, busContraBD= false, namUser="";
    // Variable de estado para la obtencion de la navegacion y redireccionamiento usando el react-router
    const navegar = useNavigate();
    // Variable de estado para mostrar el campo de la contraseña
    const [viewPass, setViewPas] = useState("password")
    // Variable de estado para la obtencion de los usuarios en la BD con axios
    const [usersBD, setUsersBD] = useState([1]);
    // Variable de estado para la apertura o cierre del modal de aviso de errores
    const [modalError, setModalError] = useState(false);
    // Variable de estado para la apertura o cierre del modal de avisos
    const [modalAdv, setModalAdv] = useState(false);
    // Variable de estado para el establecimiento del mensaje contenido en el modal de errores
    const [modalMsg, setModalMsg] = useState("Hubo un problema al intentar acceder");
    // Variables de referencia para la obtencion de valores de los campos del login
    const userRef = useRef(null);
    const passRef = useRef(null);
    // Arreglo que almacenara los valores ordenados de la consulta obtenida por axios
    const usersArr = [];
    
    // Obtener a los usuarios de la BD usando una consulta get con axios
    useEffect(() => {
        const obteInfo = async (estado) => {
            try {
                const peticion = await axios.get('https://app.buildingcontinuity.com.mx/php/data.php?tipo_consulta=usuarios');
                estado(peticion.data);
            } catch (error) {
                console.log("Error en los datos");
            }
        }
        obteInfo(setUsersBD);
    }, []);

    useEffect(() => {
        // Agregando un listener para la deteccion de teclas al presionarse
        document.addEventListener('keydown', (event) => {
            if(event.key==="F12"){
                event.preventDefault()
                setModalMsg("Error: Accion no valida");
                setModalError(!modalError);
            }
            if(event.key==="ContextMenu"){
                event.preventDefault()
                setModalMsg("Error: Accion no valida");
                setModalError(!modalError);
            }
        }, true)
    }, [modalError])

    const AbrCerrError = () => {
        setModalError(!modalError);
    }
    const AbrCerAdv = () => {
        setModalAdv(!modalAdv);
    }
    // Pasar el resultado de la consulta axios a un arreglo para operar con la informacion
    usersBD.map((usuario) => (
        usersArr.push({
            user: `${usuario.Correo}`,
            contra: `${usuario.Contra}`,
            nombre: `${usuario.Nombre}`
        })
    ));
    // Validacion de campos
    function valiCampos(correo, contra){
        // Expresion regular para correo
        const expreCorr =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        // Expresion regular para buscar espacios
        const expreEspa = /\s+/g
        // Expresiones regulares para la filtracion de inyecciones SQL
        // Buscar/remover comillas o punto y coma
        const expreCom = /(')|(;)|(';)/g
        // Buscar numero=numero o 1=1
        const expreTrue = /(\d=\d)|(=)/g
        // Expresion regular para remover consultas tipicas implementadas en SQL para inyecciones
        const expreQueSQL = /(SELECT)|(Select)|(select)|(UNION)|(Union)|(union)|(FROM)|(From)|(from)|(JOIN)|(Join)|(join)|(PASSWORD])|(Password)|(password)|(PASS)|(Pass)|(pass)|(PASSWD)|(Passwd)|(passwd)|(DROP)|(Drop)|(drop)|(TABLE)|(Table)|(table)|(DELETE)|(Delete)|(delete)|(INSERT)|(Insert)|(insert)|(UPDATE)|(Update)|(update)|(USERS)|(Users)|(users)|(DATABASE)|(Database)|(database)|(WHERE)|(Where)|(where)|(AND)|(And)|(and)|(OR)|(Or)|(or)/g

        // Banderas de validaciones
        let staEma = false, staPass = false;

        // Validacion de campos; Busqueda de campos no vacios
        if(!correo && !contra){
            setModalMsg("Error: No se ingreso correo y contraseña");
            AbrCerrError();
        }else{
            // Validacion de direccion de correo parte 1; Busqueda de valor en el campo del formulario
            if(!correo){
                setModalMsg("Error: Favor de ingresar su direccion de correo");
                AbrCerrError();
            }else{
                // Validacion de direccion de correo parte 2; Pasar a minusculas y busqueda de espacios
                correo=correo.toLowerCase()
                if(expreEspa.test(correo)){
                    setModalMsg("Error: Direccion de correo invalida");
                    AbrCerrError();
                }else{
                    // Validacion de direccion de correo parte 3; Evaluacion de direccion de correo con la expresion regular
                    if(expreCorr.test(correo)){
                        staEma = true
                    }else{
                        /* Si no se valido correctamente el correo, se interpretara que se tiene algun elemento extraño para inyeccion, por lo que se procedera con la validacion y posterior evaluacion nuevamente.
                            Validacion de direccion de correo parte 4; Busqueda y limpieza de elementos de inyecciones SQL */
                        // Parte 1: Sanitizacion de comillas y punto/coma en el correo
                        if(expreCom.test(correo)){
                            correo=correo.replace(expreCom, "");
                        }
                        // Parte 2: Sanitizacion de igualdades en el correo
                        if(expreTrue.test(correo)){
                            correo=correo.replace(expreTrue, "");
                        }
                        // Parte 3: Sanitizacion de palabras reservadas SQL
                        if(expreQueSQL.test(correo)){
                            correo=correo.replace(expreQueSQL, "");
                        }
                        // Una vez que se realizo la limpieza de elementos extraños, se vuelve a evaluar el correo con la RegExp
                        if(expreCorr.test(correo)){
                            staEma = true
                        }else{
                            setModalMsg("Error: Su direccion de correo no es valida, favor de revisarla");
                            AbrCerrError();
                        }
                    }
                }
            }
            // Validacion de contraseña parte 1; Busqueda de valor en el campo del formulario
            if(!contra){
                setModalMsg("Error: Favor de ingresar su contraseña");
                AbrCerrError();
            }else{
                // Validacion de contraseña parte 2; Remocion de espacios
                contra=contra.replace(expreEspa, "");
                // Si se borraron todos los espacios y el campo se quedo vacio se mandara un error
                if(contra.length === 0 || contra === ""){
                    setModalMsg("Error: Favor de ingresar su contraseña");
                    AbrCerrError();
                }else{
                    // Validacion de contraseña parte 3; Busqueda de mayusculas
                    if(!/[A-Z]/g.test(contra)){
                        setModalMsg("Error: Contraseña invalida");
                        AbrCerrError();
                    }else{
                        // Validacion de contraseña parte 4; Busqueda de numeros
                        if(!/\d/g.test(contra)){
                            setModalMsg("Error: Contraseña invalida");
                            AbrCerrError();
                        }else{
                            // Validacion de contraseña parte 5; Busqueda de caracteres especiales
                            if(!/\W/g.test(contra)){
                                setModalMsg("Error: Contraseña invalida");
                                AbrCerrError();
                            }else{
                                //Validacion de contraseña parte 6; Busqueda de elementos de inyecciones SQL; Sanitizacion de palabras reservadas SQL
                                if(expreQueSQL.test(contra)){
                                    contra=contra.replace(expreQueSQL, "");
                                }else{
                                    // Dado que la contraseña es mas complicada de validar, si se pasaron todas las barreras previas, se da por entendido que fue validado de manera satisfactoria
                                    staPass = true
                                }
                            }
                        }
                    }
                }
            }
            // Si los campos fueron validados satisfactoriamente se procedera con un valor verdadero
            if(staEma && staPass){
                return true
            }else{
                return false
            }
        }
    }
    // Verificacion de envio del formulario de acceso
    function veriForm(event){
        // Evitar lanzar el formulario por defecto
        event.preventDefault();
        // Validacion de campos
        if(valiCampos(`${userRef.current.value}`,`${passRef.current.value}`)){
            // Si se validaron de manera efectiva los datos, se busca el usuario en el arreglo de valores de la BD
            usersArr.map((userBus) => {
                if(userBus.user === `${userRef.current.value}`){
                    busUserBD = true
                    namUser = userBus.nombre

                    if(userBus.contra === `${passRef.current.value}`){
                        busContraBD = true
                    }
                }
                return 0;
            });
            redireccionar();
        }
    }
    // Funcion de redireccionamiento acorde a la validacion de campos del formulario
    function redireccionar(){
        if(busUserBD && busContraBD){
            acceder("user", `${userRef.current.value}`);
            setModalMsg(`${namUser}`);
            AbrCerAdv();
            setTimeout(() => (navegar("/home")), 2000);
        }
        else{
            // Caso: Usuario no encontrado
            if(!busUserBD){
                setModalMsg("Error: Usuario no encontrado");
                AbrCerrError();
            }
            // Caso: Usuario encontrado pero contraseña invalida
            if(busUserBD && !busContraBD){
                setModalMsg("Error: La contraseña es incorrecta");
                AbrCerrError();
            }
        }
    }
    // Si el usuario se logueo de manera satisfactoria se crea un elemento de localStorage para su navegacion
    function acceder(clave, user){
        const fechLastAcc = new Date();
        const session = {
            info: user,
            nameUs: namUser,
            passLen: `${passRef.current.value}`.length,
            acceso : fechLastAcc
        }
        localStorage.setItem(clave, JSON.stringify(session))
        // Agregar el acceso a la base de datos; Preparar el paquete de informacion de XMLRequest
        let infoCaptu = new FormData();
        infoCaptu.append('emaUser', user);
        infoCaptu.append('ultimoAcceso', getFecha(fechLastAcc));
        // Este sera el formato a usar de axios para todas las consultas que alteren la base de datos
        axios({
            method: 'post',
            url: 'https://app.buildingcontinuity.com.mx/php/data.php?tipo_consulta=addLastAccess',
            data: infoCaptu,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        });
    }
    // Mostrar/Ocultar contraseña
    function verPass(){
        if(viewPass === "password"){
            setViewPas("text")
        }

        if(viewPass === "text"){
            setViewPas("password")
        }
    }
    // Funcion para muestra del menu contextual
    function contextMenu(event){
        event.preventDefault()
        setModalMsg("Error: Accion no valida");
        AbrCerrError();
    }
    // Funcion para formatear las fechas
    function getFecha(fechTransform){
        let fecha, dia="", mes="", hora="", min="", seg="";
        fecha = new Date(fechTransform)
    
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
        // Agregar un cero por si el segundo tiene un solo digito
        if(fecha.getSeconds().toString().length === 1)
            seg="0"+fecha.getSeconds().toString()
        else
            seg=fecha.getSeconds()
        // YYYY-MM-DD hh:mm:ss
        return(`${fecha.getFullYear()}/${mes}/${dia} ${hora}:${min}:${seg}`);
    }
    return (
        <div className="Auth-form-container" onContextMenu={contextMenu}>
            <form className="Auth-form" onSubmit={veriForm}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title"> Acceder </h3>
                    <div className="form-group mt-3">
                        <label> Direccion de Correo: </label>
                        <input type="email" name="correo" className="form-control mt-1" placeholder="Ingrese su Correo..." ref={userRef} />
                    </div>
                    <div className="form-group mt-3">
                        <label> Contraseña: </label>
                        <div className="input-group mb-3">
                            <input type={viewPass} name="contra" className="form-control" placeholder="Ingrese su Contraseña..." ref={passRef} />
                            <div className="input-group-append">
                                <span className="input-group-text" onClick={verPass}>
                                    {(viewPass === "password")? <Eye id="ojo_abierto" /> : <EyeOff id="ojo_cerrado" />}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <RecuperContra/>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" onClick={veriForm}> Acceder </button>
                    </div>
                </div>
            </form>
            <div id="ModalError">
                <Modal isOpen={modalError} toggle={AbrCerrError}>
                    <ModalHeader toggle={AbrCerrError}>
                        Error <AlertTriangle color="red" size={30} />
                    </ModalHeader>
                    <ModalBody>
                        <Alert color="danger">
                            {modalMsg}
                        </Alert>
                    </ModalBody>
                </Modal>
            </div>
            <div id="ModalAdvice">
                <Modal isOpen={modalAdv} toggle={AbrCerAdv}>
                    <ModalHeader toggle={AbrCerAdv}>
                        Bienvenido <AlertCircle color="blue" size={30} />
                    </ModalHeader>
                    <ModalBody>
                        <Alert color="success">
                            {modalMsg}
                        </Alert>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
}