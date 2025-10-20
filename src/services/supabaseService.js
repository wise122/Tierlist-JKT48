import { supabase } from '../lib/supabase';

// Helper function to check if operation should proceed
export const checkSupabaseConfig = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
};

// Helper function to sanitize text for SQL queries
const sanitizeText = (text) => {
  return text.replace(/'/g, "''");
};

// Save user choices
export const saveChoices = async (choices) => {
  try {
    checkSupabaseConfig();
    
    for (const choice of choices) {
      // Always store options in alphabetical order to ensure consistency
      let [optionA, optionB] = [choice.option1, choice.option2].sort();
      const selectedOption = choice.choice;
      const isOptionASelected = selectedOption === optionA;

      try {
        // First try to update existing pair
        const { data: existingPair, error: selectError } = await supabase
          .from('option_pairs')
          .select('*')
          .eq('option_a', optionA)
          .eq('option_b', optionB)
          .single();

        if (selectError && selectError.code !== 'PGRST116') { // Not found error
          throw selectError;
        }

        if (existingPair) {
          // Update existing pair
          const { error: updateError } = await supabase
            .from('option_pairs')
            .update({
              option_a_selected: existingPair.option_a_selected + (isOptionASelected ? 1 : 0),
              option_b_selected: existingPair.option_b_selected + (isOptionASelected ? 0 : 1),
              total_occurrences: existingPair.total_occurrences + 1
            })
            .eq('id', existingPair.id);

          if (updateError) throw updateError;
        } else {
          // Insert new pair
          const { error: insertError } = await supabase
            .from('option_pairs')
            .insert({
              option_a: optionA,
              option_b: optionB,
              option_a_selected: isOptionASelected ? 1 : 0,
              option_b_selected: isOptionASelected ? 0 : 1,
              total_occurrences: 1
            });

          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error(`Error processing choice ${optionA} vs ${optionB}:`, error);
        throw error;
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error saving choices:', error);
    throw error;
  }
};

// Get results for specific pairs
export const getResultsForPairs = async (pairs) => {
  try {
    const results = [];
    
    for (const pair of pairs) {
      // Sort options to match how they're stored in the database
      const [optionA, optionB] = [pair.option1, pair.option2].sort();
      
      // Query for this specific pair combination
      const { data, error } = await supabase
        .from('option_pairs')
        .select('*')
        .eq('option_a', optionA)
        .eq('option_b', optionB)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error

      // If no data exists yet, return default values
      if (!data) {
        results.push({
          option_a: pair.option1,
          option_b: pair.option2,
          option_a_selected: 0,
          option_b_selected: 0,
          option_a_percentage: 0,
          option_b_percentage: 0,
          total_occurrences: 0
        });
        continue;
      }

      // Calculate percentages
      const option_a_percentage = data.total_occurrences ? 
        Math.round((data.option_a_selected / data.total_occurrences) * 100) : 0;
      const option_b_percentage = data.total_occurrences ? 
        Math.round((data.option_b_selected / data.total_occurrences) * 100) : 0;

      results.push({
        option_a: pair.option1,
        option_b: pair.option2,
        option_a_selected: data.option_a_selected,
        option_b_selected: data.option_b_selected,
        option_a_percentage,
        option_b_percentage,
        total_occurrences: data.total_occurrences
      });
    }

    return results;
  } catch (error) {
    console.error('Error getting results:', error);
    throw error;
  }
};

// Get all results
export const getAllResults = async () => {
  try {
    checkSupabaseConfig();
    
    const { data, error } = await supabase
      .from('option_pairs')
      .select('*')
      .gt('total_occurrences', 0)
      .order('total_occurrences', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      option_a: row.option_a,
      option_b: row.option_b,
      option_a_selected: row.option_a_selected || 0,
      option_b_selected: row.option_b_selected || 0,
      total_occurrences: row.total_occurrences || 0,
      option_a_percentage: row.total_occurrences ? Math.round((row.option_a_selected / row.total_occurrences) * 1000) / 10 : 0,
      option_b_percentage: row.total_occurrences ? Math.round((row.option_b_selected / row.total_occurrences) * 1000) / 10 : 0
    }));
  } catch (error) {
    console.error('Error getting all results:', error);
    throw error;
  }
}; 