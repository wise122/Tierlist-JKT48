// This file is currently empty but can be used for future features
// such as adding a download button directly to the JKT48 website 

console.log('[JKT48 Extension] Content script loaded');
console.log('[JKT48 Extension] Current URL:', window.location.href);

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[JKT48 Extension] Received message:', message);
  
  if (message.type === 'POINTS_HISTORY_UPDATED' && message.data) {
    console.log('[JKT48 Extension] Saving data to localStorage:', message.data);
    
    try {
      // Store in localStorage for the webpage to access
      localStorage.setItem('jkt48_points_history', JSON.stringify(message.data));
      
      // Log localStorage content after saving
      const savedData = localStorage.getItem('jkt48_points_history');
      console.log('[JKT48 Extension] Verified saved data:', savedData);
      
      // Dispatch an event to notify the webpage
      const event = new CustomEvent('JKT48_POINTS_HISTORY_UPDATED', {
        detail: message.data
      });
      window.dispatchEvent(event);
      
      console.log('[JKT48 Extension] Data saved and event dispatched');
      
      // Try to immediately read the data back
      const verifyData = localStorage.getItem('jkt48_points_history');
      console.log('[JKT48 Extension] Immediate verification of data:', verifyData);
      
      sendResponse({ success: true });
    } catch (error) {
      console.error('[JKT48 Extension] Error saving data:', error);
      console.error('[JKT48 Extension] Error details:', {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      });
      sendResponse({ success: false, error: error.message });
    }
  }
  
  // Required for async response
  return true;
});

// Initial load - get data from storage and save to localStorage
chrome.storage.local.get('jkt48_points_history', (result) => {
  console.log('[JKT48 Extension] Loading initial data from chrome.storage:', result);
  if (result.jkt48_points_history) {
    try {
      localStorage.setItem('jkt48_points_history', JSON.stringify(result.jkt48_points_history));
      console.log('[JKT48 Extension] Initial data saved to localStorage');
      window.dispatchEvent(new CustomEvent('JKT48_POINTS_HISTORY_UPDATED'));
    } catch (error) {
      console.error('[JKT48 Extension] Error during initial data load:', error);
    }
  } else {
    console.log('[JKT48 Extension] No initial data found in chrome.storage');
  }
}); 