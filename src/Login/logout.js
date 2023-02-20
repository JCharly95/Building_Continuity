/* eslint-disable react-hooks/rules-of-hooks */
import "bootstrap/dist/css/bootstrap.min.css";
import { AlertTriangle } from 'react-feather';
import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function LogoutForm() {
    const navegar = useNavigate();
    const [modalError, setModalError] = useState(false);
    const [modalErrMsg, setModalErrMsg] = useState("Hubo un problema al registrar el sensor");
    
    // Metodo para abrir o cerrar el modal, segun el estado en el que este
    const AbrCerrError = () => {
        setModalError(!modalError);
    }
    
    function cerrarSesion(){
        localStorage.clear();
        setModalErrMsg("Gracias por su atencion, cerrando sesion...");
        navegar("/login");
        AbrCerrError();
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