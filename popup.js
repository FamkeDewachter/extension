document
  .getElementById("authorizeButton")
  .addEventListener("click", async () => {
    try {
      const token = await getAuthToken();
      const files = await listDriveFiles(token);
      const fileListElement = document.getElementById("fileList");
      fileListElement.innerHTML = files
        .map((file) => `<p>${file.name}</p>`)
        .join("");
    } catch (error) {
      console.error("Error during authorization or fetching files:", error);
      alert("An error occurred while interacting with Google Drive.");
    }
  });

async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
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
