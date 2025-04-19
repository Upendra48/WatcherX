document.addEventListener('DOMContentLoaded', async () => {
    const { trackedUser } = await chrome.storage.local.get('trackedUser');
  
    if (trackedUser) {
      // If username is already set, show a message or auto-close the popup
      document.getElementById("username").value = trackedUser;
      document.getElementById("startTracking").textContent = "Tracking " + trackedUser;
    }
  });
  
  document.getElementById("startTracking").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
  
    if (!username) return alert("Please enter a Twitter username!");
  
    // Save the username and start tracking
    await chrome.storage.local.set({ trackedUser: username, lastTweetId: null });
  
    chrome.runtime.sendMessage({ action: "startAlarm" });
  
    alert(`Started tracking @${username}`);
  });
  