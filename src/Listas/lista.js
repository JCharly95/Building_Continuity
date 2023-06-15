/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

export default function ListaSensores({ solFilBus, elemSel, title }) {
    // Variable de estado para abrir/cerrar el menu desplegable
    const [menuSens, setMenuSens] = useState(false);
    // Variable de estado para establecer el valor a mostrar en el menu desplegable
    const [tituloMenu, setTituloMenu] = useState(title);
    // Metodo para abrir o cerrar la lista desplegable, segun el estado en el que este
    const abrirCerrarMenu = () => { 
        setMenuSens(!menuSens); 
    }
    return (
        <div>
            <div className="menuDesple">
                <Dropdown isOpen={menuSens} toggle={abrirCerrarMenu}>
                    <DropdownToggle caret>
                        {tituloMenu}
                    </DropdownToggle>
                    <DropdownMenu>
                        {
                            elemSel.map((elemento, index) => {
                                return (
                                    <DropdownItem onClick={ () => {
                                            solFilBus (elemento); 
                                            setTituloMenu(elemento);
                                        }
                                    } key={"SenBD"+index}>{elemento}</DropdownItem>
                                );
                            })
                        }
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}