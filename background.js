chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startAlarm") {
      chrome.storage.local.get('trackedUser', ({ trackedUser }) => {
        if (trackedUser) {
          // Create an alarm to check every 5 minutes
          chrome.alarms.create("checkTweet", { periodInMinutes: 5 });
        }
      });
    }
  });
  
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "checkTweet") {
      const { trackedUser, lastTweetId } = await chrome.storage.local.get(["trackedUser", "lastTweetId"]);
  
      if (!trackedUser) return;
  
      fetch(`https://twitter.com/${trackedUser}`)
        .then(res => res.text())
        .then(html => {
          const tweetMatch = html.match(/data-testid="tweet".*?href="\/[^\/]+\/status\/(\d+)"/);
          if (tweetMatch && tweetMatch[1]) {
            const latestTweetId = tweetMatch[1];
  
            if (latestTweetId !== lastTweetId) {
              chrome.storage.local.set({ lastTweetId: latestTweetId });
  
              chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon.png",
                title: `New tweet from @${trackedUser}`,

                
                message: `Click to view.`,
                priority: 2
              });
  
              chrome.notifications.onClicked.addListener(() => {
                chrome.tabs.create({ url: `https://twitter.com/${trackedUser}/status/${latestTweetId}` });
              });
            }
          }
        });
    }
  });
  