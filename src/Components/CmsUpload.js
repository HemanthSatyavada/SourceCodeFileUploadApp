import React, { useState, useRef } from "react";
import { sessionValidation, uploadCMSZip } from "../Apis/api";
import "../Styles/Tabs.css";
import swal from 'sweetalert';
import JSZip from 'jszip';
import { ALLOWED_EXTENSIONS_FOR_CMS_UPLOAD } from "../Constants/appConstant";

// Define the size limits in bytes
const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10 GB in bytes
const VALIDATION_FILE_SIZE_LIMIT = 1.5 * 1024 * 1024 * 1024; // 1.5 GB in bytes

const CmsUpload = ({ onUpload, onLogout, setLoading }) => {
  const [cmsZip, setCmsZip] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [allFilesValid, setAllFilesValid] = useState(false);
  const [validatingFiles, setValidatingFiles] = useState(false);
  const fileInputRef = useRef(null);

  // Check if the file extension is allowed
  const isFileValid = (fileName) => {
    const fileExt = fileName.split(".").pop().toLowerCase();
    return ALLOWED_EXTENSIONS_FOR_CMS_UPLOAD.includes(fileExt);
  };

  // Validate the ZIP file
  const validateZip = async (zipFile) => {
    const zip = new JSZip();
    try {
      const zipContent = await zip.loadAsync(zipFile);
      const fileEntries = Object.entries(zipContent.files);

      let allFilesValid = true;
      let hasValidFiles = false;

      fileEntries.forEach(([fileName, fileEntry]) => {
        if (!fileEntry.dir) {
          hasValidFiles = true;
          if (fileName.includes(" ") || !isFileValid(fileName)) {
            allFilesValid = false;
          }
        }
      });

      // Check if there are any valid files
      if (!hasValidFiles) {
        allFilesValid = false;
        setUploadStatus("Upload failed because the ZIP file does not contain any valid files.");
      }

      if (allFilesValid) {
        setCmsZip(zipFile);
        setUploadStatus("");
        setAllFilesValid(true);
      } else {
        setCmsZip(null);
        setUploadStatus("Upload failed because one or more files either have a space in the filename or an invalid CMS extension.");
        setAllFilesValid(false);
      }
    } catch (error) {
      console.error("Error loading zip file:", error);
      setUploadStatus("Error loading zip file");
      setAllFilesValid(false);
    } finally {
      setValidatingFiles(false);
    }
  };

  const handleFileChange = async (event) => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setCmsZip(null);
        setUploadStatus("File size exceeds the 10 GB limit.");
        setAllFilesValid(false);
        return;
      }

      if (selectedFile.size <= VALIDATION_FILE_SIZE_LIMIT) {
        // Perform client-side validation for files <= 1.5 GB
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
        const fileNameWithoutExtension = selectedFile.name.split(".").slice(0, -1).join(".");

        if (fileExtension === "zip" && fileNameWithoutExtension !== "") {
          setValidatingFiles(true);
          await validateZip(selectedFile);
        } else {
          setCmsZip(null);
          setUploadStatus("Only zip files are accepted and file name should not be empty.");
          setAllFilesValid(false);
          setValidatingFiles(false);
        }
      } else {
        // Directly set the file for upload if larger than 1.5 GB
        setCmsZip(selectedFile);
        setUploadStatus("");
        setAllFilesValid(true); // Assume the file is valid if we skip client-side validation
      }
    }
  };

  const handleUpload = async () => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }
    if (cmsZip) {
      const willUpload = await swal({
        title: "Are you sure?",
        text: "You want to upload files to CMS!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (willUpload) {
        try {
          setLoading(true);
          const response = await uploadCMSZip(cmsZip);
          setLoading(false);
          console.log("Upload response:", response);

          if (response === 200) {
            setUploadStatus("Upload successful");
            onUpload();
          } else if (response === 401) {
            onLogout();
          } else {
            setUploadStatus("Upload failed because one or more files either have a space in the filename or an invalid CMS extension.");
          }
        } catch (error) {
          setUploadStatus("Upload failed");
          console.error("Upload error:", error);
        }
      }
    } else {
      setUploadStatus("No file selected");
    }
    setCmsZip(null);
    fileInputRef.current.value = "";
    setAllFilesValid(false);
  };

  return (
    <div className="tab-container">
      <div className="upload-form">
        <h3 className="headline">Ingest Assets to CMS</h3>
        <label className="lable-info" htmlFor="cmsZip">
          Select Zip Files (size up to 10 GB):
        </label>
        <label htmlFor="cmsZip">
          <b>All the files inside the zip will be ingested into CMS. There isn't any validation.
            <br />
            Please use this functionality with caution.</b>
        </label>
        <br />
        <input
          type="file"
          id="cmsZip"
          name="cmsZip"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <button
          className={`upload-button ${!allFilesValid ? 'disabled' : ''}`}
          onClick={handleUpload}
          disabled={!allFilesValid}
        >
          Upload To CMS
        </button>

        {validatingFiles && <p className="upload-status">Validating files...</p>}
        {uploadStatus && (
          <p className={`upload-status ${uploadStatus.includes("successful") ? "success" : "failure"}`}>
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default CmsUpload;