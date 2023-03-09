/* eslint-disable react-hooks/rules-of-hooks */
import "bootstrap/dist/css/bootstrap.min.css";
import { AlertCircle } from 'react-feather';
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function LogoutForm() {
    // Variable de estado para la obtencion de la navegacion y redireccionamiento usando el react-router
    const navegar = useNavigate();
    // Variable de estado para la apertura o cierre del modal de aviso de errores
    const [modalAdv, setModalAdv] = useState(false);
    // Variable de estado para el establecimiento del mensaje contenido en el modal de errores
    const [modalAdvMsg, setModalAdvMsg] = useState("Hubo un problema al registrar el sensor");

    useEffect(() => {
        localStorage.clear();
        setModalAdvMsg("Gracias por su atencion, cerrando sesion...");
        setModalAdv(true)
        setTimeout(() => (navegar("/login")), 2000);
    }, [navegar])
    // Metodo para abrir o cerrar el modal, segun el estado en el que este
    const AbrCerAdv = () => {
        setModalAdv(!modalAdv);
    }
    return (
        <div>
            <div className="container-fluid">
                <Modal isOpen={modalAdv} toggle={AbrCerAdv}>
                    <ModalHeader toggle={AbrCerAdv}>
                        Adios <AlertCircle color="blue" size={30} />
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