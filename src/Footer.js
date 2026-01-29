import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>
        &copy; {new Date().getFullYear()} Taylor and Francis. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
