import { supabase } from '../lib/supabase';

// Helper function to check if operation should proceed
const checkSupabaseConfig = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
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
    checkSupabaseConfig();
    
    const filters = pairs.map(pair => {
      const [optionA, optionB] = [pair.option1, pair.option2].sort();
      return `(option_a.eq.'${optionA}',option_b.eq.'${optionB}')`;
    }).join(',');

    const { data, error } = await supabase
      .from('option_pairs')
      .select('*')
      .or(filters);

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