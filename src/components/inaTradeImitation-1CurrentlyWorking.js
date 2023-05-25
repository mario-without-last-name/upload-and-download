import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { FileUpload } from 'primereact/fileupload';

import '../App.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const InaTradeImitation = () => {

  // "Import Rows From Excel File" button functionality

  const [data3, setData3] = useState([]);
  const fileUploadRef3 = useRef(null);
  
  const handleFileUpload3 = (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data3 = e.target.result;
      const workbook = XLSX.read(data3, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData3 = XLSX.utils.sheet_to_json(sheet);
      const dataWithNoAndFormattedDate = parsedData3.map((row, index) => {
        const excelDateSerialNumberRepresentation = row["TANGGAL KELUAR"];
        const javascriptDate = new Date(Math.round((excelDateSerialNumberRepresentation - 25569) * 86400000));
        const options = { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
        const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(javascriptDate);
        return { ...row, NO: index + 1, "TANGGAL KELUAR": formattedDate };
      });
      setData3(dataWithNoAndFormattedDate);
    };
    reader.readAsBinaryString(file);
    fileUploadRef3.current.clear();
  };

  // Rendering "Edit" and "Delete" buttons on each table row

  const dataTableBody = (data, type, index) => {
    if (type === "aksi") {
      return (
        <>
          <Button icon="pi pi-pencil" label="Edit&nbsp;&nbsp;&nbsp;&nbsp;" onClick={() => {}} />&nbsp;
          <Button icon="pi pi-trash" label="Delete" onClick={() => deleteRow(index)} />
        </>
      );
    }
  };

  // "Add" button functionality

  

  // "Delete" button functionality

  const deleteRow = (index) => { // Delete Function
    const newData = [...data3];
    newData.splice(index, 1);
    setData3(newData);
  };

  return (
    <div className='card'>
      <h1>InaTrade Imitation (Data Distribusi Barang)</h1>
      <div style={{ display: "flex"}}>
        <Button onClick={() => {}} label="Add 1 Row Manually" icon="pi pi-plus" />
        <p style={{color: "#000000"}}>&nbsp;&nbsp;OR&nbsp;&nbsp;</p>
        <FileUpload ref={fileUploadRef3} chooseLabel="Import Rows From Excel File" chooseOptionsLabel="Choose" mode="basic" customUpload uploadHandler={handleFileUpload3} accept=".xlsx, .xls" />
      </div>
      <br />
      <DataTable value={data3} showGridLines emptyMessage="tidak ditemukan." style={{ width: "100%" }} paginator rows={10} rowsPerPageOptions={[10, 20, 50, 100]}>
        <Column field="NO" header="No" />
        <Column field="JENIS" header="Jenis" />
        <Column field="JUMLAH" header="Jumlah" />
        <Column field="SATUAN" header="Satuan" />
        <Column field="TUJUAN BARANG" header="Tujuan" />
        <Column field="TANGGAL KELUAR" header="Tanggal Keluar" />
        <Column header="Aksi" body={(rowData, rowIndex) => dataTableBody(rowData, "aksi", rowIndex)} />
      </DataTable>
    </div>
  );
};

export default InaTradeImitation;
