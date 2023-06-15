/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { AlertTriangle } from 'react-feather';
import ListaSensores from "../../Listas/lista";
import React, { useState, useEffect , useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from "reactstrap";

export default function Nuevo_Sensor({ senFunc, sensores }) {
    // Variable de estado para la obtencion de registros
    const [elemsBD, setElemsBD] = useState([1]);
    // Establecer la variable de busqueda del sensor en la base de datos que sera seleccionada en una lista desplegable
    const [sensor, setSensor] = useState("No hay Sensor");
    // Constante de estado para establecer la apertura o cierre del modal
    const [modal, setModal] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalErrMsg, setModalErrMsg] = useState("Hubo un problema al registrar el sensor");
    // Variable de referencia para obtener el campo de texto de creacion de sensor
    const nomRef = useRef(null);
    //-------------------------Peticion con Axios para obtener la informacion--------------------------------------
    useEffect(() => {
        const obteInfo = async (estado) => {
            try {
                const peticion = await axios.get('https://app.buildingcontinuity.com.mx/php/data.php?tipo_consulta=tipoSen');
                estado(peticion.data);
            } catch (error) {
                console.log("Error en los datos");
            }
        }
        obteInfo(setElemsBD);
    }, []);
//-------------------------------------------------------------------------------------------------------------
    // Metodo para abrir o cerrar el modal, segun el estado en el que este
    const abrirCerrarModal = () => {
        setModal(!modal);
    }
    const AbrCerrError = () => {
        setModalError(!modalError);
    }
    // Obtener todos los nombres de los sensores en la base de datos para la lista desplegable
    const allSensBD = [];
    elemsBD.map((registro) => (
        allSensBD.push(`${registro.ID_}`)
    ));
    // Eliminacion de elementos repetidos con filter
    const registros = allSensBD.filter((elem, index) => {
        return allSensBD.indexOf(elem) === index;
    });

    // Funcion para setear el tipo de dato a buscar en la grafica; Este dato es obtenido al retorno de seleccion por la lista
    const nueSensList = (sensSel) => {
        setSensor(sensSel);
    }

    // Funcion para crear agregar sensores al arreglo de valores de seleccion para la grafica
    function crearSensor(event){
        event.preventDefault();

        if(`${sensor}` === "No hay Sensor" || !`${nomRef.current.value}`){
            if(!`${nomRef.current.value}`)
                setModalErrMsg("Error: No detecto el nombre del sensor");
            if(`${sensor}` === "No hay Sensor")
                setModalErrMsg("Error: No fue seleccionado un sensor");
            if(!`${nomRef.current.value}` && `${sensor}` === "No hay Sensor")
                setModalErrMsg("Error: No se detectaron valores para registrar un sensor");
            AbrCerrError();
        }else{
            // Cargar el nuevo sensor en la base de datos
            // Preparar el paquete de informacion de XMLRequest
            let infoCaptu = new FormData();
            infoCaptu.append('nombre', `${nomRef.current.value}`);
            infoCaptu.append('valor', `${sensor}`);
            // Este sera el formato a usar de axios para todas las consultas que alteren la base de datos, pero para diferenciarlos, el endpoint de la consulta (la URL) cambiara con la variable tipo_consulta, donde se colocara la direccion del metodo a usar. NOTA: Para hacer esto ultimo, se deberan generar las respectivas consultas en el archivo PHP del servidor, en este caso es data3
            axios({
                method: 'post',
                url: 'https://app.buildingcontinuity.com.mx/php/data.php?tipo_consulta=addSen',
                data: infoCaptu,
                config: { headers: {'Content-Type': 'multipart/form-data' }}
            }).then(() => {
                // Agregar el nuevo sensor agregado en la lista de los sensores actuales, solo si ya fue registrado en la base de datos
                sensores.push({
                    nombre: `${nomRef.current.value}`,
                    valor: `${sensor}`
                });
            }).catch(function (error){
                if(error.response.status === 401){
                    // Este es un error controlado, si el servidor detecto que se quiere asociar un nuevo sensor con otro que este previamente asociado con un nombre en la BD se regresara este error.
                    alert("Error: El sensor que desea agregar ya esta en el sistema");
                }
                if(error.response.status === 410){
                    // Este es un error controlado y se lanza cuando por alguna razon el insert del sensor no pudo ser ejecutado 
                    alert("Error: El sensor no pudo ser agregado");
                }
            });
            // Establecer el valor de retorno de la propiedad para agregarlo a la lista de opciones de seleccion de sensor en la grafica en el componente padre
            senFunc(sensores);
            abrirCerrarModal();
        }
    }
    return (
        <div>
            <div className="text-center">
                <Button color="dark" onClick={abrirCerrarModal}>
                    <span>Agregar Filtro De Busqueda</span>
                </Button>
            </div>
            <Modal isOpen={modal} toggle={abrirCerrarModal}>
                <ModalHeader toggle={abrirCerrarModal}>
                    Agregar un Sensor a la Lista de Seleccion
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={crearSensor}>
                        <div className="form-group">
                            <label htmlFor="nombre-filtro" className="col-form-label">Nombre:</label>
                            <input type="text" className="form-control" ref={nomRef} id="nombre-filtro" name="nombre" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sensor-value" className="col-form-label">Sensores en el Sistema:</label>
                            <ListaSensores solFilBus={nueSensList} elemSel={registros} title="Seleccione el Sensor" className="form-control" id="sensor-value" name="valor" />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" type="submit" onClick={crearSensor}>Agregar Sensor</Button>
                    <Button color="danger" onClick={abrirCerrarModal}>Cancelar</Button>
                </ModalFooter>
            </Modal>
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