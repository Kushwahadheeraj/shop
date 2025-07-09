"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Link from "next/link";


const sections = [
  { name: "Dashboard", path: "/Dashboard" },
  {
    name: "Product Add",
    subItems: [
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
          {
            name: "Electrical Fittings", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings", subItemsNameComponent: [
              { name: "Accessories", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings/Accessories" },
              { name: "Circular Deep Box", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings/CircularDeepBox" },
              { name: "Circular surface box", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings/CircularSurfaceBox" },
              { name: "Rigid type", path: "/Dashboard/ProductAdd/Electrical/ElectricalFittings/RigidType" },
            ]
          },
          {
            name: "Fans", path: "/Dashboard/ProductAdd/Electrical/Fans", subItemsNameComponent: [
              { name: "Cabin Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/CabinFans" },
              { name: "Ceiling Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/CeilingFans" },
              { name: "Pedestal Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/PedestalFans" },
              { name: "Table Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/TableFans" },
              { name: "Ventilation/Exhaust Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/VentilationExhaustFans" },
              { name: "Wall Mounting Fans", path: "/Dashboard/ProductAdd/Electrical/Fans/WallMountingFans" },
            ]
          },
          { name: "Flexible Conduit", path: "/Dashboard/ProductAdd/Electrical/FlexibleConduit" },
          { name: "Flexible Wires", path: "/Dashboard/ProductAdd/Electrical/FlexibleWires" },
          { name: "Fuse Carriers", path: "/Dashboard/ProductAdd/Electrical/FuseCarriers" },
          { name: "Holders", path: "/Dashboard/ProductAdd/Electrical/Holders" },
          { name: "Indicator", path: "/Dashboard/ProductAdd/Electrical/Indicator" },
          { name: "Insulation Tapes", path: "/Dashboard/ProductAdd/Electrical/InsulationTapes" },
          { name: "Isolators", path: "/Dashboard/ProductAdd/Electrical/Isolators" },
          { name: "Jacks", path: "/Dashboard/ProductAdd/Electrical/Jacks" },
          { name: "KIT KAT Fuses", path: "/Dashboard/ProductAdd/Electrical/KITKATFuses" },
          {
            name: "Lights", path: "/Dashboard/ProductAdd/Electrical/Lights", subItemsNameComponent: [
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
            ]
          },
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
            subItemsNameComponent: [
              { name: "Aluminium Tower Bolt", path: "/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/AluminiumTowerBolt" },
              { name: "Ball Bearing Door Hinges", path: "/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/BallBearingDoorHinges" },
              { name: "Concealed Hinges", path: "/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/ConcealedHinges" },
              { name: "Door Eye", path: "/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/DoorEye" },
              { name: "Door Stopper", path: "/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/DoorStopper" },
              { name: "HINGES", path: "/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/HINGES" },
              { name: "Magnetic Door Stoppers", path: "/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/MagneticDoorStoppers" },
              { name: "Wooden Sliding Door Fittings", path: "/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/WoodenSlidingDoorFittings" },
            ]
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
    ]
  },
  {
    name: "Product List", subItems: [
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
          {
            name: "Electrical Fittings", path: "/Dashboard/ProductList/Electrical/ElectricalFittings", subItemsNameComponent: [
              { name: "Accessories", path: "/Dashboard/ProductList/Electrical/ElectricalFittings/Accessories" },
              { name: "Circular Deep Box", path: "/Dashboard/ProductList/Electrical/ElectricalFittings/CircularDeepBox" },
              { name: "Circular surface box", path: "/Dashboard/ProductList/Electrical/ElectricalFittings/CircularSurfaceBox" },
              { name: "Rigid type", path: "/Dashboard/ProductList/Electrical/ElectricalFittings/RigidType" },
            ]
          },
          {
            name: "Fans", path: "/Dashboard/ProductList/Electrical/Fans", subItemsNameComponent: [
              { name: "Cabin Fans", path: "/Dashboard/ProductList/Electrical/Fans/CabinFans" },
              { name: "Ceiling Fans", path: "/Dashboard/ProductList/Electrical/Fans/CeilingFans" },
              { name: "Pedestal Fans", path: "/Dashboard/ProductList/Electrical/Fans/PedestalFans" },
              { name: "Table Fans", path: "/Dashboard/ProductList/Electrical/Fans/TableFans" },
              { name: "Ventilation/Exhaust Fans", path: "/Dashboard/ProductList/Electrical/Fans/VentilationExhaustFans" },
              { name: "Wall Mounting Fans", path: "/Dashboard/ProductList/Electrical/Fans/WallMountingFans" },
            ]
          },
          { name: "Flexible Conduit", path: "/Dashboard/ProductList/Electrical/FlexibleConduit" },
          { name: "Flexible Wires", path: "/Dashboard/ProductList/Electrical/FlexibleWires" },
          { name: "Fuse Carriers", path: "/Dashboard/ProductList/Electrical/FuseCarriers" },
          { name: "Holders", path: "/Dashboard/ProductList/Electrical/Holders" },
          { name: "Indicator", path: "/Dashboard/ProductList/Electrical/Indicator" },
          { name: "Insulation Tapes", path: "/Dashboard/ProductList/Electrical/InsulationTapes" },
          { name: "Isolators", path: "/Dashboard/ProductList/Electrical/Isolators" },
          { name: "Jacks", path: "/Dashboard/ProductList/Electrical/Jacks" },
          { name: "KIT KAT Fuses", path: "/Dashboard/ProductList/Electrical/KITKATFuses" },
          {
            name: "Lights", path: "/Dashboard/ProductList/Electrical/Lights", subItemsNameComponent: [
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
            ]
          },
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
            subItemsNameComponent: [
              { name: "Aluminium Tower Bolt", path: "/Dashboard/ProductList/Hardware/Locks/DoorAccessories/AluminiumTowerBolt" },
              { name: "Ball Bearing Door Hinges", path: "/Dashboard/ProductList/Hardware/Locks/DoorAccessories/BallBearingDoorHinges" },
              { name: "Concealed Hinges", path: "/Dashboard/ProductList/Hardware/Locks/DoorAccessories/ConcealedHinges" },
              { name: "Door Eye", path: "/Dashboard/ProductList/Hardware/Locks/DoorAccessories/DoorEye" },
              { name: "Door Stopper", path: "/Dashboard/ProductList/Hardware/Locks/DoorAccessories/DoorStopper" },
              { name: "HINGES", path: "/Dashboard/ProductList/Hardware/Locks/DoorAccessories/HINGES" },
              { name: "Magnetic Door Stoppers", path: "/Dashboard/ProductList/Hardware/Locks/DoorAccessories/MagneticDoorStoppers" },
              { name: "Wooden Sliding Door Fittings", path: "/Dashboard/ProductList/Hardware/Locks/DoorAccessories/WoodenSlidingDoorFittings" },
            ]
          },
          {
            name: "DOOR CONTROLS",
            subItemsNameComponent: [
              { name: "Door Closers", path: "/Dashboard/ProductList/Locks/DoorControls/Door%20Closers" },
              { name: "Door Stopper", path: "/Dashboard/ProductList/Locks/DoorControls/Door%20Stopper" },
              { name: "Hydraulic Door Closers", path: "/Dashboard/ProductList/Locks/DoorControls/Hydraulic%20Door%20Closers" },
            ]
          },
          {
            name: "DOOR HANDLES",
            subItemsNameComponent: [
              { name: "Door King", path: "/Dashboard/ProductList/Locks/DoorControls/DoorKing" },
              { name: "Door Pulls", path: "/Dashboard/ProductList/Locks/DoorControls/DoorPulls" },
            ]
          },
          {
            name: "DOOR LOCKS",
            subItemsNameComponent: [
              { name: "Tri Bolt Locks", path: "/Dashboard/ProductList/Locks/DoorLocks/Tri%20Bolt%20Locks" },
              { name: "Smart Key", path: "/Dashboard/ProductList/Locks/DoorLocks/Smart%20Key" },
              { name: "Night Latch", path: "/Dashboard/ProductList/Locks/DoorLocks/Night%20Latch" },
              { name: "Pull Handles For Main Doors", path: "/Dashboard/ProductList/Locks/DoorLocks/Pull%20Handles%20For%20Main%20Doors" },
              { name: "Rim Dead Lock", path: "/Dashboard/ProductList/Locks/DoorLocks/Rim%20Dead%20Lock" },
              { name: "Side Lock", path: "/Dashboard/ProductList/Locks/DoorLocks/Side%20Lock" },
              { name: "Main Door Lock", path: "/Dashboard/ProductList/Locks/DoorLocks/Main%20Door%20Lock" },
              { name: "Jemmy Proof Door Lock", path: "/Dashboard/ProductList/Locks/DoorLocks/Jemmy%20Proof%20Door%20Lock" },
              { name: "Knob Locks", path: "/Dashboard/ProductList/Locks/DoorLocks/Knob%20Locks" },
              { name: "Drawer Lock", path: "/Dashboard/ProductList/Locks/DoorLocks/Drawer%20Lock" },
              { name: "Dead Locks", path: "/Dashboard/ProductList/Locks/DoorLocks/Dead%20Locks" },
              { name: "Diamant Padlocks", path: "/Dashboard/ProductList/Locks/DoorLocks/Diamant%20Padlocks" },
              { name: "Dimple Key", path: "/Dashboard/ProductList/Locks/DoorLocks/Dimple%20Key" },
              { name: "Disc Pad Locks", path: "/Dashboard/ProductList/Locks/DoorLocks/Disc%20Pad%20Locks" },
              { name: "Cylindrical Locks", path: "/Dashboard/ProductList/Locks/DoorLocks/Cylindrical%20Locks" },
              { name: "Centre Shutter Locks", path: "/Dashboard/ProductList/Locks/DoorLocks/Centre%20Shutter%20Locks" },
              { name: "Cupboard Locks", path: "/Dashboard/ProductList/Locks/DoorLocks/Cupboard%20Locks" },
            ]
          },
          { name: "FURNITURE BRACKETS",path: "/Dashboard/ProductList/Locks/FurnitureBrackets",},
          {
            name: "FURNITURE FITTINGS",
            subItemsNameComponent: [
              { name: "Ball Bearing Drawer Channel", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Ball%20Bearing%20Drawer%20Channel" },
              { name: "Furniture Fittings", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Furniture%20Fittings" },
              { name: "Heavy Duty Drawer Slides", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Heavy%20Duty%20Drawer%20Slides" },
              { name: "Slip On Hinge", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Slip%20On%20Hinge" },
              { name: "Soft Close Drawer Channel", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Soft%20Close%20Drawer%20Channel" },
              { name: "Thick Door Hinge", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Thick%20Door%20Hinge" },
              { name: "Folding Brackets", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Folding%20Brackets" },
              { name: "Cabinet Hinge", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Cabinet%20Hinge" },
              { name: "Clip On Soft Hinge", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Clip%20On%20Soft%20Hinge" },
              { name: "Clip On Soft Hinge4 Hole", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Clip%20On%20Soft%20Hinge4%20Hole" },
              { name: "Drawer Channels", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Drawer%20Channels" },
              { name: "Blind Corner Hinge", path: "/Dashboard/ProductList/Locks/FurnitureFittings/Blind%20Corner%20Hinge" },
            ]
          },
          {
            name: "FURNITURE LOCKS",
            subItemsNameComponent: [
              { name: "Curvo", path: "/Dashboard/ProductList/Locks/FurnitureLocks/Curvo" },
              { name: "CamLock", path: "/Dashboard/ProductList/Locks/FurnitureLocks/CamLock" },
              { name: "Nuvo", path: "/Dashboard/ProductList/Locks/FurnitureLocks/Nuvo" },
              { name: "Supernova", path: "/Dashboard/ProductList/Locks/FurnitureLocks/Supernova" },
              { name: "Table Lock", path: "/Dashboard/ProductList/Locks/FurnitureLocks/Table%20Lock" },
              { name: "Drawer Cupboard Lock", path: "/Dashboard/ProductList/Locks/FurnitureLocks/Drawer%20Cupboard%20Lock" },
              { name: "Drawer Locks", path: "/Dashboard/ProductList/Locks/FurnitureLocks/Drawer%20Locks" },
              { name: "Multi Purpose Lock", path: "/Dashboard/ProductList/Locks/FurnitureLocks/Multi%20Purpose%20Lock" },
            ]
          },
          {
            name: "GLASS HARDWARE",
            subItemsNameComponent: [
              { name: "Glass Door Pull Handle", path: "/Dashboard/ProductList/Locks/GlassHardware/Glass%20Door%20Pull%20Handle" },
              { name: "Glass Hardware", path: "/Dashboard/ProductList/Locks/GlassHardware/Glass%20Hardware" },
              { name: "Shower Cubicle Hinge", path: "/Dashboard/ProductList/Locks/GlassHardware/Shower%20Cubicle%20Hinge" },
              { name: "Sliding System", path: "/Dashboard/ProductList/Locks/GlassHardware/Sliding%20System" },
              { name: "Glass Door Lock", path: "/Dashboard/ProductList/Locks/GlassHardware/Glass%20Door%20Lock" },
              { name: "Floor Spring Combo Set", path: "/Dashboard/ProductList/Locks/GlassHardware/Floor%20Spring%20Combo%20Set" },
              { name: "Glass Door Fitting", path: "/Dashboard/ProductList/Locks/GlassHardware/Glass%20Door%20Fitting" },
            ]
          },
          {
            name: "LEVER MORTISE LOCKS",
            subItemsNameComponent: [
              { name: "EXS HI - SECURITY CYLINDERS", path: "/Dashboard/ProductList/Locks/LeverMortiseLocks/EXS%20HI%20-%20SECURITY%20CYLINDERS" },
              { name: "COMBIPACK WITH 6 LEVER MORTISE LOCK", path: "/Dashboard/ProductList/Locks/LeverMortiseLocks/COMBIPACK%20WITH%206%20LEVER%20MORTISE%20LOCK" },
              { name: "Europrofile Mortise Pin Cylinder With Master Key", path: "/Dashboard/ProductList/Locks/LeverMortiseLocks/Europrofile%20Mortise%20Pin%20Cylinder%20With%20Master%20Key" },
              { name: "Europrofile Mortise Pin Cylinder", path: "/Dashboard/ProductList/Locks/LeverMortiseLocks/Europrofile%20Mortise%20Pin%20Cylinder" },
              { name: "Europrofile Mortise Lock Bodies", path: "/Dashboard/ProductList/Locks/LeverMortiseLocks/Europrofile%20Mortise%20Lock%20Bodies" },
            ]
          },
          { name: "Mortice Locks", path: "/Dashboard/ProductList/Locks/MorticeLocks" },
            { name: "Mortise Lock Body", path: "/Dashboard/ProductList/Locks/MortiseLockBody" },

          { name: "Padlocks", subItemsNameComponent: [
            { name: "Ultra Shutter Locks", path: "/Dashboard/ProductList/Locks/Padlocks/Ultra%20Shutter%20Locks" },
            { name: "Disc Padlocks", path: "/Dashboard/ProductList/Locks/Padlocks/Disc%20Padlocks" },
            { name: "Padlocks", path: "/Dashboard/ProductList/Locks/Padlocks/Padlocks" },
            { name: "Premium Padlocks", path: "/Dashboard/ProductList/Locks/Padlocks/Premium%20Padlocks" },
            { name: "Round Type Padlock", path: "/Dashboard/ProductList/Locks/Padlocks/Round%20Type%20Padlock" },
            { name: "Square Type Padlock", path: "/Dashboard/ProductList/Locks/Padlocks/Square%20Type%20Padlock" },
          ] },
          { name: "Patch Fittings", path: "/Dashboard/ProductList/Locks/PatchFittings"},
          {
            name: "POPULAR MORTISE SERIES",
            subItemsNameComponent: [
              { name: "S S D Type Tube Lever", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/S%20S%20D%20Type%20Tube%20Lever" },
              { name: "Towy Low Height Design", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Towy%20Low%20Height%20Design" },
              { name: "Victoria", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Victoria" },
              { name: "Pull Handles", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Pull%20Handles" },
              { name: "N E H15 Low Height Design", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H15%20Low%20Height%20Design" },
              { name: "N E H16", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H16" },
              { name: "Oliver", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Oliver" },
              { name: "Popular Mortise Series", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Popular%20Mortise%20Series" },
              { name: "N E H10", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H10" },
              { name: "N E H11", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H11" },
              { name: "N E H12", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H12" },
              { name: "N E H13", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H13" },
              { name: "N E H14", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H14" },
              { name: "N E H09", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H09" },
              { name: "N E H04", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H04" },
              { name: "N E H05", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H05" },
              { name: "N E H06", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H06" },
              { name: "N E H07", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H07" },
              { name: "N E H08", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H08" },
              { name: "Matiz", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Matiz" },
              { name: "Corner Fetch Series", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Corner%20Fetch%20Series" },
              { name: "Cylindrical Locks", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Cylindrical%20Locks" },
              { name: "Gloria", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Gloria" },
              { name: "Main Door Set", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Main%20Door%20Set" },
              { name: "Combi Set", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Combi%20Set" },
              { name: "Classic Lock", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/Classic%20Lock" },
              { name: "B M01", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/B%20M01" },
              { name: "B M02", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/B%20M02" },
              { name: "B M04", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/B%20M04" },
              { name: "B M06", path: "/Dashboard/ProductList/Locks/PopularMortiseSeries/B%20M06" },
            ]
          },
          {
            name: "PREMIUM MORTISE SERIES",
            subItemsNameComponent: [
              { name: "S E H Series", path: "/Dashboard/ProductList/Locks/PremiumMortiseSeries/S%20E%20H%20Series" },
              { name: "Phoenix", path: "/Dashboard/ProductList/Locks/PremiumMortiseSeries/Phoenix" },
              { name: "Premium Mortise Series", path: "/Dashboard/ProductList/Locks/PremiumMortiseSeries/Premium%20Mortise%20Series" },
              { name: "Orbit", path: "/Dashboard/ProductList/Locks/PremiumMortiseSeries/Orbit" },
              { name: "Allure Rossette Series", path: "/Dashboard/ProductList/Locks/PremiumMortiseSeries/Allure%20Rossette%20Series" },
              { name: "Combipack With240mm Euro Mortise Lock", path: "/Dashboard/ProductList/Locks/PremiumMortiseSeries/Combipack%20With240mm%20Euro%20Mortise%20Lock" },
              { name: "Europrofile Brass Handle Set240mm", path: "/Dashboard/ProductList/Locks/PremiumMortiseSeries/Europrofile%20Brass%20Handle%20Set240mm" },
              { name: "Evva3 K S Regalis Mortise", path: "/Dashboard/ProductList/Locks/PremiumMortiseSeries/Evva3%20K%20S%20Regalis%20Mortise" },
              { name: "Mercury", path: "/Dashboard/ProductList/Locks/PremiumMortiseSeries/Mercury" },
            ]
          },
          { name: "Rim Locks", subItemsNameComponent: [
            { name: "Ultra X L Tribolt", path: "/Dashboard/ProductList/Locks/RimLocks/Ultra%20X%20L%20Tribolt" },
            { name: "Ultra X L Twinbolt", path: "/Dashboard/ProductList/Locks/RimLocks/Ultra%20X%20L%20Twinbolt" },
            { name: "Ultra X L Vertibolt", path: "/Dashboard/ProductList/Locks/RimLocks/Ultra%20X%20L%20Vertibolt" },
            { name: "Ultra X L Rim Deadbolt", path: "/Dashboard/ProductList/Locks/RimLocks/Ultra%20X%20L%20Rim%20Deadbolt" },
            { name: "Ultra Latchbolt Carton", path: "/Dashboard/ProductList/Locks/RimLocks/Ultra%20Latchbolt%20Carton" },
            { name: "Ultra Retrofit Adaptor", path: "/Dashboard/ProductList/Locks/RimLocks/Ultra%20Retrofit%20Adaptor" },
            { name: "Ultra Tribolt", path: "/Dashboard/ProductList/Locks/RimLocks/Ultra%20Tribolt" },
            { name: "Ultra Vertibolt", path: "/Dashboard/ProductList/Locks/RimLocks/Ultra%20Vertibolt" },
            { name: "Rim Locks", path: "/Dashboard/ProductList/Locks/RimLocks/Rim%20Locks" },
            { name: "E X S Altrix", path: "/Dashboard/ProductList/Locks/RimLocks/E%20X%20S%20Altrix" },
            { name: "E X S Astro", path: "/Dashboard/ProductList/Locks/RimLocks/E%20X%20S%20Astro" },
            { name: "Night Latch7 Lever", path: "/Dashboard/ProductList/Locks/RimLocks/Night%20Latch7%20Lever" },
            { name: "Pentabolt Aries", path: "/Dashboard/ProductList/Locks/RimLocks/Pentabolt%20Aries" },
            { name: "Pin Cylinder Rim Locks", path: "/Dashboard/ProductList/Locks/RimLocks/Pin%20Cylinder%20Rim%20Locks" },
          ] },
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
        ]
      },
    ]
  },
  { name: "Order List", path: "/Dashboard/OrderList" },
  { name: "User List", path: "/Dashboard/UserList" },
  { name: "Category List", path: "/Dashboard/CategoryList" },
  { name: "Brand List", path: "/Dashboard/BrandList" },
  { name: "Banner List", path: "/Dashboard/BannerList" },
  { name: "Coupon List", path: "/Dashboard/CouponList" },
  { name: "Setting", path: "/Dashboard/Setting" },
  { name: "Contact Us", path: "/Dashboard/ContactUs" },
  { name: "About Us", path: "/Dashboard/AboutUs" },
  { name: "Privacy Policy", path: "/Dashboard/PrivacyPolicy" },
  { name: "Terms & Conditions", path: "/Dashboard/TermsAndConditions" },
  { name: "FAQ", path: "/Dashboard/FAQ" },



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