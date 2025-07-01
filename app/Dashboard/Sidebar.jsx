"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Link from "next/link";



const sections = [
  { name: "Adhesives", path: "/Dashboard/Adhesives" },
  { name: "Brush", path: "/Dashboard/Brush" },
  { name: "Cements & POP", path: "/Dashboard/Cements" },
  { name: "Cleaning", path: "/Dashboard/Cleaning" },
  { name: "Dry Wall Gypsum Screws", path: "/Dashboard/Dry" },
  {
    name: "Electrical Item",
    subItems: [
      { name: "Adaptors", path: "/Dashboard/Electrical/Adaptors" },
      { name: "Ceiling Roses", path: "/Dashboard/Electrical/CeilingRoses" },
      { name: "Dimmer", path: "/Dashboard/Electrical/Dimmer" },
      { name: "Distribution Boards", path: "/Dashboard/Electrical/DistributionBoards" },
      { name: "Door Bells", path: "/Dashboard/Electrical/DoorBells" },
      { name: "DP-switch", path: "/Dashboard/Electrical/DPswitch" },
      { name: "Earthing Accessories", path: "/Dashboard/Electrical/EarthingAccessories" },
      { name: "ELCBs OR RCCBs", path: "/Dashboard/Electrical/ELCBsRCCBs" },
      { name: "Electrical Fittings", path: "/Dashboard/Electrical/ElectricalFittings", subItems: [] },
      { name: "Fans", path: "/Dashboard/Electrical/Fans", subItems: [] },
      { name: "Flexible Conduit", path: "/Dashboard/Electrical/FlexibleConduit" },
      { name: "Flexible Wires", path: "/Dashboard/Electrical/FlexibleWires" },
      { name: "Fuse Carriers", path: "/Dashboard/Electrical/FuseCarriers" },
      { name: "Holders", path: "/Dashboard/Electrical/Holders" },
      { name: "Indicator", path: "/Dashboard/Electrical/Indicator" },
      { name: "Insulation Tapes", path: "/Dashboard/Electrical/InsulationTapes" },
      { name: "Isolators", path: "/Dashboard/Electrical/Isolators" },
      { name: "Jacks", path: "/Dashboard/Electrical/Jacks" },
      { name: "KIT KAT Fuses", path: "/Dashboard/Electrical/KITKATFuses" },
      { name: "Lights", path: "/Dashboard/Electrical/Lights", subItems: [] },
      { name: "Main Switch", path: "/Dashboard/Electrical/MainSwitch" },
      { name: "MCB", path: "/Dashboard/Electrical/MCB" },
      { name: "Modular/Surface Box", path: "/Dashboard/Electrical/ModularSurfaceBox" },
      { name: "Motor Starters", path: "/Dashboard/Electrical/MotorStarters" },
      { name: "Motors", path: "/Dashboard/Electrical/Motors" },
      { name: "Others", path: "/Dashboard/Electrical/Others" },
      { name: "Pin top", path: "/Dashboard/Electrical/PinTop" },
      { name: "Plug", path: "/Dashboard/Electrical/Plug" },
      { name: "Power Strips", path: "/Dashboard/Electrical/PowerStrips" },
      { name: "PVC Clips", path: "/Dashboard/Electrical/PVCClips" },
      { name: "Regulators", path: "/Dashboard/Electrical/Regulators" },
      { name: "Rotary Switch", path: "/Dashboard/Electrical/RotarySwitch" },
      { name: "Sockets", path: "/Dashboard/Electrical/Sockets" },
      { name: "Switch & Socket", path: "/Dashboard/Electrical/SwitchAndSocket" },
      { name: "Switch Plates", path: "/Dashboard/Electrical/SwitchPlates" },
      { name: "Switches", path: "/Dashboard/Electrical/Switches" },
      { name: "Travel adaptor", path: "/Dashboard/Electrical/TravelAdaptor" },
      { name: "TV outlets", path: "/Dashboard/Electrical/TVOutlets" },
      { name: "Uni Switch Socket Combined Units", path: "/Dashboard/Electrical/UniSwitch" },
      { name: "Water Heater", path: "/Dashboard/Electrical/Water Heater" },
      { name: "Water Heaters", path: "/Dashboard/Electrical/WaterHeaters" },
      { name: "Wires & Cables", path: "/Dashboard/Electrical/WiresAndCables" },
    ],
    path: "/Dashboard/Electrical"
  },
  { name: "Electrical Fitting", path: "/Dashboard/Fitting" },
  { name: "Fiber Sheet", path: "/Dashboard/Fiber" },
  { name: "Hardware", path: "/Dashboard/Hardware" },
  { name: "Home", path: "/Dashboard/Home" },
  { name: "Home Decor", path: "/Dashboard/HomeDecor" },
  { name: "House Hold Ladder", path: "/Dashboard/HouseHold" },
  { name: "Lighting", path: "/Dashboard/Lighting" },
  {
    name: "Locks & accessories",
    subItems: [
      {
        name: "DOOR ACCESSORIES",
        path: "/Dashboard/Locks/DoorAccessories",
        subItems: []
      },
      {
        name: "DOOR CONTROLS",
        path: "/Dashboard/Locks/DoorControls",
        subItems: [
          { name: "Door Handles", path: "/Dashboard/Locks/DoorControls/DoorHandles", subItems: [] },
          { name: "Door Locks", path: "/Dashboard/Locks/DoorControls/DoorLocks", subItems: [] },
          { name: "Folding Brackets", path: "/Dashboard/Locks/DoorControls/FoldingBrackets", subItems: [] },
        ]
      },
      {
        name: "FURNITURE FITTINGS",
        path: "/Dashboard/Locks/FurnitureFittings",
        subItems: [
          { name: "Furniture Locks", path: "/Dashboard/Locks/FurnitureFittings/FurnitureLocks", subItems: [] },
        ]
      },
      {
        name: "GLASS HARDWARE",
        path: "/Dashboard/Locks/GlassHardware",
        subItems: []
      },
      {
        name: "LEVER MORTISE LOCKS",
        path: "/Dashboard/Locks/LeverMortiseLocks",
        subItems: [
          { name: "Mortice Locks", path: "/Dashboard/Locks/LeverMortiseLocks/MorticeLocks", subItems: [] },
          { name: "Mortise Lock Body", path: "/Dashboard/Locks/LeverMortiseLocks/MortiseLockBody", subItems: [] },
        ]
      },
      { name: "Padlocks", path: "/Dashboard/Locks/Padlocks", subItems: [] },
      { name: "Patch Fittings", path: "/Dashboard/Locks/PatchFittings", subItems: [] },
      {
        name: "POPULAR MORTISE SERIES",
        path: "/Dashboard/Locks/PopularMortiseSeries",
        subItems: []
      },
      {
        name: "PREMIUM MORTISE SERIES",
        path: "/Dashboard/Locks/PremiumMortiseSeries",
        subItems: []
      },
      { name: "Rim Locks", path: "/Dashboard/Locks/RimLocks", subItems: [] },
    ],
    path: "/Dashboard/Locks"
  },
  {
    name: "Paint",
    subItems: [
      { name: "Acrylic Emulsion Paint", path: "/Dashboard/Paint/AcrylicEmulsionPaint", subItems: [] },
      { name: "Aspa Paints", path: "/Dashboard/Paint/AspaPaints", subItems: [] },
      { name: "Exterior paints", path: "/Dashboard/Paint/ExteriorPaints", subItems: [] },
      { name: "Floor Paints", path: "/Dashboard/Paint/FloorPaints", subItems: [] },
      { name: "Industrial Coatings", path: "/Dashboard/Paint/IndustrialCoatings", subItems: [] },
      { name: "Interior Paints", path: "/Dashboard/Paint/InteriorPaints", subItems: [] },
      { name: "Painting Tools", path: "/Dashboard/Paint/PaintingTools", subItems: [] },
      { name: "Primer and Wall Putty", path: "/Dashboard/Paint/PrimerAndWallPutty", subItems: [] },
      { name: "Sanitizer", path: "/Dashboard/Paint/Sanitizer", subItems: [] },
      { name: "Spray Paints", path: "/Dashboard/Paint/SprayPaints", subItems: [] },
      { name: "Stainers&Thinners", path: "/Dashboard/Paint/StainersThinners", subItems: [] },
      { name: "Stencils", path: "/Dashboard/Paint/Stencils", subItems: [] },
      { name: "Tile Guard", path: "/Dashboard/Paint/TileGuard", subItems: [] },
      { name: "wall stickers and wallpapers", path: "/Dashboard/Paint/WallStickersWallpapers", subItems: [] },
      { name: "Wood & Metal", path: "/Dashboard/Paint/WoodMetal", subItems: [] },
    ],
    path: "/Dashboard/Paint"
  },
  {
    name: "Pipes & Fittings",
    subItems: [
      { name: "Ashirvad Pipes", path: "/Dashboard/Pipes/AshirvadPipes", subItems: [] },
      { name: "Astral Pipes", path: "/Dashboard/Pipes/AstralPipes", subItems: [] },
      { name: "Finolex Pipes", path: "/Dashboard/Pipes/FinolexPipes", subItems: [] },
    ],
    path: "/Dashboard/Pipes"
  },
  {
    name: "PVC Mats",
    subItems: [
      { name: "Floor Mats", path: "/Dashboard/PvcMats/Floor" },
      { name: "Door Mats", path: "/Dashboard/PvcMats/Door" },
    ],
    path: "/Dashboard/PvcMats"
  },
  {
    name: "Roofer",
    subItems: [
      { name: "Shingles", path: "/Dashboard/Roofer/Shingles" },
      { name: "Metal Roofing", path: "/Dashboard/Roofer/Metal" },
    ],
    path: "/Dashboard/Roofer"
  },
  {
    name: "Sanitary Ware & faucets",
    subItems: [
      { name: "Acrylic Products", path: "/Dashboard/Sanitary/AcrylicProducts", subItems: [] },
      { name: "Bathroom Accessories", path: "/Dashboard/Sanitary/BathroomAccessories", subItems: [] },
      { name: "Bathsense", path: "/Dashboard/Sanitary/Bathsense", subItems: [] },
      { name: "Closets", path: "/Dashboard/Sanitary/Closets", subItems: [] },
      { name: "Coral bath fixtures", path: "/Dashboard/Sanitary/CoralBathFixtures", subItems: [] },
      { name: "Corsa", path: "/Dashboard/Sanitary/Corsa", subItems: [] },
      { name: "Essess", path: "/Dashboard/Sanitary/Essess", subItems: [] },
      { name: "Faucets", path: "/Dashboard/Sanitary/Faucets", subItems: [] },
      { name: "Hardware & Bathroom Accessories", path: "/Dashboard/Sanitary/HardwareBathroomAccessories", subItems: [] },
      { name: "Health Faucet", path: "/Dashboard/Sanitary/HealthFaucet", subItems: [] },
      { name: "Hindware", path: "/Dashboard/Sanitary/Hindware", subItems: [] },
      { name: "Jaquar", path: "/Dashboard/Sanitary/Jaquar", subItems: [] },
      { name: "Kitchen Sinks", path: "/Dashboard/Sanitary/KitchenSinks", subItems: [] },
      { name: "LEMON Bathroom Accessories", path: "/Dashboard/Sanitary/LemonBathroomAccessories", subItems: [] },
      { name: "Leo Bath Fittings", path: "/Dashboard/Sanitary/LeoBathFittings", subItems: [] },
      { name: "Parryware", path: "/Dashboard/Sanitary/Parryware", subItems: [] },
      { name: "Pearl Precious Products", path: "/Dashboard/Sanitary/PearlPreciousProducts", subItems: [] },
      { name: "Showers", path: "/Dashboard/Sanitary/Showers", subItems: [] },
      { name: "Taps", path: "/Dashboard/Sanitary/Taps", subItems: [] },
      { name: "Washbasins", path: "/Dashboard/Sanitary/Washbasins", subItems: [] },
      { name: "Waterman", path: "/Dashboard/Sanitary/Waterman", subItems: [] },
      { name: "WaterTec", path: "/Dashboard/Sanitary/WaterTec", subItems: [] },
    ],
    path: "/Dashboard/Sanitary"
  },
  {
    name: "Tools",
    subItems: [
      { name: "abrasives", path: "/Dashboard/Tools/abrasives", subItems: [] },
      { name: "Allen Keys", path: "/Dashboard/Tools/AllenKeys", subItems: [] },
      { name: "Brush", path: "/Dashboard/Tools/Brush", subItems: [] },
      { name: "Carpenter Pincer", path: "/Dashboard/Tools/CarpenterPincer", subItems: [] },
      { name: "Centre Punches", path: "/Dashboard/Tools/CentrePunches", subItems: [] },
      { name: "Chisels", path: "/Dashboard/Tools/Chisels", subItems: [] },
      { name: "Clamps", path: "/Dashboard/Tools/Clamps", subItems: [] },
      { name: "Crowbar", path: "/Dashboard/Tools/Crowbar", subItems: [] },
      { name: "Cutters", path: "/Dashboard/Tools/Cutters", subItems: [] },
      { name: "files", path: "/Dashboard/Tools/files", subItems: [] },
      { name: "Garden Tools", path: "/Dashboard/Tools/GardenTools", subItems: [] },
      { name: "Gear Pullers", path: "/Dashboard/Tools/GearPullers", subItems: [] },
      { name: "Glass cutter", path: "/Dashboard/Tools/GlassCutter", subItems: [] },
      { name: "glue gun", path: "/Dashboard/Tools/gluegun", subItems: [] },
      { name: "Grease Gun", path: "/Dashboard/Tools/GreaseGun", subItems: [] },
      { name: "Hacksaw Blades", path: "/Dashboard/Tools/HacksawBlades", subItems: [] },
      { name: "Hammer", path: "/Dashboard/Tools/Hammer", subItems: [] },
      { name: "Hammer Drills", path: "/Dashboard/Tools/HammerDrills", subItems: [] },
      { name: "hand tools", path: "/Dashboard/Tools/handtools", subItems: [] },
      { name: "level", path: "/Dashboard/Tools/level", subItems: [] },
      { name: "Lubrications", path: "/Dashboard/Tools/Lubrications", subItems: [] },
      { name: "Measurement Scale", path: "/Dashboard/Tools/MeasurementScale", subItems: [] },
      { name: "Measuring Tape", path: "/Dashboard/Tools/MeasuringTape", subItems: [] },
      { name: "Multimeter", path: "/Dashboard/Tools/Multimeter", subItems: [] },
      { name: "Plier", path: "/Dashboard/Tools/Plier", subItems: [] },
      { name: "Polishing Accessories", path: "/Dashboard/Tools/PolishingAccessories", subItems: [] },
      { name: "power tools", path: "/Dashboard/Tools/powertools", subItems: [] },
      { name: "saw", path: "/Dashboard/Tools/saw", subItems: [] },
      { name: "Screw Driver", path: "/Dashboard/Tools/ScrewDriver", subItems: [] },
      { name: "Silicon Gun", path: "/Dashboard/Tools/SiliconGun", subItems: [] },
      { name: "Socket set", path: "/Dashboard/Tools/Socketset", subItems: [] },
      { name: "Spanners", path: "/Dashboard/Tools/Spanners", subItems: [] },
      { name: "Spare Malets", path: "/Dashboard/Tools/SpareMalets", subItems: [] },
      { name: "Tool Compartments", path: "/Dashboard/Tools/ToolCompartments", subItems: [] },
      { name: "toolkit set", path: "/Dashboard/Tools/toolkitset", subItems: [] },
      { name: "various tool bits", path: "/Dashboard/Tools/varioustoolbits", subItems: [] },
      { name: "wood chisel", path: "/Dashboard/Tools/woodChisel", subItems: [] },
      { name: "wood items", path: "/Dashboard/Tools/woodItems", subItems: [] },
      { name: "Wrench", path: "/Dashboard/Tools/Wrench", subItems: [] },
    ],
    path: "/Dashboard/Tools"
  },
  { name: "Uncategorized", path: "/Dashboard/Uncategorized" },
  {
    name: "WaterProofing",
    subItems: [
      { name: "Bathrooms", path: "/Dashboard/WaterProofing/Bathrooms", subItems: [] },
      { name: "Cracks & Joints", path: "/Dashboard/WaterProofing/CracksJoints", subItems: [] },
      { name: "Interiors", path: "/Dashboard/WaterProofing/Interiors", subItems: [] },
    ],
    path: "/Dashboard/WaterProofing"
  },
];



export default function Sidebar({ onSetting, onLogout, open, onClose }) {
  // Track open state for each collapsible item by name
  const [openSection, setOpenSection] = useState(null);


  const handleToggle = (name) => {
    setOpenSection(openSection === name ? null : name);
  };
  return (
    <aside className="w-64 flex text-black flex-col h-screen">
      <div className="p-4 font-bold text-xl">LOGO</div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <ul className="p-4 space-y-2">

          {sections.map((section) => (
            <div key={section.name} className="mb-2">
              <div className="flex items-center w-full">
                <Link
                  href={section.path}
                  className="flex-1 text-left px-2 py-2 rounded text-sm font-semibold hover:bg-zinc-700 transition group cursor-pointer"
                  onClick={() => handleToggle(section.name)}
                >
                  {section.name}
                </Link>
                {section.subItems && section.subItems.length > 0 && (
                  <button
                    className="ml-2"
                    onClick={(e) => { e.stopPropagation(); handleToggle(section.name); }}
                  >
                    {openSection === section.name ? (
                      <FiChevronUp className="transition-transform" />
                    ) : (
                      <FiChevronDown className="transition-transform" />
                    )}
                  </button>
                )}
              </div>
              {openSection === section.name && section.subItems && (
                <ul className="pl-4">
                  {section.subItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.path}
                        className="block px-2 py-2 rounded text-sm hover:bg-zinc-700 transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t text-black border-gray-700 flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full text-left cursor-pointer"
          onClick={onSetting}
        >
          Setting
        </Button>
        <Button
          variant="destructive"
          className="w-full text-left cursor-pointer"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
} 