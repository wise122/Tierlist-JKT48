// This file is currently empty but can be used for future features
// such as adding a download button directly to the JKT48 website 

console.log('[JKT48 Extension] Content script loaded');
console.log('[JKT48 Extension] Current URL:', window.location.href);

// Function to sync data from chrome.storage to localStorage
const syncDataToLocalStorage = async () => {
  console.log('[JKT48 Extension] Attempting to sync data to localStorage');
  try {
    const result = await chrome.storage.local.get('jkt48_points_history');
    console.log('[JKT48 Extension] Data from chrome.storage:', result);
    
    if (result.jkt48_points_history) {
      const dataString = JSON.stringify(result.jkt48_points_history);
      localStorage.setItem('jkt48_points_history', dataString);
      console.log('[JKT48 Extension] Data synced to localStorage:', dataString);
      
      // Verify the data was saved
      const savedData = localStorage.getItem('jkt48_points_history');
      console.log('[JKT48 Extension] Verified localStorage data:', savedData);
      
      // Dispatch event to notify the webpage
      const event = new CustomEvent('JKT48_POINTS_HISTORY_UPDATED', {
        detail: result.jkt48_points_history
      });
      window.dispatchEvent(event);
      console.log('[JKT48 Extension] Event dispatched');
    } else {
      console.log('[JKT48 Extension] No data found in chrome.storage');
    }
  } catch (error) {
    console.error('[JKT48 Extension] Error syncing data:', error);
    console.error('[JKT48 Extension] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
};

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[JKT48 Extension] Received message:', message);
  console.log('[JKT48 Extension] From sender:', sender);
  
  if (message.type === 'POINTS_HISTORY_UPDATED' && message.data) {
    console.log('[JKT48 Extension] Processing POINTS_HISTORY_UPDATED message');
    
    try {
      // Store in localStorage
      const dataString = JSON.stringify(message.data);
      localStorage.setItem('jkt48_points_history', dataString);
      console.log('[JKT48 Extension] Data saved to localStorage:', dataString);
      
      // Verify the data was saved
      const savedData = localStorage.getItem('jkt48_points_history');
      console.log('[JKT48 Extension] Verified localStorage data:', savedData);
      
      // Dispatch event to notify the webpage
      const event = new CustomEvent('JKT48_POINTS_HISTORY_UPDATED', {
        detail: message.data
      });
      window.dispatchEvent(event);
      console.log('[JKT48 Extension] Event dispatched');
      
      sendResponse({ success: true });
    } catch (error) {
      console.error('[JKT48 Extension] Error saving data:', error);
      console.error('[JKT48 Extension] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      sendResponse({ success: false, error: error.message });
    }
  }
  
  return true;
});

// Listen for chrome.storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('[JKT48 Extension] Storage changes detected:', changes);
  console.log('[JKT48 Extension] Storage namespace:', namespace);
  
  if (namespace === 'local' && changes.jkt48_points_history) {
    console.log('[JKT48 Extension] Points history changed in chrome.storage');
    syncDataToLocalStorage();
  }
});

// Initial sync when the content script loads
console.log('[JKT48 Extension] Performing initial sync');
syncDataToLocalStorage(); 