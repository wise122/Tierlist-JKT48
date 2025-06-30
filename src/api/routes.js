const express = require('express');
const router = express.Router();
const { saveChoices, getResultsForPairs, getAllResults } = require('../services/supabaseService');

// Save choices and get results
router.post('/save-choices', async (req, res) => {
  try {
    const { choices } = req.body;
    await saveChoices(choices);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving choices:', error);
    res.status(500).json({ error: 'Failed to save choices' });
  }
});

// Get results for specific pairs
router.post('/results-for-pairs', async (req, res) => {
  try {
    const { pairs } = req.body;
    const results = await getResultsForPairs(pairs);
    res.json(results);
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

// Get all results
router.get('/results', async (req, res) => {
  try {
    const results = await getAllResults();
    res.json(results);
  } catch (error) {
    console.error('Error getting results:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
});

module.exports = router; 