import React from "react";
import BarraNavega from '../Navbar/barraNav'
import "../Login/estilos/login.css"
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardTitle, CardSubtitle, CardText, CardImg } from "reactstrap";

export default function DashBoard(){
    // Constante de historial de navegacion
    const navegar = useNavigate();
    // Obteniendo la credencial del usuario logueado
    const usSession = localStorage.getItem("user");
    // Datos del usuario para la credencial del perfil
    let session, userVal, nomVal, contraVal ="", fechAcc = "";

//--------------Verificacion del local storage para ver si hay un usuario logueado-----------------------------
    // Si la credencial del usuario no esta almacenada en el localStorage, quiere decir que no ha iniciado sesion, por lo que se le retornara al login
    if(!usSession){
        navegar("/login");
    }else{
        session = JSON.parse(usSession);
        // Obteniendo los valores del localStorage del usuario para mostrar en la credencial
        nomVal = session.nameUs;
        userVal = session.info;
        contraVal = contraVal.padEnd(session.passLen, "*");
        fechAcc = getFecha(session.acceso)

        return(
            <div>
                <BarraNavega />
                <div className='container' style={{ padding: 50 }}>
                    <Card color="success">
                        <CardBody>
                            <div className='row align-items-center'>
                                <div className='col-md-auto'>
                                    <CardImg alt="Sample" src="https://picsum.photos/300/200" />
                                </div>
                                <div className='col-md-auto'>
                                    <CardTitle tag="h3">
                                        {nomVal}, ¿que desea hacer hoy?
                                    </CardTitle>
                                    <CardSubtitle className="mb-2" tag="h5" >
                                        Hoy es: {getFecha("")}
                                    </CardSubtitle>
                                    <CardText>
                                        <span>Direccion de correo: {userVal}</span><br />
                                        <span>Contraseña: {contraVal}</span><br />
                                        <span>Fecha de Acceso: {fechAcc}</span>
                                    </CardText>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        );
    }
    return 0;
}

function getFecha(fechTransform){
    let fecha;

    if(fechTransform === ""){
        fecha = new Date()
        const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
        let dia = "";
    
        // Agregar un cero por si es antes del dia 10
        if(fecha.getDate().toString().length === 1)
            dia = "0" + fecha.getDate().toString()
        else
            dia = fecha.getDate()
            
        return(`${dia}/${meses[fecha.getMonth()]}/${fecha.getFullYear()}`);
    }else{
        fecha = new Date(fechTransform)
        const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
        let dia = "", hora = "", minuto = "";

        // Agregar un cero por si es antes del dia 10
        if(fecha.getDate().toString().length === 1)
            dia = "0" + fecha.getDate().toString()
        else
            dia = fecha.getDate()
        
        // Agregar un cero por si es antes de las 10 en horas
        if(fecha.getHours().toString().length === 1)
            hora = "0" + fecha.getHours().toString()
        else
            hora = fecha.getHours()

        // Agregar un cero por si es antes del dia 10
        if(fecha.getMinutes().toString().length === 1)
            minuto = "0" + fecha.getMinutes().toString()
        else
            minuto = fecha.getMinutes()

        return(`${dia}-${meses[fecha.getMonth()]}-${fecha.getFullYear()}; ${hora}:${minuto} hrs`);
    }
}