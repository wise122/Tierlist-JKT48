import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitSuggestion } from './services/suggestionService';
import './styles/Suggestion.css';

const Suggestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      if (!formData.name) {
        throw new Error('Please enter your suggestion');
      }

      await submitSuggestion(formData);
      setMessage('Thank you for your suggestion!');
      setFormData({
        name: '',
        notes: ''
      });
    } catch (error) {
      setMessage(error.message || 'An error occurred while submitting your suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="suggestion-container">
      <div className="suggestion-content">
        <h1 className="suggestion-title">Suggest New JKT48 Fan Life Scenario</h1>
        
        <form onSubmit={handleSubmit} className="suggestion-form">
          <div className="form-group">
            <label htmlFor="name">Your Scenario *</label>
            <textarea
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your JKT48 fan life scenario (e.g., 'Dapat MnG tapi lupa mau ngomong apa')"
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information or context (optional)"
              rows="4"
            />
          </div>

          {message && (
            <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <div className="button-group">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
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