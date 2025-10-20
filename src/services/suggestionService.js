import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

export const saveSuggestion = async (suggestion) => {
  try {
    const { error } = await supabase
      .from('suggestions')
      .insert([{
        name: suggestion,
        category: 'User Suggestion', // Default category for user suggestions
        status: 'pending'
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving suggestion:', error);
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
    // Get all suggestions
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Check if we have any suggestions
    if (!data || data.length === 0) {
      throw new Error('No suggestions found in the database');
    }

    // Format the data for Excel
    const formattedData = data.map(suggestion => ({
      'Suggestion': suggestion.name,
      'Category': suggestion.category,
      'Status': suggestion.status,
      'Created At': new Date(suggestion.created_at).toLocaleString(),
    }));

    // Create worksheet with formatted data
    const ws = XLSX.utils.json_to_sheet(formattedData, {
      header: ['Suggestion', 'Category', 'Status', 'Created At'],
    });

    // Set column widths
    const colWidths = [
      { wch: 40 }, // Suggestion
      { wch: 20 }, // Category
      { wch: 15 }, // Status
      { wch: 20 }, // Created At
    ];
    ws['!cols'] = colWidths;

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Suggestions');

    // Write file
    XLSX.writeFile(wb, 'jkt48_suggestions.xlsx');
  } catch (error) {
    console.error('Error downloading suggestions:', error);
    throw error;
  }
}; 