/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef } from "react";
import ListaSensores from "../Listas/Lista"
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default function Nuevo_Sensor({ senFunc, sensores, elemsBD }) {
    // Establecer la variable de busqueda del sensor en la base de datos que sera seleccionada en una lista desplegable
    const [sensor, setSensor] = useState("No hay Sensor");
    // Constante de estado para establecer la apertura o cierre del modal
    const [modal, setModal] = useState(false);
    // Variable de referencia para obtener el campo de texto de creacion de sensor
    const nomRef = useRef(null);

    // Metodo para abrir o cerrar el modal, segun el estado en el que este
    const abrirCerrarModal = () => {
        setModal(!modal);
    }
    // Obtener todos los nombres de los sensores en la base de datos para la lista desplegable
    const allSensBD = [];
    elemsBD.map((registro) => (
        allSensBD.push(`${registro.HISTORY_ID}`)
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
    function crearSensor(){
        sensores.push({
            nombre: `${nomRef.current.value}`,
            valor: `${sensor}`
        });

        // Establecer el valor de retorno de la propiedad de funcion
        senFunc(sensores);
        abrirCerrarModal();
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
                        <div className="form-group">
                            <label htmlFor="nombre-filtro" className="col-form-label">Nombre:</label>
                            <input type="text" className="form-control" id="nombre-filtro" ref={nomRef} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sensor-value" className="col-form-label">Sensores Almacenados en la Base de Datos:</label>
                            <ListaSensores solFilBus={nueSensList} elemSel={registros} title="Seleccione el Sensor" className="form-control" id="sensor-value" />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={crearSensor}>Agregar Sensor</Button>
                        <Button color="danger" onClick={abrirCerrarModal}>Cancelar</Button>
                    </ModalFooter>
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