import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black overflow-hidden pt-24 pb-0 mt-auto">
      <div className="max-w-[1200px] mx-auto px-8 mb-12 flex justify-between items-end text-sm uppercase tracking-wide font-medium text-gray-600">
        <div className="flex flex-col gap-2">
          <span>© 2024 Resume.ai</span>
          <span>All rights reserved</span>
        </div>

        <div className="flex gap-8">
          <a href="#" className="hover:text-black transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-black transition-colors">
            LinkedIn
          </a>
        </div>
      </div>

      <div className="w-full leading-none">
        <h1 className="text-[13.5vw] font-bold text-center uppercase tracking-tighter leading-[0.8] select-none letter-spacing-[0.8em] text-gray-200">
          RESUME.AI
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
