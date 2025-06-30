import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { thisOrThatQuestions } from './data/this_or_that_data';
import './styles/ToTAdmin.css';

const ToTAdmin = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(thisOrThatQuestions);
  const [message, setMessage] = useState('');

  const downloadTemplate = () => {
    const template = [
      ['option1', 'option2', 'category'],
      ['Melody JKT48', 'Freya JKT48', 'Members']
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'This or That Questions');
    XLSX.writeFile(wb, 'this_or_that_template.xlsx');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Validate data format
        const isValid = data.every(row => 
          row.option1 && row.option2 && row.category
        );

        if (!isValid) {
          setMessage('Error: Invalid file format. Please use the template.');
          return;
        }

        setQuestions(data);
        setMessage('Questions imported successfully!');
      } catch (error) {
        setMessage('Error: Could not process the file.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const exportQuestions = () => {
    const ws = XLSX.utils.json_to_sheet(questions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'This or That Questions');
    XLSX.writeFile(wb, 'this_or_that_questions.xlsx');
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1 className="admin-title">This or That Admin Panel</h1>
        
        <div className="admin-section">
          <h2 className="section-title">Template</h2>
          <button
            onClick={downloadTemplate}
            className="admin-button primary"
          >
            Download Template
          </button>
        </div>

        <div className="admin-section">
          <h2 className="section-title">Import Questions</h2>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="file-input"
          />
        </div>

        <div className="admin-section">
          <h2 className="section-title">Export Questions</h2>
          <button
            onClick={exportQuestions}
            className="admin-button success"
          >
            Export Current Questions
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="admin-section">
          <h2 className="section-title">Current Questions</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Option 1</th>
                  <th>Option 2</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => (
                  <tr key={index}>
                    <td>{q.option1}</td>
                    <td>{q.option2}</td>
                    <td>{q.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="admin-button primary"
          style={{ marginTop: '1rem' }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ToTAdmin;
