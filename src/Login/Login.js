import "./estilos/login.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from 'react-feather';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useRef, useState } from "react"
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";

export default function LoginForm() {
    let validar = false;
    const navegar = useNavigate();
    const [usersBD, setUsersBD] = useState([1]);
    const [modalError, setModalError] = useState(false);
    const [modalErrMsg, setModalErrMsg] = useState("Hubo un problema al intentar acceder");

    const userRef = useRef(null);
    const passRef = useRef(null);
    
    // Obtener a los usuarios de la BD con axios
    useEffect(() => {
        const obteInfo = async (estado) => {
            try {
                const peticion = await axios.get('https://bms.controldigital.mx/data3.php?tipo_consulta=usuarios');
                estado(peticion.data);
            } catch (error) {
                console.log("Hubo un problema en la obtencion de datos con axios");
            }
        }
        obteInfo(setUsersBD);
    }, []);

    if(!usersBD)
        console.log("Ocurrio un problema en la obtencion de la informacion");

    const AbrCerrError = () => {
        setModalError(!modalError);
    }
    // Pasar los usuarios a un arreglo para obtener la informacion
    const usersArr = [];
    usersBD.map((usuario) => (
        usersArr.push({
            user: `${usuario.Correo}`,
            contra: `${usuario.Contra}`
        })
    ));

    function verificar(event){
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
            usersArr.map((userBus, index) => {
                if(userBus.user === `${userRef.current.value}`){
                    //Usuario encontrado, por lo que se procede a comprobar la contraseña
                    if(userBus.contra === `${passRef.current.value}`){
                        validar=true;
                        // Almacenar la credencial del usuario en el localStorage para que se este moviendo
                        expirarSesion("user", `${userRef.current.value}`, 5000);
                        // Para este caso 300,000 equivale a 5 minutos en milisegundosy
                        
                    }else{
                        setModalErrMsg("La contraseña es incorrecta");
                        AbrCerrError();
                    }
                }else{
                    setModalErrMsg("No se encontro el usuario ingresado");
                    AbrCerrError();
                }
            });
            redireccionar();
        }
    }

    function redireccionar(){
        if(validar)
            navegar("/home")
        else{
            setModalErrMsg("Ocurrio algun problema en la validacion");
            AbrCerrError();
        }
    }

    function expirarSesion(clave, valor, mS){
        const fecha = new Date();

        const session = {
            info: valor,
            expiracion : fecha.getTime() + mS
        }
        localStorage.setItem(clave, JSON.stringify(session))
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <form onSubmit={verificar}>
                        <h3 className="Auth-form-title"> Acceder </h3>
                        <div className="form-group mt-3">
                            <label> Direccion de Correo: </label>
                            <input type="email" name="correo" className="form-control mt-1" placeholder="Ingrese su Correo..." ref={userRef} />
                        </div>
                        <div className="form-group mt-3">
                            <label> Contraseña: </label>
                            <input type="password" name="contra" className="form-control mt-1" placeholder="Ingrese su Contraseña..." ref={passRef} />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary" onClick={verificar}> Acceder </button>
                        </div>
                    </form>
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
        </div>
    );

}