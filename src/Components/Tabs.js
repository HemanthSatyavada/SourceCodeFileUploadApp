import React, { useEffect, useState } from "react";
import AssetValidation from "./AssetValidation";
import CmsUpload from "./CmsUpload";
import CoverValidation from "./CoverValidation";
import NicheAssetUpload from "./NicheAssetUpload";
import "../Styles/Tabs.css";
import { logout, getUserRole } from "../Apis/api";
import LoadingOverlay from "react-loading-overlay-ts";
import { ADMIN_USER, COVER_USER, DEFAULT_USER, NICHE_USER } from "../Constants/appConstant";

const Tabs = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("coverValidation");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      let role = [];
      try {
        role = getUserRole();
        if(role.length === 1 && role.includes(DEFAULT_USER)){
          setActiveTab("assetValidation");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        role = DEFAULT_USER;
        setActiveTab("assetValidation");
      }
      console.log("User role: ", role);
      setUserRole(role);
    };

    fetchUserRole();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleFileUpload = () => {
    setActiveTab("cmsUpload");
  };


  const handleNicheAssetUpload = () => {
    setActiveTab("nicheAssetUpload");
  };

  const handleCoverUpload = () => {
    setActiveTab("coverValidation");
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
      <LoadingOverlay active={loading} spinner text="Uploading in progress...">
        <div className="tabs-container">
          <div>
          {userRole != null && userRole.includes(COVER_USER) && (
                        <button
                          className={`tab-button ${
                            activeTab === "coverValidation" ? "active" : ""
                          }`}
                          onClick={() => handleTabClick("coverValidation")}
                        >
                          <b>Cover Files Upload</b>
                        </button>
                      )}
            <button
              className={`tab-button ${
                activeTab === "assetValidation" ? "active" : ""
              }`}
              onClick={() => handleTabClick("assetValidation")}
            >
              <b>File Validation</b>
            </button>
            {userRole != null && userRole.includes(ADMIN_USER) && (
              <button
                className={`tab-button ${
                  activeTab === "cmsUpload" ? "active" : ""
                }`}
                onClick={() => handleTabClick("cmsUpload")}
              >
                <b>CMS Upload</b>
              </button>
            )}
            {userRole != null && userRole.includes(NICHE_USER) && (
              <button
                className={`tab-button ${
                  activeTab === "nicheAssetUpload" ? "active" : ""
                }`}
                onClick={() => handleTabClick("nicheAssetUpload")}
              >
                <b>Niche Upload</b>
              </button>
            )}

          </div>
        </div>
        <div className="tab-content">
          {activeTab === "assetValidation" && (
            <AssetValidation onLogout={handleLogout} setLoading={setLoading} />
          )}
          {activeTab === "cmsUpload" && (
            <CmsUpload
              onUpload={handleFileUpload}
              onLogout={handleLogout}
              setLoading={setLoading}
            />
          )}
           {activeTab === "nicheAssetUpload" && (
            <NicheAssetUpload
              onUpload={handleNicheAssetUpload}
              onLogout={handleLogout}
              setLoading={setLoading}
            />
          )}
          {activeTab === "coverValidation" && (
            <CoverValidation
              onUpload={handleCoverUpload}
              onLogout={handleLogout}
              setLoading={setLoading}
            />
          )}
        </div>
      </LoadingOverlay>
    </div>
  );
};

export default Tabs;