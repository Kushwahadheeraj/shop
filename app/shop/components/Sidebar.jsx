"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
// import Image from "next/image";

const getNavItems = (isLoggedIn) => {
  const baseItems = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/Shop" },
    { label: "PAINTS", href: "#", hasDropdown: true },
    { label: "ELECTRICALS", href: "#", hasDropdown: true },
    { label: "SANITARY WARE & FAUCETS", href: "#", hasDropdown: true },
    { label: "CEMENTS & POP", href: "/ShopPage/Cements" },
    { label: "ADHESIVE", href: "#" },
    { label: "CLEANING", href: "#" },
    { label: "TOOLS", href: "#", hasDropdown: true },
  ];

  if (isLoggedIn) {
    baseItems.push({ label: "TRACKING", href: "/Tracking" });
    baseItems.push({ label: "MY ACCOUNT", href: "/AccountDetails" });
  }
  
  return baseItems;
};

const submenus = {
  PAINTS: [
    { title: "EMULSION", items: ["Interior Emulsion", "Exterior Emulsion", "Wall Texture", "Tile Guard"] },
    { title: "ENAMEL", items: ["Satin Enamel", "Gloss Enamel", "Synthetic Enamel"] },
    { title: "DISTEMPER", items: ["Acrylic Distemper", "Synthetic Distemper"] },
    { title: "PRIMER", items: ["Interior Primer", "Exterior Primer", "Cement Primer", "Wood Primer", "Metal Primer", "Acrylic Primer", "Solvent Primer"] },
    { title: "STAINERS", items: ["Universal Stainers", "Wood Stainers"] },
    { title: "BRUSHES & ROLLERS", items: ["Paint Brushes", "Rollers", "Spray Paints"] },
    { title: "WATERPROOFING & FILLERS", items: ["Crack Fillers", "Waterproof Basecoat"] },
    { title: "PAINTING ACCESSORIES", items: ["Sandpaper Rolls", "Painting Tools", "Stencils"] },
    { title: "WOOD FINISHES", items: ["Polish", "Varnish & Black Board Paint", "Melamyne", "PU", "Sealer", "NC", "Glass Coatings", "Wood Putty"] },
    { title: "ADHESIVE & THINNER", items: ["Adhesive", "Thinner"] },
    { title: "WALL PUTTY", items: ["Powder Wall Putty", "Acrylic Wall Putty", "KPF Wall Putty"] },
    { title: "AUTOMOTIVE PAINTS", items: ["Aspa paints"] },
    { title: "TOP BRANDS", items: ["Asian Paints", "Jk Wall Putty", "Gem Paints", "Agsar Paints"] },
  ],
  ELECTRICALS: [
    { title: "LIGHTING", items: ["Light Electronics", "Lamps", "Reflectors", "Standard Incandescent", "CFL", "Desk Light", "Focus Light"] },
    { title: "LED LIGHTING", items: ["Tube Light", "LED Bulbs", "LED DownLighters/Spot Light", "LED Strips", "Ceiling Light", "Wall Light"] },
    { title: "PLUGS & ADAPTORS", items: ["Pin Top", "Adaptors"] },
    { title: "FANS", items: ["Ceiling Fans", "Cabin Fans", "Ventilation/Exhaust", "Wall Mounting Fans", "Pedestal Fans", "Table Fans"] },
    { title: "CABLES & WIRES", items: ["House Wires", "Flexible Wires"] },
    { title: "WATER PUMPS", items: ["Motors"] },
    { title: "SWITCHES & GEARS", items: ["Switches", "Dimmer", "Sockets", "Regulators", "Indicator", "DP-switch", "TV Outlets", "Switch Socket Combined", "Switch Plates", "Ceiling Roses"] },
    { title: "PROTECTION DEVICES", items: ["MCB", "ELCBs OR RCCBs", "Distribution Boards", "Fuse Carriers", "KIT KAT Fuses", "Isolators"] },
    { title: "MODULAR/SURFACE BOX", items: ["Electrical Fittings", "Flexible Conduit", "Holders"] },
    { title: "OTHERS", items: ["Rotatory Switch", "Power Strips", "Insulation Tapes", "PVC Clips", "Earthing Accessories", "Jacks"] },
  ],
  "SANITARY WARE & FAUCETS": [
    { items: [
      "Acrylic Products",
      "Bathsense",
      "Coral bath fixtures",
      "Essess",
      "Corsa",
      "Hindware",
      "Parryware",
      "Leo Bath Fittings",
      "WaterTec",
      "Hardware & Bathroom Accessories",
      "Taps"
    ] },
  ],
  TOOLS: [
    {
      items: [
        "Hand Tools",
        "Abrasives",
        "Allen Keys",
        "Brush",
        "Carpenter Pincer",
        "Chisels",
        "Clamps",
        "Cutters",
        "Files",
        "Garden Tools",
        "Glue Gun",
        "Grease Gun",
        "Hammer",
        "Level",
        "Lubrications",
        "Piler",
        "Polishing Accessories",
        "Power Tools",
        "Screw Driver",
        "Socket Set",
        "Spare Mallets",
        "Spanner",
        "Wrench",
      ],
    },
  ],
};

export default function Sidebar({ open, onClose }) {
  const [openItem, setOpenItem] = useState(null);
  const asideRef = useRef(null);
  const [allOpen, setAllOpen] = useState(false);
  const allRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('euser_token');
      setIsLoggedIn(!!token);
    };
    
    checkLoginStatus();
    window.addEventListener('euser-auth', checkLoginStatus);
    return () => window.removeEventListener('euser-auth', checkLoginStatus);
  }, []);

  const navItems = getNavItems(isLoggedIn);

  // Map category labels (from dropdown + navbar/Sidebar items) to
  // the base folder segment used in /ShopPage routes.
  // Keys are normalized (lowercase, no spaces/special chars).
  const folderMap = {
    uncategorized: "Uncategorized",
    adhesives: "Adhesives",
    adhesive: "Adhesives",
    // CEMENTS & POP (Navbar + Sidebar labels "CEMENTS & POP" / "Cements & POP")
    cementsampop: "Cements",
    cementsandpop: "Cements",
    cements: "Cements",
    cleaning: "Cleaning",
    drywallgypsumscrews: "Dry",
    electricalitems: "Electrical",
    electricals: "Electrical",
    householdladder: "Hardware",
    locksaccessories: "Locks",
    masksanitizers: "Cleaning",
    paints: "Paint",
    paint: "Paint",
    pipesfittings: "Pipe",
    sanitarywarefaucets: "Sanitary",
    tools: "Tools",
    waterproofing: "WaterProofing",
  };

  const getFolderName = (label) => {
    const key = String(label).toLowerCase().replace(/[^a-z0-9]/g, "");
    return folderMap[key] || label;
  };
  const toSegment = (s) => String(s).replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    const handleOutside = (e) => {
      if (asideRef.current && !asideRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, onClose]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (allRef.current && !allRef.current.contains(e.target)) {
        setAllOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleItem = (label) => {
    setOpenItem((prev) => (prev === label ? null : label));
  };

  return (
    <>
    {/* Backdrop overlay - mobile only */}
    <div
      className={`fixed inset-0 bg-black/40 z-[3500] lg:hidden transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />
    <aside
      ref={asideRef}
      className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-[4000] lg:hidden transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ minWidth: "16rem", maxWidth: "20rem" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        
        <button onClick={onClose} className="text-2xl lg:hidden">
          <IoClose />
        </button>
      </div>

      {/* Search (same as header) */}
      <div className="px-3 py-2 border-b bg-white">
        <div className="flex items-center w-full">
          {/* All dropdown chip */}
          <div className="relative" ref={allRef}>
            <button onClick={() => setAllOpen(v => !v)} className="h-8 px-3 rounded-full bg-white border border-gray-300 shadow-sm flex items-center text-gray-700 text-sm">
              <span>All</span>
              <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.586l3.71-3.356a.75.75 0 1 1 1.02 1.1l-4.25 3.85a.75.75 0 0 1-1.02 0l-4.25-3.85a.75.75 0 0 1 .02-1.06z' />
              </svg>
            </button>
            {/* Dropdown Menu */}
            <div className={`absolute top-full left-0 w-48 bg-white border border-gray-200 shadow-xl z-[2000] ${allOpen ? 'block' : 'hidden'}`}>
                  <div className=''>
                    {/* <div className='px-4 py-0.2 hover:bg-blue-600 cursor-pointer flex items-center border-b border-gray-100'>
                      
                      <span className='text-sm font-medium text-gray-600 hover:text-white'>All</span>
                    </div> */}
                    <Link href='/ShopPage/Adhesives' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Adhesives</Link>
                    <Link href='/ShopPage/Cements' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Cements & POP</Link>
                    <Link href='/ShopPage/Cleaning' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Cleaning</Link>
                    <Link href='/ShopPage/Dry' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Dry Wall Gypsum Screws</Link>
                    <Link href='/ShopPage/Electrical/Adaptors' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Electrical Items</Link>
                    <Link href='/ShopPage/Hardware' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>House Hold Ladder</Link>
                    <Link href='/ShopPage/Locks/FoldingBrackets/BlindCornerHinge' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Locks & accessories</Link>
                    <Link href='/ShopPage/Cleaning' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Mask & Sanitizers</Link>
                    <Link href='/ShopPage/Paint/AcrylicEmulsionPaint' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Paints</Link>
                    <Link href='/ShopPage/Pipe/AshirvadPipes' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Pipes & Fittings</Link>
                    <Link href='/ShopPage/Sanitary/AcrylicProducts' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Sanitary Ware & faucets</Link>
                    <Link href='/ShopPage/Tools/HandTools' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Tools</Link>
                    <Link href='/ShopPage/Uncategorized' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Uncategorized</Link>
                    <Link href='/ShopPage/WaterProofing/Interiors' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>WaterProofing</Link>
                  </div>
                </div>
            {/* <div className={`absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 ${allOpen ? 'block' : 'hidden'}`}>
              <div className="py-1">
                {[
                  "Adhesives",
                  "Cements & POP",
                  "Cleaning",
                  "Dry Wall Gypsum Screws",
                  "Electrical Items",
                  "House Hold Ladder",
                  "Locks & accessories",
                  "Mask & Sanitizers",
                  "Paints",
                  "Pipes & Fittings",
                  "Sanitary Ware & faucets",
                  "Tools",
                  "Uncategorized",
                  "WaterProofing",
                ].map((opt) => {
                  const folder = getFolderName(opt);
                  const href = folder ? `/ShopPage/${folder}` : "/";
                  return (
                    <Link
                      key={opt}
                      href={href}
                      onClick={onClose}
                      className="block px-4 py-2 hover:bg-blue-600"
                    >
                      <span className="text-sm text-gray-700 hover:text-white">
                        {opt}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div> */}
          </div> 
          <div className="w-2"></div>
          {/* Search pill */}
          <div className="relative flex-1 h-8 rounded-full w-36 bg-gray-50 border border-gray-300 shadow-sm flex items-center">
            <svg className="absolute left-3 text-gray-500" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search..." className="flex-1 h-full pl-8 pr-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="overflow-y-auto h-[calc(100vh-104px)]">
        {navItems.map((item) => (
          <div key={item.label} className="border-b border-gray-100">
            {item.hasDropdown ? (
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  toggleItem(item.label);
                }}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="flex-1 text-left">{item.label}</span>
                <FiChevronDown
                  className={`ml-2 h-5 w-5 text-gray-500 transition-transform ${
                    openItem === item.label ? "rotate-180" : "rotate-0"
                  }`}
                />
              </a>
            ) : (
              <Link
                href={
                  item.href && item.href !== "#"
                    ? item.href
                    : `/ShopPage/${getFolderName(item.label)}`
                }
                onClick={onClose}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            )}

            {item.hasDropdown && openItem === item.label && (
              <div className="px-3 pb-3">
                {(submenus[item.label] || []).map((group) => (
                  <div key={group.title} className="mb-3">
                    <div className="text-[11px] font-semibold text-gray-600 tracking-wide mb-1">{group.title}</div>
                    <ul>
                      {group.items.map((sub) => (
                        <li key={sub}>
                          <Link
                            href={`/ShopPage/${getFolderName(
                              item.label
                            )}${
                              group.title ? `/${toSegment(group.title)}` : ""
                            }/${toSegment(sub)}`}
                            className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
                            onClick={onClose}
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
    </>
  );
}