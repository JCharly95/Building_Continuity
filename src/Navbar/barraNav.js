import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom'
import { Nav, Navbar, NavItem, NavbarToggler, Collapse, NavLink, NavbarBrand } from "reactstrap";

export default function BarraNavega(){
    // Constante de historial de navegacion
    const navegar = useNavigate();
    // Obteniendo la credencial del usuario logueado
    const usSession = localStorage.getItem("user");
    // Constante de estado para saber si la barra esta abierta o no
    const [navBarSta, setNavBarSta] = useState(false);
    // Lista de opciones para la barra
    const opcs = listaOpcNav()
//--------------Verificacion del local storage para ver si hay un usuario logueado-----------------------------
    // Si la credencial del usuario no esta almacenada en el localStorage, quiere decir que no ha iniciado sesion, por lo que se le retornara al login
    if(!usSession){
        navegar("/login");
    }else{
        return (
            <div>
                <div>
                    <Navbar style={{ backgroundColor: "#00304E"}} light expand="md">
                        <NavbarBrand style={{ color: "white"}}>Building Continuity</NavbarBrand>
                        <NavbarToggler onClick={() => { setNavBarSta(!navBarSta) }} />
                        <Collapse isOpen={navBarSta} navbar>
                            <Nav className="mr-auto">
                                {
                                    opcs.map((item, index) => {
                                        return (
                                            <NavItem key={"ItemLink"+index}>
                                                <NavLink href={item.url} style={{ color: "white"}}>{item.title}</NavLink>
                                            </NavItem>
                                        );
                                    })
                                }
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div >
            </div>
        );
    }
    return 0;
}

/* 
    Esta funcion sirve para listar de manera dinamica las opciones que tendra la barra de navegacion.
    NOTA: Las url deben ser dadas de alta primero en el archivo de direcciones en ruteo
*/
function listaOpcNav(){
    const listaOpc = [
        {
            title: "Inicio",
            url: "/home"
        },
        {
            title: "Grafica",
            url: "/grafica"
        },
        {
            title: "Cerrar Session",
            url: "/CSesion"
        }
    ];
    return listaOpc;
}