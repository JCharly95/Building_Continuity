import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "../Login/login";
import Bomba from '../Grafica_Sensores/bombLine';
import ErrorPage from "./error";
import DashBoard from "../Dashboard/dashboard";
import CerrSess from "../Login/logout";

export default function direccionamiento(){
    return(
        <Router>
            <Routes>
                <Route index element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="home" element={<DashBoard />} />
                <Route path="grafica" element={<Bomba />} />
                <Route path="CSesion" element={<CerrSess />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
}