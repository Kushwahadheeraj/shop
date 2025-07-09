"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Link from "next/link";


const sections = [
  {name: "Dashboard",path: "/Dashboard"},
  {name: "Product Add",
    subItems:[
{ name: "Adhesives", path: "/Dashboard/ProductAdd/Adhesives" },
  { name: "Brush", path: "/Dashboard/ProductAdd/Brush" },
  { name: "Cements & POP", path: "/Dashboard/ProductAdd/Cements" },
  { name: "Cleaning", path: "/Dashboard/ProductAdd/Cleaning" },
  { name: "Dry Wall Gypsum Screws", path: "/Dashboard/ProductAdd/Dry" },
  {
    name: "Electrical Item",
    subItemsName: [
      { name: "Adaptors", path: "/Dashboard/ProductAdd/Electrical/Adaptors" },
      { name: "Ceiling Roses", path: "/Dashboard/ProductAdd/Electrical/CeilingRoses" },
      { name: "Dimmer", path: "/Dashboard/ProductAdd/Electrical/Dimmer" },
      { name: "Distribution Boards", path: "/Dashboard/ProductAdd/Electrical/DistributionBoards" },
      { name: "Door Bells", path: "/Dashboard/ProductAdd/Electrical/DoorBells" },
      { name: "DP-switch", path: "/Dashboard/ProductAdd/Electrical/DPswitch" },
      { name: "Earthing Accessories", path: "/Dashboard/ProductAdd/Electrical/EarthingAccessories" },
      { name: "ELCBs OR RCCBs", path: "/Dashboard/ProductAdd/Electrical/ELCBsRCCBs" },
      { name: "Electrical Fittings", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings", subItemsNameComponent: [
         { name: "Accessories", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings/Accessories" },
            { name: "Circular Deep Box", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings/CircularDeepBox" },
            { name: "Circular surface box", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings/CircularSurfaceBox" },
            { name: "Rigid type", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings/RigidType" },
      ] },
      { name: "Fans", path: "/Dashboard/ProductAdd/Electrical/Fans", subItemsNameComponent: [
        { name: "Cabin Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/CabinFans" },
          { name: "Ceiling Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/CeilingFans" },
          { name: "Pedestal Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/PedestalFans" },
          { name: "Table Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/TableFans" },
          { name: "Ventilation/Exhaust Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/VentilationExhaustFans" },
          { name: "Wall Mounting Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/WallMountingFans" },
      ] },
      { name: "Flexible Conduit", path: "/Dashboard/ProductAdd/Electrical/FlexibleConduit" },
      { name: "Flexible Wires", path: "/Dashboard/ProductAdd/Electrical/FlexibleWires" },
      { name: "Fuse Carriers", path: "/Dashboard/ProductAdd/Electrical/FuseCarriers" },
      { name: "Holders", path: "/Dashboard/ProductAdd/Electrical/Holders" },
      { name: "Indicator", path: "/Dashboard/ProductAdd/Electrical/Indicator" },
      { name: "Insulation Tapes", path: "/Dashboard/ProductAdd/Electrical/InsulationTapes" },
      { name: "Isolators", path: "/Dashboard/ProductAdd/Electrical/Isolators" },
      { name: "Jacks", path: "/Dashboard/ProductAdd/Electrical/Jacks" },
      { name: "KIT KAT Fuses", path: "/Dashboard/ProductAdd/Electrical/KITKATFuses" },
      { name: "Lights", path: "/Dashboard/ProductAdd/Electrical/Lights", subItemsNameComponent: [
                   { name: "Ceiling light", path: "/Dashboard/ProductAdd/Electrical/Lights/CeilingLight" },
            { name: "CFL", path: "/Dashboard/ProductAdd/Electrical/Lights/CFL" },
            { name: "Desklight", path: "/Dashboard/ProductAdd/Electrical/Lights/Desklight" },
            { name: "Focus Light", path: "/Dashboard/ProductAdd/Electrical/Lights/FocusLight" },
            { name: "Garden Light", path: "/Dashboard/ProductAdd/Electrical/Lights/GardenLight" },
            { name: "Gate Light", path: "/Dashboard/ProductAdd/Electrical/Lights/GateLight" },
            { name: "GLS", path: "/Dashboard/ProductAdd/Electrical/Lights/GLS" },
            { name: "Home", path: "/Dashboard/ProductAdd/Electrical/Lights/Home" },
            { name: "Lamps", path: "/Dashboard/ProductAdd/Electrical/Lights/Lamps" },
            { name: "LED Batten", path: "/Dashboard/ProductAdd/Electrical/Lights/LEDBatten" },
            { name: "LED Bulbs", path: "/Dashboard/ProductAdd/Electrical/Lights/LEDBulbs" },
            { name: "Led DownLighters/Spot Light", path: "/Dashboard/ProductAdd/Electrical/Lights/LedDownLightersSpotLight" },
            { name: "LED Luminaires", path: "/Dashboard/ProductAdd/Electrical/Lights/LEDLuminaires" },
            { name: "LED Panel Light", path: "/Dashboard/ProductAdd/Electrical/Lights/LEDPanelLight" },
            { name: "LED Spotlight", path: "/Dashboard/ProductAdd/Electrical/Lights/LEDSpotlight" },
            { name: "LED Street Light", path: "/Dashboard/ProductAdd/Electrical/Lights/LEDStreetLight" },
            { name: "LED Strips", path: "/Dashboard/ProductAdd/Electrical/Lights/LEDStrips" },
            { name: "Led Surface Light", path: "/Dashboard/ProductAdd/Electrical/Lights/LedSurfaceLight" },
            { name: "Light Electronics", path: "/Dashboard/ProductAdd/Electrical/Lights/LightElectronics" },
            { name: "Mirror Light", path: "/Dashboard/ProductAdd/Electrical/Lights/MirrorLight" },
            { name: "Reflectors", path: "/Dashboard/ProductAdd/Electrical/Lights/Reflectors" },
            { name: "Standard Incandescent", path: "/Dashboard/ProductAdd/Electrical/Lights/StandardIncandescent" },
            { name: "T Bulb", path: "/Dashboard/ProductAdd/Electrical/Lights/TBulb" },
            { name: "Tube Light", path: "/Dashboard/ProductAdd/Electrical/Lights/TubeLight" },
            { name: "Under Water Lights", path: "/Dashboard/ProductAdd/Electrical/Lights/UnderWaterLights" },
            { name: "Wall Light", path: "/Dashboard/ProductAdd/Electrical/Lights/WallLight" },
      ] },
      { name: "Main Switch", path: "/Dashboard/ProductAdd/Electrical/MainSwitch" },
      { name: "MCB", path: "/Dashboard/ProductAdd/Electrical/MCB" },
      { name: "Modular/Surface Box", path: "/Dashboard/ProductAdd/Electrical/ModularSurfaceBox" },
      { name: "Motor Starters", path: "/Dashboard/ProductAdd/Electrical/MotorStarters" },
      { name: "Motors", path: "/Dashboard/ProductAdd/Electrical/Motors" },
      { name: "Others", path: "/Dashboard/ProductAdd/Electrical/Others" },
      { name: "Pin top", path: "/Dashboard/ProductAdd/Electrical/PinTop" },
      { name: "Plug", path: "/Dashboard/ProductAdd/Electrical/Plug" },
      { name: "Power Strips", path: "/Dashboard/ProductAdd/Electrical/PowerStrips" },
      { name: "PVC Clips", path: "/Dashboard/ProductAdd/Electrical/PVCClips" },
      { name: "Regulators", path: "/Dashboard/ProductAdd/Electrical/Regulators" },
      { name: "Rotary Switch", path: "/Dashboard/ProductAdd/Electrical/RotarySwitch" },
      { name: "Sockets", path: "/Dashboard/ProductAdd/Electrical/Sockets" },
      { name: "Switch & Socket", path: "/Dashboard/ProductAdd/Electrical/SwitchAndSocket" },
      { name: "Switch Plates", path: "/Dashboard/ProductAdd/Electrical/SwitchPlates" },
      { name: "Switches", path: "/Dashboard/ProductAdd/Electrical/Switches" },
      { name: "Travel adaptor", path: "/Dashboard/ProductAdd/Electrical/TravelAdaptor" },
      { name: "TV outlets", path: "/Dashboard/ProductAdd/Electrical/TVOutlets" },
      { name: "Uni Switch Socket Combined Units", path: "/Dashboard/ProductAdd/Electrical/UniSwitch" },
      { name: "Water Heater", path: "/Dashboard/ProductAdd/Electrical/Water Heater" },
      { name: "Water Heaters", path: "/Dashboard/ProductAdd/Electrical/WaterHeaters" },
      { name: "Wires & Cables", path: "/Dashboard/ProductAdd/Electrical/WiresAndCables" },

    ],
  },
  { name: "Electrical Fitting", path: "/Dashboard/ProductAdd/Fitting" },
  { name: "Fiber Sheet", path: "/Dashboard/ProductAdd/Fiber" },
  { name: "Hardware", path: "/Dashboard/ProductAdd/Hardware" },
  { name: "Home", path: "/Dashboard/ProductAdd/Home" },
  { name: "Home Decor", path: "/Dashboard/ProductAdd/HomeDecor" },
  { name: "House Hold Ladder", path: "/Dashboard/ProductAdd/HouseHold" },
  { name: "Lighting", path: "/Dashboard/ProductAdd/Lighting" },
  {
    name: "Locks & accessories",
    subItemsName: [
      {
        name: "DOOR ACCESSORIES",
        subItemsNameComponent: []
      },
      {
        name: "DOOR CONTROLS",
        subItemsNameComponent: [
          { name: "Door Handles", path: "/Dashboard/ProductAdd/Locks/DoorControls/DoorHandles", subItemsNameComponent: [] },
          { name: "Door Locks", path: "/Dashboard/ProductAdd/Locks/DoorControls/DoorLocks", subItemsNameComponent: [] },
          { name: "Folding Brackets", path: "/Dashboard/ProductAdd/Locks/DoorControls/FoldingBrackets", subItemsNameComponent: [] },
        ]
      },
      {
        name: "FURNITURE FITTINGS",
        subItemsNameComponent: [
          { name: "Furniture Locks", path: "/Dashboard/ProductAdd/Locks/FurnitureFittings/FurnitureLocks", subItemsNameComponent: [] },
        ]
      },
      {
        name: "GLASS HARDWARE",
        subItemsNameComponent: []
      },
      {
        name: "LEVER MORTISE LOCKS",
        subItemsNameComponent: [
          { name: "Mortice Locks", path: "/Dashboard/ProductAdd/Locks/LeverMortiseLocks/MorticeLocks", subItemsNameComponent: [] },
          { name: "Mortise Lock Body", path: "/Dashboard/ProductAdd/Locks/LeverMortiseLocks/MortiseLockBody", subItemsNameComponent: [] },
        ]
      },
      { name: "Padlocks", path: "/Dashboard/ProductAdd/Locks/Padlocks", subItemsNameComponent: [] },
      { name: "Patch Fittings", path: "/Dashboard/ProductAdd/Locks/PatchFittings", subItemsNameComponent: [] },
      {
        name: "POPULAR MORTISE SERIES",
        subItemsNameComponent: []
      },
      {
        name: "PREMIUM MORTISE SERIES",
        subItemsNameComponent: []
      },
      { name: "Rim Locks", path: "/Dashboard/ProductAdd/Locks/RimLocks", subItemsNameComponent: [] },
    ],
  },
  {
    name: "Paint",
    subItemsName: [
      { name: "Acrylic Emulsion Paint", path: "/Dashboard/ProductAdd/Paint/AcrylicEmulsionPaint", subItemsNameComponent: [] },
      { name: "Aspa Paints", path: "/Dashboard/ProductAdd/Paint/AspaPaints", subItemsNameComponent: [] },
      { name: "Exterior paints", path: "/Dashboard/ProductAdd/Paint/ExteriorPaints", subItemsNameComponent: [] },
      { name: "Floor Paints", path: "/Dashboard/ProductAdd/Paint/FloorPaints", subItemsNameComponent: [] },
      { name: "Industrial Coatings", path: "/Dashboard/ProductAdd/Paint/IndustrialCoatings", subItemsNameComponent: [] },
      { name: "Interior Paints", path: "/Dashboard/ProductAdd/Paint/InteriorPaints", subItemsNameComponent: [] },
      { name: "Painting Tools", path: "/Dashboard/ProductAdd/Paint/PaintingTools", subItemsNameComponent: [] },
      { name: "Primer and Wall Putty", path: "/Dashboard/ProductAdd/Paint/PrimerAndWallPutty", subItemsNameComponent: [] },
      { name: "Sanitizer", path: "/Dashboard/ProductAdd/Paint/Sanitizer", subItemsNameComponent: [] },
      { name: "Spray Paints", path: "/Dashboard/ProductAdd/Paint/SprayPaints", subItemsNameComponent: [] },
      { name: "Stainers&Thinners", path: "/Dashboard/ProductAdd/Paint/StainersThinners", subItemsNameComponent: [] },
      { name: "Stencils", path: "/Dashboard/ProductAdd/Paint/Stencils", subItemsNameComponent: [] },
      { name: "Tile Guard", path: "/Dashboard/ProductAdd/Paint/TileGuard", subItemsNameComponent: [] },
      { name: "wall stickers and wallpapers", path: "/Dashboard/ProductAdd/Paint/WallStickersWallpapers", subItemsNameComponent: [] },
      { name: "Wood & Metal", path: "/Dashboard/ProductAdd/Paint/WoodMetal", subItemsNameComponent: [] },
    ],
  },
  {
    name: "Pipes & Fittings",
subItemsName: [
      { name: "Ashirvad Pipes", path: "/Dashboard/ProductAdd/Pipes/AshirvadPipes", subItemsNameComponent: [] },
      { name: "Astral Pipes", path: "/Dashboard/ProductAdd/Pipes/AstralPipes", subItemsNameComponent: [] },
      { name: "Finolex Pipes", path: "/Dashboard/ProductAdd/Pipes/FinolexPipes", subItemsNameComponent: [] },
    ],
  },
  {
    name: "PVC Mats",
    subItemsName: [
      { name: "Floor Mats", path: "/Dashboard/ProductAdd/PvcMats/Floor" },
      { name: "Door Mats", path: "/Dashboard/ProductAdd/PvcMats/Door" },
    ],
  },
  {
    name: "Roofer",
    subItemsName: [
      { name: "Shingles", path: "/Dashboard/ProductAdd/Roofer/Shingles" },
      { name: "Metal Roofing", path: "/Dashboard/ProductAdd/Roofer/Metal" },
    ],
  },
  {
    name: "Sanitary Ware & faucets",
    subItemsName: [
      { name: "Acrylic Products", path: "/Dashboard/ProductAdd/Sanitary/AcrylicProducts", subItemsNameComponent: [] },
      { name: "Bathroom Accessories", path: "/Dashboard/ProductAdd/Sanitary/BathroomAccessories", subItemsNameComponent: [] },
      { name: "Bathsense", path: "/Dashboard/ProductAdd/Sanitary/Bathsense", subItemsNameComponent: [] },
      { name: "Closets", path: "/Dashboard/ProductAdd/Sanitary/Closets", subItemsNameComponent: [] },
      { name: "Coral bath fixtures", path: "/Dashboard/ProductAdd/Sanitary/CoralBathFixtures", subItemsNameComponent: [] },
      { name: "Corsa", path: "/Dashboard/ProductAdd/Sanitary/Corsa", subItemsNameComponent: [] },
      { name: "Essess", path: "/Dashboard/ProductAdd/Sanitary/Essess", subItemsNameComponent: [] },
      { name: "Faucets", path: "/Dashboard/ProductAdd/Sanitary/Faucets", subItemsNameComponent: [] },
      { name: "Hardware & Bathroom Accessories", path: "/Dashboard/ProductAdd/Sanitary/HardwareBathroomAccessories", subItemsNameComponent: [] },
      { name: "Health Faucet", path: "/Dashboard/ProductAdd/Sanitary/HealthFaucet", subItemsNameComponent: [] },
      { name: "Hindware", path: "/Dashboard/ProductAdd/Sanitary/Hindware", subItemsNameComponent: [] },
      { name: "Jaquar", path: "/Dashboard/ProductAdd/Sanitary/Jaquar", subItemsNameComponent: [] },
      { name: "Kitchen Sinks", path: "/Dashboard/ProductAdd/Sanitary/KitchenSinks", subItemsNameComponent: [] },
      { name: "LEMON Bathroom Accessories", path: "/Dashboard/ProductAdd/Sanitary/LemonBathroomAccessories", subItemsNameComponent: [] },
      { name: "Leo Bath Fittings", path: "/Dashboard/ProductAdd/Sanitary/LeoBathFittings", subItemsNameComponent: [] },
      { name: "Parryware", path: "/Dashboard/ProductAdd/Sanitary/Parryware", subItemsNameComponent: [] },
      { name: "Pearl Precious Products", path: "/Dashboard/ProductAdd/Sanitary/PearlPreciousProducts", subItemsNameComponent: [] },
      { name: "Showers", path: "/Dashboard/ProductAdd/Sanitary/Showers", subItemsNameComponent: [] },
      { name: "Taps", path: "/Dashboard/ProductAdd/Sanitary/Taps", subItemsNameComponent: [] },
      { name: "Washbasins", path: "/Dashboard/ProductAdd/Sanitary/Washbasins", subItemsNameComponent: [] },
      { name: "Waterman", path: "/Dashboard/ProductAdd/Sanitary/Waterman", subItemsNameComponent: [] },
      { name: "WaterTec", path: "/Dashboard/ProductAdd/Sanitary/WaterTec", subItemsNameComponent: [] },
    ],
  },
  {
    name: "Tools",
    subItemsName: [
      { name: "abrasives", path: "/Dashboard/ProductAdd/Tools/abrasives", subItemsNameComponent: [] },
      { name: "Allen Keys", path: "/Dashboard/ProductAdd/Tools/AllenKeys", subItemsNameComponent: [] },
      { name: "Brush", path: "/Dashboard/ProductAdd/Tools/Brush", subItemsNameComponent: [] },
      { name: "Carpenter Pincer", path: "/Dashboard/ProductAdd/Tools/CarpenterPincer", subItemsNameComponent: [] },
      { name: "Centre Punches", path: "/Dashboard/ProductAdd/Tools/CentrePunches", subItemsNameComponent: [] },
      { name: "Chisels", path: "/Dashboard/ProductAdd/Tools/Chisels", subItemsNameComponent: [] },
      { name: "Clamps", path: "/Dashboard/ProductAdd/Tools/Clamps", subItemsNameComponent: [] },
      { name: "Crowbar", path: "/Dashboard/ProductAdd/Tools/Crowbar", subItemsNameComponent: [] },
      { name: "Cutters", path: "/Dashboard/ProductAdd/Tools/Cutters", subItemsNameComponent: [] },
      { name: "files", path: "/Dashboard/ProductAdd/Tools/files", subItemsNameComponent: [] },
      { name: "Garden Tools", path: "/Dashboard/ProductAdd/Tools/GardenTools", subItemsNameComponent: [] },
      { name: "Gear Pullers", path: "/Dashboard/ProductAdd/Tools/GearPullers", subItemsNameComponent: [] },
      { name: "Glass cutter", path: "/Dashboard/ProductAdd/Tools/GlassCutter", subItemsNameComponent: [] },
      { name: "glue gun", path: "/Dashboard/ProductAdd/Tools/gluegun", subItemsNameComponent: [] },
      { name: "Grease Gun", path: "/Dashboard/ProductAdd/Tools/GreaseGun", subItemsNameComponent: [] },
      { name: "Hacksaw Blades", path: "/Dashboard/ProductAdd/Tools/HacksawBlades", subItemsNameComponent: [] },
      { name: "Hammer", path: "/Dashboard/ProductAdd/Tools/Hammer", subItemsNameComponent: [] },
      { name: "Hammer Drills", path: "/Dashboard/ProductAdd/Tools/HammerDrills", subItemsNameComponent: [] },
      { name: "hand tools", path: "/Dashboard/ProductAdd/Tools/handtools", subItemsNameComponent: [] },
      { name: "level", path: "/Dashboard/ProductAdd/Tools/level", subItemsNameComponent: [] },
      { name: "Lubrications", path: "/Dashboard/ProductAdd/Tools/Lubrications", subItemsNameComponent: [] },
      { name: "Measurement Scale", path: "/Dashboard/ProductAdd/Tools/MeasurementScale", subItemsNameComponent: [] },
      { name: "Measuring Tape", path: "/Dashboard/ProductAdd/Tools/MeasuringTape", subItemsNameComponent: [] },
      { name: "Multimeter", path: "/Dashboard/ProductAdd/Tools/Multimeter", subItemsNameComponent: [] },
      { name: "Plier", path: "/Dashboard/ProductAdd/Tools/Plier", subItemsNameComponent: [] },
      { name: "Polishing Accessories", path: "/Dashboard/ProductAdd/Tools/PolishingAccessories", subItemsNameComponent: [] },
      { name: "power tools", path: "/Dashboard/ProductAdd/Tools/powertools", subItemsNameComponent: [] },
      { name: "saw", path: "/Dashboard/ProductAdd/Tools/saw", subItemsNameComponent: [] },
      { name: "Screw Driver", path: "/Dashboard/ProductAdd/Tools/ScrewDriver", subItemsNameComponent: [] },
      { name: "Silicon Gun", path: "/Dashboard/ProductAdd/Tools/SiliconGun", subItemsNameComponent: [] },
      { name: "Socket set", path: "/Dashboard/ProductAdd/Tools/Socketset", subItemsNameComponent: [] },
      { name: "Spanners", path: "/Dashboard/ProductAdd/Tools/Spanners", subItemsNameComponent: [] },
      { name: "Spare Malets", path: "/Dashboard/ProductAdd/Tools/SpareMalets", subItemsNameComponent: [] },
      { name: "Tool Compartments", path: "/Dashboard/ProductAdd/Tools/ToolCompartments", subItemsNameComponent: [] },
      { name: "toolkit set", path: "/Dashboard/ProductAdd/Tools/toolkitset", subItemsNameComponent: [] },
      { name: "various tool bits", path: "/Dashboard/ProductAdd/Tools/varioustoolbits", subItemsNameComponent: [] },
      { name: "wood chisel", path: "/Dashboard/ProductAdd/Tools/woodChisel", subItemsNameComponent: [] },
      { name: "wood items", path: "/Dashboard/ProductAdd/Tools/woodItems", subItemsNameComponent: [] },
      { name: "Wrench", path: "/Dashboard/ProductAdd/Tools/Wrench", subItemsNameComponent: [] },
    ],
  },
  { name: "Uncategorized", path: "/Dashboard/ProductAdd/Uncategorized" },
  {
    name: "WaterProofing",
    subItemsName: [
      { name: "Bathrooms", path: "/Dashboard/ProductAdd/WaterProofing/Bathrooms", subItemsNameComponent: [] },
      { name: "Cracks & Joints", path: "/Dashboard/ProductAdd/WaterProofing/CracksJoints", subItemsNameComponent: [] },
      { name: "Interiors", path: "/Dashboard/ProductAdd/WaterProofing/Interiors", subItemsNameComponent: [] },
    ],
  },
    ]},  
  {name: "Product List",subItems:[
    { name: "Adhesives", path: "/Dashboard/ProductList/Adhesives" },
      { name: "Brush", path: "/Dashboard/ProductList/Brush" },
      { name: "Cements & POP", path: "/Dashboard/ProductList/Cements" },
      { name: "Cleaning", path: "/Dashboard/ProductList/Cleaning" },
      { name: "Dry Wall Gypsum Screws", path: "/Dashboard/ProductList/Dry" },
      {
        name: "Electrical Item",
        subItemsName: [
          { name: "Adaptors", path: "/Dashboard/ProductList/Electrical/Adaptors" },
          { name: "Ceiling Roses", path: "/Dashboard/ProductList/Electrical/CeilingRoses" },
          { name: "Dimmer", path: "/Dashboard/ProductList/Electrical/Dimmer" },
          { name: "Distribution Boards", path: "/Dashboard/ProductList/Electrical/DistributionBoards" },
          { name: "Door Bells", path: "/Dashboard/ProductList/Electrical/DoorBells" },
          { name: "DP-switch", path: "/Dashboard/ProductList/Electrical/DPswitch" },
          { name: "Earthing Accessories", path: "/Dashboard/ProductList/Electrical/EarthingAccessories" },
          { name: "ELCBs OR RCCBs", path: "/Dashboard/ProductList/Electrical/ELCBsRCCBs" },
          { name: "Electrical Fittings", path: "/Dashboard/ProductList/Electrical/ElectricalFittings", subItemsNameComponent: [
            { name: "Accessories", path: "/Dashboard/ProductList/Electrical/ElectricalFittings/Accessories" },
            { name: "Circular Deep Box", path: "/Dashboard/ProductList/Electrical/ElectricalFittings/CircularDeepBox" },
            { name: "Circular surface box", path: "/Dashboard/ProductList/Electrical/ElectricalFittings/CircularSurfaceBox" },
            { name: "Rigid type", path: "/Dashboard/ProductList/Electrical/ElectricalFittings/RigidType" },
          ] },
          { name: "Fans", path: "/Dashboard/ProductList/Electrical/Fans", subItemsNameComponent: [
          { name: "Cabin Fans", path: "/Dashboard/ProductList/Electrical/Fans/CabinFans" },
          { name: "Ceiling Fans", path: "/Dashboard/ProductList/Electrical/Fans/CeilingFans" },
          { name: "Pedestal Fans", path: "/Dashboard/ProductList/Electrical/Fans/PedestalFans" },
          { name: "Table Fans", path: "/Dashboard/ProductList/Electrical/Fans/TableFans" },
          { name: "Ventilation/Exhaust Fans", path: "/Dashboard/ProductList/Electrical/Fans/VentilationExhaustFans" },
          { name: "Wall Mounting Fans", path: "/Dashboard/ProductList/Electrical/Fans/WallMountingFans" },
         ] },
          { name: "Flexible Conduit", path: "/Dashboard/ProductList/Electrical/FlexibleConduit" },
          { name: "Flexible Wires", path: "/Dashboard/ProductList/Electrical/FlexibleWires" },
          { name: "Fuse Carriers", path: "/Dashboard/ProductList/Electrical/FuseCarriers" },
          { name: "Holders", path: "/Dashboard/ProductList/Electrical/Holders" },
          { name: "Indicator", path: "/Dashboard/ProductList/Electrical/Indicator" },
          { name: "Insulation Tapes", path: "/Dashboard/ProductList/Electrical/InsulationTapes" },
          { name: "Isolators", path: "/Dashboard/ProductList/Electrical/Isolators" },
          { name: "Jacks", path: "/Dashboard/ProductList/Electrical/Jacks" },
          { name: "KIT KAT Fuses", path: "/Dashboard/ProductList/Electrical/KITKATFuses" },
          { name: "Lights", path: "/Dashboard/ProductList/Electrical/Lights", subItemsNameComponent: [
            { name: "Ceiling light", path: "/Dashboard/ProductList/Electrical/Lights/CeilingLight" },
            { name: "CFL", path: "/Dashboard/ProductList/Electrical/Lights/CFL" },
            { name: "Desklight", path: "/Dashboard/ProductList/Electrical/Lights/Desklight" },
            { name: "Focus Light", path: "/Dashboard/ProductList/Electrical/Lights/FocusLight" },
            { name: "Garden Light", path: "/Dashboard/ProductList/Electrical/Lights/GardenLight" },
            { name: "Gate Light", path: "/Dashboard/ProductList/Electrical/Lights/GateLight" },
            { name: "GLS", path: "/Dashboard/ProductList/Electrical/Lights/GLS" },
            { name: "Home", path: "/Dashboard/ProductList/Electrical/Lights/Home" },
            { name: "Lamps", path: "/Dashboard/ProductList/Electrical/Lights/Lamps" },
            { name: "LED Batten", path: "/Dashboard/ProductList/Electrical/Lights/LEDBatten" },
            { name: "LED Bulbs", path: "/Dashboard/ProductList/Electrical/Lights/LEDBulbs" },
            { name: "Led DownLighters/Spot Light", path: "/Dashboard/ProductList/Electrical/Lights/LedDownLightersSpotLight" },
            { name: "LED Luminaires", path: "/Dashboard/ProductList/Electrical/Lights/LEDLuminaires" },
            { name: "LED Panel Light", path: "/Dashboard/ProductList/Electrical/Lights/LEDPanelLight" },
            { name: "LED Spotlight", path: "/Dashboard/ProductList/Electrical/Lights/LEDSpotlight" },
            { name: "LED Street Light", path: "/Dashboard/ProductList/Electrical/Lights/LEDStreetLight" },
            { name: "LED Strips", path: "/Dashboard/ProductList/Electrical/Lights/LEDStrips" },
            { name: "Led Surface Light", path: "/Dashboard/ProductList/Electrical/Lights/LedSurfaceLight" },
            { name: "Light Electronics", path: "/Dashboard/ProductList/Electrical/Lights/LightElectronics" },
            { name: "Mirror Light", path: "/Dashboard/ProductList/Electrical/Lights/MirrorLight" },
            { name: "Reflectors", path: "/Dashboard/ProductList/Electrical/Lights/Reflectors" },
            { name: "Standard Incandescent", path: "/Dashboard/ProductList/Electrical/Lights/StandardIncandescent" },
            { name: "T Bulb", path: "/Dashboard/ProductList/Electrical/Lights/TBulb" },
            { name: "Tube Light", path: "/Dashboard/ProductList/Electrical/Lights/TubeLight" },
            { name: "Under Water Lights", path: "/Dashboard/ProductList/Electrical/Lights/UnderWaterLights" },
            { name: "Wall Light", path: "/Dashboard/ProductList/Electrical/Lights/WallLight" },
          ] },
          { name: "Main Switch", path: "/Dashboard/ProductList/Electrical/MainSwitch" },
          { name: "MCB", path: "/Dashboard/ProductList/Electrical/MCB" },
          { name: "Modular/Surface Box", path: "/Dashboard/ProductList/Electrical/ModularSurfaceBox" },
          { name: "Motor Starters", path: "/Dashboard/ProductList/Electrical/MotorStarters" },
          { name: "Motors", path: "/Dashboard/ProductList/Electrical/Motors" },
          { name: "Others", path: "/Dashboard/ProductList/Electrical/Others" },
          { name: "Pin top", path: "/Dashboard/ProductList/Electrical/PinTop" },
          { name: "Plug", path: "/Dashboard/ProductList/Electrical/Plug" },
          { name: "Power Strips", path: "/Dashboard/ProductList/Electrical/PowerStrips" },
          { name: "PVC Clips", path: "/Dashboard/ProductList/Electrical/PVCClips" },
          { name: "Regulators", path: "/Dashboard/ProductList/Electrical/Regulators" },
          { name: "Rotary Switch", path: "/Dashboard/ProductList/Electrical/RotarySwitch" },
          { name: "Sockets", path: "/Dashboard/ProductList/Electrical/Sockets" },
          { name: "Switch & Socket", path: "/Dashboard/ProductList/Electrical/SwitchAndSocket" },
          { name: "Switch Plates", path: "/Dashboard/ProductList/Electrical/SwitchPlates" },
          { name: "Switches", path: "/Dashboard/ProductList/Electrical/Switches" },
          { name: "Travel adaptor", path: "/Dashboard/ProductList/Electrical/TravelAdaptor" },
          { name: "TV outlets", path: "/Dashboard/ProductList/Electrical/TVOutlets" },
          { name: "Uni Switch Socket Combined Units", path: "/Dashboard/ProductList/Electrical/UniSwitch" },
          { name: "Water Heater", path: "/Dashboard/ProductList/Electrical/Water Heater" },
          { name: "Water Heaters", path: "/Dashboard/ProductList/Electrical/WaterHeaters" },
          { name: "Wires & Cables", path: "/Dashboard/ProductList/Electrical/WiresAndCables" },
    
        ],
      },
      { name: "Electrical Fitting", path: "/Dashboard/ProductList/Fitting" },
      { name: "Fiber Sheet", path: "/Dashboard/ProductList/Fiber" },
      { name: "Hardware", path: "/Dashboard/ProductList/Hardware" },
      { name: "Home", path: "/Dashboard/ProductList/Home" },
      { name: "Home Decor", path: "/Dashboard/ProductList/HomeDecor" },
      { name: "House Hold Ladder", path: "/Dashboard/ProductList/HouseHold" },
      { name: "Lighting", path: "/Dashboard/ProductList/Lighting" },
      {
        name: "Locks & accessories",
        subItemsName: [
          {
            name: "DOOR ACCESSORIES",
            subItemsNameComponent: []
          },
          {
            name: "DOOR CONTROLS",
            subItemsNameComponent: [
              { name: "Door Handles", path: "/Dashboard/ProductList/Locks/DoorControls/DoorHandles", subItemsNameComponent: [] },
              { name: "Door Locks", path: "/Dashboard/ProductList/Locks/DoorControls/DoorLocks", subItemsNameComponent: [] },
              { name: "Folding Brackets", path: "/Dashboard/ProductList/Locks/DoorControls/FoldingBrackets", subItemsNameComponent: [] },
            ]
          },
          {
            name: "FURNITURE FITTINGS",
            subItemsNameComponent: [
              { name: "Furniture Locks", path: "/Dashboard/ProductList/Locks/FurnitureFittings/FurnitureLocks", subItemsNameComponent: [] },
            ]
          },
          {
            name: "GLASS HARDWARE",
            subItemsNameComponent: []
          },
          {
            name: "LEVER MORTISE LOCKS",
            subItemsNameComponent: [
              { name: "Mortice Locks", path: "/Dashboard/ProductList/Locks/LeverMortiseLocks/MorticeLocks", subItemsNameComponent: [] },
              { name: "Mortise Lock Body", path: "/Dashboard/ProductList/Locks/LeverMortiseLocks/MortiseLockBody", subItemsNameComponent: [] },
            ]
          },
          { name: "Padlocks", path: "/Dashboard/ProductList/Locks/Padlocks", subItemsNameComponent: [] },
          { name: "Patch Fittings", path: "/Dashboard/ProductList/Locks/PatchFittings", subItemsNameComponent: [] },
          {
            name: "POPULAR MORTISE SERIES",
            subItemsNameComponent: []
          },
          {
            name: "PREMIUM MORTISE SERIES",
            subItemsNameComponent: []
          },
          { name: "Rim Locks", path: "/Dashboard/ProductList/Locks/RimLocks", subItemsNameComponent: [] },
        ],
      },
      {
        name: "Paint",
        subItemsName: [
          { name: "Acrylic Emulsion Paint", path: "/Dashboard/ProductList/Paint/AcrylicEmulsionPaint", subItemsNameComponent: [] },
          { name: "Aspa Paints", path: "/Dashboard/ProductList/Paint/AspaPaints", subItemsNameComponent: [] },
          { name: "Exterior paints", path: "/Dashboard/ProductList/Paint/ExteriorPaints", subItemsNameComponent: [] },
          { name: "Floor Paints", path: "/Dashboard/ProductList/Paint/FloorPaints", subItemsNameComponent: [] },
          { name: "Industrial Coatings", path: "/Dashboard/ProductList/Paint/IndustrialCoatings", subItemsNameComponent: [] },
          { name: "Interior Paints", path: "/Dashboard/ProductList/Paint/InteriorPaints", subItemsNameComponent: [] },
          { name: "Painting Tools", path: "/Dashboard/ProductList/Paint/PaintingTools", subItemsNameComponent: [] },
          { name: "Primer and Wall Putty", path: "/Dashboard/ProductList/Paint/PrimerAndWallPutty", subItemsNameComponent: [] },
          { name: "Sanitizer", path: "/Dashboard/ProductList/Paint/Sanitizer", subItemsNameComponent: [] },
          { name: "Spray Paints", path: "/Dashboard/ProductList/Paint/SprayPaints", subItemsNameComponent: [] },
          { name: "Stainers&Thinners", path: "/Dashboard/ProductList/Paint/StainersThinners", subItemsNameComponent: [] },
          { name: "Stencils", path: "/Dashboard/ProductList/Paint/Stencils", subItemsNameComponent: [] },
          { name: "Tile Guard", path: "/Dashboard/ProductList/Paint/TileGuard", subItemsNameComponent: [] },
          { name: "wall stickers and wallpapers", path: "/Dashboard/ProductList/Paint/WallStickersWallpapers", subItemsNameComponent: [] },
          { name: "Wood & Metal", path: "/Dashboard/ProductList/Paint/WoodMetal", subItemsNameComponent: [] },
        ],
      },
      {
        name: "Pipes & Fittings",
    subItemsName: [
          { name: "Ashirvad Pipes", path: "/Dashboard/ProductList/Pipes/AshirvadPipes", subItemsNameComponent: [] },
          { name: "Astral Pipes", path: "/Dashboard/ProductList/Pipes/AstralPipes", subItemsNameComponent: [] },
          { name: "Finolex Pipes", path: "/Dashboard/ProductList/Pipes/FinolexPipes", subItemsNameComponent: [] },
        ],
      },
      {
        name: "PVC Mats",
        subItemsName: [
          { name: "Floor Mats", path: "/Dashboard/ProductList/PvcMats/Floor" },
          { name: "Door Mats", path: "/Dashboard/ProductList/PvcMats/Door" },
        ],
      },
      {
        name: "Roofer",
        subItemsName: [
          { name: "Shingles", path: "/Dashboard/ProductList/Roofer/Shingles" },
          { name: "Metal Roofing", path: "/Dashboard/ProductList/Roofer/Metal" },
        ],
      },
      {
        name: "Sanitary Ware & faucets",
        subItemsName: [
          { name: "Acrylic Products", path: "/Dashboard/ProductList/Sanitary/AcrylicProducts", subItemsNameComponent: [] },
          { name: "Bathroom Accessories", path: "/Dashboard/ProductList/Sanitary/BathroomAccessories", subItemsNameComponent: [] },
          { name: "Bathsense", path: "/Dashboard/ProductList/Sanitary/Bathsense", subItemsNameComponent: [] },
          { name: "Closets", path: "/Dashboard/ProductList/Sanitary/Closets", subItemsNameComponent: [] },
          { name: "Coral bath fixtures", path: "/Dashboard/ProductList/Sanitary/CoralBathFixtures", subItemsNameComponent: [] },
          { name: "Corsa", path: "/Dashboard/ProductList/Sanitary/Corsa", subItemsNameComponent: [] },
          { name: "Essess", path: "/Dashboard/ProductList/Sanitary/Essess", subItemsNameComponent: [] },
          { name: "Faucets", path: "/Dashboard/ProductList/Sanitary/Faucets", subItemsNameComponent: [] },
          { name: "Hardware & Bathroom Accessories", path: "/Dashboard/ProductList/Sanitary/HardwareBathroomAccessories", subItemsNameComponent: [] },
          { name: "Health Faucet", path: "/Dashboard/ProductList/Sanitary/HealthFaucet", subItemsNameComponent: [] },
          { name: "Hindware", path: "/Dashboard/ProductList/Sanitary/Hindware", subItemsNameComponent: [] },
          { name: "Jaquar", path: "/Dashboard/ProductList/Sanitary/Jaquar", subItemsNameComponent: [] },
          { name: "Kitchen Sinks", path: "/Dashboard/ProductList/Sanitary/KitchenSinks", subItemsNameComponent: [] },
          { name: "LEMON Bathroom Accessories", path: "/Dashboard/ProductList/Sanitary/LemonBathroomAccessories", subItemsNameComponent: [] },
          { name: "Leo Bath Fittings", path: "/Dashboard/ProductList/Sanitary/LeoBathFittings", subItemsNameComponent: [] },
          { name: "Parryware", path: "/Dashboard/ProductList/Sanitary/Parryware", subItemsNameComponent: [] },
          { name: "Pearl Precious Products", path: "/Dashboard/ProductList/Sanitary/PearlPreciousProducts", subItemsNameComponent: [] },
          { name: "Showers", path: "/Dashboard/ProductList/Sanitary/Showers", subItemsNameComponent: [] },
          { name: "Taps", path: "/Dashboard/ProductList/Sanitary/Taps", subItemsNameComponent: [] },
          { name: "Washbasins", path: "/Dashboard/ProductList/Sanitary/Washbasins", subItemsNameComponent: [] },
          { name: "Waterman", path: "/Dashboard/ProductList/Sanitary/Waterman", subItemsNameComponent: [] },
          { name: "WaterTec", path: "/Dashboard/ProductList/Sanitary/WaterTec", subItemsNameComponent: [] },
        ],
      },
      {
        name: "Tools",
        subItemsName: [
          { name: "abrasives", path: "/Dashboard/ProductList/Tools/abrasives", subItemsNameComponent: [] },
          { name: "Allen Keys", path: "/Dashboard/ProductList/Tools/AllenKeys", subItemsNameComponent: [] },
          { name: "Brush", path: "/Dashboard/ProductList/Tools/Brush", subItemsNameComponent: [] },
          { name: "Carpenter Pincer", path: "/Dashboard/ProductList/Tools/CarpenterPincer", subItemsNameComponent: [] },
          { name: "Centre Punches", path: "/Dashboard/ProductList/Tools/CentrePunches", subItemsNameComponent: [] },
          { name: "Chisels", path: "/Dashboard/ProductList/Tools/Chisels", subItemsNameComponent: [] },
          { name: "Clamps", path: "/Dashboard/ProductList/Tools/Clamps", subItemsNameComponent: [] },
          { name: "Crowbar", path: "/Dashboard/ProductList/Tools/Crowbar", subItemsNameComponent: [] },
          { name: "Cutters", path: "/Dashboard/ProductList/Tools/Cutters", subItemsNameComponent: [] },
          { name: "files", path: "/Dashboard/ProductList/Tools/files", subItemsNameComponent: [] },
          { name: "Garden Tools", path: "/Dashboard/ProductList/Tools/GardenTools", subItemsNameComponent: [] },
          { name: "Gear Pullers", path: "/Dashboard/ProductList/Tools/GearPullers", subItemsNameComponent: [] },
          { name: "Glass cutter", path: "/Dashboard/ProductList/Tools/GlassCutter", subItemsNameComponent: [] },
          { name: "glue gun", path: "/Dashboard/ProductList/Tools/gluegun", subItemsNameComponent: [] },
          { name: "Grease Gun", path: "/Dashboard/ProductList/Tools/GreaseGun", subItemsNameComponent: [] },
          { name: "Hacksaw Blades", path: "/Dashboard/ProductList/Tools/HacksawBlades", subItemsNameComponent: [] },
          { name: "Hammer", path: "/Dashboard/ProductList/Tools/Hammer", subItemsNameComponent: [] },
          { name: "Hammer Drills", path: "/Dashboard/ProductList/Tools/HammerDrills", subItemsNameComponent: [] },
          { name: "hand tools", path: "/Dashboard/ProductList/Tools/handtools", subItemsNameComponent: [] },
          { name: "level", path: "/Dashboard/ProductList/Tools/level", subItemsNameComponent: [] },
          { name: "Lubrications", path: "/Dashboard/ProductList/Tools/Lubrications", subItemsNameComponent: [] },
          { name: "Measurement Scale", path: "/Dashboard/ProductList/Tools/MeasurementScale", subItemsNameComponent: [] },
          { name: "Measuring Tape", path: "/Dashboard/ProductList/Tools/MeasuringTape", subItemsNameComponent: [] },
          { name: "Multimeter", path: "/Dashboard/ProductList/Tools/Multimeter", subItemsNameComponent: [] },
          { name: "Plier", path: "/Dashboard/ProductList/Tools/Plier", subItemsNameComponent: [] },
          { name: "Polishing Accessories", path: "/Dashboard/ProductList/Tools/PolishingAccessories", subItemsNameComponent: [] },
          { name: "power tools", path: "/Dashboard/ProductList/Tools/powertools", subItemsNameComponent: [] },
          { name: "saw", path: "/Dashboard/ProductList/Tools/saw", subItemsNameComponent: [] },
          { name: "Screw Driver", path: "/Dashboard/ProductList/Tools/ScrewDriver", subItemsNameComponent: [] },
          { name: "Silicon Gun", path: "/Dashboard/ProductList/Tools/SiliconGun", subItemsNameComponent: [] },
          { name: "Socket set", path: "/Dashboard/ProductList/Tools/Socketset", subItemsNameComponent: [] },
          { name: "Spanners", path: "/Dashboard/ProductList/Tools/Spanners", subItemsNameComponent: [] },
          { name: "Spare Malets", path: "/Dashboard/ProductList/Tools/SpareMalets", subItemsNameComponent: [] },
          { name: "Tool Compartments", path: "/Dashboard/ProductList/Tools/ToolCompartments", subItemsNameComponent: [] },
          { name: "toolkit set", path: "/Dashboard/ProductList/Tools/toolkitset", subItemsNameComponent: [] },
          { name: "various tool bits", path: "/Dashboard/ProductList/Tools/varioustoolbits", subItemsNameComponent: [] },
          { name: "wood chisel", path: "/Dashboard/ProductList/Tools/woodChisel", subItemsNameComponent: [] },
          { name: "wood items", path: "/Dashboard/ProductList/Tools/woodItems", subItemsNameComponent: [] },
          { name: "Wrench", path: "/Dashboard/ProductList/Tools/Wrench", subItemsNameComponent: [] },
        ],
      },
      { name: "Uncategorized", path: "/Dashboard/ProductList/Uncategorized" },
      {
        name: "WaterProofing",
        subItemsName: [
          { name: "Bathrooms", path: "/Dashboard/ProductList/WaterProofing/Bathrooms", subItemsNameComponent: [] },
          { name: "Cracks & Joints", path: "/Dashboard/ProductList/WaterProofing/CracksJoints", subItemsNameComponent: [] },
          { name: "Interiors", path: "/Dashboard/ProductList/WaterProofing/Interiors", subItemsNameComponent: [] },
        ],
      },
        ]},
  {name: "Order List",path: "/Dashboard/OrderList"},
  {name: "User List",path: "/Dashboard/UserList"},
  {name: "Category List",path: "/Dashboard/CategoryList"},
  {name: "Brand List",path: "/Dashboard/BrandList"},
  {name: "Banner List",path: "/Dashboard/BannerList"},
  {name: "Coupon List",path: "/Dashboard/CouponList"},
  {name: "Setting",path: "/Dashboard/Setting"},
  {name: "Contact Us",path: "/Dashboard/ContactUs"},
  {name: "About Us",path: "/Dashboard/AboutUs"},
  {name: "Privacy Policy",path: "/Dashboard/PrivacyPolicy"},
  {name: "Terms & Conditions",path: "/Dashboard/TermsAndConditions"},
  {name: "FAQ",path: "/Dashboard/FAQ"},
  
  
  
];

const getIconPath = (name) => `/sidebar-icons/${name.replace(/ /g, '')}.png`;


export default function Sidebar({ onSetting, onLogout, open, onClose }) {
  // Track open state for each collapsible item by name
  const [openSection, setOpenSection] = useState(null);
  const [openSubSection, setOpenSubSection] = useState(null);


  const handleToggle = (name) => {
    setOpenSection(openSection === name ? null : name);
  };
  return (
    <aside className="w-64 h-screen bg-white rounded-2xl shadow-lg p-2 flex flex-col text-zinc-800 border border-zinc-100">
      <div className="p-2 font-bold text-xl">LOGO</div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <ul className="p-2 space-y-2">

          {sections.map((section) => (
            <div key={section.name} className="mb-2">
              <div className="flex items-center w-full">
                {section.path ? (
                  <Link
                    href={section.path}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition group cursor-pointer ${openSection === section.name ? "bg-zinc-100 font-semibold shadow" : "hover:bg-zinc-100"}`}
                    onClick={() => handleToggle(section.name)}
                  >
                    {section.name}
                  </Link>
                ) : (
                  <span className="flex-1 text-left px-2 py-2 rounded text-sm font-semibold">{section.name}</span>
                )}
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
                {section.subItemsName && section.subItemsName.length > 0 && (
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
                {section.subItemsNameComponent && section.subItemsNameComponent.length > 0 && (
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
              {openSection === section.name && (section.subItems || section.subItemsName || section.subItemsNameComponent) && (
                <ul className="pl-4">
                  {Array.isArray(section.subItems) && section.subItems.map((item) => (
                    <SidebarItem
                      key={item.name}
                      item={item}
                      openSubSection={openSubSection}
                      setOpenSubSection={setOpenSubSection}
                    />
                  ))}
                  {Array.isArray(section.subItemsName) && section.subItemsName.map((item) => (
                    <SidebarItem
                      key={item.name}
                      item={item}
                      openSubSection={openSubSection}
                      setOpenSubSection={setOpenSubSection}
                    />
                  ))}
                  {Array.isArray(section.subItemsNameComponent) && section.subItemsNameComponent.map((item) => (
                    <SidebarItem
                      key={item.name}
                      item={item}
                      openSubSection={openSubSection}
                      setOpenSubSection={setOpenSubSection}
                    />
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

function SidebarItem({ item, openSubSection, setOpenSubSection }) {
  const hasSubItemsName = Array.isArray(item.subItemsName) && item.subItemsName.length > 0;
  const hasSubItemsNameComponent = Array.isArray(item.subItemsNameComponent) && item.subItemsNameComponent.length > 0;
  const isOpen = openSubSection === item.name;

  return (
    <li>
      <div className="flex items-center">
        {item.path ? (
          <Link
            href={item.path}
            className="block px-2 py-2 rounded text-sm hover:bg-zinc-700 transition flex-1"
            onClick={() => (hasSubItemsName || hasSubItemsNameComponent) ? setOpenSubSection(isOpen ? null : item.name) : undefined}
          >
            <span className="align-middle">{item.name}</span>
          </Link>
        ) : (
          <span className="block px-2 py-2 rounded text-sm flex-1">
            <span className="align-middle">{item.name}</span>
          </span>
        )}
        {(hasSubItemsName || hasSubItemsNameComponent) && (
          <button
            className="ml-2"
            onClick={e => { e.stopPropagation(); setOpenSubSection(isOpen ? null : item.name); }}
          >
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        )}
      </div>
      {isOpen && (
        <ul className="pl-4">
          {hasSubItemsName && item.subItemsName.map(child =>
            <SidebarItem
              key={child.name}
              item={child}
              openSubSection={openSubSection}
              setOpenSubSection={setOpenSubSection}
            />
          )}
          {hasSubItemsNameComponent && item.subItemsNameComponent.map(child =>
            <SidebarItem
              key={child.name}
              item={child}
              openSubSection={openSubSection}
              setOpenSubSection={setOpenSubSection}
            />
          )}
        </ul>
      )}
    </li>
  );
} 