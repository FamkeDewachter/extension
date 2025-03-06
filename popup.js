// Add an event listener to the authorize button to handle click events
document
  .getElementById("authorizeButton")
  .addEventListener("click", async () => {
    try {
      // Get the authentication token
      const token = await getAuthToken();
      // List the files from Google Drive using the token
      const files = await listDriveFiles(token);
      // Get the file list element from the DOM
      const fileListElement = document.getElementById("fileList");
      // Populate the file list element with the names of the files
      fileListElement.innerHTML = files
        .map((file) => `<p>${file.name}</p>`)
        .join("");
    } catch (error) {
      // Log any errors to the console and show an alert to the user
      console.error("Error during authorization or fetching files:", error);
      alert("An error occurred while interacting with Google Drive.");
    }
  });

// Function to get the authentication token
async function getAuthToken() {
  return new Promise((resolve, reject) => {
    // Use the Chrome Identity API to get the auth token
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        // Reject the promise if there is an error
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        // Resolve the promise with the token
        resolve(token);
      }
    });
  });
}

async function listDriveFiles(token) {
  try {
    const response = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data.files;
    } else {
      throw new Error(`Failed to fetch files: ${data.error.message}`);
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error; // Rethrow to propagate it to the calling code
  }
}
