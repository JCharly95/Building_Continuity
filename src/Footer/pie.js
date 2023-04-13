import React from "react";
import "../Estilos/estilosGen.css"
import { useNavigate } from 'react-router-dom';
//import { Box, Container, Row, Column, FooterLink, Heading } from "./FooterStyles";

export default function Pie_Copyright(){
    const copyright = "Buiding Continuity 2023 Copyright © Todos los derechos reservados"
    // Constante de historial de navegacion
    const navegar = useNavigate();
    // Obteniendo la credencial del usuario logueado
    const usSession = localStorage.getItem("user");
    //--------------Verificacion del local storage para ver si hay un usuario logueado-----------------------------
    // Si la credencial del usuario no esta almacenada en el localStorage, quiere decir que no ha iniciado sesion, por lo que se le retornara al login
    if(!usSession){
        navegar("/login");
    }else{
        return (
            <div>
                <footer>
                    {copyright}
                </footer>
            </div>
        );
    }
    return 0;
}