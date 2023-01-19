import React from 'react';
import ReactDOM from 'react-dom/client';
import './BasicApp/index.css';
//import reportWebVitals from './BasicApp/reportWebVitals';
/*import App from './BasicApp';
import AGet from './Axios_GET/App_Axios_GET'
import AGetBMS from './Axios_GET/App_Axios_Get_BMS'
import APost from './Axios_POST/App_Axios_POST'
import ApChart from './ApexCharts/App_ApexCharts'
import APut from './Axios_PUT/App_Axios_PUT'
import ADel from './Axios_DELETE/App_Axios_DEL'
import AGet from './Axios_GET/App_Axios_GET'
import AGet2 from './Axios_GET/App_Axios_GET_V2'
import Flpck from './Flatpickr/App_Flatpickr'
import ApChBMS from './ApexCharts/ApexCharts_BMS'
import Dropdown from "./EjemploPract/dropdown_menu/menu";
import ApChBMS2 from './ApexCharts/ApexCharts_BMS_V2'*/
import Bomba from './EjemploPract/BombLine'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  {/* 
    <App />
    <br />
    <AGet />
    <br />
    <AGetBMS />
    <br />
    <APost />
    <br />
    <ApChart />
    <br />
    <APut />
    <br />
    <ADel />
    <br />
    <hr />
    <br />
    <ApChBMS />
    <Flpck />
  <Dropdown />
  */}
  <Bomba />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
