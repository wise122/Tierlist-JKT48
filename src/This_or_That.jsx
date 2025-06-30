import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { thisOrThatQuestions, categories } from './data/this_or_that_data';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { saveChoices, getResultsForPairs, getAllResults } from './services/supabaseService';
import './styles/ThisOrThat.css';
import { supabase } from './services/supabaseService';

const STORAGE_KEY = 'thisOrThatChoices';

const ThisOrThat = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [questionCount, setQuestionCount] = useState(5);
  const [score, setScore] = useState({ option1: 0, option2: 0 });
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [choices, setChoices] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const questionCountOptions = [5, 10, 15, 20, 'All'];

  // Load saved choices from localStorage
  useEffect(() => {
    const savedChoices = localStorage.getItem(STORAGE_KEY);
    if (savedChoices) {
      setChoices(JSON.parse(savedChoices));
    }
  }, []);

  // Test Supabase connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('option_pairs')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
        } else {
          console.log('Supabase connected successfully');
        }
      } catch (error) {
        console.error('Failed to connect to Supabase:', error);
      }
    };

    testConnection();
  }, []);

  useEffect(() => {
    let filteredQuestions = selectedCategory === 'All' 
      ? [...thisOrThatQuestions]
      : thisOrThatQuestions.filter(q => q.category === selectedCategory);
    
    filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
    
    if (questionCount !== 'All' && filteredQuestions.length > questionCount) {
      filteredQuestions = filteredQuestions.slice(0, questionCount);
    }
    
    setQuestions(filteredQuestions);
    setCurrentQuestionIndex(0);
    setScore({ option1: 0, option2: 0 });
    setSelectedAnswers([]);
    setShowResults(false);
  }, [selectedCategory, questionCount]);

  const handleChoice = (choice) => {
    const newSelectedAnswers = [...selectedAnswers, choice];
    setSelectedAnswers(newSelectedAnswers);
    const currentQ = questions[currentQuestionIndex];
    
    const newChoices = [...choices, {
      option1: currentQ.option1,
      option2: currentQ.option2,
      category: currentQ.category,
      choice: choice === 'option1' ? currentQ.option1 : currentQ.option2
    }];
    
    setChoices(newChoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newChoices));

    setScore(prev => ({
      ...prev,
      [choice]: prev[choice] + 1
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const saveToDatabase = async () => {
    setIsLoading(true);
    try {
      // Directly call the Supabase service
      await saveChoices(choices);
      
      // Get results for the pairs we just played
      const results = await getResultsForPairs(choices);
      setResults(results);
      setShowResults(true);
      
      // Clear localStorage after successful save
      localStorage.removeItem(STORAGE_KEY);
      setChoices([]);
    } catch (error) {
      console.error('Error saving choices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore({ option1: 0, option2: 0 });
    setSelectedAnswers([]);
    setGameStarted(false);
    setShowResults(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isGameOver = currentQuestionIndex === questions.length - 1 && selectedAnswers.length === questions.length;

  if (questions.length === 0) {
    return (
      <div className="this-or-that-container">
        <div className="game-container">
          <div className="game-card">
            <h2 className="game-over-title text-red-600">No Questions Available</h2>
            <p>Please select a different category or contact the administrator.</p>
            <button onClick={() => navigate('/')} className="back-button">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="this-or-that-container">
      <div className="game-container">
        <h1 className="game-title">JKT48 This or That</h1>

        {!gameStarted ? (
          <div className="setup-card">
            <div className="setup-form">
              <div className="form-group">
                <label htmlFor="category">Select Category:</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select-input"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="questionCount">Number of Questions:</label>
                <select
                  id="questionCount"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                  className="select-input"
                >
                  {questionCountOptions.map(count => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setGameStarted(true)}
                className="start-button"
              >
                Start Game
              </button>

              <button
                onClick={() => navigate('/')}
                className="back-button"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : isGameOver ? (
          showResults ? (
            <div className="results-card">
              <h2 className="results-title">Your Game Results</h2>
              <div className="results-list">
                {results.map((result, index) => (
                  <div key={index} className="result-item">
                    <div className="result-header">
                      <div className="result-options">
                        <span>{result.option_a}</span>
                        <span>vs</span>
                        <span>{result.option_b}</span>
                      </div>
                    </div>
                    <div className="percentage-bar">
                      <div 
                        className="percentage-fill option-a"
                        style={{ width: `${result.option_a_percentage}%` }}
                      >
                        {result.option_a_percentage}%
                      </div>
                      <div 
                        className="percentage-fill option-b"
                        style={{ width: `${result.option_b_percentage}%` }}
                      >
                        {result.option_b_percentage}%
                      </div>
                    </div>
                    <div className="vote-counts">
                      <span>{result.option_a_selected} votes</span>
                      <span>Total votes: {result.total_occurrences}</span>
                      <span>{result.option_b_selected} votes</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="button-group">
                <button
                  onClick={restartGame}
                  className="play-again-button"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="back-button"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="game-over-card">
              <h2 className="game-over-title">Game Over!</h2>
              <div className="results-grid">
                <div className="result-box option1">
                  <p className="result-label">Option 1</p>
                  <p className="result-score">{score.option1}</p>
                </div>
                <div className="result-box option2">
                  <p className="result-label">Option 2</p>
                  <p className="result-score">{score.option2}</p>
                </div>
              </div>
              <div className="button-group">
                <button
                  onClick={saveToDatabase}
                  className="save-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save & Show Results'}
                </button>
                <button
                  onClick={restartGame}
                  className="play-again-button"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="back-button"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="game-card">
            <div className="progress-container">
              <div className="progress-info">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Category: {currentQuestion.category}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="options-grid">
              <button
                onClick={() => handleChoice('option1')}
                className="option-button option1"
              >
                <p className="option-text">{currentQuestion.option1}</p>
              </button>
              <button
                onClick={() => handleChoice('option2')}
                className="option-button option2"
              >
                <p className="option-text">{currentQuestion.option2}</p>
              </button>
            </div>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
                  restartGame();
                }
              }}
              className="back-button"
            >
              Back to Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThisOrThat;
