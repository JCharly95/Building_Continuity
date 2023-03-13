import axios from "axios";
import "../Estilos/estilosGen.css"
import { useNavigate } from "react-router-dom";
import { AlertTriangle, AlertCircle, Eye, EyeOff } from 'react-feather';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useRef, useState } from "react"
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";

export default function LoginForm() {
    // Banderas de verificacion de los campos
    let valUser= false, valContra= false, namUser="";
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
    const [modalErrMsg, setModalErrMsg] = useState("Hubo un problema al intentar acceder");
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
    // Verificacion de envio del formulario de acceso
    function veriForm(event){
        let valiCorreo = false, valiContra = false

        event.preventDefault();
        // Validacion de campos vacios
        if(!`${userRef.current.value}` || !`${passRef.current.value}`){
            if(!`${userRef.current.value}`){
                setModalErrMsg("No se ingreso username");
            }
            if(!`${passRef.current.value}`){
                setModalErrMsg("No se ingreso contraseña");
            }
            if(!`${userRef.current.value}` && !`${passRef.current.value}`){
                setModalErrMsg("No se ingreso correo y contraseña");
            }
            AbrCerrError();
        }else{
            // Validacion del campo de correo
            if(valiCampos("correo", `${userRef.current.value}`)){
                valiCorreo = true
            }
            // Validacion del campo contraseña
            if(valiCampos("contra", `${passRef.current.value}`)){
                valiContra = true
            }
            // Si ambos campos fueron validados correctamente se procede a buscarlos en la BD
            if(valiCorreo && valiContra){
                usersArr.map((userBus) => {
                    if(userBus.user === `${userRef.current.value}`){
                        valUser = true
                        namUser = userBus.nombre
                    }
                    if(userBus.contra === `${passRef.current.value}`){
                        valContra = true
                    }
                    return 0;
                });
            }
            redireccionar();
        }
    }
    // Funcion de redireccionamiento acorde a la validacion de campos del formulario
    function redireccionar(){
        if(valUser && valContra){
            acceder("user", `${userRef.current.value}`);
            setModalErrMsg(`${namUser}`);
            AbrCerAdv();
            setTimeout(() => (navegar("/home")), 2000);
        }
        else{
            if(!valUser){
                setModalErrMsg("El usuario NO fue encontrado");
                AbrCerrError();
            }
            if(!valContra){
                setModalErrMsg("La contraseña NO coincidio");
                AbrCerrError();
            }
            if(!valUser && !valContra){
                setModalErrMsg("El usuario y la contraseña NO coincidieron");
                AbrCerrError();
            }
        }
    }
    // Si el usuario se logueo de manera satisfactoria se crea un elemento de localStorage para su navegacion
    function acceder(clave, user){
        const session = {
            info: user,
            nameUs: namUser,
            passLen: `${passRef.current.value}`.length,
            acceso : new Date()
        }
        localStorage.setItem(clave, JSON.stringify(session))
    }
    // Validacion de campos
    function valiCampos(campo, valor){
        let staEma = false, staPass = false;

        if(campo === "correo"){
            // Expresion regular para correo
            let expreCorr =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
            // Expresion regular para buscar espacios
            let expreEspa = /\s+/

            // Castear el correo para buscar espacios
            if(expreEspa.test(valor)){
                setModalErrMsg("Error: Favor de remover los espacios de la direccion de correo");
                AbrCerrError();
            }else{
                // Pasar el valor a minusculas
                valor=valor.toLowerCase()
                // Castear la direccion de correo con la expresion regular
                if(expreCorr.test(valor)){
                    staEma = true
                }else{
                    setModalErrMsg("Error: Su direccion de correo no es valida, favor de revisarla");
                    AbrCerrError();
                }
            }
            return staEma;
        }

        if(campo === "contra"){
            // Expresion regular para descartar caracteres especiales
            let expreCarEsp =  /[^A-Za-z0-9]+/;
            // Expresion regular para buscar espacios
            let expreEspa = /\s+/

            // Castear la contraseña para buscar espacios
            if(expreEspa.test(valor)){
                // Remover todos los espacios usando una expresion regular
                valor=valor.replace(/\s+/g, "");
                // Si se borraron todos los espacios y el campo se quedo vacio se mandara un error
                if(valor.length === 0 || valor === ""){
                    setModalErrMsg("Error: Su contraseña no pueden ser puros espacios, favor de colocar una");
                    AbrCerrError();
                }else{
                    // Castear la contraseña para buscar caracteres especiales
                    if(expreCarEsp.test(valor)){
                        // Si se contiene caracteres especiales, se lanzara una alerta
                        setModalErrMsg("Error: Su contraseña no puede tener caracteres especiales");
                        AbrCerrError();
                    }else{
                        staPass = true
                    }
                }
            }else{
                // Castear la contraseña para buscar caracteres especiales
                if(expreCarEsp.test(valor)){
                    // Si se contiene caracteres especiales, se lanzara una alerta
                    setModalErrMsg("Error: Su contraseña no puede tener caracteres especiales");
                    AbrCerrError();
                }else{
                    staPass = true
                }
            }
            return staPass;
        }
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
    return (
        <div className="Auth-form-container">
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
                            {modalErrMsg}
                        </Alert>
                    </ModalBody>
                </Modal>
            </div>
            <div id="ModalAdvice">
                <Modal isOpen={modalAdv} toggle={AbrCerAdv}>
                    <ModalHeader toggle={AbrCerrError}>
                        Bienvenido <AlertCircle color="blue" size={30} />
                    </ModalHeader>
                    <ModalBody>
                        <Alert color="success">
                            {modalErrMsg}
                        </Alert>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
}