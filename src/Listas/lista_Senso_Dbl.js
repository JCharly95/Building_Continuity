/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

export default function menuDropdown({ selFilBus, elemSel, title }) {
    // Variable de estado para abrir/cerrar el menu desplegable
    const [dropdown, setDropdown] = useState(false);
    // Variable de estado para establecer el valor a mostrar en el menu desplegable
    const [tituloMenu, setTituloMenu] = useState(title);
    // Metodo para abrir o cerrar la lista desplegable, segun el estado en el que este
    const abrirCerrarMenu = () => {
        setDropdown(!dropdown);
    }
    return (
        <div className="btn">
            <Dropdown isOpen={dropdown} toggle={abrirCerrarMenu}>
                <DropdownToggle caret>
                    {tituloMenu}
                </DropdownToggle>
                <DropdownMenu>
                    {
                        elemSel.map((elemento, index) => {
                            return (
                                <DropdownItem onClick={ () => {
                                        selFilBus (`${elemento.valor};${elemento.nombre}`); 
                                        setTituloMenu(elemento.nombre);
                                    }
                                } key={"TipSensor"+index} >{elemento.nombre}</DropdownItem>
                            );
                        })
                    }
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
/* 
    BATERÍA
        /niagaratest/Engine$20Battery
    COMBUSTIBLE
        /niagaratest/Fuel$20Level
    LÍNEA DE ENERGÍA
        /niagaratest/L3$20$2d$20L1
        /niagaratest/L1$20$2d$20N
        /niagaratest/L1$20$2d$20L2
        /niagaratest/L2$20$2d$20L3
        /niagaratest/L3$20$2dN
    INCENDIOS
        /niagaratest/mmH2O$20Contra$20Incendio1
    DRENAJE
        /niagaratest/mmH2O$20Pluvial1
    AGUA
        /niagaratest/mmH2O$20Potable1
    PISO
        /niagaratest/Number$20of$20Starts
*/