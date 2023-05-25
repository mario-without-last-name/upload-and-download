import React, { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Divider } from 'primereact/divider';

import '../App.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const DownloadCard = () => {

  // DOWNLOAD - https://www.youtube.com/watch?v=IPEqb_AJbAQ
  const XLSX_FILE_URL = "http://localhost:3000/template_dist.xlsx"
  const downloadFileAtURL=(url)=>{
    const fileName = "template_dist.xlsx";
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  }

  return (
    <div className='card'>
      <h1>Download File</h1>
      <Divider />
      <h4>{"Using regular html <button>"}</h4>
      <button onClick={()=>{downloadFileAtURL(XLSX_FILE_URL)}}><i className="pi pi-download"/>&nbsp;Download Excel File Format</button>
      <Divider />
      <h4>{"Using Prime React <Button>"}</h4>
      <Button onClick={()=>{downloadFileAtURL(XLSX_FILE_URL)}} label="Download Excel File Format" icon="pi pi-download"/>
    </div>
  )
}

export default DownloadCard