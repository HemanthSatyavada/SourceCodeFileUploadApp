import React, { useState, useRef } from "react";
import { sessionValidation, uploadCMSZip } from "../Apis/api";
import "../Styles/AssetValidation.css";
import swal from 'sweetalert';
import JSZip from 'jszip';
import { ALLOWED_EXTENSIONS_FOR_CMS_UPLOAD } from "../Constants/appConstant";

const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024;
const VALIDATION_FILE_SIZE_LIMIT = 1.5 * 1024 * 1024 * 1024;

const CmsUpload = ({ selectedSubOption, onUpload, onLogout, setLoading }) => {
  const [pdfZip, setPdfZip] = useState(null);
  const [artworkZip, setArtworkZip] = useState(null);
  const [pdfUploadStatus, setPdfUploadStatus] = useState("");
  const [artworkUploadStatus, setArtworkUploadStatus] = useState("");
  const [validatingPdf, setValidatingPdf] = useState(false);
  const [validatingArtwork, setValidatingArtwork] = useState(false);
  const pdfRef = useRef(null);
  const artworkRef = useRef(null);

  const isFileValid = (fileName) => {
    const fileExt = fileName.split(".").pop().toLowerCase();
    return ALLOWED_EXTENSIONS_FOR_CMS_UPLOAD.includes(fileExt);
  };

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

      if (!hasValidFiles) {
        allFilesValid = false;
        return { valid: false, message: "ZIP file does not contain any valid files." };
      }

      if (allFilesValid) {
        return { valid: true, message: "" };
      } else {
        return { valid: false, message: "One or more files have a space in the filename or an invalid CMS extension." };
      }
    } catch (error) {
      console.error("Error loading zip file:", error);
      return { valid: false, message: "Error loading zip file" };
    }
  };

  const handlePdfFileChange = async (event) => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setPdfZip(null);
        setPdfUploadStatus("File size exceeds the 10 GB limit.");
        return;
      }

      if (selectedFile.size <= VALIDATION_FILE_SIZE_LIMIT) {
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
        const fileNameWithoutExtension = selectedFile.name.split(".").slice(0, -1).join(".");

        if (fileExtension === "zip" && fileNameWithoutExtension !== "") {
          setValidatingPdf(true);
          const result = await validateZip(selectedFile);
          if (result.valid) {
            setPdfZip(selectedFile);
            setPdfUploadStatus("");
          } else {
            setPdfZip(null);
            setPdfUploadStatus("Upload failed because " + result.message);
          }
          setValidatingPdf(false);
        } else {
          setPdfZip(null);
          setPdfUploadStatus("Only zip files are accepted and file name should not be empty.");
        }
      } else {
        setPdfZip(selectedFile);
        setPdfUploadStatus("");
      }
    }
  };

  const handleArtworkFileChange = async (event) => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setArtworkZip(null);
        setArtworkUploadStatus("File size exceeds the 10 GB limit.");
        return;
      }

      if (selectedFile.size <= VALIDATION_FILE_SIZE_LIMIT) {
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
        const fileNameWithoutExtension = selectedFile.name.split(".").slice(0, -1).join(".");

        if (fileExtension === "zip" && fileNameWithoutExtension !== "") {
          setValidatingArtwork(true);
          const result = await validateZip(selectedFile);
          if (result.valid) {
            setArtworkZip(selectedFile);
            setArtworkUploadStatus("");
          } else {
            setArtworkZip(null);
            setArtworkUploadStatus("Upload failed because " + result.message);
          }
          setValidatingArtwork(false);
        } else {
          setArtworkZip(null);
          setArtworkUploadStatus("Only zip files are accepted and file name should not be empty.");
        }
      } else {
        setArtworkZip(selectedFile);
        setArtworkUploadStatus("");
      }
    }
  };

  const handlePdfUpload = async () => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }
    if (pdfZip) {
      const willUpload = await swal({
        title: "Are you sure?",
        text: "You want to upload CMS Cover PDFs!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (willUpload) {
        try {
          setLoading(true);
          const response = await uploadCMSZip(pdfZip);
          setLoading(false);
          console.log("Upload response:", response);

          if (response === 200) {
            setPdfUploadStatus("Upload successful");
            setPdfZip(null);
            pdfRef.current.value = "";
            onUpload();
          } else if (response === 401) {
            onLogout();
          } else {
            setPdfUploadStatus("Upload failed because one or more files either have a space in the filename or an invalid CMS extension.");
          }
        } catch (error) {
          setPdfUploadStatus("Upload failed");
          console.error("Upload error:", error);
        }
      }
    } else {
      setPdfUploadStatus("No file selected");
    }
  };

  const handleArtworkUpload = async () => {
    if (!sessionValidation()) {
      onLogout();
      return;
    }
    if (artworkZip) {
      const willUpload = await swal({
        title: "Are you sure?",
        text: "You want to upload CMS Cover Artwork!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (willUpload) {
        try {
          setLoading(true);
          const response = await uploadCMSZip(artworkZip);
          setLoading(false);
          console.log("Upload response:", response);

          if (response === 200) {
            setArtworkUploadStatus("Upload successful");
            setArtworkZip(null);
            artworkRef.current.value = "";
            onUpload();
          } else if (response === 401) {
            onLogout();
          } else {
            setArtworkUploadStatus("Upload failed because one or more files either have a space in the filename or an invalid CMS extension.");
          }
        } catch (error) {
          setArtworkUploadStatus("Upload failed");
          console.error("Upload error:", error);
        }
      }
    } else {
      setArtworkUploadStatus("No file selected");
    }
  };

  return (
    <div className="page-container">
      <div className="content-card">
        {(!selectedSubOption || selectedSubOption === "cmsPdf") && (
        <div className="upload-section">
          <p className="upload-section-description">
            Upload Final Cover PDFs. Cover PDF will trigger Cover PDF workflow in Activiti. Accepted PDF types include but are not limited to: ISBN_cover.pdf, ISBN_cover.tif, ISBN_spine.pdf, ISBN_endpaper.pdf, ISBN_jacket.pdf, ISBN_jacket_spotuv.pdf, ISBN_cover_inside.pdf and ISBN_case_side.pdf.
          </p>

          <div
            className="drop-zone"
            onClick={() => pdfRef.current && pdfRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handlePdfFileChange({ target: { files: e.dataTransfer.files } });
            }}
          >
            <p className="drop-zone-text">Click or drag zip file here</p>
            <input
              type="file"
              id="pdfZip"
              name="pdfZip"
              onChange={handlePdfFileChange}
              ref={pdfRef}
              accept=".zip"
              hidden
            />
          </div>

          <button className="btn-upload" onClick={handlePdfUpload}>
            Upload Cover PDFs
          </button>

          {validatingPdf && <p className="upload-status">Validating files...</p>}
          {pdfUploadStatus && (
            <p className={`upload-status ${pdfUploadStatus.includes("successful") ? "success" : "failure"}`}>
              {pdfUploadStatus}
            </p>
          )}
        </div>
        )}

        {(!selectedSubOption || selectedSubOption === "cmsCover") && (
        <div className="upload-section" style={{ marginTop: 24 }}>
          <p className="upload-section-description">
            Upload Cover Artwork files. Artwork will directly ingested to the CMS. Accepted file types include but are not limited to: ISBN_cover_artwork.zip, ISBN_cover.indd, ISBN_cover.tiff, ISBN_cover.jpg and ISBN_case.indd.
          </p>

          <div
            className="drop-zone"
            onClick={() => artworkRef.current && artworkRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleArtworkFileChange({ target: { files: e.dataTransfer.files } });
            }}
          >
            <p className="drop-zone-text">Click or drag zip file here</p>
            <input
              type="file"
              id="artworkZip"
              name="artworkZip"
              onChange={handleArtworkFileChange}
              ref={artworkRef}
              accept=".zip"
              hidden
            />
          </div>

          <button className="btn-upload" onClick={handleArtworkUpload}>
            Upload Artwork
          </button>

          {validatingArtwork && <p className="upload-status">Validating files...</p>}
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

export default CmsUpload;