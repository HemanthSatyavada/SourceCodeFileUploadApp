import React, { useState, useRef } from "react";
import { sessionValidation, uploadCoverActivitiAssetsFiles, uploadCoverCmsAssetsFiles } from "../Apis/api";
import "../Styles/AssetValidation.css";
import swal from 'sweetalert';
import { COVER_FILE_PATTERNS, ARTWORK_FILE_PATTERNS } from "../Constants/appConstant";

const validateFiles = (files, patterns) => {
  const failedFiles = [];
  for (const file of files) {
    const fileName = file.name;
    const isValid = patterns.some(pattern => pattern.test(fileName));
    if (!isValid) failedFiles.push(fileName);
  }
  return failedFiles;
};

const CoverValidation = ({ selectedSubOption, onLogout, setLoading }) => {
  const [coverFile, setCoverFile] = useState(null);
  const [artworkFile, setArtworkFile] = useState(null);
  const [coverUploadStatus, setCoverUploadStatus] = useState("");
  const [artworkUploadStatus, setArtworkUploadStatus] = useState("");
  const coverFileRef = useRef(null);
  const artworkFileRef = useRef(null);

  const handleCoverFileChange = (event) => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }

    const files = event.target.files;
    if (files.length === 0) {
      setCoverUploadStatus("");
      return;
    }

    const failedFiles = validateFiles(files, COVER_FILE_PATTERNS);
    if (failedFiles.length > 0) {
      setCoverUploadStatus(`Invalid files: ${failedFiles.join(", ")}`);
      setCoverFile(null);
      coverFileRef.current.value = "";
    } else {
      setCoverFile(files);
      setCoverUploadStatus("");
    }
  };

  const handleArtworkFileChange = (event) => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }

    const files = event.target.files;
    if (files.length === 0) {
      setArtworkUploadStatus("");
      return;
    }

    const failedFiles = validateFiles(files, ARTWORK_FILE_PATTERNS);
    if (failedFiles.length > 0) {
      setArtworkUploadStatus(`Invalid files: ${failedFiles.join(", ")}`);
      setArtworkFile(null);
      artworkFileRef.current.value = "";
    } else {
      setArtworkFile(files);
      setArtworkUploadStatus("");
    }
  };

  const handleCoverFileUpload = async () => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }

    if (!coverFile) {
      setCoverUploadStatus("No file selected");
      return;
    }

    const willUpload = await swal({
      title: "Are you sure?",
      text: "You want to upload Cover PDFs!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (willUpload) {
      const successfulFiles = [];
      const failedFiles = [];
      setLoading(true);

      for (const file of coverFile) {
        try {
          const response = await uploadCoverActivitiAssetsFiles(file);
          if (response === 200 || response.status === 200) {
            successfulFiles.push(file.name);
          } else {
            failedFiles.push(file.name);
          }
        } catch (error) {
          failedFiles.push(file.name);
        }
      }

      setLoading(false);

      let statusMessage = "";
      if (successfulFiles.length > 0) {
        statusMessage += `Successfully uploaded: ${successfulFiles.join(", ")}`;
      }
      if (failedFiles.length > 0) {
        statusMessage += (statusMessage ? " | " : "") + `Upload failed for: ${failedFiles.join(", ")}`;
      }

      setCoverUploadStatus(statusMessage || "Upload completed");
      setCoverFile(null);
      if (coverFileRef.current) coverFileRef.current.value = "";
    }
  };

  const handleArtworkFileUpload = async () => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }

    if (!artworkFile) {
      setArtworkUploadStatus("No file selected");
      return;
    }

    const willUpload = await swal({
      title: "Are you sure?",
      text: "You want to upload Artwork files!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (willUpload) {
      const successfulFiles = [];
      const failedFiles = [];
      setLoading(true);

      for (const file of artworkFile) {
        try {
          const response = await uploadCoverCmsAssetsFiles(file);
          if (response === 200 || response.status === 200) {
            successfulFiles.push(file.name);
          } else {
            failedFiles.push(file.name);
          }
        } catch (error) {
          failedFiles.push(file.name);
        }
      }

      setLoading(false);

      let statusMessage = "";
      if (successfulFiles.length > 0) {
        statusMessage += `Successfully uploaded: ${successfulFiles.join(", ")}`;
      }
      if (failedFiles.length > 0) {
        statusMessage += (statusMessage ? " | " : "") + `Upload failed for: ${failedFiles.join(", ")}`;
      }

      setArtworkUploadStatus(statusMessage || "Upload completed");
      setArtworkFile(null);
      if (artworkFileRef.current) artworkFileRef.current.value = "";
    }
  };

  return (
    <div className="page-container">
      <div className="content-card">
        {(!selectedSubOption || selectedSubOption === "coverPdf") && (
        <div className="upload-section">
          <p className="upload-section-description">
            Upload Final Cover PDFs. Cover PDF will trigger Cover PDF workflow in Activiti. Accepted PDF file types are ISBN_cover, ISBN_jacket, ISBN_spine, ISBN_endpaper, ISBN_coversheet, ISBN_emboss, ISBN_coverf, ISBN_spine_foil, ISBN_cover_foil, ISBN_cover_crusher, ISBN_back_endpaper, ISBN_front_endpaper, ISBN_inside_cover, ISBN_spine_crusher, ISBN_inside_back_cover, ISBN_inside_front_cover, ISBN_jacket_spotuv, ISBN_spotuv.
          </p>

          <div
            className="drop-zone"
            onClick={() => coverFileRef.current && coverFileRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleCoverFileChange({ target: { files: e.dataTransfer.files } });
            }}
          >
            <p className="drop-zone-text">Click or drag files here</p>
            <input
              type="file"
              id="coverFile"
              name="coverFile"
              onChange={handleCoverFileChange}
              ref={coverFileRef}
              multiple
              hidden
            />
          </div>

          <button className="btn-upload" onClick={handleCoverFileUpload}>Upload Cover PDFs</button>
          {coverUploadStatus && (
            <p className={`upload-status ${coverUploadStatus.includes("successful") ? "success" : "failure"}`}>
              {coverUploadStatus}
            </p>
          )}
        </div>
        )}

        {(!selectedSubOption || selectedSubOption === "coverArtwork") && (
        <div className="upload-section" style={{ marginTop: 24 }}>
          <p className="upload-section-description">
            Upload Cover Artwork files. Artwork and indd files will be directly ingested to the CMS. Accepted file types are ISBN_cover_artwork.zip, ISBN_cover.indd, ISBN_coverf.indd and ISBN.jpg
          </p>

          <div
            className="drop-zone"
            onClick={() => artworkFileRef.current && artworkFileRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleArtworkFileChange({ target: { files: e.dataTransfer.files } });
            }}
          >
            <p className="drop-zone-text">Click or drag files here</p>
            <input
              type="file"
              id="artworkFile"
              name="artworkFile"
              onChange={handleArtworkFileChange}
              ref={artworkFileRef}
              multiple
              hidden
            />
          </div>

          <button className="btn-upload" onClick={handleArtworkFileUpload}>Upload Artwork Files</button>
          {artworkUploadStatus && (
            <p className={`upload-status ${artworkUploadStatus.includes("successful") ? "success" : "failure"}`}>
              {artworkUploadStatus}
            </p>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default CoverValidation;
