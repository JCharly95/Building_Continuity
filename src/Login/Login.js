import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Autenticacion/Auth";

export default function Login() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="Autenticacion/Auth" element={<Auth />} />
            </Routes>
        </BrowserRouter>
    );
}

/* 
    Para el login se siguio el ejemplo de esta pagina
    https://supertokens.com/blog/building-a-login-screen-with-react-and-bootstrap
*/