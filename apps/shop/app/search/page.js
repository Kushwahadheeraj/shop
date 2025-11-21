'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchCategories = () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Define available categories/pages with ALL subcategories and nested folders
        const allCategories = [
          // Main Categories
          { name: 'Electrical', path: '/ShopPage/Electrical', description: 'Electrical items and accessories', type: 'main' },
          { name: 'Paint', path: '/ShopPage/Paint', description: 'Paints and painting supplies', type: 'main' },
          { name: 'Sanitary', path: '/ShopPage/Sanitary', description: 'Sanitary ware and faucets', type: 'main' },
          { name: 'Tools', path: '/ShopPage/Tools', description: 'Tools and equipment', type: 'main' },
          { name: 'Adhesives', path: '/ShopPage/Adhesives', description: 'Adhesives and bonding materials', type: 'main' },
          { name: 'Cements', path: '/ShopPage/Cements', description: 'Cements & POP', type: 'main' },
          { name: 'Cleaning', path: '/ShopPage/Cleaning', description: 'Cleaning supplies', type: 'main' },
          { name: 'Dry', path: '/ShopPage/Dry', description: 'Dry Wall Gypsum Screws', type: 'main' },
          { name: 'Hardware', path: '/ShopPage/Hardware', description: 'House Hold Ladder', type: 'main' },
          { name: 'Locks', path: '/ShopPage/Locks', description: 'Locks & accessories', type: 'main' },
          { name: 'Pipe', path: '/ShopPage/Pipe', description: 'Pipes & Fittings', type: 'main' },
          { name: 'Uncategorized', path: '/ShopPage/Uncategorized', description: 'Uncategorized items', type: 'main' },
          { name: 'WaterProofing', path: '/ShopPage/WaterProofing', description: 'WaterProofing materials', type: 'main' },
          { name: 'Brush', path: '/ShopPage/Brush', description: 'Brushes', type: 'main' },
          { name: 'Fiber', path: '/ShopPage/Fiber', description: 'Fiber materials', type: 'main' },
          { name: 'Fitting', path: '/ShopPage/Fitting', description: 'Fittings', type: 'main' },
          { name: 'HomeDecor', path: '/ShopPage/HomeDecor', description: 'Home Decor items', type: 'main' },
          { name: 'PvcMats', path: '/ShopPage/PvcMats', description: 'PVC Mats', type: 'main' },
          { name: 'Roofer', path: '/ShopPage/Roofer', description: 'Roofing materials', type: 'main' },
          
          // Electrical - ALL Subcategories and Nested Folders
          { name: 'Adaptors', path: '/ShopPage/Electrical/Adaptors', description: 'Electrical Adaptors', type: 'sub', parent: 'Electrical' },
          { name: 'Ceiling Roses', path: '/ShopPage/Electrical/CeilingRoses', description: 'Ceiling Roses', type: 'sub', parent: 'Electrical' },
          { name: 'Dimmer', path: '/ShopPage/Electrical/Dimmer', description: 'Dimmers', type: 'sub', parent: 'Electrical' },
          { name: 'Distribution Boards', path: '/ShopPage/Electrical/DistributionBoards', description: 'Distribution Boards', type: 'sub', parent: 'Electrical' },
          { name: 'Door Bells', path: '/ShopPage/Electrical/DoorBells', description: 'Door Bells', type: 'sub', parent: 'Electrical' },
          { name: 'DP Switch', path: '/ShopPage/Electrical/DPswitch', description: 'DP Switches', type: 'sub', parent: 'Electrical' },
          { name: 'Earthing Accessories', path: '/ShopPage/Electrical/EarthingAccessories', description: 'Earthing Accessories', type: 'sub', parent: 'Electrical' },
          { name: 'Electrical Fittings', path: '/ShopPage/Electrical/ElectricalFittings', description: 'Electrical Fittings', type: 'sub', parent: 'Electrical' },
          { name: 'Flexible Conduit', path: '/ShopPage/Electrical/FlexibleConduit', description: 'Flexible Conduit', type: 'sub', parent: 'Electrical' },
          { name: 'Flexible Wires', path: '/ShopPage/Electrical/FlexibleWires', description: 'Flexible Wires', type: 'sub', parent: 'Electrical' },
          { name: 'Fuse Carriers', path: '/ShopPage/Electrical/FuseCarriers', description: 'Fuse Carriers', type: 'sub', parent: 'Electrical' },
          { name: 'Holders', path: '/ShopPage/Electrical/Holders', description: 'Light Holders', type: 'sub', parent: 'Electrical' },
          { name: 'Indicator', path: '/ShopPage/Electrical/Indicator', description: 'Indicators', type: 'sub', parent: 'Electrical' },
          { name: 'Insulation Tapes', path: '/ShopPage/Electrical/InsulationTapes', description: 'Insulation Tapes', type: 'sub', parent: 'Electrical' },
          { name: 'Isolators', path: '/ShopPage/Electrical/Isolators', description: 'Isolators', type: 'sub', parent: 'Electrical' },
          { name: 'Jacks', path: '/ShopPage/Electrical/Jacks', description: 'Electrical Jacks', type: 'sub', parent: 'Electrical' },
          { name: 'KITKAT Fuses', path: '/ShopPage/Electrical/KITKATFuses', description: 'KITKAT Fuses', type: 'sub', parent: 'Electrical' },
          { name: 'Main Switch', path: '/ShopPage/Electrical/MainSwitch', description: 'Main Switches', type: 'sub', parent: 'Electrical' },
          { name: 'MCB', path: '/ShopPage/Electrical/MCB', description: 'Miniature Circuit Breakers', type: 'sub', parent: 'Electrical' },
          { name: 'Modular Surface Box', path: '/ShopPage/Electrical/ModularSurfaceBox', description: 'Modular Surface Boxes', type: 'sub', parent: 'Electrical' },
          { name: 'Motors', path: '/ShopPage/Electrical/Motors', description: 'Motors', type: 'sub', parent: 'Electrical' },
          { name: 'Motor Starters', path: '/ShopPage/Electrical/MotorStarters', description: 'Motor Starters', type: 'sub', parent: 'Electrical' },
          { name: 'Others', path: '/ShopPage/Electrical/Others', description: 'Other Electrical Items', type: 'sub', parent: 'Electrical' },
          { name: 'Pin Top', path: '/ShopPage/Electrical/PinTop', description: 'Pin Tops', type: 'sub', parent: 'Electrical' },
          { name: 'Plug', path: '/ShopPage/Electrical/Plug', description: 'Plugs', type: 'sub', parent: 'Electrical' },
          { name: 'Power Strips', path: '/ShopPage/Electrical/PowerStrips', description: 'Power Strips', type: 'sub', parent: 'Electrical' },
          { name: 'PVC Clips', path: '/ShopPage/Electrical/PVCClips', description: 'PVC Clips', type: 'sub', parent: 'Electrical' },
          { name: 'Regulators', path: '/ShopPage/Electrical/Regulators', description: 'Regulators', type: 'sub', parent: 'Electrical' },
          { name: 'Rotary Switch', path: '/ShopPage/Electrical/RotarySwitch', description: 'Rotary Switches', type: 'sub', parent: 'Electrical' },
          { name: 'Sockets', path: '/ShopPage/Electrical/Sockets', description: 'Electrical Sockets', type: 'sub', parent: 'Electrical' },
          { name: 'Switch And Socket', path: '/ShopPage/Electrical/SwitchAndSocket', description: 'Switch and Socket Combinations', type: 'sub', parent: 'Electrical' },
          { name: 'Switch Plates', path: '/ShopPage/Electrical/SwitchPlates', description: 'Switch Plates', type: 'sub', parent: 'Electrical' },
          { name: 'Switches', path: '/ShopPage/Electrical/Switches', description: 'Electrical Switches', type: 'sub', parent: 'Electrical' },
          { name: 'Travel Adaptor', path: '/ShopPage/Electrical/TravelAdaptor', description: 'Travel Adaptors', type: 'sub', parent: 'Electrical' },
          { name: 'TV Outlets', path: '/ShopPage/Electrical/TVOutlets', description: 'TV Outlets', type: 'sub', parent: 'Electrical' },
          { name: 'Uni Switch', path: '/ShopPage/Electrical/UniSwitch', description: 'Uni Switches', type: 'sub', parent: 'Electrical' },
          { name: 'Water Heater', path: '/ShopPage/Electrical/WaterHeater', description: 'Water Heaters', type: 'sub', parent: 'Electrical' },
          { name: 'Water Heaters', path: '/ShopPage/Electrical/WaterHeaters', description: 'Water Heaters', type: 'sub', parent: 'Electrical' },
          { name: 'Wires And Cables', path: '/ShopPage/Electrical/WiresAndCables', description: 'Wires and Cables', type: 'sub', parent: 'Electrical' },
          { name: 'ELCBs RCCBs', path: '/ShopPage/Electrical/ELCBsRCCBs', description: 'ELCBs and RCCBs', type: 'sub', parent: 'Electrical' },
          
          // Electrical - Fans
          { name: 'Fans', path: '/ShopPage/Electrical/Fans', description: 'All Types of Fans', type: 'sub', parent: 'Electrical' },
          { name: 'Ceiling Fans', path: '/ShopPage/Electrical/Fans/CeilingFans', description: 'Ceiling Fans', type: 'sub', parent: 'Electrical' },
          { name: 'Table Fans', path: '/ShopPage/Electrical/Fans/TableFans', description: 'Table Fans', type: 'sub', parent: 'Electrical' },
          { name: 'Pedestal Fans', path: '/ShopPage/Electrical/Fans/PedestalFans', description: 'Pedestal Fans', type: 'sub', parent: 'Electrical' },
          { name: 'Wall Mounting Fans', path: '/ShopPage/Electrical/Fans/WallMountingFans', description: 'Wall Mounting Fans', type: 'sub', parent: 'Electrical' },
          { name: 'Cabin Fans', path: '/ShopPage/Electrical/Fans/CabinFans', description: 'Cabin Fans', type: 'sub', parent: 'Electrical' },
          { name: 'Ventilation Exhaust Fans', path: '/ShopPage/Electrical/Fans/VentilationExhaustFans', description: 'Ventilation Exhaust Fans', type: 'sub', parent: 'Electrical' },
          
          // Electrical - Lights
          { name: 'Lights', path: '/ShopPage/Electrical/Lights', description: 'All Types of Lights', type: 'sub', parent: 'Electrical' },
          { name: 'LED Bulbs', path: '/ShopPage/Electrical/Lights/LEDBulbs', description: 'LED Bulbs and lighting', type: 'sub', parent: 'Electrical' },
          { name: 'Ceiling Light', path: '/ShopPage/Electrical/Lights/CeilingLight', description: 'Ceiling Lights', type: 'sub', parent: 'Electrical' },
          { name: 'Wall Light', path: '/ShopPage/Electrical/Lights/WallLight', description: 'Wall Lights', type: 'sub', parent: 'Electrical' },
          { name: 'Tube Light', path: '/ShopPage/Electrical/Lights/TubeLight', description: 'Tube Lights', type: 'sub', parent: 'Electrical' },
          { name: 'LED Panel Light', path: '/ShopPage/Electrical/Lights/LEDPanelLight', description: 'LED Panel Lights', type: 'sub', parent: 'Electrical' },
          { name: 'LED Street Light', path: '/ShopPage/Electrical/Lights/LEDStreetLight', description: 'LED Street Lights', type: 'sub', parent: 'Electrical' },
          { name: 'LED Spotlight', path: '/ShopPage/Electrical/Lights/LEDSpotlight', description: 'LED Spotlights', type: 'sub', parent: 'Electrical' },
          { name: 'LED Strips', path: '/ShopPage/Electrical/Lights/LEDStrips', description: 'LED Strips', type: 'sub', parent: 'Electrical' },
          { name: 'Garden Light', path: '/ShopPage/Electrical/Lights/GardenLight', description: 'Garden Lights', type: 'sub', parent: 'Electrical' },
          { name: 'Gate Light', path: '/ShopPage/Electrical/Lights/GateLight', description: 'Gate Lights', type: 'sub', parent: 'Electrical' },
          { name: 'Mirror Light', path: '/ShopPage/Electrical/Lights/MirrorLight', description: 'Mirror Lights', type: 'sub', parent: 'Electrical' },
          { name: 'Under Water Lights', path: '/ShopPage/Electrical/Lights/UnderWaterLights', description: 'Under Water Lights', type: 'sub', parent: 'Electrical' },
          { name: 'CFL', path: '/ShopPage/Electrical/Lights/CFL', description: 'CFL Lights', type: 'sub', parent: 'Electrical' },
          { name: 'Desk Light', path: '/ShopPage/Electrical/Lights/Desklight', description: 'Desk Lights', type: 'sub', parent: 'Electrical' },
          { name: 'Focus Light', path: '/ShopPage/Electrical/Lights/FocusLight', description: 'Focus Lights', type: 'sub', parent: 'Electrical' },
          { name: 'GLS', path: '/ShopPage/Electrical/Lights/GLS', description: 'GLS Lights', type: 'sub', parent: 'Electrical' },
          { name: 'LED Batten', path: '/ShopPage/Electrical/Lights/LEDBatten', description: 'LED Batten Lights', type: 'sub', parent: 'Electrical' },
          { name: 'LED Luminaires', path: '/ShopPage/Electrical/Lights/LEDLuminaires', description: 'LED Luminaires', type: 'sub', parent: 'Electrical' },
          { name: 'LED Surface Light', path: '/ShopPage/Electrical/Lights/LedSurfaceLight', description: 'LED Surface Lights', type: 'sub', parent: 'Electrical' },
          { name: 'Light Electronics', path: '/ShopPage/Electrical/Lights/LightElectronics', description: 'Light Electronics', type: 'sub', parent: 'Electrical' },
          { name: 'Lamps', path: '/ShopPage/Electrical/Lights/Lamps', description: 'Lamps', type: 'sub', parent: 'Electrical' },
          { name: 'Reflectors', path: '/ShopPage/Electrical/Lights/Reflectors', description: 'Reflectors', type: 'sub', parent: 'Electrical' },
          { name: 'Standard Incandescent', path: '/ShopPage/Electrical/Lights/StandardIncandescent', description: 'Standard Incandescent Lights', type: 'sub', parent: 'Electrical' },
          { name: 'T Bulb', path: '/ShopPage/Electrical/Lights/TBulb', description: 'T Bulbs', type: 'sub', parent: 'Electrical' },
          { name: 'LED Down Lighters Spot Light', path: '/ShopPage/Electrical/Lights/LedDownLightersSpotLight', description: 'LED Down Lighters Spot Light', type: 'sub', parent: 'Electrical' },
          
          // Electrical - Electrical Fittings
          { name: 'Electrical Fittings Accessories', path: '/ShopPage/Electrical/ElectricalFittings/Accessories', description: 'Electrical Fittings Accessories', type: 'sub', parent: 'Electrical' },
          { name: 'Circular Deep Box', path: '/ShopPage/Electrical/ElectricalFittings/CircularDeepBox', description: 'Circular Deep Box', type: 'sub', parent: 'Electrical' },
          { name: 'Circular Surface Box', path: '/ShopPage/Electrical/ElectricalFittings/CircularSurfaceBox', description: 'Circular Surface Box', type: 'sub', parent: 'Electrical' },
          { name: 'Rigid Type', path: '/ShopPage/Electrical/ElectricalFittings/RigidType', description: 'Rigid Type Fittings', type: 'sub', parent: 'Electrical' },
          
          // Sanitary Subcategories
          { name: 'Bathroom Faucets', path: '/ShopPage/Sanitary/Faucets', description: 'Bathroom Faucets', type: 'sub', parent: 'Sanitary' },
          { name: 'Washbasins', path: '/ShopPage/Sanitary/Washbasins', description: 'Washbasins', type: 'sub', parent: 'Sanitary' },
          { name: 'Showers', path: '/ShopPage/Sanitary/Showers', description: 'Shower Systems', type: 'sub', parent: 'Sanitary' },
          { name: 'Bathroom Accessories', path: '/ShopPage/Sanitary/BathroomAccessories', description: 'Bathroom Accessories', type: 'sub', parent: 'Sanitary' },
          { name: 'Health Faucet', path: '/ShopPage/Sanitary/HealthFaucet', description: 'Health Faucets', type: 'sub', parent: 'Sanitary' },
          { name: 'Kitchen Sinks', path: '/ShopPage/Sanitary/KitchenSinks', description: 'Kitchen Sinks', type: 'sub', parent: 'Sanitary' },
          { name: 'Closets', path: '/ShopPage/Sanitary/Closets', description: 'Water Closets', type: 'sub', parent: 'Sanitary' },
          { name: 'Taps', path: '/ShopPage/Sanitary/Taps', description: 'Taps and Faucets', type: 'sub', parent: 'Sanitary' },
          { name: 'Acrylic Products', path: '/ShopPage/Sanitary/AcrylicProducts', description: 'Acrylic Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Bathsense', path: '/ShopPage/Sanitary/Bathsense', description: 'Bathsense Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Coral Bath Fixtures', path: '/ShopPage/Sanitary/CoralBathFixtures', description: 'Coral Bath Fixtures', type: 'sub', parent: 'Sanitary' },
          { name: 'Corsa', path: '/ShopPage/Sanitary/Corsa', description: 'Corsa Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Essess', path: '/ShopPage/Sanitary/Essess', description: 'Essess Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Hindware', path: '/ShopPage/Sanitary/Hindware', description: 'Hindware Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Jaquar', path: '/ShopPage/Sanitary/Jaquar', description: 'Jaquar Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Leo Bath Fittings', path: '/ShopPage/Sanitary/LeoBathFittings', description: 'Leo Bath Fittings', type: 'sub', parent: 'Sanitary' },
          { name: 'Pamay', path: '/ShopPage/Sanitary/Pamay', description: 'Pamay Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Parryware', path: '/ShopPage/Sanitary/Parryware', description: 'Parryware Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Pearl Precious Products', path: '/ShopPage/Sanitary/PearlPreciousProducts', description: 'Pearl Precious Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Waterman', path: '/ShopPage/Sanitary/Waterman', description: 'Waterman Products', type: 'sub', parent: 'Sanitary' },
          { name: 'WaterTec', path: '/ShopPage/Sanitary/WaterTec', description: 'WaterTec Products', type: 'sub', parent: 'Sanitary' },
          { name: 'Hardware Bathroom Accessories', path: '/ShopPage/Sanitary/HardwareBathroomAccessories', description: 'Hardware Bathroom Accessories', type: 'sub', parent: 'Sanitary' },
          { name: 'Lemon Bathroom Accessories', path: '/ShopPage/Sanitary/LemonBathroomAccessories', description: 'Lemon Bathroom Accessories', type: 'sub', parent: 'Sanitary' },
          
          // Tools Subcategories
          { name: 'Hand Tools', path: '/ShopPage/Tools/handtools', description: 'Hand Tools', type: 'sub', parent: 'Tools' },
          { name: 'Power Tools', path: '/ShopPage/Tools/PowerTools', description: 'Power Tools', type: 'sub', parent: 'Tools' },
          { name: 'Hammer', path: '/ShopPage/Tools/Hammer', description: 'Hammers', type: 'sub', parent: 'Tools' },
          { name: 'Screw Driver', path: '/ShopPage/Tools/ScrewDriver', description: 'Screw Drivers', type: 'sub', parent: 'Tools' },
          { name: 'Spanners', path: '/ShopPage/Tools/Spanners', description: 'Spanners', type: 'sub', parent: 'Tools' },
          { name: 'Plier', path: '/ShopPage/Tools/Plier', description: 'Pliers', type: 'sub', parent: 'Tools' },
          { name: 'Measuring Tape', path: '/ShopPage/Tools/MeasuringTape', description: 'Measuring Tapes', type: 'sub', parent: 'Tools' },
          { name: 'Multimeter', path: '/ShopPage/Tools/Multimeter', description: 'Multimeters', type: 'sub', parent: 'Tools' },
          { name: 'Tool Kit Set', path: '/ShopPage/Tools/toolkitset', description: 'Tool Kit Sets', type: 'sub', parent: 'Tools' },
          { name: 'Garden Tools', path: '/ShopPage/Tools/GardenTools', description: 'Garden Tools', type: 'sub', parent: 'Tools' },
          { name: 'Allen Keys', path: '/ShopPage/Tools/AllenKeys', description: 'Allen Keys', type: 'sub', parent: 'Tools' },
          { name: 'Brush', path: '/ShopPage/Tools/Brush', description: 'Brushes', type: 'sub', parent: 'Tools' },
          { name: 'Carpenter Pincer', path: '/ShopPage/Tools/CarpenterPincer', description: 'Carpenter Pincers', type: 'sub', parent: 'Tools' },
          { name: 'Centre Punches', path: '/ShopPage/Tools/CentrePunches', description: 'Centre Punches', type: 'sub', parent: 'Tools' },
          { name: 'Chisels', path: '/ShopPage/Tools/Chisels', description: 'Chisels', type: 'sub', parent: 'Tools' },
          { name: 'Clamps', path: '/ShopPage/Tools/Clamps', description: 'Clamps', type: 'sub', parent: 'Tools' },
          { name: 'Crowbar', path: '/ShopPage/Tools/Crowbar', description: 'Crowbars', type: 'sub', parent: 'Tools' },
          { name: 'Cutters', path: '/ShopPage/Tools/Cutters', description: 'Cutters', type: 'sub', parent: 'Tools' },
          { name: 'Files', path: '/ShopPage/Tools/files', description: 'Files', type: 'sub', parent: 'Tools' },
          { name: 'Glass Cutter', path: '/ShopPage/Tools/GlassCutter', description: 'Glass Cutters', type: 'sub', parent: 'Tools' },
          { name: 'Glue Gun', path: '/ShopPage/Tools/gluegun', description: 'Glue Guns', type: 'sub', parent: 'Tools' },
          { name: 'Grease Gun', path: '/ShopPage/Tools/GreaseGun', description: 'Grease Guns', type: 'sub', parent: 'Tools' },
          { name: 'Hacksaw Blades', path: '/ShopPage/Tools/HacksawBlades', description: 'Hacksaw Blades', type: 'sub', parent: 'Tools' },
          { name: 'Hammer Drills', path: '/ShopPage/Tools/HammerDrills', description: 'Hammer Drills', type: 'sub', parent: 'Tools' },
          { name: 'Level', path: '/ShopPage/Tools/level', description: 'Levels', type: 'sub', parent: 'Tools' },
          { name: 'Lubrications', path: '/ShopPage/Tools/Lubrications', description: 'Lubrications', type: 'sub', parent: 'Tools' },
          { name: 'Measurement Scale', path: '/ShopPage/Tools/MeasurementScale', description: 'Measurement Scales', type: 'sub', parent: 'Tools' },
          { name: 'Polishing Accessories', path: '/ShopPage/Tools/PolishingAccessories', description: 'Polishing Accessories', type: 'sub', parent: 'Tools' },
          { name: 'Saw', path: '/ShopPage/Tools/saw', description: 'Saws', type: 'sub', parent: 'Tools' },
          { name: 'Silicon Gun', path: '/ShopPage/Tools/SiliconGun', description: 'Silicon Guns', type: 'sub', parent: 'Tools' },
          { name: 'Socket Set', path: '/ShopPage/Tools/Socketset', description: 'Socket Sets', type: 'sub', parent: 'Tools' },
          { name: 'Spare Malets', path: '/ShopPage/Tools/SpareMalets', description: 'Spare Malets', type: 'sub', parent: 'Tools' },
          { name: 'Tool Compartments', path: '/ShopPage/Tools/ToolCompartments', description: 'Tool Compartments', type: 'sub', parent: 'Tools' },
          { name: 'Various Tool Bits', path: '/ShopPage/Tools/varioustoolbits', description: 'Various Tool Bits', type: 'sub', parent: 'Tools' },
          { name: 'Wood Chisel', path: '/ShopPage/Tools/woodChisel', description: 'Wood Chisels', type: 'sub', parent: 'Tools' },
          { name: 'Wood Items', path: '/ShopPage/Tools/woodItems', description: 'Wood Items', type: 'sub', parent: 'Tools' },
          { name: 'Wrench', path: '/ShopPage/Tools/Wrench', description: 'Wrenches', type: 'sub', parent: 'Tools' },
          { name: 'Abrasives', path: '/ShopPage/Tools/abrasives', description: 'Abrasives', type: 'sub', parent: 'Tools' },
          { name: 'Gear Pullers', path: '/ShopPage/Tools/GearPullers', description: 'Gear Pullers', type: 'sub', parent: 'Tools' },
          
          // Paint Subcategories
          { name: 'Emulsion Paint', path: '/ShopPage/Paint/Emulsion', description: 'Emulsion Paints', type: 'sub', parent: 'Paint' },
          { name: 'Enamel Paint', path: '/ShopPage/Paint/Enamel', description: 'Enamel Paints', type: 'sub', parent: 'Paint' },
          { name: 'Primer', path: '/ShopPage/Paint/Primer', description: 'Primers', type: 'sub', parent: 'Paint' },
          { name: 'Wall Putty', path: '/ShopPage/Paint/WallPutty', description: 'Wall Putty', type: 'sub', parent: 'Paint' },
          { name: 'Brushes & Rollers', path: '/ShopPage/Paint/BrushesRollers', description: 'Paint Brushes and Rollers', type: 'sub', parent: 'Paint' },
          { name: 'Spray Paints', path: '/ShopPage/Paint/SprayPaints', description: 'Spray Paints', type: 'sub', parent: 'Paint' },
          { name: 'Wood Finishes', path: '/ShopPage/Paint/WoodFinishes', description: 'Wood Finishes', type: 'sub', parent: 'Paint' },
          { name: 'Waterproofing', path: '/ShopPage/Paint/Waterproofing', description: 'Waterproofing Paints', type: 'sub', parent: 'Paint' },
          { name: 'Distemper', path: '/ShopPage/Paint/Distemper', description: 'Distemper Paints', type: 'sub', parent: 'Paint' },
          { name: 'Floor Paints', path: '/ShopPage/Paint/FloorPaints', description: 'Floor Paints', type: 'sub', parent: 'Paint' },
          
          // Locks - ALL Subcategories and Nested Folders
          { name: 'Door Accessories', path: '/ShopPage/Locks/DoorAccessories', description: 'Door Accessories', type: 'sub', parent: 'Locks' },
          { name: 'Door Controls', path: '/ShopPage/Locks/DoorControls', description: 'Door Controls', type: 'sub', parent: 'Locks' },
          { name: 'Door Handles', path: '/ShopPage/Locks/DoorHandles', description: 'Door Handles', type: 'sub', parent: 'Locks' },
          { name: 'Door Locks', path: '/ShopPage/Locks/DoorLocks', description: 'Door Locks', type: 'sub', parent: 'Locks' },
          { name: 'Folding Brackets', path: '/ShopPage/Locks/FoldingBrackets', description: 'Folding Brackets', type: 'sub', parent: 'Locks' },
          { name: 'Furniture Fittings', path: '/ShopPage/Locks/FurnitureFittings', description: 'Furniture Fittings', type: 'sub', parent: 'Locks' },
          { name: 'Glass Hardware', path: '/ShopPage/Locks/GlassHardware', description: 'Glass Hardware', type: 'sub', parent: 'Locks' },
          { name: 'Lever Mortise Locks', path: '/ShopPage/Locks/LeverMortiseLocks', description: 'Lever Mortise Locks', type: 'sub', parent: 'Locks' },
          { name: 'Mortice Locks', path: '/ShopPage/Locks/MorticeLocks', description: 'Mortice Locks', type: 'sub', parent: 'Locks' },
          { name: 'Mortise Lock Body', path: '/ShopPage/Locks/MortiseLockBody', description: 'Mortise Lock Body', type: 'sub', parent: 'Locks' },
          { name: 'Padlocks', path: '/ShopPage/Locks/Padlocks', description: 'Padlocks', type: 'sub', parent: 'Locks' },
          { name: 'Patch Fittings', path: '/ShopPage/Locks/PatchFittings', description: 'Patch Fittings', type: 'sub', parent: 'Locks' },
          { name: 'Popular Mortise Series', path: '/ShopPage/Locks/PopularMortiseSeries', description: 'Popular Mortise Series', type: 'sub', parent: 'Locks' },
          { name: 'Premium Mortise Series', path: '/ShopPage/Locks/PremiumMortiseSeries', description: 'Premium Mortise Series', type: 'sub', parent: 'Locks' },
          { name: 'Rim Locks', path: '/ShopPage/Locks/RimLocks', description: 'Rim Locks', type: 'sub', parent: 'Locks' },
          
          // Locks - Door Accessories
          { name: 'Aluminium Tower Bolt', path: '/ShopPage/Locks/DoorAccessories/AluminiumTowerBolt', description: 'Aluminium Tower Bolt', type: 'sub', parent: 'Locks' },
          { name: 'Ball Bearing Door Hinges', path: '/ShopPage/Locks/DoorAccessories/BallBearingDoorHinges', description: 'Ball Bearing Door Hinges', type: 'sub', parent: 'Locks' },
          { name: 'Concealed Hinges', path: '/ShopPage/Locks/DoorAccessories/ConcealedHinges', description: 'Concealed Hinges', type: 'sub', parent: 'Locks' },
          { name: 'Door Eye', path: '/ShopPage/Locks/DoorAccessories/DoorEye', description: 'Door Eye', type: 'sub', parent: 'Locks' },
          { name: 'Door Stopper', path: '/ShopPage/Locks/DoorAccessories/DoorStopper', description: 'Door Stopper', type: 'sub', parent: 'Locks' },
          { name: 'Hinges', path: '/ShopPage/Locks/DoorAccessories/Hinges', description: 'Hinges', type: 'sub', parent: 'Locks' },
          { name: 'Magnetic Door Stoppers', path: '/ShopPage/Locks/DoorAccessories/MagneticDoorStoppers', description: 'Magnetic Door Stoppers', type: 'sub', parent: 'Locks' },
          { name: 'Wooden Sliding Door Fittings', path: '/ShopPage/Locks/DoorAccessories/WoodenSlidingDoorFittings', description: 'Wooden Sliding Door Fittings', type: 'sub', parent: 'Locks' },
          
          // Locks - Door Controls
          { name: 'Door Closer', path: '/ShopPage/Locks/DoorControls/DoorCloser', description: 'Door Closer', type: 'sub', parent: 'Locks' },
          { name: 'Hydraulic Door Closers', path: '/ShopPage/Locks/DoorControls/HydraulicDoorClosers', description: 'Hydraulic Door Closers', type: 'sub', parent: 'Locks' },
          
          // Locks - Door Handles
          { name: 'Door Kings', path: '/ShopPage/Locks/DoorHandles/DoorKings', description: 'Door Kings', type: 'sub', parent: 'Locks' },
          { name: 'Door Pulls', path: '/ShopPage/Locks/DoorHandles/DoorPulls', description: 'Door Pulls', type: 'sub', parent: 'Locks' },
          
          // Locks - Door Locks
          { name: 'Centre Shutter Locks', path: '/ShopPage/Locks/DoorLocks/CentreShutterLocks', description: 'Centre Shutter Locks', type: 'sub', parent: 'Locks' },
          { name: 'Cupboard Locks', path: '/ShopPage/Locks/DoorLocks/CupboardLocks', description: 'Cupboard Locks', type: 'sub', parent: 'Locks' },
          { name: 'Cylindrical Locks', path: '/ShopPage/Locks/DoorLocks/CylindricalLocks', description: 'Cylindrical Locks', type: 'sub', parent: 'Locks' },
          { name: 'Dead Locks', path: '/ShopPage/Locks/DoorLocks/DeadLocks', description: 'Dead Locks', type: 'sub', parent: 'Locks' },
          { name: 'Diamant Padlocks', path: '/ShopPage/Locks/DoorLocks/DiamantPadlocks', description: 'Diamant Padlocks', type: 'sub', parent: 'Locks' },
          { name: 'Dimple Key', path: '/ShopPage/Locks/DoorLocks/DimpleKey', description: 'Dimple Key', type: 'sub', parent: 'Locks' },
          { name: 'Disc Pad Locks', path: '/ShopPage/Locks/DoorLocks/DiscPadLocks', description: 'Disc Pad Locks', type: 'sub', parent: 'Locks' },
          { name: 'Drawer Lock', path: '/ShopPage/Locks/DoorLocks/DrawerLock', description: 'Drawer Lock', type: 'sub', parent: 'Locks' },
          { name: 'Jemmy Proof Door Lock', path: '/ShopPage/Locks/DoorLocks/JemmyProofDoorLock', description: 'Jemmy Proof Door Lock', type: 'sub', parent: 'Locks' },
          { name: 'Knob Locks', path: '/ShopPage/Locks/DoorLocks/KnobLocks', description: 'Knob Locks', type: 'sub', parent: 'Locks' },
          { name: 'Main Door Lock', path: '/ShopPage/Locks/DoorLocks/MainDoorLock', description: 'Main Door Lock', type: 'sub', parent: 'Locks' },
          { name: 'Night Latch', path: '/ShopPage/Locks/DoorLocks/NightLatch', description: 'Night Latch', type: 'sub', parent: 'Locks' },
          { name: 'Pull Handles For Main Doors', path: '/ShopPage/Locks/DoorLocks/PullHandlesForMainDoors', description: 'Pull Handles For Main Doors', type: 'sub', parent: 'Locks' },
          { name: 'Rim Dead Lock', path: '/ShopPage/Locks/DoorLocks/RimDeadLock', description: 'Rim Dead Lock', type: 'sub', parent: 'Locks' },
          { name: 'Side Lock', path: '/ShopPage/Locks/DoorLocks/SideLock', description: 'Side Lock', type: 'sub', parent: 'Locks' },
          { name: 'Smart Key', path: '/ShopPage/Locks/DoorLocks/SmartKey', description: 'Smart Key', type: 'sub', parent: 'Locks' },
          { name: 'Tri Bolt Locks', path: '/ShopPage/Locks/DoorLocks/TriBoltLocks', description: 'Tri Bolt Locks', type: 'sub', parent: 'Locks' },
          
          // Locks - Folding Brackets
          { name: 'Blind Corner Hinge', path: '/ShopPage/Locks/FoldingBrackets/BlindCornerHinge', description: 'Blind Corner Hinge', type: 'sub', parent: 'Locks' },
          { name: 'Cabinet Hinge', path: '/ShopPage/Locks/FoldingBrackets/CabinetHinge', description: 'Cabinet Hinge', type: 'sub', parent: 'Locks' },
          { name: 'Clip On Soft Hinge', path: '/ShopPage/Locks/FoldingBrackets/ClipOnSoftHinge', description: 'Clip On Soft Hinge', type: 'sub', parent: 'Locks' },
          { name: 'Drawer Channels', path: '/ShopPage/Locks/FoldingBrackets/DrawerChannels', description: 'Drawer Channels', type: 'sub', parent: 'Locks' },
          { name: 'Heavy Duty Drawer Slides', path: '/ShopPage/Locks/FoldingBrackets/HeavyDutyDrawerSlides', description: 'Heavy Duty Drawer Slides', type: 'sub', parent: 'Locks' },
          { name: 'Soft Close Drawer Channel', path: '/ShopPage/Locks/FoldingBrackets/SoftCloseDrawerChannel', description: 'Soft Close Drawer Channel', type: 'sub', parent: 'Locks' },
          { name: 'Thick Door Hinge', path: '/ShopPage/Locks/FoldingBrackets/ThickDoorHinge', description: 'Thick Door Hinge', type: 'sub', parent: 'Locks' },
          
          // Locks - Furniture Fittings
          { name: 'Curvo', path: '/ShopPage/Locks/FurnitureFittings/Curvo', description: 'Curvo', type: 'sub', parent: 'Locks' },
          { name: 'Drawer Cupboard Lock', path: '/ShopPage/Locks/FurnitureFittings/DrawerCupboardLock', description: 'Drawer Cupboard Lock', type: 'sub', parent: 'Locks' },
          { name: 'Drawer Locks', path: '/ShopPage/Locks/FurnitureFittings/DrawerLocks', description: 'Drawer Locks', type: 'sub', parent: 'Locks' },
          { name: 'Multi Purpose Lock', path: '/ShopPage/Locks/FurnitureFittings/MultiPurposeLock', description: 'Multi Purpose Lock', type: 'sub', parent: 'Locks' },
          { name: 'Nuvo', path: '/ShopPage/Locks/FurnitureFittings/Nuvo', description: 'Nuvo', type: 'sub', parent: 'Locks' },
          { name: 'Supernova', path: '/ShopPage/Locks/FurnitureFittings/Supernova', description: 'Supernova', type: 'sub', parent: 'Locks' },
          { name: 'Table Lock', path: '/ShopPage/Locks/FurnitureFittings/TableLock', description: 'Table Lock', type: 'sub', parent: 'Locks' },
          
          // Locks - Glass Hardware
          { name: 'Floor Spring', path: '/ShopPage/Locks/GlassHardware/FloorSpring', description: 'Floor Spring', type: 'sub', parent: 'Locks' },
          { name: 'Glass Door Fitting', path: '/ShopPage/Locks/GlassHardware/GlassDoorFitting', description: 'Glass Door Fitting', type: 'sub', parent: 'Locks' },
          { name: 'Glass Door Lock', path: '/ShopPage/Locks/GlassHardware/GlassDoorLock', description: 'Glass Door Lock', type: 'sub', parent: 'Locks' },
          { name: 'Glass Door Pull Handle', path: '/ShopPage/Locks/GlassHardware/GlassDoorPullHandle', description: 'Glass Door Pull Handle', type: 'sub', parent: 'Locks' },
          { name: 'Shower Cubicle Hinge', path: '/ShopPage/Locks/GlassHardware/ShowerCubicleHinge', description: 'Shower Cubicle Hinge', type: 'sub', parent: 'Locks' },
          { name: 'Sliding System', path: '/ShopPage/Locks/GlassHardware/SlidingSystem', description: 'Sliding System', type: 'sub', parent: 'Locks' },
          
          // Locks - Padlocks
          { name: 'Disc Padlocks', path: '/ShopPage/Locks/Padlocks/DiscPadlocks', description: 'Disc Padlocks', type: 'sub', parent: 'Locks' },
          { name: 'Premium Padlocks', path: '/ShopPage/Locks/Padlocks/PremiumPadlocks', description: 'Premium Padlocks', type: 'sub', parent: 'Locks' },
          { name: 'Round Type Padlock', path: '/ShopPage/Locks/Padlocks/RoundTypePadlock', description: 'Round Type Padlock', type: 'sub', parent: 'Locks' },
          { name: 'Square Type Padlock', path: '/ShopPage/Locks/Padlocks/SquareTypePadlock', description: 'Square Type Padlock', type: 'sub', parent: 'Locks' },
          { name: 'Ultra Shutter Locks', path: '/ShopPage/Locks/Padlocks/UltraShutterLocks', description: 'Ultra Shutter Locks', type: 'sub', parent: 'Locks' },
          
          // Pipes & Fittings - ALL Subcategories
          { name: 'Ashirvad Pipes', path: '/ShopPage/Pipe/AshirvadPipes', description: 'Ashirvad Pipes', type: 'sub', parent: 'Pipe' },
          { name: 'Astral Pipes', path: '/ShopPage/Pipe/AstralPipes', description: 'Astral Pipes', type: 'sub', parent: 'Pipe' },
          { name: 'Birla Pipe', path: '/ShopPage/Pipe/BirlaPipe', description: 'Birla Pipe', type: 'sub', parent: 'Pipe' },
          { name: 'Finolex Pipes', path: '/ShopPage/Pipe/FinolexPipes', description: 'Finolex Pipes', type: 'sub', parent: 'Pipe' },
          { name: 'Nepul Pipes', path: '/ShopPage/Pipe/NepulPipes', description: 'Nepul Pipes', type: 'sub', parent: 'Pipe' },
          { name: 'Prakash Pipe', path: '/ShopPage/Pipe/PrakashPipe', description: 'Prakash Pipe', type: 'sub', parent: 'Pipe' },
          { name: 'Prince Pipe', path: '/ShopPage/Pipe/PrincePipe', description: 'Prince Pipe', type: 'sub', parent: 'Pipe' },
          { name: 'Supreme Pipe', path: '/ShopPage/Pipe/SupremePipe', description: 'Supreme Pipe', type: 'sub', parent: 'Pipe' },
          { name: 'Tata Pipe', path: '/ShopPage/Pipe/TataPipe', description: 'Tata Pipe', type: 'sub', parent: 'Pipe' },
          { name: 'TSA Pipe', path: '/ShopPage/Pipe/TSAPipe', description: 'TSA Pipe', type: 'sub', parent: 'Pipe' },
          
          // Roofer - ALL Subcategories
          { name: 'Aluminium Sheet', path: '/ShopPage/Roofer/AluminiumSheet', description: 'Aluminium Sheet', type: 'sub', parent: 'Roofer' },
          { name: 'Cements Sheet', path: '/ShopPage/Roofer/CementsSheet', description: 'Cements Sheet', type: 'sub', parent: 'Roofer' },
          { name: 'Color Sheet', path: '/ShopPage/Roofer/ColorSheet', description: 'Color Sheet', type: 'sub', parent: 'Roofer' },
          { name: 'Fiber Sheet', path: '/ShopPage/Roofer/FiberSheet', description: 'Fiber Sheet', type: 'sub', parent: 'Roofer' },
          { name: 'Metal', path: '/ShopPage/Roofer/Metal', description: 'Metal Roofing', type: 'sub', parent: 'Roofer' },
          { name: 'Shingles', path: '/ShopPage/Roofer/Shingles', description: 'Shingles', type: 'sub', parent: 'Roofer' },
          { name: 'Teen Sheet', path: '/ShopPage/Roofer/TeenSheet', description: 'Teen Sheet', type: 'sub', parent: 'Roofer' },
          
          // WaterProofing - ALL Subcategories
          { name: 'Bathrooms', path: '/ShopPage/WaterProofing/Bathrooms', description: 'Bathroom WaterProofing', type: 'sub', parent: 'WaterProofing' },
          { name: 'Cracks Joints', path: '/ShopPage/WaterProofing/CracksJoints', description: 'Cracks Joints WaterProofing', type: 'sub', parent: 'WaterProofing' },
          { name: 'Interiors', path: '/ShopPage/WaterProofing/Interiors', description: 'Interior WaterProofing', type: 'sub', parent: 'WaterProofing' }
        ];

        // Filter categories based on search query
        const filteredCategories = allCategories.filter(category => 
          category.name.toLowerCase().includes(query.toLowerCase()) ||
          category.description.toLowerCase().includes(query.toLowerCase())
        );

        setCategories(filteredCategories);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search categories');
      } finally {
        setLoading(false);
      }
    };

    searchCategories();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          <p className="mt-2 text-gray-600">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} found
          </p>
        </div>

        {/* Results */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.path}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      category.type === 'main' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <span className={`font-bold text-2xl ${
                        category.type === 'main' ? 'text-yellow-300' : 'text-blue-600'
                      }`}>
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {category.description}
                      </p>
                      {category.type === 'sub' && (
                        <p className="text-xs text-blue-600 font-medium">Under {category.parent}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className={`inline-flex items-center px-4 py-2 font-medium rounded-full transition-colors ${
                      category.type === 'main' 
                        ? 'bg-yellow-300 text-white hover:bg-yellow-300' 
                        : 'bg-blue-400 text-white hover:bg-blue-500'
                    }`}>
                      View {category.name} Products
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
