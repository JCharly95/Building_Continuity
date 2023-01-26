import React, { useState } from "react"
import "../login.css"
import "bootstrap/dist/css/bootstrap.min.css";

export default function Autenticar(props) {
    let [authMode, setAuthMode] = useState("signin");
    // Cambiar a singup para ver la segunda interfaz de registro

    const changeAuthMode = () => {
        setAuthMode((authMode === "signin") ? "signup" : "signin")
    }

    if (authMode === "signin") {
        return (
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title"> Acceder </h3>
                        <div className="text-center">
                            ¿Aún no te has registrado?{" "}
                            <span className="link-primary" onClick={changeAuthMode}> Registrarse </span>
                        </div>
                        <div className="form-group mt-3">
                            <label> Direccion de Correo </label>
                            <input type="email" className="form-control mt-1" placeholder="Ingrese su Correo..." />
                        </div>
                        <div className="form-group mt-3">
                            <label> Contraseña </label>
                            <input type="password" className="form-control mt-1" placeholder="Ingrese su Contraseña..." />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary"> Acceder </button>
                        </div>
                        <p className="text-center mt-2"> ¿Olvidaste tu <a href="#"> contraseña? </a></p>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title"> Registro </h3>
                    <div className="text-center">
                        ¿Ya estas registrado?{" "}
                        <span className="link-primary" onClick={changeAuthMode}> Acceder </span>
                    </div>
                    <div className="form-group mt-3">
                        <label> Nombre Completo </label>
                        <input type="email" className="form-control mt-1" placeholder="Ejemplo: Juan Lopez" />
                    </div>
                    <div className="form-group mt-3">
                        <label> Direccion de Correo </label>
                        <input type="email" className="form-control mt-1" placeholder="Ingresa direccion de correo..." />
                    </div>
                    <div className="form-group mt-3">
                        <label> Contraseña </label>
                        <input type="password" className="form-control mt-1" placeholder="Ingresa tu contraseña..." />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary"> Registrarse </button>
                    </div>
                    <p className="text-center mt-2"> ¿Olvidaste tu <a href="#"> contraseña? </a> </p>
                </div>
            </form>
        </div>
    )
}