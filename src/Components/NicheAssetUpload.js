import React, { useState, useRef } from "react";
import { sessionValidation, uploadNicheVendorFiles } from "../Apis/api";
import "../Styles/AssetValidation.css";
import swal from 'sweetalert';
import { NICHE_FILE_UPLOAD_LIMIT , NICHE_FILE_SIZE_LIMIT } from "../Constants/appConstant";

const NicheAssetUpload = ({ selectedSubOption, onUpload, onLogout, setLoading }) => {
  const [asset, setAsset] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);
  const MAX_FILE_SIZE = NICHE_FILE_SIZE_LIMIT * 1024 * 1024  * 1024;

  const handleFileChange = async (event) => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }

    const files = event.target.files;
    const failedFiles = [];
    if(files.length === 0){
      setUploadStatus("");
      return;
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        failedFiles.push(`${file.name} - exceeds ${NICHE_FILE_SIZE_LIMIT} GB limit`);
      }
    }

    if (failedFiles.length > 0) {
      setUploadStatus(`Upload failed for: ${failedFiles.join(", ")}`);
      setAsset(null);
      return;
    }

    if (files.length > NICHE_FILE_UPLOAD_LIMIT) {
      setUploadStatus(`You can upload maximum ${NICHE_FILE_UPLOAD_LIMIT} files at a time`);
      setAsset(null);
      return;
    }

    setAsset(files);
    setUploadStatus("");
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
            setAsset(null);
            fileInputRef.current.value = "";
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
  };

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="upload-section">
          <p className="upload-section-description">
            Upload Final Files received from Niche Routes. Please only use this Niche Upload tool for niche/non-core vendors, author typeset, co-publisher and in-house typeset. Accepted file types include but are not limited to: ISBN_text.pdf, ISBN_cover.pdf, ISBN.jpg, ISBN_application_files.zip, ISBN_covers.zip. Cover PDF and Text PDF files will trigger QA in Activiti.
          </p>

          <div
            className="drop-zone"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange({ target: { files: e.dataTransfer.files } });
            }}
          >
            <p className="drop-zone-text">Click or drag files here</p>
            <input
              type="file"
              id="asset"
              name="asset"
              onChange={handleFileChange}
              ref={fileInputRef}
              multiple
              hidden
            />
          </div>

          <button className="btn-upload" onClick={handleUpload}>
            Upload Niche Files
          </button>

          {uploadStatus && (
            <p className={`upload-status ${uploadStatus.includes("successful") ? "success" : "failure"}`}>
              {uploadStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NicheAssetUpload;
