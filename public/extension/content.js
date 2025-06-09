// This file is currently empty but can be used for future features
// such as adding a download button directly to the JKT48 website 

console.log('[JKT48 Extension] Content script loaded');

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[JKT48 Extension] Received message:', message);
  
  if (message.type === 'POINTS_HISTORY_UPDATED' && message.data) {
    console.log('[JKT48 Extension] Saving data to localStorage:', message.data);
    
    try {
      // Store in localStorage for the webpage to access
      localStorage.setItem('jkt48_points_history', JSON.stringify(message.data));
      
      // Dispatch an event to notify the webpage
      const event = new CustomEvent('JKT48_POINTS_HISTORY_UPDATED', {
        detail: message.data
      });
      window.dispatchEvent(event);
      
      console.log('[JKT48 Extension] Data saved and event dispatched');
      sendResponse({ success: true });
    } catch (error) {
      console.error('[JKT48 Extension] Error saving data:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  
  // Required for async response
  return true;
});

// Initial load - get data from storage and save to localStorage
chrome.storage.local.get('jkt48_points_history', (result) => {
  if (result.jkt48_points_history) {
    localStorage.setItem('jkt48_points_history', JSON.stringify(result.jkt48_points_history));
    window.dispatchEvent(new CustomEvent('JKT48_POINTS_HISTORY_UPDATED'));
  }
}); 