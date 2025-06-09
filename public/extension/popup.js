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

    statusDiv.textContent = 'Collecting data from all pages...';

    // First, get the total number of pages
    const pageCountResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getTotalPages
    });

    const totalPages = pageCountResult[0].result;
    console.log('[JKT48 Extension] Total pages:', totalPages);

    // Array to store all data
    let allData = [];

    // Scrape each page
    for (let page = 1; page <= totalPages; page++) {
      statusDiv.textContent = `Collecting data from page ${page} of ${totalPages}...`;
      
      // Navigate to the page
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (pageNum) => {
          window.location.href = `/mypage/point-history?page=${pageNum}&lang=id`;
        },
        args: [page]
      });

      // Wait for page load
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Scrape the current page
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrapeCurrentPage
      });

      if (result[0].result.error) {
        statusDiv.textContent = result[0].result.error;
        statusDiv.className = 'error';
        return;
      }

      allData = allData.concat(result[0].result.data);
      console.log(`[JKT48 Extension] Collected ${result[0].result.data.length} records from page ${page}`);
    }

    // Prepare the data
    const pointsData = {
      data: allData,
      timestamp: new Date().toISOString()
    };

    // Store data in chrome.storage.local
    await chrome.storage.local.set({ 'jkt48_points_history': pointsData });
    console.log('[JKT48 Extension] Data saved to chrome.storage.local');

    // Send data to content script to store in localStorage
    try {
      // Send to JKT48 page
      await chrome.tabs.sendMessage(tab.id, {
        type: 'POINTS_HISTORY_UPDATED',
        data: pointsData
      });
      
      // Find and send to your website tab if it's open
      const allTabs = await chrome.tabs.query({});
      for (const otherTab of allTabs) {
        if (otherTab.url && (
          otherTab.url.includes('www.tierlistjkt48.my.id') || 
          otherTab.url.includes('tierlistjkt48.my.id') || 
          otherTab.url.includes('localhost') ||
          otherTab.url.includes('vercel.app')
        )) {
          console.log('[JKT48 Extension] Found website tab:', otherTab.url);
          try {
            await chrome.tabs.sendMessage(otherTab.id, {
              type: 'POINTS_HISTORY_UPDATED',
              data: pointsData
            });
            console.log('[JKT48 Extension] Message sent to tab:', otherTab.id);
          } catch (err) {
            console.error('[JKT48 Extension] Error sending to tab:', err);
          }
        }
      }

      statusDiv.textContent = `Successfully collected data from all ${totalPages} pages! You can now view it in the JKT48 Fan Tools.`;
      statusDiv.className = '';
    } catch (error) {
      console.error('[JKT48 Extension] Error:', error);
      statusDiv.textContent = 'Error saving data. Please try again.';
      statusDiv.className = 'error';
    }
  } catch (error) {
    console.error('[JKT48 Extension] Error:', error);
    statusDiv.textContent = 'Error: ' + error.message;
    statusDiv.className = 'error';
  }
});

// Function to get total number of pages
function getTotalPages() {
  const paginationElement = document.querySelector('.entry-news__list--pagination .page');
  if (!paginationElement) {
    return 1; // Default to 1 if pagination element not found
  }

  const pageText = paginationElement.textContent.trim(); // Should be in format "X / Y"
  const match = pageText.match(/\d+\s*\/\s*(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1]);
  }
  
  return 1; // Default to 1 if we can't parse the page number
}

// Function to scrape current page
function scrapeCurrentPage() {
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