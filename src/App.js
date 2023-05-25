import React, { useState, useEffect, useRef } from "react"

import './App.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Gives the color and shape of buttons, and other components
import "primereact/resources/primereact.min.css"; // Makes the appearance of inside the button (and other components) look right

import DownloadCard from './components/downloadCard'
import UploadCard from './components/uploadCard';
import InaTradeImitation from "./components/inaTradeImitation";

function App() {
  return (
    <div className='container'>
      <DownloadCard />
      <UploadCard />
      <InaTradeImitation />
    </div>
  );
}

export default App;