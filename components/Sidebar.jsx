import { useState } from "react";
import { FiSearch, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import Logo from "@/public/logo.png";

const sections = [
  {
    heading: "Getting Started",
    items: ["Installation", "Project Structure"],
  },
  {
    heading: "Building Your Application",
    items: [
      "Routing",
      "Data Fetching",
      "Rendering",
      "Caching",
      "Styling",
      "Optimizing",
      "Configuring",
      "Testing",
      "Authentication",
      "Deploying",
      "Upgrading",
      "Examples",
    ],
  },
  {
    heading: "API Reference",
    items: ["Components", "File Conventions"],
  },
  {
    heading: "Architecture",
    items: ["Accessibility"],
  },
];

export default function Sidebar({ open, onClose }) {
  const [openSection, setOpenSection] = useState(null);

  const handleToggle = (heading) => {
    setOpenSection(openSection === heading ? null : heading);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-72 bg-[#d3d3f8]  z-50 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ minWidth: "16rem", maxWidth: "20rem" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 rounded p-2 flex items-center justify-center w-8 h-8">
            <Image src={Logo} alt="Logo" width={20} height={20} className="object-contain" />
          </span>
          <div>
            <div className="font-bold">Documentation</div>
            <div className="text-xs text-zinc-400">v1.0.1</div>
          </div>
        </div>
        <button onClick={onClose} className="text-2xl lg:hidden">
          <IoClose />
        </button>
      </div>
      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center bg-zinc-800 rounded px-2">
          <FiSearch className="text-zinc-400" />
          <input
            type="text"
            placeholder="Search the docs..."
            className="bg-transparent outline-none px-2 py-2 w-full text-sm text-zinc-200"
          />
        </div>
      </div>
      {/* Nav */}
      <nav className="sidebar-scroll overflow-y-auto h-[calc(100vh-120px)] px-2 pb-4">
        {sections.map((section) => (
          <div key={section.heading} className="mb-2">
            <button
              className="flex items-center w-full px-2 py-2 rounded text-sm font-semibold hover:bg-zinc-700 transition group"
              onClick={() => handleToggle(section.heading)}
            >
              <span className="flex-1 text-left">{section.heading}</span>
              {section.items.length > 0 && (
                openSection === section.heading ? (
                  <FiChevronDown className="ml-2 transition-transform" />
                ) : (
                  <FiChevronRight className="ml-2 transition-transform" />
                )
              )}
            </button>
            {openSection === section.heading && (
              <ul className="pl-4">
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="block px-2 py-2 rounded text-sm hover:bg-zinc-700 transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}