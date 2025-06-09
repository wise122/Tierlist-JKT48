document.getElementById('exportBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if we're on the correct page
    if (!tab.url.includes('jkt48.com/mypage/point-history')) {
      statusDiv.textContent = 'Please navigate to the JKT48 Points History page first';
      statusDiv.className = 'error';
      return;
    }

    // Execute content script to scrape data
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapePointsHistory
    });

    if (result[0].result.error) {
      statusDiv.textContent = result[0].result.error;
      statusDiv.className = 'error';
      return;
    }

    // Prepare the data
    const pointsData = {
      data: result[0].result.data,
      timestamp: new Date().toISOString()
    };

    // Send data to content script to store in localStorage
    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'POINTS_HISTORY_UPDATED',
        data: pointsData
      });
      
      // Also send to any other open tabs of your web app
      const allTabs = await chrome.tabs.query({});
      for (const otherTab of allTabs) {
        if (otherTab.id !== tab.id) {
          chrome.tabs.sendMessage(otherTab.id, {
            type: 'POINTS_HISTORY_UPDATED',
            data: pointsData
          }).catch(() => {
            // Ignore errors for tabs that can't receive messages
          });
        }
      }

      statusDiv.textContent = 'Points history saved successfully! You can now view it in the JKT48 Fan Tools.';
      statusDiv.className = '';
    } catch (error) {
      statusDiv.textContent = 'Error saving data. Please try again.';
      statusDiv.className = 'error';
    }
  } catch (error) {
    statusDiv.textContent = 'Error: ' + error.message;
    statusDiv.className = 'error';
  }
});

function scrapePointsHistory() {
  try {
    const table = document.querySelector('.table-pink__scroll .table');
    if (!table) {
      return { error: 'Points history table not found' };
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const data = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      const pointsText = cells[5]?.textContent || '';
      const pointsLines = pointsText.split('\n').map(line => line.trim());
      const bonusPoints = pointsLines[0]?.replace('Bonus:', '').trim() || '0 P';
      const buyPoints = pointsLines[1]?.replace('Buy:', '').trim() || '0 P';

      return {
        operation: cells[0]?.querySelector('a')?.textContent || '',
        id: cells[1]?.textContent || '',
        date: cells[2]?.textContent || '',
        purpose: cells[3]?.textContent || '',
        quantity: cells[4]?.textContent || '',
        bonusPoints: bonusPoints,
        buyPoints: buyPoints,
        status: cells[6]?.textContent || ''
      };
    });

    return { data };
  } catch (error) {
    return { error: error.message };
  }
} 