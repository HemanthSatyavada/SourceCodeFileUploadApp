import React, { useState, useRef } from "react";
import { sessionValidation, uploadNicheVendorFiles } from "../Apis/api";
import "../Styles/Tabs.css";
import swal from 'sweetalert';
import { NICHE_FILE_UPLOAD_LIMIT , NICHE_FILE_SIZE_LIMIT } from "../Constants/appConstant";

// Define the size limits in bytes

const NicheAssetUpload = ({ onUpload, onLogout, setLoading }) => {
  const [asset, setAsset] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [allFilesValid, setAllFilesValid] = useState(false);
  const fileInputRef = useRef(null);
  const MAX_FILE_SIZE = NICHE_FILE_SIZE_LIMIT * 1024 * 1024  * 1024 ; // 5 GB in bytes

  // Check if the file extension is allowed
  // Validate the ZIP file

  const handleFileChange = async (event) => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }

    const files = event.target.files;
    const failedFiles = [];
    if(files.length === 0){
      setAllFilesValid(false);
      setUploadStatus("");
    }
   
    if(files.length > NICHE_FILE_UPLOAD_LIMIT){
      setAllFilesValid(false);
      setUploadStatus("File Upload limit exceeded:"+NICHE_FILE_UPLOAD_LIMIT);
      fileInputRef.current.value = "";
      setAsset(null);
      return;
    }

    for (const file of files) {
      console.log(file.size);
      if(file.size > MAX_FILE_SIZE){
        failedFiles.push(file.name +": File exceeds upload limit of "+ NICHE_FILE_SIZE_LIMIT +" GB" );
      }
    }
    if(failedFiles.length > 0){
      setUploadStatus(failedFiles.concat(" ") + " Not accepted.");
      setAsset(null);
      fileInputRef.current.value = "";
      setAllFilesValid(false);
    } else {
      setAllFilesValid(true);
      setUploadStatus("");
      setAsset(files);
    }
  
  };

  const handleUpload = async () => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }
    if (asset) {
      const willUpload = await swal({
        title: "Are you sure?",
        text: "You want to upload files as Niche Vendor!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (willUpload) {
        try {
          setLoading(true);
          const response = await uploadNicheVendorFiles(asset);
          setLoading(false);
          console.log("Upload response:", response);

          if (response === "Upload successful") {
            setUploadStatus(response);
            onUpload();
          } else {
            setUploadStatus(response);
          }
        } catch (error) {
          setUploadStatus("Upload failed");
          console.error("Upload error:", error);
        }
      }
    } else {
      setUploadStatus("No file selected");
    }
    setAsset(null);
    fileInputRef.current.value = "";
    setAllFilesValid(false);
  };

  return (
    <div className="tab-container">
      <div className="upload-form">
        <h3 className="headline">Niche Uploads</h3>
        <label className="lable-info" htmlFor="asset">
          Upload Final Files recieved from Niche Routes
        </label>
            
        <br />
        <label htmlFor="asset">
          <b>Please only use this Niche Upload tool for niche/non-core vendors, author typeset, co-publisher and in-house typeset, which do not currently load via our core vendor delivery route. All other uploads should come through the existing workflow.
            <br />
           </b>
        </label>
        <br />
        <label htmlFor="asset">
            Accepted file types include but are not limited to, ISBN_text.pdf, ISBN_cover.pdf, ISBN.jpg, ISBN_print.zip, ISBN_application_files.zip, ISBN_covers.zip. Please use the CMS naming document for more information on accepted filenames.
              <br />
            Cover PDF and Text PDF files will trigger QA in Activiti.    
        </label>
        <br />
        <input
          type="file"
          id="asset"
          name="asset"
          onChange={handleFileChange}
          ref={fileInputRef}
          multiple
        />
        <button
          className={`upload-button ${!allFilesValid ? 'disabled' : ''}`}
          onClick={handleUpload}
          disabled={!allFilesValid}
        >
          Upload
        </button>

        
        {uploadStatus && (
          <div align="center"
            className={`upload-status ${uploadStatus.includes("successful") ? "success" : "failure"}`}
            dangerouslySetInnerHTML={{ __html: uploadStatus }} // Render HTML inside div
          />
        )}

      </div>
    </div>
  );
};

export default NicheAssetUpload;