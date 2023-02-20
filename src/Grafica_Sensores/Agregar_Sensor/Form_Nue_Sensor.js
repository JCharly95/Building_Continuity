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
    // Variable de estado del formulario
    const [envioForm, setEnvioForm] = useState("No se ha enviado el formulario");

    //-------------------------Peticion con Axios para obtener la informacion--------------------------------------
    useEffect(() => {
        const obteInfo = async (estado) => {
            try {
                const peticion = await axios.get('https://bms.controldigital.mx/data3.php?tipo_consulta=tipoSen');
                // const peticion = await axios.get('https://bms.controldigital.mx/data2.php');
                estado(peticion.data);
            } catch (error) {
                console.log("Hubo un problema en la obtencion de datos con axios");
            }
        }
        obteInfo(setElemsBD);
    }, []);

    if (!elemsBD)
        console.log("Ocurrio un problema en la obtencion de la informacion");
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
                setModalErrMsg("No detecto el nombre del sensor a registrar");
            if(`${sensor}` === "No hay Sensor")
                setModalErrMsg("No fue seleccionado un sensor de la base de datos");
            if(!`${nomRef.current.value}` && `${sensor}` === "No hay Sensor")
                setModalErrMsg("No se detecto un nombre ni una seleccion de sensor para dar de alta");
            AbrCerrError();
        }else{
            // Agregar el nuevo sensor agregado en la lista de los sensores actuales
            sensores.push({
                nombre: `${nomRef.current.value}`,
                valor: `${sensor}`
            });

            // Cargar el nuevo sensor en la base de datos
            // Preparar el paquete de informacion de XMLRequest
            let infoCaptu = new FormData();
            infoCaptu.append('nombre', `${nomRef.current.value}`);
            infoCaptu.append('valor', `${sensor}`);
            // Este sera el formato a usar de axios para todas las consultas que alteren la base de datos, pero para diferenciarlos, el endpoint de la consulta (la URL) cambiara con la variable tipo_consulta, donde se colocara la direccion del metodo a usar. NOTA: Para hacer esto ultimo, se deberan generar las respectivas consultas en el archivo PHP del servidor, en este caso es data3
            axios({
                method: 'post',
                url: 'https://bms.controldigital.mx/data3.php?tipo_consulta=addSen',
                data: infoCaptu,
                config: { headers: {'Content-Type': 'multipart/form-data' }}
            }).then((respuesta) => {
                setEnvioForm(respuesta.data);
            }).catch(function (error){
                if(error.response.status === 401){
                    // Este es un error controlado, si el servidor detecto que se quiere asociar un nuevo sensor con otro que este previamente asociado con un nombre en la BD se regresara este error.
                    alert("El sensor que desea agregar ya esta asociado en la base de datos con otro nombre");
                }
            });
    
            if (!envioForm)
                console.log("Ocurrio un problema en el envio del informacion del formulario");
    
            // Establecer el valor de retorno de la propiedad para agregarlo a la lista de opciones de seleccion de sensor en la grafica en el componente padre
            senFunc(sensores);
            console.log("Sensores actualizados", sensores);
            abrirCerrarModal();
        }
    }

    return (
        <div>
            <div className="container-fluid">
                <Button color="dark" onClick={abrirCerrarModal}>
                    <span>Agregar Filtro De Busqueda</span>
                </Button>
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
                            <label htmlFor="sensor-value" className="col-form-label">Sensores Almacenados en la Base de Datos:</label>
                            <ListaSensores solFilBus={nueSensList} elemSel={registros} title="Seleccione el Sensor" className="form-control" id="sensor-value" name="valor" />
                        </div>
                    </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type="submit" onClick={crearSensor}>Agregar Sensor</Button>
                        <Button color="danger" onClick={abrirCerrarModal}>Cancelar</Button>
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

/*  MUCHO OJO; ESTA ES LA EXPLICACION VIEJA POR SI ME PIERDO UN POCO, LA NUEVA EXPLICACION ESTA EN BOMBLINE (por si acaso)

    Explicacion rapida para pasar valores entre componentes react (hijo a padre)
        Primero se crea una funcion vacia en el componente padre y una variable de estado (useState) vacia o con un valor por defecto.
        La funcion puede ser como la funcion flecha previa a esta explicacion o como el siguiente ejemplo:
            const [datos, estableceDatos] = useState('');
            const hijoAPadre = () => {
            
            }
        Luego se pasa esta funcion como propiedad a la invocacion al componente hijo como esta en SelFilBus debajo. 
            <Hijo hijoAPadre={hijoAPadre}/>
        Nota: La propiedad puede tener el nombre que sea, para fines practicos en esta ocasion se dejo el nombre de la funcion.
            <SelFilBus solFilBus={solFilBus}/>
        Despues en el componente hijo se acepta la llamada a la funcion como propiedad (parametro si se usa function), como es para este caso
            function menuDropdown({ solFilBus }) {
                ...
            }
        Y dentro del hijo se crea algun elemento que genere un evento donde se pueda invocar la funcion del componente padre; para este caso
        se hicieron botones de la lista desplegable
            <DropdownItem onClick={()=>solFilBus("/niagaratest/Engine$20Battery")}>Bateria</DropdownItem>
        Donde en el evento onClick, se invoca una arrowFunction para llamar al metodo solFilBus del componente padre y se "retorna" con
        el valor modificado.
        Finalmente, en la funcion vacia del componente padre se aceptan los datos procesados como parametro y se establece el estado creado,
        por ejemplo:
            const hijoAPadre = (datoshijo) => {
                estableceDatos(datoshijo);
            }
        O como quedo al final el metodo solFilBus previo a esta explicacion.
        Finalmente para ver si es efectivo este elemento, se imprime el valor del estado en el componente padre usando el estado entre llaves.
        Por ejemplo: el resultado del ejemplo teorico seria { datos }, ya que asi se nombro el useState inicial.
*/