// Background script - handles keyboard command
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'add-to-reading-list') {
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.url && !tab.url.startsWith('chrome://')) {
        // Add to reading list
        await chrome.readingList.addEntry({
          title: tab.title || tab.url,
          url: tab.url,
          hasBeenRead: false
        });
        
        // Send message to content script to show feedback
        chrome.tabs.sendMessage(tab.id, {
          action: 'showFeedback',
          title: tab.title || 'Page'
        });
      }
    } catch (error) {
      console.error('Error adding to reading list:', error);
      
      // Try to show error feedback if possible
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, {
          action: 'showFeedback',
          title: 'Error',
          isError: true
        });
      } catch (msgError) {
        console.error('Could not send error message:', msgError);
      }
    }
  }
});