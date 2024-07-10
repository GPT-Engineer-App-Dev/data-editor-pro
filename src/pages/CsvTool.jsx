import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import Papa from "papaparse";

const CsvTool = () => {
  const [csvData, setCsvData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setHeaders(results.meta.fields);
          setCsvData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  const handleInputChange = (event, rowIndex, field) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][field] = event.target.value;
    setCsvData(updatedData);
  };

  const handleNewRowChange = (event, field) => {
    setNewRow({ ...newRow, [field]: event.target.value });
  };

  const handleAddRow = () => {
    if (Object.keys(newRow).length === headers.length) {
      setCsvData([...csvData, newRow]);
      setNewRow({});
    } else {
      alert("Please fill in all fields before adding a new row.");
    }
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(updatedData);
  };

  const handleDownloadCsv = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "edited_data.csv";
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">CSV Management Tool</h1>
      <div className="mb-8">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button onClick={handleFileUpload} className="ml-2">Upload</Button>
      </div>
      {csvData.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, index) => (
                    <TableCell key={index}>
                      <Input
                        value={row[header]}
                        onChange={(event) => handleInputChange(event, rowIndex, header)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => handleDeleteRow(rowIndex)} variant="destructive">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Add New Row</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {headers.map((header, index) => (
                <Input
                  key={index}
                  placeholder={header}
                  value={newRow[header] || ""}
                  onChange={(event) => handleNewRowChange(event, header)}
                />
              ))}
            </div>
            <Button onClick={handleAddRow} className="mt-4">Add Row</Button>
          </div>
          <div className="mt-8">
            <Button onClick={handleDownloadCsv}>Download CSV</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CsvTool;