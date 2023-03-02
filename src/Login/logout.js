/* eslint-disable react-hooks/rules-of-hooks */
import "bootstrap/dist/css/bootstrap.min.css";
import { AlertTriangle } from 'react-feather';
import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function LogoutForm() {
    // Variable de estado para la obtencion de la navegacion y redireccionamiento usando el react-router
    const navegar = useNavigate();
    // Variable de estado para la apertura o cierre del modal de aviso de errores
    const [modalError, setModalError] = useState(false);
    // Variable de estado para el establecimiento del mensaje contenido en el modal de errores
    const [modalErrMsg, setModalErrMsg] = useState("Hubo un problema al registrar el sensor");
    
    // Metodo para abrir o cerrar el modal, segun el estado en el que este
    const AbrCerrError = () => {
        setModalError(!modalError);
    }
    // Funcion para cerrar la sesion del usuario limpiando el localStorage y redirigiendo a login
    function cerrarSesion(){
        localStorage.clear();
        setModalErrMsg("Gracias por su atencion, cerrando sesion...");
        AbrCerrError();
        navegar("/login");
    }
    return (
        <div>
            <div className="container-fluid">
                <Button color="primary" onClick={cerrarSesion}>
                    <span>Cerrar Sesion</span>
                </Button>
                <Modal isOpen={modalError} toggle={AbrCerrError}>
                    <ModalHeader toggle={AbrCerrError}>
                        Adios <AlertTriangle color="blue" size={30} />
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