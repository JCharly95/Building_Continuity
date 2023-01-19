import "flatpickr/dist/themes/material_blue.css";
import React, { useRef } from "react";
import Flatpickr from "react-flatpickr";

export default function Flatpickr_Calen() {
  const fechIniSel = useRef(null), fechFinSel = useRef(null);
  let fechIngreIni, fechIngreFin;
  const optionsInicial = {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    defaultDate: "today",
    onClose: function(selectedDates, dateSel) {
      fechIngreIni=new Date(dateSel)
      console.log("Fecha de Inicio Seleccionada:", fechIngreIni)
    }
  }
  const optionsFinal = {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    defaultDate: "today",
    onClose: function(selectedDates, dateSel) {
      fechIngreFin=new Date(dateSel)
      console.log("Fecha de Fin Seleccionada:", fechIngreFin)
    }
  }

  return (
    <div id="CalenGrafSel">
      <p>
        &nbsp;
        Seleccionar Fecha de inicio: &nbsp;
        <Flatpickr ref={fechIniSel} options={optionsInicial} />
        <button type="button" onClick={() => {
            if (!fechIniSel?.current?.flatpickr) return;
            fechIniSel.current.flatpickr.clear();
          }
        }>
          Limpiar Seleccion
        </button>
        &nbsp;
        Seleccionar Fecha de fin: &nbsp;
        <Flatpickr ref={fechFinSel} options={optionsFinal} />
        <button type="button" onClick={() => {
            if (!fechFinSel?.current?.flatpickr) return;
            fechFinSel.current.flatpickr.clear();
          }
        }>
          Limpiar Seleccion
        </button>
      </p>
    </div>
  );
}