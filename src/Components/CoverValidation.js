import React, { useState, useRef } from "react";
import { sessionValidation, uploadCoverActivitiAssetsFiles, uploadCoverCmsAssetsFiles } from "../Apis/api";
import "../Styles/AssetValidation.css";
import { COVER_FILE_PATTERNS, ARTWORK_FILE_PATTERNS } from "../Constants/appConstant";

// Shared file validation function
const validateFiles = (files, patterns) => {
  const failedFiles = [];
  for (const file of files) {
    const fileName = file.name;
    const isValid = patterns.some(pattern => pattern.test(fileName));
    if (!isValid) failedFiles.push(fileName);
  }
  return failedFiles;
};

const useFileUpload = (uploadFunction, setStatus, fileRef, setLoading, onLogout) => {
  return async (files) => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }
    if (!files || files.length === 0) {
      setStatus("Please select a file");
      return;
    }

    const failedFiles = [];
    const successfulFiles = [];
    setLoading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await uploadFunction(file);
        if (response.status === 200) {
          successfulFiles.push(file.name);
        } else {
          failedFiles.push(`${file.name}: ${response.message}`);
        }
      } catch (error) {
        failedFiles.push(`${file.name}: Upload failed.`);
      }
    }

    setLoading(false);
    
    let statusMessage = "";
    if (successfulFiles.length > 0) {
      statusMessage += `<div class="status-success">Successfully uploaded:<br/>${successfulFiles.join("<br/>")}</div>`;
    }
    if (failedFiles.length > 0) {
      statusMessage += (statusMessage ? "<br/><br/>" : "") + `<div class="status-failure">Upload failed:<br/>${failedFiles.join("<br/>")}</div>`;
    }
    if (!successfulFiles.length && !failedFiles.length) {
      statusMessage = "No files were uploaded.";
    }

    setStatus(statusMessage);
    if (fileRef.current) fileRef.current.value = "";
  };
};

const CoverValidation = ({ onLogout, setLoading }) => {
  const [coverFile, setCoverFile] = useState(null);
  const [artworkFile, setArtworkFile] = useState(null);
  const [coverUploadStatus, setCoverUploadStatus] = useState("");
  const [coverArtworkFileUploadStatus, setCoverArtworkFileUploadStatus] = useState("");
  const coverFileRef = useRef(null);
  const coverArtworkFileRef = useRef(null);

  const handleFileChange = (event, setFile, patterns, setStatus, fileRef) => {
    if (!sessionValidation()) {
      onLogout();
    }

    const selectedFiles = event.target.files;
    if (selectedFiles.length > 5) {
      setFile(null);
      setStatus("Can't select more than 5 files at a time.");
      fileRef.current.value = "";
      return;
    }

    const failedFiles = validateFiles(selectedFiles, patterns);
    if (failedFiles.length > 0) {
      setFile(null);
      setStatus("Space is not allowed in File Name and Only the specified file types are accepted.");
      fileRef.current.value = "";
    } else {
      setFile(selectedFiles);
      setStatus("");
    }
  };

  const handleCoverFileUpload = useFileUpload(uploadCoverActivitiAssetsFiles, setCoverUploadStatus, coverFileRef, setLoading, onLogout);
  const handleArtworkFileUpload = useFileUpload(uploadCoverCmsAssetsFiles, setCoverArtworkFileUploadStatus, coverArtworkFileRef, setLoading, onLogout);

  return (
    <div className="tab-container">
      <div className="upload-form">
        <h3 className="headline">Upload Final Cover PDFs</h3>
        <label className="label-info" htmlFor="coverFile">
          Cover PDF will trigger Cover PDF workflow in Activiti
          <br />
          <p style={{ fontSize: 'smaller' }}>
            Accepted PDF file types are ISBN_cover, ISBN_jacket, ISBN_spine, ISBN_endpaper,
            ISBN_coversheet, ISBN_emboss, ISBN_coverf, ISBN_spine_foil,<br />
            ISBN_cover_foil, ISBN_cover_crusher, ISBN_back_endpaper, ISBN_front_endpaper,ISBN_inside_cover,
            ISBN_spine_crusher,<br/>
            ISBN_inside_back_cover, ISBN_inside_front_cover, ISBN_jacket_spotuv, ISBN_spotuv.
          </p>
        </label>
        <br />
        <input
          type="file"
          id="coverFile"
          name="coverFile"
          onChange={(e) => handleFileChange(e, setCoverFile, COVER_FILE_PATTERNS, setCoverUploadStatus, coverFileRef)}
          ref={coverFileRef}
          multiple
        />
        <button onClick={() => handleCoverFileUpload(coverFile)}>Upload</button>
        <p className={`upload-status ${coverUploadStatus.includes("successfully") ? "success" : "failure"}`}
           dangerouslySetInnerHTML={{ __html: coverUploadStatus }}>
        </p>
      </div>

      <div className="upload-form">
        <h3 className="headline">Upload Cover Artwork files</h3>
        <label className="label-info" htmlFor="coverArtworkFile">
          Artwork and indd files will be directly ingested to the CMS{" "}
          <br />
          <p style={{ fontSize: 'smaller' }}>
          Accepted file types are ISBN_cover_artwork.zip, ISBN_cover.indd, ISBN_coverf.indd and ISBN.jpg
          </p>
        </label>
        <br />
        <input
          type="file"
          id="coverArtworkFile"
          name="coverArtworkFile"
          onChange={(e) => handleFileChange(e, setArtworkFile, ARTWORK_FILE_PATTERNS, setCoverArtworkFileUploadStatus, coverArtworkFileRef)}
          ref={coverArtworkFileRef}
          multiple
        />
        <button onClick={() => handleArtworkFileUpload(artworkFile)}>Upload</button>
        <p className={`upload-status ${coverArtworkFileUploadStatus.includes("successfully") ? "success" : "failure"}`}
           dangerouslySetInnerHTML={{ __html: coverArtworkFileUploadStatus }}>
        </p>
      </div>
    </div>
  );
};
export default CoverValidation;