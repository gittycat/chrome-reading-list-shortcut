// Background script - handles keyboard command and notifications
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
        
        // Show success notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Added to Reading List',
          message: `"${tab.title || 'Page'}" has been added to your reading list.`,
          priority: 0
        });
      }
    } catch (error) {
      console.error('Error adding to reading list:', error);
      
      // Show info notification for duplicate URL, error for others
      const isDuplicate = error && error.message && error.message.includes('Duplicate');
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: isDuplicate ? 'Info' : 'Error',
        message: isDuplicate ? 'Page already in Reading List.' : 'Failed to add to reading list.',
        priority: 0
      });
    }
  }
});
