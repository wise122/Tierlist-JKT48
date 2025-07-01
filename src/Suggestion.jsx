import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveSuggestion } from './services/suggestionService';
import './styles/Suggestion.css';

const Suggestion = () => {
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      setError('Please enter a suggestion');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await saveSuggestion(suggestion.trim());
      setSuccess(true);
      setSuggestion('');
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setError('Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="suggestion-container">
      <h1 className="suggestion-title">Berikan Ide Pilihan</h1>
      <p className="suggestion-subtitle">Ide pilihan akan digunakan untuk membuat game ini lebih baik</p>
      
      <div className="suggestion-card">
        <form onSubmit={handleSubmit} className="suggestion-form">
          <div className="form-group">
            <label htmlFor="suggestion">Masukan Idemu di sini:</label>
            <input
              type="text"
              id="suggestion"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Verif Theater tapi depanmmu Tiang...."
              disabled={isSubmitting}
              className="suggestion-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Thank you for your suggestion!</p>}

          <div className="button-group">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/this-or-that')}
              className="back-button"
            >
              Back to This or That
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Suggestion; 