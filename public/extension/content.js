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
      const dataToStore = JSON.stringify(message.data);
      localStorage.setItem('jkt48_points_history', dataToStore);
      
      // Also store in chrome.storage for persistence
      chrome.storage.local.set({ 'jkt48_points_history': message.data }, () => {
        console.log('[JKT48 Extension] Data saved to chrome.storage');
      });
      
      // Dispatch an event to notify the webpage
      const event = new CustomEvent('JKT48_POINTS_HISTORY_UPDATED', {
        detail: message.data
      });
      window.dispatchEvent(event);
      
      // Broadcast to other tabs via storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'jkt48_points_history',
        newValue: dataToStore,
        url: window.location.href
      });
      window.dispatchEvent(storageEvent);
      
      console.log('[JKT48 Extension] Data saved and events dispatched');
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
  console.log('[JKT48 Extension] Loading initial data from chrome.storage:', result);
  if (result.jkt48_points_history) {
    try {
      localStorage.setItem('jkt48_points_history', JSON.stringify(result.jkt48_points_history));
      window.dispatchEvent(new CustomEvent('JKT48_POINTS_HISTORY_UPDATED', {
        detail: result.jkt48_points_history
      }));
      console.log('[JKT48 Extension] Initial data loaded successfully');
    } catch (error) {
      console.error('[JKT48 Extension] Error loading initial data:', error);
    }
  }
}); 