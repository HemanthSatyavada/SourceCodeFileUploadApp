import { USER_DETAILS } from "../Utils/Constants";
import { API_BASE_URL } from "../Constants/apiConstant";
import jwtDecode from "jwt-decode";

export async function login(username, password) {
  console.log(username);
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    console.log(response.status);

    if (response.status === 200) {
      const responseBody = await response.text();
      localStorage.setItem(USER_DETAILS, responseBody);
      return true;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Network Error");
  }

  return false;
}

export async function logout() {
  console.log("Logout");
  localStorage.removeItem(USER_DETAILS);
  return true;
}

export const uploadCMSZip = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/api/uploadCmsZip`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    console.log(response.status);
    const responseBody = await response.text();
    console.log(responseBody);
    return response.status;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Upload failed");
  }
};

export const uploadEpubZip = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = getAuthToken();
  const queryParams = new URLSearchParams({
    email: getEmail(),
  });
  const url = `${API_BASE_URL}/api/uploadEpubZip?${queryParams.toString()}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log(response.status);
    const responseBody = await response.text();
    console.log(responseBody);
    return response.status;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Upload failed");
  }
};

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = getAuthToken();

  const queryParams = new URLSearchParams({
    email: getEmail(),
  });
  const url = `${API_BASE_URL}/api/uploadPdf?${queryParams.toString()}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    console.log(response.status);
    const responseBody = await response.text();
    console.log(responseBody);
    return response.status;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Upload failed");
  }
};

export const uploadCoverActivitiAssetsFiles = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = getAuthToken();
  try {
    const queryParams = new URLSearchParams({
    email: getEmail(),
  });
    const response = await fetch(`${API_BASE_URL}/api/processCoverActivitiAssetsFile?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    console.log(response.status);
    const responseBody = await response.text();
    console.log(responseBody);
    var jsonObject = JSON.parse(responseBody);
    return {
      status: response.status,
      message: jsonObject.message
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Upload failed");
  }
};
// Cover CMS Assets files
export const uploadCoverCmsAssetsFiles = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const token = getAuthToken();
  try {
    const queryParams = new URLSearchParams({
    email: getEmail(),
  });
    const response = await fetch(`${API_BASE_URL}/api/processCoverCmsAssetsFiles?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    console.log(response.status);
    const responseBody = await response.text();
    console.log(responseBody);
    var jsonObject = JSON.parse(responseBody);
    return {
      status: response.status,
      message: jsonObject.message
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Upload failed");
  }
};

function getAuthToken() {
  let token = localStorage.getItem(USER_DETAILS);
  return token;
}

function getDecodedAuthToken() {
  return jwtDecode(localStorage.getItem(USER_DETAILS));
}

function getEmail() {
  let data = getDecodedAuthToken();
  return data.email;
}

export function getExpiryTime() {
  let data = getDecodedAuthToken();
  return data.expiry;
}

export function getUserRole() {
  let data = getDecodedAuthToken();
  return data.role;
}

export function sessionValidation() {
  try {
    let time = getExpiryTime();
    let isExpire = Math.round(new Date().getTime()) < time;
    return isExpire;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

export const uploadNicheVendorFiles = async (file) => {
  const passedFiles = [];
  const failedFiles = []; 
  for(var i=0; i < file.length ; i++){
    const formData = new FormData();
    formData.append("file", file[i]);
    formData.append("conversionPartner", "Niche");
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_BASE_URL}/api/uploadToCpViaNicheFlow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log(response.status);
      const responseBody = await response.text();
      console.log(responseBody);
      if(response.status === 200){
        passedFiles.push(file[i].name);
      } else {
        const responseBodyJson = JSON.parse(responseBody);
        if(JSON.stringify(responseBodyJson.message).includes(file[i].name)){
          failedFiles.push (responseBodyJson.message);
        }else{
          failedFiles.push (file[i].name +" : "+ responseBodyJson.message);
        }
        
      }
      
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Upload failed");
    }
  }
   // send file upload success
    if (passedFiles.length > 0) {
      try {
        const token = getAuthToken();
        const passedFilesParam = passedFiles.join(",");
        const apiUrl = `${API_BASE_URL}/api/nicheUploadSuccessMail?passedFiles=${encodeURIComponent(passedFilesParam)}`;

        await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      } catch (err) {
        console.error("Error calling email API:", err);
      }
    }


  if(passedFiles.length === file.length){
    return "Upload successful";
  }else {
    let html = `
        <h5 style="color:red;">Failed to upload the following files:</h5>
        <table border="1" style="border-collapse: collapse; width: 50%;">
            <tr>
                <th style="background-color: #f44336; color: white; padding: 8px;">Failed Files:</th>
            </tr>`;

    failedFiles.forEach(file => {
        html += `<tr border="1"><td style="padding: 8px;">${file}</td></tr>`;
    });

    html += `</table>`;
    return html;
   
  }
  
  
};