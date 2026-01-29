import React, { useState, useRef } from "react";
import { uploadEpubZip, uploadPdf, sessionValidation } from "../Apis/api";
import "../Styles/AssetValidation.css";

const AssetValidation = ({ onLogout, setLoading }) => {
  const [epubZip, setEpubZip] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [epubZipUploadStatus, setEpubZipUploadStatus] = useState("");
  const [pdfUploadStatus, setPdfUploadStatus] = useState("");
  const epubZipRef = useRef(null);
  const pdfRef = useRef(null);

  const handleEpubZipChange = (event) => {
    if (!sessionValidation()) {
      onLogout();
    }
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      console.log(fileExtension);
      if ("zip" === fileExtension) {
        setEpubZip(event.target.files[0]);
        setEpubZipUploadStatus("");
        setPdfUploadStatus("");
      } else {
        setEpubZip(null);
        setEpubZipUploadStatus("Only zip files are accepted");
        setPdfUploadStatus("");
        epubZipRef.current.value = "";
      }
    }
  };

  const handlePdfChange = (event) => {
    if (!sessionValidation()) {
      onLogout();
    }
    setPdfFile(event.target.files[0]);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const selectedFileName = selectedFile.name;
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      console.log(fileExtension);
      const coverFileNamePattern = /.*cover\.pdf$/i;
      const textFileNamePattern = /.*text\.pdf$/i;
      const webPdfFileNamePattern = /.*webpdf\.pdf$/i;

      if (
        "pdf" === fileExtension &&
        (coverFileNamePattern.test(selectedFileName) ||
          textFileNamePattern.test(selectedFileName) || webPdfFileNamePattern.test(selectedFileName))
      ) {
        setPdfFile(event.target.files[0]);
        setPdfUploadStatus("");
        setEpubZipUploadStatus("");
      } else {
        setPdfFile(null);
        setPdfUploadStatus("Only text pdf, cover pdf and web pdf files are accepted");
        setEpubZipUploadStatus("");
        pdfRef.current.value = "";
      }
    }
  };

  const handleEpubZipUpload = async (event) => {
    if (!sessionValidation()) {
      onLogout();
    }
    event.preventDefault();

    if (!epubZip) {
      setEpubZipUploadStatus("Please select a file");
      setPdfUploadStatus("");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadEpubZip(epubZip);
      setLoading(false);
      console.log("Upload response : ", response);
      if (200 === response) {
        setEpubZipUploadStatus("Upload successful");
        setPdfUploadStatus("");
      } else if (204 === response) {
        setEpubZipUploadStatus("No epub file present in the zip");
        setPdfUploadStatus("");
      } else if (401 === response) {
        onLogout();
      } else {
        setEpubZipUploadStatus("Zip upload failed");
        setPdfUploadStatus("");
      }
    } catch (error) {
      setEpubZipUploadStatus("Zip upload failed");
      setPdfUploadStatus("");
    }
    setEpubZip(null);
    epubZipRef.current.value = "";
  };

  const handlePdf = async (event) => {
    if (!sessionValidation()) {
      onLogout();
    }
    event.preventDefault();

    if (!pdfFile) {
      setPdfUploadStatus("Please select a file");
      setEpubZipUploadStatus("");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      setLoading(true);
      const response = await uploadPdf(pdfFile);
      setLoading(false);
      console.log("Upload response : ", response);
      if (200 === response) {
        setPdfUploadStatus("Pdf upload successful");
        setEpubZipUploadStatus("");
      } else if (401 === response) {
        onLogout();
      } else {
        setPdfUploadStatus("Pdf upload failed");
        setEpubZipUploadStatus("");
      }
    } catch (error) {
      setPdfUploadStatus("Pdf upload failed");
      setEpubZipUploadStatus("");
    }
    setPdfFile(null);
    pdfRef.current.value = "";
  };

  return (
    <div className="tab-container">
      <div className="upload-form">
        <h3 className="headline">Upload Epub Zip</h3>
        <label className="lable-info" htmlFor="text1">
          Select Zip Files containing epubs (size upto 10 GB) :
        </label>
        <label htmlFor="text">
          {" "}
          <b>
          Only ePubs under the zip will be considered and validated against only Penta validation.
            <br />
            Also, ePubs will not be archived and will be deleted from S3 in 24
            hours.
          </b>
        </label>
        <br />
        <input
          type="file"
          id="epubZip"
          name="epubZip"
          onChange={handleEpubZipChange}
          ref={epubZipRef}
        />
        <button onClick={handleEpubZipUpload}>Upload Epub file</button>
        <p
          className={`upload-status ${
            epubZipUploadStatus.includes("successful") ? "success" : "failure"
          }`}
        >
          {epubZipUploadStatus}
        </p>
      </div>
      <div className="upload-form">
        <h3 className="headline">Upload PDF File</h3>
        <label className="lable-info" htmlFor="text1">
          Select only text, cover and web pdf file for preflight (after successful upload
          report will be delivered via email)
        </label>
        <br />
        <input
          type="file"
          id="pdfFile"
          name="pdfFile"
          onChange={handlePdfChange}
          ref={pdfRef}
        />
        <button onClick={handlePdf}>Upload Pdf File</button>
        <p
          className={`upload-status ${
            pdfUploadStatus.includes("successful") ? "success" : "failure"
          }`}
        >
          {pdfUploadStatus}
        </p>
      </div>
    </div>
  );
};

export default AssetValidation;
