// This event listener is triggered when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
  console.log("Google Drive Extension Installed");
});

// This event listener is triggered when the extension's action button is clicked.
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Get the authentication token.
    const token = await getAuthToken();
    // List the files in Google Drive using the obtained token.
    const files = await listDriveFiles(token);
    console.log(files);
  } catch (error) {
    console.error(error);
  }
});

// Function to get the authentication token.
async function getAuthToken() {
  return new Promise((resolve, reject) => {
    // Request an OAuth token from the Chrome Identity API.
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        // Reject the promise if there is an error.
        reject(chrome.runtime.lastError);
      } else {
        // Resolve the promise with the obtained token.
        resolve(token);
      }
    });
  });
}

// Function to list the files in Google Drive.
async function listDriveFiles(token) {
  // Make a GET request to the Google Drive API to list files.
  const response = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // Parse the response as JSON.
  const data = await response.json();
  // Return the list of files.
  return data.files;
}
