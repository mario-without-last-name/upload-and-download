import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { addLocale } from 'primereact/api';
import { Button } from "primereact/button";
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';

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

  // "Add 1 Row Manually" button functionality

  const [showAddModal, setShowAddModal] = useState(false);
  const [jenis, setJenis] = useState(null);
  const [jumlah, setJumlah] = useState('');
  const [satuan, setSatuan] = useState('');
  const [tujuan, setTujuan] = useState(null);
  const [tanggalKeluar, setTanggalKeluar] = useState(null);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    resetAddFormInputs();
    setShowAddModal(false);
  };

  const resetAddFormInputs = () => {
    setJenis(null);
    setJumlah('');
    setSatuan('');
    setTujuan(null);
    setTanggalKeluar(null);
  };

  const addRowManually = () => {
    tanggalKeluar.setHours(7,0,0);
    // console.log(tanggalKeluar);
    const newRow = {
      NO: data3.length + 1,
      JENIS: jenis,
      JUMLAH: jumlah,
      SATUAN: satuan,
      "TUJUAN BARANG": tujuan,
      "TANGGAL KELUAR": tanggalKeluar
        ? new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(tanggalKeluar)
        : "",
    };
    const newData = [...data3, newRow];
    setData3(newData);
    closeAddModal();
  };

  // Rendering "Edit" and "Delete" buttons on each table row

  const dataTableBody = (data, type, index) => {
    if (type === "aksi") {
      return (
        <>
          <Button icon="pi pi-pencil" label="Edit" onClick={() => openEditModal(data)} />&nbsp;
          <Button icon="pi pi-trash" label="Delete" onClick={() => deleteRow(data)} />
        </>
      );
    }
  };

  // "Edit" button functionality

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editJenis, setEditJenis] = useState(null);
  const [editJumlah, setEditJumlah] = useState('');
  const [editSatuan, setEditSatuan] = useState('');
  const [editTujuan, setEditTujuan] = useState(null);
  const [editTanggalKeluar, setEditTanggalKeluar] = useState(null);

  const openEditModal = (rowData) => {
    setEditData(rowData);
    setEditJenis(rowData.JENIS);
    setEditJumlah(rowData.JUMLAH);
    setEditSatuan(rowData.SATUAN);
    setEditTujuan(rowData["TUJUAN BARANG"]);
    setEditTanggalKeluar(new Date(convertToEnglishDate(rowData["TANGGAL KELUAR"])));
    setShowEditModal(true);
    // console.log(rowData["TANGGAL KELUAR"]);
    // console.log(convertToEnglishDate(rowData["TANGGAL KELUAR"]));
  };
  
  const closeEditModal = () => {
    // resetEditFormInputs();
    setShowEditModal(false);
  };
  
  const resetEditFormInputs = () => {
    setEditJenis(null);
    setEditJumlah('');
    setEditSatuan('');
    setEditTujuan(null);
    setEditTanggalKeluar(null);
  };

  const updateRow = () => {
    const updatedData = data3.map((row) => {
      if (row === editData) {
        editTanggalKeluar.setHours(7,0,0);
        return {
          ...row,
          JENIS: editJenis,
          JUMLAH: editJumlah,
          SATUAN: editSatuan,
          "TUJUAN BARANG": editTujuan,
          "TANGGAL KELUAR": editTanggalKeluar
            ? new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(editTanggalKeluar)
            : "",
        };
      }
      return row;
    });
    setData3(updatedData);
    closeEditModal();
  };
  
  // "Delete" button functionality

  const deleteRow = (rowData) => {
    const index = data3.findIndex((row) => row === rowData);
    if (index !== -1) {
      const newData = [...data3];
      newData.splice(index, 1);
      const updatedData = newData.map((row, i) => ({ ...row, NO: i + 1 }));
      setData3(updatedData);
    }
  };

  // Indonesian date

  addLocale('id', {
    // firstDayOfWeek: 1,
    dayNames: [ 'minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'],
    dayNamesShort: ['min', 'sen', 'sel', 'rab', 'kam', 'jum', 'sab'],
    dayNamesMin: ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'St'],
    monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  });

  // Number formatter -> 2 decimals, Indoensian numbering

  const formatJumlah = (rowData) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rowData.JUMLAH);
  };

  // So that a prime react calendar component can read a date useState variable, we must change the Indonesian date string from the table into an english date string first.

  const convertToEnglishDate = (indonesianDate) => {
    const indonesianMonthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const englishMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const parts = indonesianDate.split(" ");
    const indonesianMonth = parts[1];
    const englishMonth = englishMonthNames[indonesianMonthNames.indexOf(indonesianMonth)];
    return indonesianDate.replace(indonesianMonth, englishMonth);
  };

  // const [testTanggal, setTestTanggal] = useState(new Date(convertToEnglishDate("6 Desember 2025")));

  return (
    <div className='card'>
      <h1>InaTrade Imitation (Data Distribusi Barang)</h1>
      <div style={{ display: "flex"}}>
        <Button onClick={openAddModal} label="Add 1 Row Manually" icon="pi pi-plus" />
        <p>&nbsp;&nbsp;OR&nbsp;&nbsp;</p>
        <FileUpload ref={fileUploadRef3} chooseLabel="Import Rows From Excel File" chooseOptionsLabel="Choose" mode="basic" customUpload uploadHandler={handleFileUpload3} accept=".xlsx, .xls" />
      </div>
      <br />
      <DataTable value={data3} showGridLines emptyMessage="tidak ditemukan." style={{ width: "100%" }} paginator rows={10} rowsPerPageOptions={[10, 20, 50, 100]}>
        <Column field="NO" header="No" />
        <Column field="JENIS" header="Jenis" />
        <Column field="JUMLAH" header="Jumlah" body={formatJumlah}/>
        <Column field="SATUAN" header="Satuan" />
        <Column field="TUJUAN BARANG" header="Tujuan" />
        <Column field="TANGGAL KELUAR" header="Tanggal Keluar" />
        <Column header="Aksi" body={(rowData, rowIndex) => dataTableBody(rowData, "aksi", rowIndex)} />
      </DataTable>

      <Dialog header='Add Row Manually' visible={showAddModal} onHide={closeAddModal}>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Jenis<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <Dropdown style={{width: "300px"}} id='jenis' options={['jenis1', 'jenis2', 'jenis3', 'jenisW', 'jenisX', 'jenisY', 'jenisZ']} value={jenis} onChange={(e) => setJenis(e.value)} placeholder='Pilih Jenis Barang' />
        </div>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Jumlah<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <InputNumber style={{width: "300px"}} id='jumlah' value={jumlah} onValueChange={(e) => setJumlah(e.value)} minFractionDigits={2} maxFractionDigits={2} min={0} locale="id-ID" />
        </div>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Satuan<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <InputText style={{width: "300px"}} id='satuan' value={satuan} onChange={(e) => setSatuan(e.target.value)} />
        </div>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Tujuan Barang<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <Dropdown style={{width: "300px"}} id='tujuan' options={['Bandung', 'Jakarta', 'Medan', 'Palembang', 'Surabaya']} value={tujuan} onChange={(e) => setTujuan(e.value)} placeholder='Pilih Tujuan Barang' />
        </div>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Tanggal Keluar<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <Calendar style={{width: "300px"}} id='tanggalKeluar' value={tanggalKeluar} onChange={(e) => setTanggalKeluar(e.value)} showIcon dateFormat="d MM yy" locale="id"/>
        </div>
        <div style={{display: "flex", margin: "40px 0px 0px", justifyContent: "center"}}>
          <Button label='Ok' onClick={addRowManually} disabled={!jenis || !jumlah || !satuan || !tujuan || !tanggalKeluar} icon="pi pi-check"/>
        </div>
      </Dialog>

      <Dialog header="Edit Row" visible={showEditModal} onHide={closeEditModal}>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Jenis<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <Dropdown style={{width: "300px"}} id='editJenis' options={['jenis1', 'jenis2', 'jenis3', 'jenisW', 'jenisX', 'jenisY', 'jenisZ']} value={editJenis} onChange={(e) => setEditJenis(e.value)} placeholder='Pilih Jenis Barang' />
        </div>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Jumlah<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <InputNumber style={{width: "300px"}} id='editJumlah' value={editJumlah} onValueChange={(e) => setEditJumlah(e.value)} minFractionDigits={2} maxFractionDigits={2} min={0} locale="id-ID" />
        </div>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Satuan<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <InputText style={{width: "300px"}} id='editSatuan' value={editSatuan} onChange={(e) => setEditSatuan(e.target.value)} />
        </div>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Tujuan Barang<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <Dropdown style={{width: "300px"}} id='editTujuan' options={['Bandung', 'Jakarta', 'Medan', 'Palembang', 'Surabaya']} value={editTujuan} onChange={(e) => setEditTujuan(e.value)} placeholder='Pilih Tujuan Barang' />
        </div>
        <div style={{display: "flex", margin: "10px 0px"}}>
          <div style={{width: "200px"}}><p>Tanggal Keluar<sup style={{color:"#FF0000"}}>*</sup></p></div>
          <Calendar style={{width: "300px"}} id='editTanggalKeluar' value={editTanggalKeluar} onChange={(e) => setEditTanggalKeluar(e.value)} showIcon dateFormat="d MM yy" locale="id"/>
        </div>
        <div style={{ display: "flex", margin: "40px 0px 0px", justifyContent: "center" }}>
          <Button label="Update" onClick={updateRow} disabled={!editJenis || !editJumlah || !editSatuan || !editTujuan || !editTanggalKeluar} icon="pi pi-check"/>
        </div>
      </Dialog>

      {/* <Calendar style={{width: "300px"}} id='testTanggal' value={testTanggal} onChange={(e) => setTestTanggal(e.value)} showIcon dateFormat="d MM yy" locale="id"/> */}

    </div>
  );
};

export default InaTradeImitation;
