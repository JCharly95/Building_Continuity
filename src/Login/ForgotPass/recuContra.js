/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { AlertTriangle } from 'react-feather';
import React, { useState, useEffect , useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from "reactstrap";

export default function Recuper_Contra() {
    // Variable de estado para la obtencion de los usuarios en la BD con axios
    const [usersBD, setUsersBD] = useState([1]);
    // Constante de estado para establecer la apertura o cierre del modal
    const [modal, setModal] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalErrMsg, setModalErrMsg] = useState("Hubo un problema al registrar el sensor");
    // Variables de referencia para obtener los campos de informacion: IDUser, Nombre, ApePat, ApeMat, Correo
    const idRef = useRef(null);
    const nomRef = useRef(null);
    const apePRef = useRef(null);
    const apeMRef = useRef(null);
    const emaRef = useRef(null);
    // Bandera de busqueda de usuario
    let busUser = false
    //-------------------------Peticion con Axios para obtener la informacion--------------------------------------
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
//-------------------------------------------------------------------------------------------------------------
    // Metodo para abrir o cerrar el modal, segun el estado en el que este
    const abrirCerrarModal = () => {
        setModal(!modal);
    }
    const AbrCerrError = () => {
        setModalError(!modalError);
    }

    // Funcion para recuperacion de contraseña; lado del usuario o cliente
    function recuContra(event){
        event.preventDefault();

        if(!`${idRef.current.value}` || !`${nomRef.current.value}` || !`${apePRef.current.value}` || !`${apeMRef.current.value}` || !`${emaRef.current.value}`){
            if(!`${idRef.current.value}`)
                setModalErrMsg("Error: Favor de ingresar su codigo de usuario");
            if(!`${nomRef.current.value}`)
                setModalErrMsg("Error: Favor de ingresar su nombre");
            if(!`${apePRef.current.value}`)
                setModalErrMsg("Error: Favor de ingresar su primer apellido");
            if(!`${apeMRef.current.value}`)
                setModalErrMsg("Error: Favor de ingresar su segundo apellido");
            if(!`${emaRef.current.value}`)
                setModalErrMsg("Error: Favor de ingresar su direccion de correo");
            if(!`${idRef.current.value}` && !`${nomRef.current.value}` && !`${apePRef.current.value}` && !`${apeMRef.current.value}` && !`${emaRef.current.value}`)
                setModalErrMsg("Error: Favor de ingresar su informacion");
            AbrCerrError();
        }else{
            let codIngre =`${idRef.current.value}`, nombreIngre =`${nomRef.current.value}`, apePatIngre =`${apePRef.current.value}`;
            let apeMatIngre =`${apeMRef.current.value}`, correoIngre =`${emaRef.current.value}`;
            //Buscar el usuario en el arreglo de elementos
            usersBD.map((usuario) => {
                let codigo = `${usuario.Cod_User}`, nombre =`${usuario.Nombre}`, apePat =`${usuario.Ape_Pat}`;
                let apeMat =`${usuario.Ape_Mat}`, correo =`${usuario.Correo}`
                // Si y solo si todos los valores ingresados coinciden es cuando se mandara el correo
                if(codIngre === codigo){
                    if(nombre === nombreIngre){
                        if(apePat === apePatIngre){
                            if(apeMat === apeMatIngre){
                                if(correo === correoIngre){
                                    busUser = true
                                }
                            }
                        }
                    }
                }
                return 0;
            });
            // Como ya se encontro el usuario en los registros, se procedera con el proceso pero ahora del lado del servidor
            if(busUser){
                // Preparar el paquete de informacion de XMLRequest para el servidor
                let infoCaptuRecPass = new FormData();
                infoCaptuRecPass.append('codigo', `${idRef.current.value}`);
                infoCaptuRecPass.append('correo', `${emaRef.current.value}`);
                // Este sera el formato a usar de axios para todas las consultas que alteren la base de datos, pero para diferenciarlos, el endpoint de la consulta (la URL) cambiara con la variable tipo_consulta, donde se colocara la direccion del metodo a usar. NOTA: Para hacer esto ultimo, se deberan generar las respectivas consultas en el archivo PHP del servidor, en este caso es data3
                axios({
                    method: 'post',
                    url: 'https://app.buildingcontinuity.com.mx/php/data.php?tipo_consulta=recPass',
                    data: infoCaptuRecPass,
                    config: { headers: {'Content-Type': 'multipart/form-data' }}
                }).then(() => {
                    alert("Aviso: El correo fue enviado a su direccion de correo satisfactoriamente");
                    abrirCerrarModal();
                }).catch(function (error){
                    if(error.response.status === 400){
                        // Este es un error controlado, si la informacion proporcionada no arrojo registros de la BD, se lanzará este error
                        alert("Error: Informacion no encontrada");
                    }
                    if(error.response.status === 402){
                        // Este es un error controlado, si el servidor no pudo enviar el correo se regresará este error.
                        alert("Error: Ocurrio un problema en el envio del correo");
                    }
                });
            }else{
                // Si no, es porque algun valor esta incorrecto o no coincide con los registros por lo que no se puede continuar con el proceso
                setModalErrMsg("Error: Favor de revisar la informacion ingresada");
                AbrCerrError();
            }
        }
    }
    return (
        <div>
            <div className="container-fluid">
                <div className="text-center">
                    <Button color="secondary" onClick={abrirCerrarModal} type="button">
                        <span>Recuperar Contraseña</span>
                    </Button>
                </div>
                <Modal isOpen={modal} toggle={abrirCerrarModal}>
                    <ModalHeader toggle={abrirCerrarModal}>
                        Recuperación de Contraseña
                    </ModalHeader>
                    <ModalBody>
                    <form onSubmit={recuContra}>
                        <div className='col-md-12'>
                            <div className="row justify-content-center">
                                <div className='col-md-12'>
                                    <div id="txtAdvice" className="form-control" name="areaAviso" style={{resize: "none", border: "none", textAlign:"justify"}}>
                                    <label className="col-form-label">Disclaimer:</label><br/>
                                        Con el propósito de asegurar que es el usuario en cuestión quien realmente quiere recuperar su 
                                        contraseña.<br/>Serán solicitados sus datos personales. (Se recomienda discreción)
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className='col-md-10 offset-md-1'>
                                    <label htmlFor="id-usuario" className="col-form-label">Codigo de Usuario:</label>
                                    <input type="text" className="form-control" ref={idRef} id="id-usuario" name="idUser" />
                                </div>
                                <div className='col-md-1' />
                            </div>
                            <div className="row justify-content-center">
                                <div className='col-md-10 offset-md-1'>
                                    <label htmlFor="nombre-usuario" className="col-form-label">Nombre:</label>
                                    <input type="text" className="form-control" ref={nomRef} id="nombre-usuario" name="nombre" />
                                </div>
                                <div className='col-md-1' />
                            </div>
                            <div className="row justify-content-center">
                                <div className='col-md-10 offset-md-1'>
                                    <label htmlFor="ape-paterno" className="col-form-label">Primer Apellido:</label>
                                    <input type="text" className="form-control" ref={apePRef} id="ape-paterno" name="apePat" />
                                </div>
                                <div className='col-md-1' />
                            </div>
                            <div className="row justify-content-center">
                                <div className='col-md-10 offset-md-1'>
                                    <label htmlFor="ape-materno" className="col-form-label">Segundo Apellido:</label>
                                    <input type="text" className="form-control" ref={apeMRef} id="ape-materno" name="apeMat" />
                                </div>
                                <div className='col-md-1' />
                            </div>
                            <div className="row justify-content-center">
                                <div className='col-md-10 offset-md-1'>
                                    <label htmlFor="dir-correo" className="col-form-label">Correo:</label>
                                    <input type="text" className="form-control" ref={emaRef} id="dir-correo" name="correo" />
                                </div>
                                <div className='col-md-1' />
                            </div>
                        </div>
                    </form>
                    </ModalBody>
                    <ModalFooter>
                        <div className='col-md-12'>
                            <div className="row justify-content-center">
                                <div className='col-md-4 offset-md-1'>
                                    <Button color="success" className="form-control" type="submit" onClick={recuContra}>Enviar Correo</Button>
                                </div>
                                <div className='col-md-4 offset-md-1'>
                                    <Button color="danger" className="form-control" onClick={abrirCerrarModal}>Cancelar</Button>
                                </div>
                                <div className='col-md-1' />
                            </div>
                        </div>
                    </ModalFooter>
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
                </Modal>
            </div>
        </div>
    );
}