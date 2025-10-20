import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { supabase } from './lib/supabase';
import { saveGameChoices, getRandomPairs } from './services/optionService';
import { getResultsForPairs } from './services/supabaseService';
import './styles/ThisOrThat.css';

const STORAGE_KEY = 'thisOrThatChoices';

const ThisOrThat = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(5);
  const [score, setScore] = useState({ option1: 0, option2: 0 });
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [choices, setChoices] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const questionCountOptions = [5, 10, 15, 20, 'All'];

  // Load saved choices from localStorage
  useEffect(() => {
    const savedChoices = localStorage.getItem(STORAGE_KEY);
    if (savedChoices) {
      setChoices(JSON.parse(savedChoices));
    }
  }, []);

  // Load questions when game starts
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setError('');
        setIsLoadingQuestions(true);
        const pairs = await getRandomPairs(questionCount);
        if (!pairs || pairs.length === 0) {
          throw new Error('No questions available');
        }
        setQuestions(pairs);
        if (pairs.length < questionCount && questionCount !== 'All') {
          setError(`Note: Only ${pairs.length} unique pairs available. Each option will appear only once.`);
        }
        setCurrentQuestionIndex(0);
        setScore({ option1: 0, option2: 0 });
        setSelectedAnswers([]);
        setShowResults(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setError('Failed to load questions. Please try again.');
        setGameStarted(false);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    if (gameStarted) {
      loadQuestions();
    }
  }, [questionCount, gameStarted]);

  const handleChoice = (choice) => {
    if (!questions[currentQuestionIndex]) return;

    const newSelectedAnswers = [...selectedAnswers, choice];
    setSelectedAnswers(newSelectedAnswers);
    const currentQ = questions[currentQuestionIndex];
    
    const newChoices = [...choices, {
      option1: currentQ.option1,
      option2: currentQ.option2,
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
      // Save choices using the new service
      await saveGameChoices(choices);
      
      // Get results only for the pairs we just played
      const pairResults = await Promise.all(
        questions.map(async (pair) => {
          const result = await getResultsForPairs([{
            option1: pair.option1,
            option2: pair.option2,
            choice: choices.find(c => 
              (c.option1 === pair.option1 && c.option2 === pair.option2) ||
              (c.option1 === pair.option2 && c.option2 === pair.option1)
            )?.choice || pair.option1
          }]);
          return result[0]; // Get first result since we're querying one pair at a time
        })
      );
      setResults(pairResults);
      setShowResults(true);
      
      // Clear localStorage after successful save
      localStorage.removeItem(STORAGE_KEY);
      setChoices([]);
    } catch (error) {
      console.error('Error saving choices:', error);
      setError('Failed to save results');
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
    setError('');
    setQuestions([]);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isGameOver = currentQuestionIndex === questions.length - 1 && selectedAnswers.length === questions.length;

  if (isLoadingQuestions) {
    return (
      <div className="this-or-that-container">
        <div className="game-container">
          <div className="game-card">
            <h2 className="game-over-title">Loading Questions...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="this-or-that-container">
        <div className="game-container">
          <div className="game-card">
            <h2 className="game-over-title text-red-600">{error}</h2>
            <button onClick={restartGame} className="back-button">
              Try Again
            </button>
            <button onClick={() => navigate('/this-or-that')} className="back-button">
              Back to This or That
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
                <label htmlFor="questionCount">Jumlah Pertanyaan:</label>
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
                onClick={() => navigate('/this-or-that')}
                className="back-button"
              >
                Back to This or That
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
                  onClick={() => navigate('/this-or-that')}
                  className="back-button"
                >
                  Back to This or That
                </button>
              </div>
            </div>
          ) : (
            <div className="game-over-card">
              <h2 className="game-over-title">Game Over!</h2>
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
                  onClick={() => navigate('/this-or-that')}
                  className="back-button"
                >
                  Back to This or That
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="game-card">
            <div className="progress-container">
              <div className="progress-info">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {currentQuestion && (
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
            )}

            <button
              onClick={() => {
                if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
                  restartGame();
                }
              }}
              className="back-button"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThisOrThat;
