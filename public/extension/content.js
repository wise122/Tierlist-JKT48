// This file is currently empty but can be used for future features
// such as adding a download button directly to the JKT48 website 

console.log('[JKT48 Extension] Content script loaded');

// Inject a script tag to expose window.jkt48PointsHistory
function injectData(data) {
  const script = document.createElement('script');
  script.textContent = `
    window.jkt48PointsHistory = ${JSON.stringify(data)};
    window.dispatchEvent(new CustomEvent('JKT48_POINTS_HISTORY_UPDATED', {
      detail: window.jkt48PointsHistory
    }));
  `;
  document.head.appendChild(script);
}

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[JKT48 Extension] Received message:', message);
  
  if (message.type === 'POINTS_HISTORY_UPDATED' && message.data) {
    console.log('[JKT48 Extension] Saving data:', message.data);
    
    try {
      // Inject the data into the page
      injectData(message.data);
      
      // Also save to localStorage as backup
      localStorage.setItem('jkt48_points_history', JSON.stringify(message.data));
      
      console.log('[JKT48 Extension] Data saved and injected');
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