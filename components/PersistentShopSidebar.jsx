'use client';

import React, { useState } from 'react';
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
  "Home",
  "HomeDecor",
  "House Hold Ladder",
  "LED Luminaires",
  "Locks & accessories",
  "Mask & Sanitizers",
  "Paints",
  "Pipes & Fittings",
  "Roofer",
  "Sanitary Ware & faucets",
  "Tools",
  "Uncategorized",
  "WaterProofing",
];

const electricalSubcategories = [
  "Adaptors",
  "ceiling Roses", 
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
  "Astral Pipes", 
  "Birla Pipe",
  "Finolex Pipes",
  "Nepul Pipes",
  "Prakash Pipe",
  "Prince Pipe",
  "Supreme Pipe",
  "TSA Pipe",
  "Tata Pipe"
];

const sanitarySubcategories = [
  "Acrylic Products",
  "Bathroom Accessories",
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
        sub: ["Almond", "Arrow", "Bold", "Budget", "Concept", "Deluxe", "Eeco", "Expert", "Florence", "Glass Bowl Faucet", "Idea", "Jazz", "Ket", "Milano", "Nano", "Nexa", "Niagra", "Nice", "Omega", "Passion", "Royal", "Slimline", "Splash", "Square F", "Square S", "Super", "Tri"]
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
      "Trand"
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
        sub: ["Angular Stop Cock", "Bath Spout", "Bib Cock", "Chbm", "Concealed Stop Cock", "Csc Exp Kit", "Deusch Mixer", "Exposed Mixers", "Flush Cock", "Medical Series", "Mixer Faucet", "Pillar Cock", "Pillar Cock Tall", "Pillar Faucet", "Pressmatic", "Recessed", "Single Lever Divertor", "Sink Cock", "Sink Mixer", "Slbm Faucet", "Slbm Faucet Tall", "Wall Mixer"]
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
    label: "abrasives",
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
  "files",
  "Garden Tools",
  "Gear Pullers",
  "Glass cutter",
  "glue gun",
  "Grease Gun",
  "Hacksaw Blades",
  "Hammer",
  "Hammer Drills",
  "hand tools",
  "level",
  "Lubrications",
  "Measurement Scale",
  "Measuring Tape",
  "Multimeter",
  "Plier",
  "Polishing Accessories",
  {
    label: "power tools",
    sub: ["Drill", "Grinders", "Marble Cutter"]
  },
  "saw",
  "Screw Driver",
  "Silicon Gun",
  "Socket Set",
  "Spanners",
  "Spare Mallets",
  "Tool Compartments",
  "toolkit set",
  "various tool bits",
  "wood chisel",
  "wood items",
  "Wrench"
];

const waterproofingSubcategories = [
  "Bathrooms",
  "Cracks & Joints",
  "Interiors"
];

const pvcMatsSubcategories = [
  "Door",
  "Floor"
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

export default function PersistentShopSidebar() {
  const [price, setPrice] = useState([0, 148670]);
  const pathname = usePathname();

  const getSubcategories = (category) => {
    switch (category) {
      case "Electrical Items":
        return electricalSubcategories;                 
      case "Locks & accessories":
        return locksSubcategories;
      case "Paints":
        return paintsSubcategories;
      case "Pipes & Fittings":
        return pipesSubcategories;
      case "Roofer":
        return rooferSubcategories;
      case "Sanitary Ware & faucets":
        return sanitarySubcategories;
      case "Tools":
        return toolsSubcategories;
      case "WaterProofing":
        return waterproofingSubcategories;
      case "PvcMats":
        return pvcMatsSubcategories;
      default:
        return null;
    }
  }; 

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
    "Home": "Home",
    "HomeDecor": "HomeDecor",
    "House Hold Ladder": "Hardware",
    "LED Luminaires": "Electrical",
    "Locks & accessories": "Locks",
    "Mask & Sanitizers": "Cleaning",
    "Paints": "Paint",
    "Pipes & Fittings": "Pipe",
    "Roofer": "Roofer",
    "PvcMats": "PvcMats",
    "Sanitary Ware & faucets": "Sanitary",
    "Tools": "Tools",
    "Uncategorized": "Uncategorized",
    "WaterProofing": "WaterProofing"
  };

  const isActive = (category) => {
    const folderName = categoryMap[category] || category;
    return pathname?.includes(`/ShopPage/${folderName}`);
  };

  const isSubcategoryActive = (category, subcategory) => {
    const folderName = categoryMap[category] || category;
    const subPath = subcategory.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    return pathname?.includes(`/ShopPage/${folderName}/${subPath}`);
  };

  const isNestedSubcategoryActive = (category, subcategory, nestedSubcategory) => {
    const folderName = categoryMap[category] || category;
    const subPath = subcategory.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    const nestedPath = nestedSubcategory.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    return pathname?.includes(`/ShopPage/${folderName}/${subPath}/${nestedPath}`);
  };

  return (
    <aside className="w-full mt-32 lg:w-1/4 bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24 h-fit">
      <div className="mb-8">
        <div className="text-gray-800 font-bold text-lg mb-2">FILTER BY PRICE</div>
        <div className="h-0.5 w-8 bg-blue-500 mb-4" />
        <Slider
          min={0}
          max={148670}
          step={1}
          value={price}
          onValueChange={setPrice}
          className="mb-4"
        />
        <div className="flex items-center gap-3">
          <button
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full text-xs tracking-widest hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            FILTER
          </button>
          <span className="text-gray-600 text-sm">
            Price: <span className="font-bold text-blue-600">₹{price[0].toLocaleString()}</span> — <span className="font-bold text-blue-600">₹{price[1].toLocaleString()}</span>
          </span>
        </div>
      </div>
      
      <div>
        <div className="text-gray-800 font-bold text-lg mb-2">BROWSE</div>
        <div className="h-0.5 w-8 bg-blue-500 mb-4" />
        <div className="space-y-0">
          {browse.map((cat, index) => {
            const subcategories = getSubcategories(cat);
            const folderName = categoryMap[cat] || cat;

            return (
              <div key={cat}>
                {subcategories ? (
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center w-full justify-between py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium rounded-md px-2 group">
                      <span className={`group-hover:text-blue-600 ${isActive(cat) ? 'text-blue-600 bg-blue-50' : ''}`}>{cat}</span>
                      <ChevronDown className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      {subcategories.map((sub) => {
                        if (typeof sub === "string") {
                          return (
                            <Link
                              key={sub}
                              href={`/ShopPage/${folderName}/${sub.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`}
                              className={`block py-2 text-xs transition-all duration-200 rounded-md px-2 ml-2 ${
                                isSubcategoryActive(cat, sub)
                                  ? 'text-blue-600 bg-blue-50 font-semibold'
                                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:underline'
                              }`}
                            >
                              {sub}
                            </Link>
                          );
                        } else if (sub && typeof sub === "object" && sub.label && sub.sub) {
                          return (
                            <Collapsible key={sub.label}>
                              <CollapsibleTrigger className={`flex items-center w-full justify-between py-2 text-xs font-semibold transition-colors rounded-md px-2 ml-2 group ${
                                isSubcategoryActive(cat, sub.label)
                                  ? 'text-blue-600 bg-blue-50'
                                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                              }`}>
                                <span>{sub.label}</span>
                                <ChevronDown className="w-3 h-3 group-hover:text-blue-600 transition-colors" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-4">
                                {sub.sub.map((item) => {
                                  if (typeof item === "string") {
                                    return (
                                      <Link
                                        key={item}
                                        href={`/ShopPage/${folderName}/${sub.label.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}/${item.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`}
                                        className={`block py-1 text-xs transition-all duration-200 rounded-md px-2 ml-4 ${
                                          isSubcategoryActive(cat, `${sub.label}/${item}`)
                                            ? 'text-blue-600 bg-blue-50 font-semibold'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:underline'
                                        }`}
                                      >
                                        {item}
                                      </Link>
                                    );
                                  } else if (item && typeof item === "object" && item.label && item.sub) {
                                    return (
                                      <Collapsible key={item.label}>
                                        <CollapsibleTrigger className={`flex items-center w-full justify-between py-1 text-xs font-semibold transition-colors rounded-md px-2 ml-4 group ${
                                          isSubcategoryActive(cat, `${sub.label}/${item.label}`)
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`}>
                                          <span>{item.label}</span>
                                          <ChevronDown className="w-3 h-3 group-hover:text-blue-600 transition-colors" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="pl-4">
                                          {item.sub.map((subItem) => (
                                            <Link
                                              key={subItem}
                                              href={`/ShopPage/${folderName}/${sub.label.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}/${item.label.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}/${subItem.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`}
                                              className={`block py-1 text-xs transition-all duration-200 rounded-md px-2 ml-6 ${
                                                isNestedSubcategoryActive(cat, `${sub.label}/${item.label}`, subItem)
                                                  ? 'text-blue-600 bg-blue-50 font-semibold'
                                                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:underline'
                                              }`}
                                            >
                                              {subItem}
                                            </Link>
                                          ))}
                                        </CollapsibleContent>
                                      </Collapsible>
                                    );
                                  }
                                  return null;
                                })}
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        }
                        return null;
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link
                    href={`/ShopPage/${folderName}`}
                    className={`block py-3 text-sm transition-all duration-200 font-medium rounded-md px-2 group ${
                      isActive(cat) 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="group-hover:text-blue-600">{cat}</span>
                  </Link>
                )}
                {index < browse.length - 1 && (
                  <div className="h-px bg-gray-200 mx-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
