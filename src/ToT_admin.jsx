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
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load options from database on mount
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('options')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setOptions(data);
    } catch (error) {
      console.error('Error loading options:', error);
      setMessage({ text: 'Error: Could not load options', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['name'],
      ['Example Option 1'],
      ['Example Option 2']
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'options_template.xlsx');
  };

  const exportCurrentOptions = () => {
    try {
      const exportData = options.map(({ name }) => ({ name }));
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Current Options');
      XLSX.writeFile(wb, 'current_options.xlsx');
      setMessage({ text: 'Options exported successfully!', type: 'success' });
    } catch (error) {
      console.error('Error exporting options:', error);
      setMessage({ text: 'Error: Could not export options', type: 'error' });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    setIsProcessing(true);
    setMessage(null);

    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Validate data format
        const isValid = data.every(row => row.name && typeof row.name === 'string');
        if (!isValid) {
          throw new Error('Invalid file format. Please use the template.');
        }

        // Insert options into database
        const { error } = await supabase
          .from('options')
          .insert(data);

        if (error) throw error;

        // Reload options
        await loadOptions();
        setMessage({ text: 'Options imported successfully!', type: 'success' });
      } catch (error) {
        console.error('Error:', error);
        setMessage({ 
          text: error.message || 'Error: Could not process the file or save to database.', 
          type: 'error' 
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadSuggestions = async () => {
    setIsProcessing(true);
    try {
      await downloadSuggestionsAsExcel();
      setMessage({ text: 'Suggestions downloaded successfully!', type: 'success' });
    } catch (error) {
      let errorMessage = 'Error: Could not download suggestions.';
      
      // Handle specific error messages
      if (error.message.includes('Please log in as admin')) {
        errorMessage = 'Error: Please log in as admin to download suggestions';
      } else if (error.message.includes('Access denied')) {
        errorMessage = 'Error: Admin privileges required to download suggestions';
      } else if (error.message.includes('No suggestions found')) {
        errorMessage = 'No suggestions found in the database';
      }
      
      setMessage({ text: errorMessage, type: 'error' });
      console.error('Error downloading suggestions:', error);
    } finally {
      setIsProcessing(false);
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
        
        <div className="admin-grid">
          <div className="admin-card">
            <h2 className="card-title">Import Options</h2>
            <p className="card-description">Import new options from an Excel file.</p>
            <div className="card-actions">
              <button onClick={downloadTemplate} className="admin-button secondary">
                Download Template
              </button>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="file-input"
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="admin-card">
            <h2 className="card-title">Export Options</h2>
            <p className="card-description">Export current options to an Excel file.</p>
            <button
              onClick={exportCurrentOptions}
              className="admin-button primary"
              disabled={isProcessing}
            >
              Export Current Options
            </button>
          </div>

          <div className="admin-card">
            <h2 className="card-title">Download Suggestions</h2>
            <p className="card-description">Download user suggestions as Excel file.</p>
            <button
              onClick={handleDownloadSuggestions}
              className="admin-button accent"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Download Suggestions'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="admin-card current-options">
          <h2 className="card-title">Current Options</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {options.map((option) => (
                  <tr key={option.id}>
                    <td>{option.name}</td>
                    <td>{new Date(option.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={() => navigate('/this-or-that')}
          className="admin-button back"
        >
          Back to This or That
        </button>
      </div>
    </div>
  );
};

export default ToTAdmin;
