import React, { useEffect, useState } from "react";
import AssetValidation from "./AssetValidation";
import CmsUpload from "./CmsUpload";
import CoverValidation from "./CoverValidation";
import NicheAssetUpload from "./NicheAssetUpload";
import Sidebar from "./Sidebar";
import "../Styles/Tabs.css";
import "../Styles/global.css";
import "../Styles/header.css";
import "../Styles/sidebar.css";
import { logout, getUserRole } from "../Apis/api";
import LoadingOverlay from "react-loading-overlay-ts";
import { ADMIN_USER, COVER_USER, DEFAULT_USER, NICHE_USER } from "../Constants/appConstant";

const Tabs = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("assetValidation");
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      let role = [];
      try {
        // HARDCODED FOR TESTING - COMMENT OUT ABOVE LINE AND UNCOMMENT BELOW FOR PRODUCTION
        // role = getUserRole();
        role = [ADMIN_USER, COVER_USER, NICHE_USER, DEFAULT_USER]; // HARDCODED: ALL ROLES FOR CSS TESTING
        if(role.length === 1 && role.includes(DEFAULT_USER)){
          setActiveTab("assetValidation");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        // role = DEFAULT_USER;
        role = [ADMIN_USER, COVER_USER, NICHE_USER, DEFAULT_USER]; // HARDCODED: ALL ROLES FOR CSS TESTING
        setActiveTab("assetValidation");
      }
      console.log("User role: ", role);
      setUserRole(role);
    };

    fetchUserRole();
  }, []);

  const handleTabClick = (tab) => {
    // Map sub-item IDs to main component IDs and store the sub-option
    const subOptionMap = {
      epubZip: { component: "assetValidation", subOption: "epubZip" },
      pdfFile: { component: "assetValidation", subOption: "pdfFile" },
      cmsPdf: { component: "cmsUpload", subOption: "cmsPdf" },
      cmsCover: { component: "cmsUpload", subOption: "cmsCover" },
      nicheArtwork: { component: "nicheAssetUpload", subOption: "nicheArtwork" },
      coverPdf: { component: "coverValidation", subOption: "coverPdf" },
      coverArtwork: { component: "coverValidation", subOption: "coverArtwork" },
    };
    
    const mapping = subOptionMap[tab];
    if (mapping) {
      setActiveTab(mapping.component);
      setSelectedSubOption(mapping.subOption);
    } else {
      setActiveTab(tab);
      setSelectedSubOption(null);
    }
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      alert("Session Timeout, please log in to continue");
      onLogout();
    }
  };

  return (
    <div>
      <Sidebar 
        userRole={userRole} 
        activeTab={activeTab} 
        onTabClick={handleTabClick}
        onLogout={onLogout}
      />
      <LoadingOverlay active={loading} spinner text="Uploading in progress...">
        <div className="main-content-with-sidebar">
          <div className="page-container">
            {activeTab === "assetValidation" && (
              <AssetValidation 
                selectedSubOption={selectedSubOption}
                onLogout={handleLogout} 
                setLoading={setLoading} 
              />
            )}
            {activeTab === "cmsUpload" && (
              <CmsUpload
                selectedSubOption={selectedSubOption}
                onUpload={() => setActiveTab("cmsUpload")}
                onLogout={handleLogout}
                setLoading={setLoading}
              />
            )}
            {activeTab === "nicheAssetUpload" && (
              <NicheAssetUpload
                selectedSubOption={selectedSubOption}
                onUpload={() => setActiveTab("nicheAssetUpload")}
                onLogout={handleLogout}
                setLoading={setLoading}
              />
            )}
            {activeTab === "coverValidation" && (
              <CoverValidation
                selectedSubOption={selectedSubOption}
                onUpload={() => setActiveTab("coverValidation")}
                onLogout={handleLogout}
                setLoading={setLoading}
              />
            )}
          </div>
        </div>
      </LoadingOverlay>
    </div>
  );
};

export default Tabs;