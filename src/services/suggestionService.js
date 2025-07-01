import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

export const submitSuggestion = async (suggestion) => {
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .insert({
        name: suggestion.name,
        notes: suggestion.notes,
        status: 'pending' // Default status for new suggestions
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting suggestion:', error);
    throw error;
  }
};

export const getAllSuggestions = async () => {
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw error;
  }
};

export const downloadSuggestionsAsExcel = async () => {
  try {
    const suggestions = await getAllSuggestions();
    
    // Convert suggestions to worksheet format
    const wsData = suggestions.map(suggestion => ({
      'Option Name': suggestion.name,
      'Status': suggestion.status || 'pending',
      'Notes': suggestion.notes,
      'Created At': new Date(suggestion.created_at).toLocaleString()
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Suggestions');

    // Download file
    XLSX.writeFile(wb, 'jkt48_fan_life_suggestions.xlsx');
  } catch (error) {
    console.error('Error downloading suggestions:', error);
    throw error;
  }
}; 