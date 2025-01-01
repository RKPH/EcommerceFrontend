// src/Layouts/DefaultLayout.jsx
import Header from "../Components/Header";
import React, { lazy, Suspense } from "react";
import "tailwindcss/tailwind.css";
import PropTypes from "prop-types";

const DefaultLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen">
      <Header />
      {/* Reset ErrorBoundary key when path changes */}

      <Suspense  fallback={<div>Loading...</div>}>
          <div className="bg-[#efefef]">
              {children}
          </div>
      </Suspense>
    </div>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
