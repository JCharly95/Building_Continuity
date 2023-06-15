/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

export default function listaFiltroSelGrafica({ selFilBus, elemSel, title }) {
    // Variable de estado para abrir/cerrar el menu desplegable
    const [menuSensGraf, setMenuSensGraf] = useState(false);
    // Variable de estado para establecer el valor a mostrar en el menu desplegable
    const [tituloMenu, setTituloMenu] = useState(title);
    // Metodo para abrir o cerrar la lista desplegable, segun el estado en el que este
    const abrirCerrarMenu = () => {
        setMenuSensGraf(!menuSensGraf);
    }
    return (
        <div>
            <Dropdown isOpen={menuSensGraf} toggle={abrirCerrarMenu}>
                <DropdownToggle caret>
                    {tituloMenu}
                </DropdownToggle>
                <DropdownMenu>
                    {
                        elemSel.map((elemento, index) => {
                            return (
                                <DropdownItem onClick={ () => {
                                        selFilBus(`${elemento.valor};${elemento.nombre};${elemento.unidad}`); 
                                        setTituloMenu(`${elemento.nombre} (${elemento.unidad})`);
                                    }
                                } key={"TipSensor"+index}>{`${elemento.nombre} (${elemento.unidad})`}</DropdownItem>
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