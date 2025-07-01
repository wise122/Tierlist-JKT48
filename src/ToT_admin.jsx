import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { supabase } from './lib/supabase';
import { downloadSuggestionsAsExcel } from './services/suggestionService';
import './styles/ToTAdmin.css';

const ToTAdmin = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load options from database on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('options')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setOptions(data);
      } catch (error) {
        console.error('Error loading options:', error);
        setMessage('Error: Could not load options');
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, []);

  const downloadTemplate = () => {
    const template = [
      ['name'],
      ['Verif Theater terus tapi Row J']
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Options');
    XLSX.writeFile(wb, 'options_template.xlsx');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Validate data format
        const isValid = data.every(row => row.name);

        if (!isValid) {
          setMessage('Error: Invalid file format. Please use the template.');
          return;
        }

        // Insert options into database
        const { error } = await supabase
          .from('options')
          .insert(data);

        if (error) throw error;

        // Reload options
        const { data: newOptions, error: loadError } = await supabase
          .from('options')
          .select('*')
          .order('created_at', { ascending: true });

        if (loadError) throw loadError;
        
        setOptions(newOptions);
        setMessage('Options imported successfully!');
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error: Could not process the file or save to database.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const exportOptions = () => {
    const exportData = options.map(({ name }) => ({ name }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Options');
    XLSX.writeFile(wb, 'options.xlsx');
  };

  const handleDownloadSuggestions = async () => {
    setIsDownloading(true);
    try {
      await downloadSuggestionsAsExcel();
      setMessage('Suggestions downloaded successfully!');
    } catch (error) {
      setMessage('Error: Could not download suggestions.');
      console.error('Error downloading suggestions:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="admin-content">
          <h1 className="admin-title">Loading...</h1>
        </div>
      </div>
    );
  }

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
          <h2 className="section-title">Import Options</h2>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="file-input"
          />
        </div>

        <div className="admin-section">
          <h2 className="section-title">Export Options</h2>
          <button
            onClick={exportOptions}
            className="admin-button success"
          >
            Export Current Options
          </button>
        </div>

        <div className="admin-section">
          <h2 className="section-title">User Suggestions</h2>
          <button
            onClick={handleDownloadSuggestions}
            className="admin-button info"
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download Suggestions'}
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="admin-section">
          <h2 className="section-title">Current Options</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {options.map((option, index) => (
                  <tr key={index}>
                    <td>{option.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={() => navigate('/this-or-that')}
          className="admin-button primary"
          style={{ marginTop: '1rem' }}
        >
          Back to This or That
        </button>
      </div>
    </div>
  );
};

export default ToTAdmin;
