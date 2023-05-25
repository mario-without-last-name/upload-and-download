import React, { useState, useEffect, useRef } from "react"
import * as XLSX from "xlsx";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { FileUpload } from 'primereact/fileupload';

import '../App.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

function UploadCard() {

  // UPLOAD - https://www.youtube.com/watch?v=yd48ImBhC5U

  // Using basic html <input>
  const [data1, setData1] = useState([]);
  const handleFileUpload1 = (e) => {
    const reader = new FileReader(); // create a new instance, allowing access to several file manipulation methods
    reader.readAsBinaryString(e.target.files[0]); // start reading the (first) file's content
    reader.onload = (e) => { // after successfully freading the file's contents...
      const data1 = e.target.result; // store all values in this variable
      const workbook = XLSX.read(data1, { type: "binary" }); // convert binary data into a readable excel format
      const sheetName = workbook.SheetNames[0]; // the chosen sheet name is the first worksheet
      const sheet = workbook.Sheets[sheetName]; // take that sheet name as the key
      const parsedData1 = XLSX.utils.sheet_to_json(sheet); // turn the data of the selected sheet into a json object
      setData1(parsedData1); // store the json data into the state variable.
    };
  };

  
  // Using Prime React's <FileUpload>, data needs to be converted to base64 encoded format, I think?
  const [data2, setData2] = useState([]);
  const fileUploadRef2 = useRef(null);
  const handleFileUpload2 = (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data2 = e.target.result;
      const workbook = XLSX.read(data2, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData2 = XLSX.utils.sheet_to_json(sheet);
      setData2(parsedData2);
    };
    reader.readAsBinaryString(file);
    fileUploadRef2.current.clear();
  };

  return (
    <div className='card'>
      <h1>Upload File</h1>
      <Divider />
      <h4>{"Using regular html <input> and <table>"}</h4>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload1}/>
      <br/>
      {/* {Object.keys(data[0]).map((key) => (...)     Make table headers (column names), notice we used keys, not the values directly. It returns an array of property names for that object */}
      {data1.length > 0 && (
        <table className="table" border={10}>
          <thead>
            <tr>
              {Object.keys(data1[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data1.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Divider />
      <h4>{"Using Prime React <FileUpload> and <DataTable>"}</h4>
      {/* Using Prime React <FileUpload>*/}
      <FileUpload ref={fileUploadRef2} chooseOptionsLabel="Choose" mode="basic" customUpload uploadHandler={handleFileUpload2} accept=".xlsx, .xls"/>
      <br/>
      {data2.length > 0 && (
        <DataTable value={data2} className="table" style={{width:"100%"}}>
          {Object.keys(data2[0]).map((key) => (
            <Column key={key} field={key} header={key} />
          ))}
        </DataTable>
      )}
    </div>
  );
}

export default UploadCard;