chrome.runtime.onInstalled.addListener(() => {
  console.log("Google Drive Extension Installed");
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    const token = await getAuthToken();
    const files = await listDriveFiles(token);
    console.log(files);
  } catch (error) {
    console.error(error);
  }
});

async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
}

async function listDriveFiles(token) {
  const response = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.files;
}
