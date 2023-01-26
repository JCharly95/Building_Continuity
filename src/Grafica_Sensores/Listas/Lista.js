/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

export default function ListaSimple({ solFilBus, elemSel, title }) {
    const [menu, setMenu] = useState(false);
    const [tituloMenu, setTituloMenu] = useState(title);

    // Metodo para abrir o cerrar la lista desplegable, segun el estado en el que este
    const abrirCerrarMenu = () => { setMenu(!menu); }

    return (
        <div className="menuDesple">
            <Dropdown isOpen={menu} toggle={abrirCerrarMenu}>
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
                                } key={"SenBD"+index} >{elemento}</DropdownItem>
                            );
                        })
                    }
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}