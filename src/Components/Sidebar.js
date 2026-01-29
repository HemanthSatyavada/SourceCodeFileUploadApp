import React, { useState, useRef, useEffect } from "react";
import "../Styles/sidebar.css";
import { logout } from "../Apis/api";
import { ADMIN_USER, COVER_USER, DEFAULT_USER, NICHE_USER } from "../Constants/appConstant";

const Sidebar = ({ userRole, activeTab, onTabClick, onLogout }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [submenuPos, setSubmenuPos] = useState({});
  const [clickedItem, setClickedItem] = useState(null);

  const sidebarRef = useRef(null);
  const itemRefs = useRef({});

  const sections = [];

  // Always add File Validation
  sections.push({
    title: "File Validation",
    icon: "📄",
    id: "assetValidation",
    subItems: [
      { title: "Upload EPUB ZIP", id: "epubZip" },
      { title: "Upload PDF File", id: "pdfFile" },
    ],
  });

  // Add CMS Upload if user has ADMIN role
  if (userRole != null && userRole.includes(ADMIN_USER)) {
    sections.push({
      title: "CMS Upload",
      icon: "⚙️",
      id: "cmsUpload",
      subItems: [
        { title: "Upload Final Cover PDFs", id: "cmsPdf" },
        { title: "Upload Cover Artwork", id: "cmsCover" },
      ],
    });
  }

  // Add Niche Upload if user has NICHE role
  if (userRole != null && userRole.includes(NICHE_USER)) {
    sections.push({
      title: "Niche Upload",
      icon: "⭐",
      id: "nicheAssetUpload",
      subItems: [
        { title: "Upload Niche Files", id: "nicheArtwork" },
      ],
    });
  }

  // Add Cover Files Upload if user has COVER role
  if (userRole != null && userRole.includes(COVER_USER)) {
    sections.push({
      title: "Cover Files Upload",
      icon: "🖼️",
      id: "coverValidation",
      subItems: [
        { title: "Upload Final Cover PDFs", id: "coverPdf" },
        { title: "Upload Cover Artwork", id: "coverArtwork" },
      ],
    });
  }

  const updateSubmenuPosition = (id) => {
    const itemEl = itemRefs.current[id];
    if (itemEl && sidebarRef.current) {
      const itemRect = itemEl.getBoundingClientRect();
      const topPos = itemRect.top;
      setSubmenuPos((prev) => ({ ...prev, [id]: topPos }));
    }
  };

  const handleMouseEnter = (id) => {
    if (sections.find(s => s.id === id)?.subItems?.length > 0) {
      setActiveSubmenu(id);
      updateSubmenuPosition(id);
    }
  };

  const handleMouseLeave = () => {
    if (clickedItem === null) {
      setActiveSubmenu(null);
    }
  };

  const handleItemClick = (e, id) => {
    e.preventDefault();
    const section = sections.find(s => s.id === id);
    
    if (section?.subItems?.length > 0) {
      if (clickedItem === id) {
        setActiveSubmenu(null);
        setClickedItem(null);
      } else {
        setActiveSubmenu(id);
        setClickedItem(id);
        updateSubmenuPosition(id);
      }
    } else {
      onTabClick(id);
      setActiveSubmenu(null);
      setClickedItem(null);
    }
  };

  const handleSubItemClick = (subId) => {
    onTabClick(subId || activeSubmenu);
    setActiveSubmenu(null);
    setClickedItem(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const submenuEl = document.querySelector(".sidebar-submenu.show");
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        (!submenuEl || !submenuEl.contains(e.target))
      ) {
        setActiveSubmenu(null);
        setClickedItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      alert("Logged out successfully");
      onLogout();
    }
  };

  return (
    <>
      <div className="sidebar" ref={sidebarRef}>
        <div className="sidebar-header">
          <span className="home-icon">🏠</span>
          <span className="app-title">File Upload App</span>
        </div>

        <ul className="sidebar-list">
          {sections.map((section) => (
            <li
              key={section.id}
              className={`sidebar-item ${activeTab === section.id ? "active" : ""}`}
              ref={(el) => (itemRefs.current[section.id] = el)}
              onMouseEnter={() => handleMouseEnter(section.id)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="sidebar-link"
                onClick={(e) => handleItemClick(e, section.id)}
              >
                <span className="sidebar-icon">{section.icon}</span>
                <span>{section.title}</span>
              </button>

              {section.subItems && section.subItems.length > 0 && (
                <ul
                  className={`sidebar-submenu ${
                    activeSubmenu === section.id ? "show" : ""
                  }`}
                  style={{ top: submenuPos[section.id] }}
                >
                  {section.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <button
                        className="sidebar-sublink"
                        onClick={() => handleSubItemClick(subItem.id)}
                      >
                        {subItem.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar">
        <div className="navbar-right">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
