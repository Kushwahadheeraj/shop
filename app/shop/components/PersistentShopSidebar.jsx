'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const browse = [
  "Adhesives",
  "Brush",
  "Cements & POP",
  "Cleaning",
  "Dry Wall Gypsum Screws",
  "Electrical Items",
  "Fiber",
  "Fitting",
  "Hardware",
  "HomeDecor",
  "Locks & accessories",
  "Paints",
  "Pipes & Fittings",
  "PVC Mats",
  "Roofer",
  "Sanitary Ware & faucets",
  "Tools",
  "Uncategorized",
  "WaterProofing",
];

const electricalSubcategories = [
  "Adaptors",
  "Ceiling Roses", 
  "Dimmer",
  "Distribution Boards",
  "Door Bells",
  "DP-switch",
  "Earthing Accessories",
  "ELCBs OR RCCBs",
  {
    label: "Electrical Fittings",
    sub: ["Accessories", "Circular Deep Box", "Circular surface box", "Rigid type"]
  },
  {
    label: "Fans",
    sub: ["Cabin Fans", "Ceiling Fans", "Pedestal fans", "Table Fans", "Ventilation/Exhaust fans", "Wall Mounting fans"]
  },
  "Flexible Conduit",
  "Flexible Wires",
  "Fuse Carriers",
  "Holders",
  "Indicator",
  "Insulation Tapes",
  "Isolators",
  "Jacks",
  "KIT KAT Fuses",
  {
    label: "Lights",
    sub: ["Ceiling light", "CFL", "Desklight", "Focus Light", "Garden Light", "Gate Light", "GLS", "Home", "Lamps", "LED Batten", "LED Bulbs", "Led DownLighters/Spot Light", "LED Luminaires", "LED Panel Light", "LED Spotlight", "LED Street Light", "LED Strips", "Led Surface Light", "Light Electronics", "Mirror Light", "Reflectors", "Standard Incandescent", "T Bulb", "Tube Light", "Under Water Lights", "Wall Light"]
  },
  "Main Switch",
  "MCB",
  "Modular/Surface Box",
  "Motor Starters",
  "Motors",
  "Others",
  "Pin top",
  "Plug",
  "Power Strips",
  "PVC Clips",
  "Regulators",
  "Rotatory Switch",
  "Sockets",
  "Switch & Socket",
  "Switch Plates",
  "Switches",
  "Travel adaptor",
  "TV outlets",
  "Uni Switch Socket Combined Units",
  "Water Heater",
  "Water Heaters",
  "Wires & Cables"
];

const locksSubcategories = [
  {
    label: "DOOR ACCESSORIES",
    sub: ["Aluminium Tower Bolt", "Ball Bearing Door Hinges", "Concealed Hinges", "Door Eye", "Door Stopper", "Hinges", "Magnetic Door Stoppers", "Wooden Sliding Door Fittings"]
  },
  {
    label: "DOOR CONTROLS",
    sub: ["Door Closer", "Door Stopper", "Hydraulic Door Closers"]
  },
  {
    label: "Door Handles",
    sub: ["Door Kings", "Door Pulls"]
  },
  {
    label: "Door Locks",
    sub: ["Centre Shutter Locks", "Cupboard Locks", "Cylindrical Locks", "Dead Locks", "Diamant Padlocks", "Dimple Key", "Disc Pad Locks", "Drawer Lock", "Jemmy Proof Door Lock", "Knob Locks", "Main Door Lock", "Night Latch", "Pull Handles For Main Doors", "Rim Dead Lock", "Side Lock", "Smart Key", "Tri Bolt Locks"]
  },
  {
    label: "Folding Brackets",
    sub: ["Blind Corner Hinge", "Cabinet Hinge", "Clip On Soft Hinge", "Clip On Soft Hinge 4 Hole", "Drawer Channels", "Folding Brackets", "Heavy Duty Drawer Slides", "Slip On Hinge", "Soft Close Drawer Channel", "Thick Door Hinge"]
  },
  {
    label: "FURNITURE FITTINGS",
    sub: ["Curvo", "Drawer Cupboard Lock", "Drawer Locks", "Furniture Fittings", "Multi Purpose Lock", "Nuvo", "Supernova", "Table Lock"]
  },
  {
    label: "Furniture Locks",
    sub: []
  },
  {
    label: "GLASS HARDWARE",
    sub: ["Floor Spring", "Floor Spring Combo Set", "Glass Door Fitting", "Glass Door Lock", "Glass Door Pull Handle", "Glass Hardware", "Shower Cubicle Hinge", "Sliding System"]
  },
  {
    label: "LEVER MORTISE LOCKS",
    sub: ["Combipack With 6 Lever Mortise Lock", "Europrofile Mortise Lock Bodies", "Europrofile Mortise Pin Cylinder", "Europrofile Mortise Pin Cylinder With Master Key", "EXS HI Security Cylinders", "Lever Mortise Locks"]
  },
  "Mortice Locks",
  "Mortise Lock Body",
  {
    label: "Padlocks",
    sub: ["Disc Padlocks", "Padlocks", "Premium Padlocks", "Round Type Padlock", "Square Type Padlock", "Ultra Shutter Locks"]
  },
  "Patch Fittings",
  {
    label: "POPULAR MORTISE SERIES",
    sub: ["BM01", "BM02", "BM04", "BM06", "Classic Lock", "Combi Set", "Corner Fetch Series", "Cylindrical Locks", "Gloria", "Main Door Set", "Matiz", "NEH04", "NEH05", "NEH06", "NEH07", "NEH08", "NEH09", "NEH10", "NEH11", "NEH12", "NEH13", "NEH14", "NEH15", "NEH16", "Oliver", "Popular Mortise Series", "Pull Handles", "SSD Type Tube Lever", "Towy Low Height Design", "Victoria"]
  },
  {
    label: "PREMIUM MORTISE SERIES",
    sub: ["Allure Rossette Series", "Combipack With 240mm Euro Mortise Lock", "Europrofile Brass Handle Set 240mm", "Evva 3KS Regalis Mortise", "Mercury", "Orbit", "Phoenix", "Premium Mortise Series", "SEH Series"]
  },
  {
    label: "Rim Locks",
    sub: ["EXS Altrix", "EXS Astro", "Night Latch 7 Lever", "Pentabolt Aries", "Pin Cylinder Rim Locks", "Rim Locks", "Ultra Latchbolt Carton", "Ultra Retrofit Adaptor", "Ultra Tribolt", "Ultra Vertibolt", "Ultra XL Rim Deadbolt", "Ultra XL Tribolt", "Ultra XL Twinbolt", "Ultra XL Vertibolt"]
  }
];

const paintsSubcategories = [
  "Acrylic Emulsion Paint",
  {
    label: "Adhesive Thinner",
    sub: ["Adhesive", "Thinner"]
  },
  "Aspa Paints",
  {
    label: "Brushes Rollers",
    sub: ["Paint Brushes", "Rollers", "Spray Paints"]
  },
  {
    label: "Distemper",
    sub: ["Acrylic Distemper", "Synthetic Distemper"]
  },
  {
    label: "Emulsion",
    sub: ["Exterior Emulsion", "Interior Emulsion", "Tile Guard", "Wall Texture"]
  },
  {
    label: "Enamel",
    sub: ["Gloss Enamel", "Satin Enamel", "Synthetic Enamel"]
  },
  "Exterior Paints",
  "Floor Paints",
  "Industrial Coatings",
  "Interior Paints",
  {
    label: "Painting Accessories",
    sub: ["Painting Tools", "Sandpaper Rolls", "Stencils"]
  },
  "Painting Tools",
  {
    label: "Primer",
    sub: ["Acrylic Primer", "Cement Primer", "Exterior Primer", "Interior Primer", "Metal Primer", "Solvent Primer", "Wood Primer"]
  },
  "Primer And Wall Putty",
  "Sanitizer",
  "Spray Paints",
  {
    label: "Stainers",
    sub: ["Universal Stainers", "Wood Stainers"]
  },
  "Stainers Thinners",
  "Stencils",
  "Tile Guard",
  {
    label: "Top Brands",
    sub: ["Asian Paints", "Dulux", "Jk Wall Putty", "Neroloc"]
  },
  {
    label: "Wall Putty",
    sub: ["Acrylic Wall Putty", "Kpf Wall Putty", "Powder Wall Putty"]
  },
  "Wall Stickers Wallpapers",
  {
    label: "Waterproofing",
    sub: ["Crack Fillers", "Waterproof Basecoat"]
  },
  {
    label: "Wood Finishes",
    sub: ["Glass Coatings", "Melamyne", "Nc", "Polish", "Pu", "Sealer", "Varnish Black Board Paint", "Wood Putty"]
  },
  "Wood Metal"
];

const pipesSubcategories = [
  "Ashirvad Pipes",
  "Apollo Pipes", 
  "Birla Pipe",
  "Delivery Pipe",
  "Finolex Pipes",
  "Garden Pipe",
  "Nepul Pipes",
  "Other Pipe & Fittings",
  "Prakash Pipe",
  "Prinzia Pipes",
  "Prince Pipe",
  "Supreme Pipe",
  "TSA Pipe",
  "Tata Pipe"
];

const sanitarySubcategories = [
  "Plastic Toti",
  "PTMT Toti",
  "SS Toti",
  "Acrylic Products",
  "Bathroom Accessories",
  "Waste Pipe",
  "Sink Wash Basin Jali",
  "Kitchen Bathroom Jali",
  "Bathroom Soap Stand",
  "Cistern",
  "Seat Cover",
  {
    label: "Bathsense",
    sub: [
      {
        label: "CP Fittings Faucets",
        sub: ["Altius", "Bathsense Essentials", "Bathsense Showers", "Colossus", "Invictus", "Maximus", "Spry", "Theta"]
      },
      {
        label: "Sanitaryware",
        sub: ["Essentials", "Pedestals", "Venus", "Washbasins", "Water Closet"]
      }
    ]
  },
  {
    label: "Coral Bath Fixtures",
    sub: ["Eurosmart Series", "Flowmore Series", "New Super Glow Series", "Royale Series", "Treemo Series", "Xrossa Series"]
  },
  "Closets",
  {
    label: "Corsa",
    sub: [
      {
        label: "BATHROOM ACCESSORIES",
        sub: ["Acrylic Accessories", "Almond", "Anglo", "Budget", "Dolphin", "Ecco", "Keti", "Qubix", "Square", "Supreme"]
      },
      {
        label: "Bathroom Faucets",
        sub: ["Almond", "Arrow", "Bold", "Budget", "Concept", "Deluxe", "Ecco", "Expert", "Florence", "Glass Bowl Faucet", "Idea", "Jazz", "Keti", "Milano", "Nano", "Nexa", "Niagra", "Nice", "Omega", "Passion", "Royal", "Slimline", "Splash", "Square F", "Square S", "Super", "Tri"]
      },
      "Flushing Cistern",
      {
        label: "Kitchen",
        sub: ["Kitchen Faucets", "Kitchen Sink"]
      },
      {
        label: "Other Useful Items",
        sub: ["Ball Valves", "Mini Angle Cock", "Mouth Operated", "Pressmatic Push Cock", "Sensor Taps", "Soap Dispenser"]
      },
      {
        label: "Showers",
        sub: ["Health Faucet", "Overhead Shower", "Rain Shower", "Telephonic Shower"]
      }
    ]
  },
  {
    label: "Essess",
    sub: [
      {
        label: "Accessories",
        sub: ["Series 1 Croma", "Series 2 Swing", "Series 3 Tarim", "Series 5 Hotelier Series", "Series 6 Cruzo", "Series 7 Deon", "Series 8 B Series"]
      },
      "Auto Close Taps",
      "Celato",
      "Croma",
      "Cruzo",
      "Deon",
      "D Series",
      "Echo",
      "Essentials",
      "Hotelier Series",
      "HS03",
      "Lab Taps",
      "New Dune",
      "New Xess",
      "Quadra",
      "Sensors",
      {
        label: "Showers",
        sub: ["Hand Showers", "Overhead Showers", "Rainfall Showers", "Shower Arms"]
      },
      "Tarim",
      "Trend"
    ]
  },
  "Faucets",
  "Hardware Bathroom Accessories",
  "Health Faucet",
  {
    label: "Hindware",
    sub: [
      "Add On",
      "Bath Tub",
      "Cisterns",
      {
        label: "Faucets",
        sub: ["Angular Stop Cock", "Bath Spout", "Bib Cock", "Chbm", "Concealed Stop Cock", "Csc Exp Kit", "Deutsch Mixer", "Exposed Mixers", "Flush Cock", "Medical Series", "Mixer Faucet", "Pillar Cock", "Pillar Cock Tall", "Pillar Faucet", "Pressmatic", "Recessed", "Single Lever Divertor", "Sink Cock", "Sink Mixer", "Slbm Faucet", "Slbm Faucet Tall", "Wall Mixer"]
      },
      {
        label: "Showers",
        sub: ["Rain Showers"]
      },
      "Wash Basins",
      "Water Closets"
    ]
  },
  "Jaquar",
  "Kitchen Sinks",
  "Lemon Bathroom Accessories",
  {
    label: "Leo Bath Fittings",
    sub: ["Bathroom Accessories", "Faucets", "Valve"]
  },
  {
    label: "Pamay",
    sub: ["Faucets", "Showers"]
  },
  {
    label: "Parryware",
    sub: [
      "Accessories",
      "Angle Valves",
      "Below Counter Basins",
      "Bowl Basins",
      "Closets",
      "Concealed Cistern",
      "European Water Closet",
      {
        label: "Faucets",
        sub: ["Flush Cocks", "Flush Valve", "Health Faucets", "Kitchen Sinks", "Pedestals"]
      },
      "Polymer Cisterns",
      "Push Plates",
      "Seat Covers",
      "Semi Recessed Basins",
      "Shower Enclosures",
      "Shower Panels",
      "Showers",
      "Utsav Range",
      "Wash Basins",
      "Waste Coupling",
      "Water Heaters"
    ]
  },
  "Pearl Precious Products",
  "Showers",
  "Taps",
  "Washbasins",
  {
    label: "Waterman",
    sub: ["Accessories", "Aria", "Aura", "Dell", "Deluxe", "Eco", "Evoque", "Hand Showers", "Health Faucet Abs", "Health Faucets Brass", "Ikon", "Rain Showers", "Roman", "Shower Tubes", "Wall Showers With Arm", "Wall Showers Without Arm"]
  },
  {
    label: "WaterTec",
    sub: ["Allied", "Aqua", "Aspire", "Bathroom Accessories", "Cistern", "Concealed Cistern", "Connection Tube", "Ebony", "Eco", "Eva", "Flora", "Health Faucets", "Quattro", "Showers", "Taps", "Toilet Seat Covers", "T Series", "T Series Alt", "Valves"]
  }
];

const toolsSubcategories = [
  {
    label: "Abrasives",
    sub: ["Cut Off Wheel", "Diamond Blades"]
  },
  "Allen Keys",
  "Brush",
  "Carpenter Pincer",
  "Centre Punches",
  "Chisels",
  "Clamps",
  "Crowbar",
  "Cutters",
  "Files",
  "Garden Tools",
  "Gear Pullers",
  "Glass cutter",
  "Glue gun",
  "Grease Gun",
  "Hacksaw Blades",
  "Hammer",
  "Hammer Drills",
  "hand tools",
  "Level",
  "Lubrications",
  "Measurement Scale",
  "Measuring Tape",
  "Multimeter",
  "Plier",
  "Polishing Accessories",
  {
    label: "Power Tools",
    sub: ["Drill", "Grinders", "Marble Cutter"]
  },
  "Saw",
  "Screw Driver",
  "Silicon Gun",
  "Socket Set",
  "Spanners",
  "Spare Mallets",
  "Tool Compartments",
  "Toolkit Set",
  "Various Tool Bits",
  "Wood Chisel",
  "Wood Items",
  "Wrench"
];

const waterproofingSubcategories = [
  "Bathrooms",
  "Cracks & Joints",
  "Interiors"
];

const pvcMatsSubcategories = [
  "Door Mats",
  "Floor Mats"
];

const rooferSubcategories = [
  "Aluminium Sheet",
  "Cements Sheet",
  "Color Sheet",
  "Fiber Sheet",
  "Metal",
  "Shingles",
  "Teen Sheet"
];

export default function PersistentShopSidebar({ forceMobile = false }) {
  const [price, setPrice] = useState([0, 148670]);
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState([]);

  // Helper to format path segments consistently
  const formatPath = (str) => String(str).replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');

  const categoryMap = {
    "Adhesives": "Adhesives",
    "Brush": "Brush",
    "Cements & POP": "Cements", 
    "Cleaning": "Cleaning",
    "Dry Wall Gypsum Screws": "Dry",
    "Electrical Items": "Electrical",
    "Fiber": "Fiber",
    "Fitting": "Fitting",
    "Hardware": "Hardware",
    "HomeDecor": "HomeDecor",
    "Locks & accessories": "Locks",
    "Paints": "Paint",
    "Pipes & Fittings": "Pipe",
    "Roofer": "Roofer",
    "PVC Mats": "PvcMats",
    "Sanitary Ware & faucets": "Sanitary",
    "Tools": "Tools",
    "Uncategorized": "Uncategorized",
    "WaterProofing": "WaterProofing"
  };

  const getSubcategories = (category) => {
    const maps = {
      "Electrical Items": electricalSubcategories,
      "Locks & accessories": locksSubcategories,
      "Paints": paintsSubcategories,
      "Pipes & Fittings": pipesSubcategories,
      "Roofer": rooferSubcategories,
      "Sanitary Ware & faucets": sanitarySubcategories,
      "Tools": toolsSubcategories,
      "WaterProofing": waterproofingSubcategories,
      "PVC Mats": pvcMatsSubcategories
    };
    return maps[category] || null;
  };

  const checkActive = (pathSegments) => {
    if (!pathname) return false;
    const currentPath = pathname.toLowerCase();
    const targetPath = `/ShopPage/${pathSegments.map(formatPath).join('/')}`.toLowerCase();
    
    // Exact match or starts with (for nested items)
    return currentPath === targetPath || (currentPath.startsWith(targetPath + '/') && pathSegments.length > 0);
  };

  const handleOpenChange = (item, isOpen) => {
    setOpenItems(prev => isOpen ? [...prev, item] : prev.filter(c => c !== item));
  };

  // Sync open state with active category on path change
  useEffect(() => {
    if (!pathname) return;
    const newOpenItems = [];
    
    browse.forEach(cat => {
      const folderName = categoryMap[cat] || cat;
      if (pathname.toLowerCase().includes(`/shoppage/${formatPath(folderName).toLowerCase()}`)) {
        newOpenItems.push(cat);
        const subs = getSubcategories(cat);
        if (subs) {
          subs.forEach(sub => {
            if (typeof sub === 'object' && pathname.toLowerCase().includes(`/${formatPath(sub.label).toLowerCase()}`)) {
              newOpenItems.push(sub.label);
            }
          });
        }
      }
    });
    
    setOpenItems(prev => {
      const unique = Array.from(new Set(newOpenItems));
      return (prev.length === unique.length && prev.every(i => unique.includes(i))) ? prev : unique;
    });
  }, [pathname]);

  const NavItem = ({ label, href, subItems, level = 0, parentPath = [] }) => {
    const currentPath = [...parentPath, label];
    const isOpened = openItems.includes(label);
    const isActive = checkActive(currentPath);
    
    const activeStyles = "text-black bg-yellow-400 font-bold";
    const baseStyles = "flex items-center w-full justify-start py-2.5 px-6 transition-all duration-200 text-left group mb-1";
    const hoverStyles = "hover:text-yellow-600";
    const textStyles = level === 0 ? "text-[14px]" : "text-[13px]";

    const content = (
      <div className={`${baseStyles} ${textStyles} ${isActive ? activeStyles : 'text-gray-500'} ${hoverStyles}`}>
        <span className="flex-1 truncate uppercase">{label}</span>
        {subItems && (
          <ChevronDown className={`w-3 h-3 ml-auto transition-transform duration-300 ${isOpened ? 'rotate-180' : ''}`} />
        )}
      </div>
    );

    if (!subItems || subItems.length === 0) {
      return (
        <Link href={href} className="block">
          {content}
        </Link>
      );
    }

    return (
      <Collapsible open={isOpened} onOpenChange={(open) => handleOpenChange(label, open)}>
        <CollapsibleTrigger className="w-full">
          {content}
        </CollapsibleTrigger>
        <CollapsibleContent className={`pl-4 border-l border-gray-200 ml-2 mt-1 mb-1`}>
          {subItems.map((sub, i) => {
            const subLabel = typeof sub === 'string' ? sub : sub.label;
            const subFolderName = formatPath(subLabel);
            const subHref = `${href}/${subFolderName}`;
            return (
              <NavItem 
                key={i}
                label={subLabel}
                href={subHref}
                subItems={sub.sub}
                level={level + 1}
                parentPath={currentPath}
              />
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <aside
      className={forceMobile ? "fixed top-0 left-0 z-[4000] block md:hidden w-72 bg-white px-0 py-6 h-[100vh] overflow-y-auto overscroll-contain text-[12px] leading-tight" : "w-64 bg-white px-0 py-8 sticky top-[180px] h-fit md:block hidden rounded-xl shadow-sm border border-gray-100"}
      style={forceMobile ? { WebkitOverflowScrolling: 'touch' } : undefined}
    >
      <div className={forceMobile ? "mb-6 px-6" : "mb-10 px-8"}>
        <div className="text-[#333] font-bold text-[12px] tracking-[0.1em] mb-2 uppercase">Filter by price</div>
        <div className="h-[2px] w-8 bg-gray-200 mb-6" />
        <Slider min={0} max={149570} step={1} value={price} onValueChange={setPrice} className="mb-6" />
        <div className="flex flex-col gap-4">
          <button
            className={`bg-[#333] text-white font-bold rounded-full tracking-[0.15em] hover:bg-yellow-400 hover:text-black transition-all duration-300 w-fit ${forceMobile ? 'px-6 py-2 text-[10px]' : 'px-8 py-2.5 text-[10px]'}`}
            onClick={() => {
              try {
                const detail = { min: price[0], max: price[1] };
                window.dispatchEvent(new CustomEvent('shop-price-filter', { detail }));
              } catch {}
            }}
          >
            FILTER
          </button>
          <span className="text-gray-400 text-[12px] font-medium">
            Price: ₹{price[0].toLocaleString()} — ₹{price[1].toLocaleString()}
          </span>
        </div>
      </div>
      
      <div>
        <div className="text-[#333] font-bold text-[12px] tracking-[0.1em] mb-2 px-8 uppercase">Browse</div>
        <div className="h-[2px] w-8 bg-gray-200 mb-6 mx-8" />
        <div className="space-y-1">
          {browse.map((cat) => {
            const folderName = categoryMap[cat] || cat;
            return (
              <NavItem 
                key={cat}
                label={cat}
                href={`/ShopPage/${formatPath(folderName)}`}
                subItems={getSubcategories(cat)}
                parentPath={[]}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}
