import { supabase } from '../lib/supabase';
import { checkSupabaseConfig } from './supabaseService';

// Get all options
export const getAllOptions = async () => {
  try {
    checkSupabaseConfig();
    const { data, error } = await supabase
      .from('options')
      .select('*')
      .order('created_at');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting options:', error);
    throw error;
  }
};

// Get random pairs for the game
export const getRandomPairs = async (count) => {
  try {
    // Get all available options
    const { data: options, error } = await supabase
      .from('options')
      .select('name');

    if (error) throw error;
    if (!options || options.length < 2) {
      throw new Error('Not enough options available');
    }

    const allOptions = options.map(opt => opt.name);
    const usedOptions = new Set();
    const usedPairs = new Set();
    const pairs = [];
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loops

    while (pairs.length < (count === 'All' ? Math.floor(allOptions.length / 2) : count) && attempts < maxAttempts) {
      attempts++;
      
      // Get available options (not used in this session)
      const availableOptions = allOptions.filter(opt => !usedOptions.has(opt));
      
      if (availableOptions.length < 2) {
        break; // Not enough unused options left
      }

      // Get two random options from available ones
      const idx1 = Math.floor(Math.random() * availableOptions.length);
      const option1 = availableOptions[idx1];
      
      // Remove first option from available list for second pick
      const remainingOptions = availableOptions.filter((_, idx) => idx !== idx1);
      const idx2 = Math.floor(Math.random() * remainingOptions.length);
      const option2 = remainingOptions[idx2];

      // Create a unique pair identifier (alphabetically sorted)
      const pairId = [option1, option2].sort().join('|||');

      // Check if this pair has been used
      if (!usedPairs.has(pairId)) {
        pairs.push({
          option1,
          option2
        });
        
        // Mark both options and the pair as used
        usedOptions.add(option1);
        usedOptions.add(option2);
        usedPairs.add(pairId);
      }
    }

    if (pairs.length === 0) {
      throw new Error('Could not generate any valid pairs');
    }

    if (pairs.length < count && count !== 'All') {
      console.warn(`Could only generate ${pairs.length} unique pairs instead of requested ${count}`);
    }

    return pairs;
  } catch (error) {
    console.error('Error getting random pairs:', error);
    throw error;
  }
};

// Save game choices
export const saveGameChoices = async (choices) => {
  try {
    for (const choice of choices) {
      // Always store options in alphabetical order to ensure consistency
      const [optionA, optionB] = [choice.option1, choice.option2].sort();
      const selectedOption = choice.choice;
      const isOptionASelected = selectedOption === optionA;

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
    }
    return { success: true };
  } catch (error) {
    console.error('Error saving game choices:', error);
    throw error;
  }
};

// Get results for a specific pair
export const getResultsForPair = async (option1, option2) => {
  try {
    checkSupabaseConfig();
    const [optionA, optionB] = [option1, option2].sort();
    
    const { data, error } = await supabase
      .from('option_pairs')
      .select('*')
      .eq('option_a', optionA)
      .eq('option_b', optionB)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return {
        option_a: optionA,
        option_b: optionB,
        option_a_selected: 0,
        option_b_selected: 0,
        total_occurrences: 0,
        option_a_percentage: 0,
        option_b_percentage: 0
      };
    }

    return {
      option_a: data.option_a,
      option_b: data.option_b,
      option_a_selected: data.option_a_selected,
      option_b_selected: data.option_b_selected,
      total_occurrences: data.total_occurrences,
      option_a_percentage: data.total_occurrences ? Math.round((data.option_a_selected / data.total_occurrences) * 1000) / 10 : 0,
      option_b_percentage: data.total_occurrences ? Math.round((data.option_b_selected / data.total_occurrences) * 1000) / 10 : 0
    };
  } catch (error) {
    console.error('Error getting pair results:', error);
    throw error;
  }
};

// Get all available categories
export const getCategories = async () => {
  try {
    checkSupabaseConfig();
    const { data, error } = await supabase
      .from('options')
      .select('category')
      .distinct();
    
    if (error) throw error;
    return data.map(item => item.category);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}; 