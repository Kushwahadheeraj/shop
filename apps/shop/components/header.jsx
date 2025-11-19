'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '@/public/logo.png';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import LoginRegisterModal from "@/components/LoginRegisterModal";
import { useCart } from '@/components/CartContext';
import CartPreview from '@/components/CartPreview';
import API_BASE_URL from '@/lib/apiConfig';
import { performLogout } from '@/lib/logout';


export default function Header() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { count } = useCart() || { count: 0 };
  const [hover, setHover] = useState(false);
  const [username, setUsername] = useState('');
  const [userOpen, setUserOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const allRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('euser_token');
      let name = localStorage.getItem('euser_username');
      if (token && !name) {
        try {
          const res = await fetch(`${API_BASE_URL}/euser/me`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            name = data?.username || data?.email?.split('@')[0] || 'USER';
            localStorage.setItem('euser_username', name);
          }
        } catch {}
      }
      setUsername(token ? (name || 'USER') : '');
    };
    load();
    const onAuth = () => load();
    window.addEventListener('euser-auth', onAuth);
    return () => window.removeEventListener('euser-auth', onAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (allRef.current && !allRef.current.contains(event.target)) {
        setAllOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality for categories/pages
  useEffect(() => {
    const searchCategories = () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      // Define available categories/pages with ALL subcategories and nested folders
      const categories = [
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
        
        // Sanitary - ALL Subcategories and Nested Folders
        { name: 'Acrylic Products', path: '/ShopPage/Sanitary/AcrylicProducts', description: 'Acrylic Products', type: 'sub', parent: 'Sanitary' },
        { name: 'Bathroom Accessories', path: '/ShopPage/Sanitary/BathroomAccessories', description: 'Bathroom Accessories', type: 'sub', parent: 'Sanitary' },
        { name: 'Bathroom Faucets', path: '/ShopPage/Sanitary/Faucets', description: 'Bathroom Faucets', type: 'sub', parent: 'Sanitary' },
        { name: 'Closets', path: '/ShopPage/Sanitary/Closets', description: 'Water Closets', type: 'sub', parent: 'Sanitary' },
        { name: 'Health Faucet', path: '/ShopPage/Sanitary/HealthFaucet', description: 'Health Faucets', type: 'sub', parent: 'Sanitary' },
        { name: 'Kitchen Sinks', path: '/ShopPage/Sanitary/KitchenSinks', description: 'Kitchen Sinks', type: 'sub', parent: 'Sanitary' },
        { name: 'Showers', path: '/ShopPage/Sanitary/Showers', description: 'Shower Systems', type: 'sub', parent: 'Sanitary' },
        { name: 'Taps', path: '/ShopPage/Sanitary/Taps', description: 'Taps and Faucets', type: 'sub', parent: 'Sanitary' },
        { name: 'Washbasins', path: '/ShopPage/Sanitary/Washbasins', description: 'Washbasins', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Bathsense
        { name: 'Bathsense', path: '/ShopPage/Sanitary/Bathsense', description: 'Bathsense Products', type: 'sub', parent: 'Sanitary' },
        { name: 'Bathsense CP Fittings Faucets', path: '/ShopPage/Sanitary/Bathsense/CPfittingsFaucets', description: 'Bathsense CP Fittings Faucets', type: 'sub', parent: 'Sanitary' },
        { name: 'Bathsense Sanitaryware', path: '/ShopPage/Sanitary/Bathsense/Sanitaryware', description: 'Bathsense Sanitaryware', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Coral Bath Fixtures
        { name: 'Coral Bath Fixtures', path: '/ShopPage/Sanitary/CoralBathFixtures', description: 'Coral Bath Fixtures', type: 'sub', parent: 'Sanitary' },
        { name: 'Coral Eurosmart Series', path: '/ShopPage/Sanitary/CoralBathFixtures/EurosmartSeries', description: 'Coral Eurosmart Series', type: 'sub', parent: 'Sanitary' },
        { name: 'Coral Flowmore Series', path: '/ShopPage/Sanitary/CoralBathFixtures/FlowmoreSeries', description: 'Coral Flowmore Series', type: 'sub', parent: 'Sanitary' },
        { name: 'Coral New Super Glow Series', path: '/ShopPage/Sanitary/CoralBathFixtures/NewSuperGlowSeries', description: 'Coral New Super Glow Series', type: 'sub', parent: 'Sanitary' },
        { name: 'Coral Royale Series', path: '/ShopPage/Sanitary/CoralBathFixtures/RoyaleSeries', description: 'Coral Royale Series', type: 'sub', parent: 'Sanitary' },
        { name: 'Coral Treemo Series', path: '/ShopPage/Sanitary/CoralBathFixtures/TreemoSeries', description: 'Coral Treemo Series', type: 'sub', parent: 'Sanitary' },
        { name: 'Coral Xrossa Series', path: '/ShopPage/Sanitary/CoralBathFixtures/XrossaSeries', description: 'Coral Xrossa Series', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Corsa
        { name: 'Corsa', path: '/ShopPage/Sanitary/Corsa', description: 'Corsa Products', type: 'sub', parent: 'Sanitary' },
        { name: 'Corsa Bathroom Accessories', path: '/ShopPage/Sanitary/Corsa/BATHROOMACCESSORIES', description: 'Corsa Bathroom Accessories', type: 'sub', parent: 'Sanitary' },
        { name: 'Corsa Bathroom Faucets', path: '/ShopPage/Sanitary/Corsa/BathroomFaucets', description: 'Corsa Bathroom Faucets', type: 'sub', parent: 'Sanitary' },
        { name: 'Corsa Flushing Cistern', path: '/ShopPage/Sanitary/Corsa/FlushingCistern', description: 'Corsa Flushing Cistern', type: 'sub', parent: 'Sanitary' },
        { name: 'Corsa Kitchen', path: '/ShopPage/Sanitary/Corsa/Kitchen', description: 'Corsa Kitchen', type: 'sub', parent: 'Sanitary' },
        { name: 'Corsa Other Useful Items', path: '/ShopPage/Sanitary/Corsa/OtherUsefulItems', description: 'Corsa Other Useful Items', type: 'sub', parent: 'Sanitary' },
        { name: 'Corsa Showers', path: '/ShopPage/Sanitary/Corsa/Showers', description: 'Corsa Showers', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Essess
        { name: 'Essess', path: '/ShopPage/Sanitary/Essess', description: 'Essess Products', type: 'sub', parent: 'Sanitary' },
        { name: 'Essess Accessories', path: '/ShopPage/Sanitary/Essess/Accessories', description: 'Essess Accessories', type: 'sub', parent: 'Sanitary' },
        { name: 'Essess Auto Close Taps', path: '/ShopPage/Sanitary/Essess/AutoCloseTaps', description: 'Essess Auto Close Taps', type: 'sub', parent: 'Sanitary' },
        { name: 'Essess Showers', path: '/ShopPage/Sanitary/Essess/Showers', description: 'Essess Showers', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Hindware
        { name: 'Hindware', path: '/ShopPage/Sanitary/Hindware', description: 'Hindware Products', type: 'sub', parent: 'Sanitary' },
        { name: 'Hindware Faucets', path: '/ShopPage/Sanitary/Hindware/Faucets', description: 'Hindware Faucets', type: 'sub', parent: 'Sanitary' },
        { name: 'Hindware Showers', path: '/ShopPage/Sanitary/Hindware/Showers', description: 'Hindware Showers', type: 'sub', parent: 'Sanitary' },
        { name: 'Hindware Wash Basins', path: '/ShopPage/Sanitary/Hindware/WashBasins', description: 'Hindware Wash Basins', type: 'sub', parent: 'Sanitary' },
        { name: 'Hindware Water Closets', path: '/ShopPage/Sanitary/Hindware/WaterClosets', description: 'Hindware Water Closets', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Jaquar
        { name: 'Jaquar', path: '/ShopPage/Sanitary/Jaquar', description: 'Jaquar Products', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Leo Bath Fittings
        { name: 'Leo Bath Fittings', path: '/ShopPage/Sanitary/LeoBathFittings', description: 'Leo Bath Fittings', type: 'sub', parent: 'Sanitary' },
        { name: 'Leo Bathroom Accessories', path: '/ShopPage/Sanitary/LeoBathFittings/BathroomAccessories', description: 'Leo Bathroom Accessories', type: 'sub', parent: 'Sanitary' },
        { name: 'Leo Faucets', path: '/ShopPage/Sanitary/LeoBathFittings/Faucets', description: 'Leo Faucets', type: 'sub', parent: 'Sanitary' },
        { name: 'Leo Valve', path: '/ShopPage/Sanitary/LeoBathFittings/Valve', description: 'Leo Valve', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Pamay
        { name: 'Pamay', path: '/ShopPage/Sanitary/Pamay', description: 'Pamay Products', type: 'sub', parent: 'Sanitary' },
        { name: 'Pamay Faucets', path: '/ShopPage/Sanitary/Pamay/Faucets', description: 'Pamay Faucets', type: 'sub', parent: 'Sanitary' },
        { name: 'Pamay Showers', path: '/ShopPage/Sanitary/Pamay/Showers', description: 'Pamay Showers', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Parryware
        { name: 'Parryware', path: '/ShopPage/Sanitary/Parryware', description: 'Parryware Products', type: 'sub', parent: 'Sanitary' },
        { name: 'Parryware Faucets', path: '/ShopPage/Sanitary/Parryware/Faucets', description: 'Parryware Faucets', type: 'sub', parent: 'Sanitary' },
        { name: 'Parryware Showers', path: '/ShopPage/Sanitary/Parryware/Showers', description: 'Parryware Showers', type: 'sub', parent: 'Sanitary' },
        { name: 'Parryware Wash Basins', path: '/ShopPage/Sanitary/Parryware/WashBasins', description: 'Parryware Wash Basins', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Pearl Precious Products
        { name: 'Pearl Precious Products', path: '/ShopPage/Sanitary/PearlPreciousProducts', description: 'Pearl Precious Products', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Waterman
        { name: 'Waterman', path: '/ShopPage/Sanitary/Waterman', description: 'Waterman Products', type: 'sub', parent: 'Sanitary' },
        { name: 'Waterman Accessories', path: '/ShopPage/Sanitary/Waterman/Accessories', description: 'Waterman Accessories', type: 'sub', parent: 'Sanitary' },
        { name: 'Waterman Hand Showers', path: '/ShopPage/Sanitary/Waterman/HandShowers', description: 'Waterman Hand Showers', type: 'sub', parent: 'Sanitary' },
        { name: 'Waterman Rain Showers', path: '/ShopPage/Sanitary/Waterman/RainShowers', description: 'Waterman Rain Showers', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - WaterTec
        { name: 'WaterTec', path: '/ShopPage/Sanitary/WaterTec', description: 'WaterTec Products', type: 'sub', parent: 'Sanitary' },
        { name: 'WaterTec Bathroom Accessories', path: '/ShopPage/Sanitary/WaterTec/BathroomAccessories', description: 'WaterTec Bathroom Accessories', type: 'sub', parent: 'Sanitary' },
        { name: 'WaterTec Showers', path: '/ShopPage/Sanitary/WaterTec/Showers', description: 'WaterTec Showers', type: 'sub', parent: 'Sanitary' },
        { name: 'WaterTec Taps', path: '/ShopPage/Sanitary/WaterTec/Taps', description: 'WaterTec Taps', type: 'sub', parent: 'Sanitary' },
        
        // Sanitary - Hardware & Lemon
        { name: 'Hardware Bathroom Accessories', path: '/ShopPage/Sanitary/HardwareBathroomAccessories', description: 'Hardware Bathroom Accessories', type: 'sub', parent: 'Sanitary' },
        { name: 'Lemon Bathroom Accessories', path: '/ShopPage/Sanitary/LemonBathroomAccessories', description: 'Lemon Bathroom Accessories', type: 'sub', parent: 'Sanitary' },
        
        // Tools - ALL Subcategories and Nested Folders
        { name: 'Abrasives', path: '/ShopPage/Tools/abrasives', description: 'Abrasives', type: 'sub', parent: 'Tools' },
        { name: 'Allen Keys', path: '/ShopPage/Tools/AllenKeys', description: 'Allen Keys', type: 'sub', parent: 'Tools' },
        { name: 'Brush', path: '/ShopPage/Tools/Brush', description: 'Brushes', type: 'sub', parent: 'Tools' },
        { name: 'Carpenter Pincer', path: '/ShopPage/Tools/CarpenterPincer', description: 'Carpenter Pincers', type: 'sub', parent: 'Tools' },
        { name: 'Centre Punches', path: '/ShopPage/Tools/CentrePunches', description: 'Centre Punches', type: 'sub', parent: 'Tools' },
        { name: 'Chisels', path: '/ShopPage/Tools/Chisels', description: 'Chisels', type: 'sub', parent: 'Tools' },
        { name: 'Clamps', path: '/ShopPage/Tools/Clamps', description: 'Clamps', type: 'sub', parent: 'Tools' },
        { name: 'Crowbar', path: '/ShopPage/Tools/Crowbar', description: 'Crowbars', type: 'sub', parent: 'Tools' },
        { name: 'Cutters', path: '/ShopPage/Tools/Cutters', description: 'Cutters', type: 'sub', parent: 'Tools' },
        { name: 'Files', path: '/ShopPage/Tools/files', description: 'Files', type: 'sub', parent: 'Tools' },
        { name: 'Garden Tools', path: '/ShopPage/Tools/GardenTools', description: 'Garden Tools', type: 'sub', parent: 'Tools' },
        { name: 'Gear Pullers', path: '/ShopPage/Tools/GearPullers', description: 'Gear Pullers', type: 'sub', parent: 'Tools' },
        { name: 'Glass Cutter', path: '/ShopPage/Tools/GlassCutter', description: 'Glass Cutters', type: 'sub', parent: 'Tools' },
        { name: 'Glue Gun', path: '/ShopPage/Tools/gluegun', description: 'Glue Guns', type: 'sub', parent: 'Tools' },
        { name: 'Grease Gun', path: '/ShopPage/Tools/GreaseGun', description: 'Grease Guns', type: 'sub', parent: 'Tools' },
        { name: 'Hacksaw Blades', path: '/ShopPage/Tools/HacksawBlades', description: 'Hacksaw Blades', type: 'sub', parent: 'Tools' },
        { name: 'Hammer', path: '/ShopPage/Tools/Hammer', description: 'Hammers', type: 'sub', parent: 'Tools' },
        { name: 'Hammer Drills', path: '/ShopPage/Tools/HammerDrills', description: 'Hammer Drills', type: 'sub', parent: 'Tools' },
        { name: 'Hand Tools', path: '/ShopPage/Tools/handtools', description: 'Hand Tools', type: 'sub', parent: 'Tools' },
        { name: 'Level', path: '/ShopPage/Tools/level', description: 'Levels', type: 'sub', parent: 'Tools' },
        { name: 'Lubrications', path: '/ShopPage/Tools/Lubrications', description: 'Lubrications', type: 'sub', parent: 'Tools' },
        { name: 'Measurement Scale', path: '/ShopPage/Tools/MeasurementScale', description: 'Measurement Scales', type: 'sub', parent: 'Tools' },
        { name: 'Measuring Tape', path: '/ShopPage/Tools/MeasuringTape', description: 'Measuring Tapes', type: 'sub', parent: 'Tools' },
        { name: 'Multimeter', path: '/ShopPage/Tools/Multimeter', description: 'Multimeters', type: 'sub', parent: 'Tools' },
        { name: 'Plier', path: '/ShopPage/Tools/Plier', description: 'Pliers', type: 'sub', parent: 'Tools' },
        { name: 'Polishing Accessories', path: '/ShopPage/Tools/PolishingAccessories', description: 'Polishing Accessories', type: 'sub', parent: 'Tools' },
        { name: 'Power Tools', path: '/ShopPage/Tools/PowerTools', description: 'Power Tools', type: 'sub', parent: 'Tools' },
        { name: 'Saw', path: '/ShopPage/Tools/saw', description: 'Saws', type: 'sub', parent: 'Tools' },
        { name: 'Screw Driver', path: '/ShopPage/Tools/ScrewDriver', description: 'Screw Drivers', type: 'sub', parent: 'Tools' },
        { name: 'Silicon Gun', path: '/ShopPage/Tools/SiliconGun', description: 'Silicon Guns', type: 'sub', parent: 'Tools' },
        { name: 'Socket Set', path: '/ShopPage/Tools/Socketset', description: 'Socket Sets', type: 'sub', parent: 'Tools' },
        { name: 'Spanners', path: '/ShopPage/Tools/Spanners', description: 'Spanners', type: 'sub', parent: 'Tools' },
        { name: 'Spare Malets', path: '/ShopPage/Tools/SpareMalets', description: 'Spare Malets', type: 'sub', parent: 'Tools' },
        { name: 'Tool Compartments', path: '/ShopPage/Tools/ToolCompartments', description: 'Tool Compartments', type: 'sub', parent: 'Tools' },
        { name: 'Tool Kit Set', path: '/ShopPage/Tools/toolkitset', description: 'Tool Kit Sets', type: 'sub', parent: 'Tools' },
        { name: 'Various Tool Bits', path: '/ShopPage/Tools/varioustoolbits', description: 'Various Tool Bits', type: 'sub', parent: 'Tools' },
        { name: 'Wood Chisel', path: '/ShopPage/Tools/woodChisel', description: 'Wood Chisels', type: 'sub', parent: 'Tools' },
        { name: 'Wood Items', path: '/ShopPage/Tools/woodItems', description: 'Wood Items', type: 'sub', parent: 'Tools' },
        { name: 'Wrench', path: '/ShopPage/Tools/Wrench', description: 'Wrenches', type: 'sub', parent: 'Tools' },
        
        // Tools - Abrasives
        { name: 'Cut Off Wheel', path: '/ShopPage/Tools/abrasives/CutOffWheel', description: 'Cut Off Wheels', type: 'sub', parent: 'Tools' },
        { name: 'Diamond Blades', path: '/ShopPage/Tools/abrasives/DiamondBlades', description: 'Diamond Blades', type: 'sub', parent: 'Tools' },
        
        // Tools - Power Tools
        { name: 'Drill', path: '/ShopPage/Tools/PowerTools/Drill', description: 'Drills', type: 'sub', parent: 'Tools' },
        { name: 'Grinders', path: '/ShopPage/Tools/PowerTools/Grinders', description: 'Grinders', type: 'sub', parent: 'Tools' },
        { name: 'Marble Cutter', path: '/ShopPage/Tools/PowerTools/Marble Cutter', description: 'Marble Cutters', type: 'sub', parent: 'Tools' },
        
        // Paint - ALL Subcategories and Nested Folders
        { name: 'Acrylic Emulsion Paint', path: '/ShopPage/Paint/AcrylicEmulsionPaint', description: 'Acrylic Emulsion Paints', type: 'sub', parent: 'Paint' },
        { name: 'Adhesive Thinner', path: '/ShopPage/Paint/AdhesiveThinner', description: 'Adhesive Thinner', type: 'sub', parent: 'Paint' },
        { name: 'Aspa Paints', path: '/ShopPage/Paint/AspaPaints', description: 'Aspa Paints', type: 'sub', parent: 'Paint' },
        { name: 'Brushes & Rollers', path: '/ShopPage/Paint/BrushesRollers', description: 'Paint Brushes and Rollers', type: 'sub', parent: 'Paint' },
        { name: 'Distemper', path: '/ShopPage/Paint/Distemper', description: 'Distemper Paints', type: 'sub', parent: 'Paint' },
        { name: 'Emulsion', path: '/ShopPage/Paint/Emulsion', description: 'Emulsion Paints', type: 'sub', parent: 'Paint' },
        { name: 'Enamel', path: '/ShopPage/Paint/Enamel', description: 'Enamel Paints', type: 'sub', parent: 'Paint' },
        { name: 'Exterior Paints', path: '/ShopPage/Paint/ExteriorPaints', description: 'Exterior Paints', type: 'sub', parent: 'Paint' },
        { name: 'Floor Paints', path: '/ShopPage/Paint/FloorPaints', description: 'Floor Paints', type: 'sub', parent: 'Paint' },
        { name: 'Industrial Coatings', path: '/ShopPage/Paint/IndustrialCoatings', description: 'Industrial Coatings', type: 'sub', parent: 'Paint' },
        { name: 'Interior Paints', path: '/ShopPage/Paint/InteriorPaints', description: 'Interior Paints', type: 'sub', parent: 'Paint' },
        { name: 'Painting Accessories', path: '/ShopPage/Paint/PaintingAccessories', description: 'Painting Accessories', type: 'sub', parent: 'Paint' },
        { name: 'Painting Tools', path: '/ShopPage/Paint/PaintingTools', description: 'Painting Tools', type: 'sub', parent: 'Paint' },
        { name: 'Primer', path: '/ShopPage/Paint/Primer', description: 'Primers', type: 'sub', parent: 'Paint' },
        { name: 'Primer And Wall Putty', path: '/ShopPage/Paint/PrimerAndWallPutty', description: 'Primer and Wall Putty', type: 'sub', parent: 'Paint' },
        { name: 'Sanitizer', path: '/ShopPage/Paint/Sanitizer', description: 'Sanitizer', type: 'sub', parent: 'Paint' },
        { name: 'Spray Paints', path: '/ShopPage/Paint/SprayPaints', description: 'Spray Paints', type: 'sub', parent: 'Paint' },
        { name: 'Stainers', path: '/ShopPage/Paint/Stainers', description: 'Stainers', type: 'sub', parent: 'Paint' },
        { name: 'Stainers Thinners', path: '/ShopPage/Paint/StainersThinners', description: 'Stainers Thinners', type: 'sub', parent: 'Paint' },
        { name: 'Stencils', path: '/ShopPage/Paint/Stencils', description: 'Stencils', type: 'sub', parent: 'Paint' },
        { name: 'Tile Guard', path: '/ShopPage/Paint/TileGuard', description: 'Tile Guard', type: 'sub', parent: 'Paint' },
        { name: 'Top Brands', path: '/ShopPage/Paint/TopBrands', description: 'Top Brands', type: 'sub', parent: 'Paint' },
        { name: 'Wall Putty', path: '/ShopPage/Paint/WallPutty', description: 'Wall Putty', type: 'sub', parent: 'Paint' },
        { name: 'Wall Stickers Wallpapers', path: '/ShopPage/Paint/WallStickersWallpapers', description: 'Wall Stickers Wallpapers', type: 'sub', parent: 'Paint' },
        { name: 'Waterproofing', path: '/ShopPage/Paint/Waterproofing', description: 'Waterproofing Paints', type: 'sub', parent: 'Paint' },
        { name: 'Wood Finishes', path: '/ShopPage/Paint/WoodFinishes', description: 'Wood Finishes', type: 'sub', parent: 'Paint' },
        { name: 'Wood Metal', path: '/ShopPage/Paint/WoodMetal', description: 'Wood Metal', type: 'sub', parent: 'Paint' },
        
        // Paint - Adhesive Thinner
        { name: 'Adhesive', path: '/ShopPage/Paint/AdhesiveThinner/Adhesive', description: 'Adhesive', type: 'sub', parent: 'Paint' },
        { name: 'Thinner', path: '/ShopPage/Paint/AdhesiveThinner/Thinner', description: 'Thinner', type: 'sub', parent: 'Paint' },
        
        // Paint - Brushes Rollers
        { name: 'Paint Brushes', path: '/ShopPage/Paint/BrushesRollers/PaintBrushes', description: 'Paint Brushes', type: 'sub', parent: 'Paint' },
        { name: 'Rollers', path: '/ShopPage/Paint/BrushesRollers/Rollers', description: 'Rollers', type: 'sub', parent: 'Paint' },
        { name: 'Spray Paints', path: '/ShopPage/Paint/BrushesRollers/SprayPaints', description: 'Spray Paints', type: 'sub', parent: 'Paint' },
        
        // Paint - Distemper
        { name: 'Acrylic Distemper', path: '/ShopPage/Paint/Distemper/AcrylicDistemper', description: 'Acrylic Distemper', type: 'sub', parent: 'Paint' },
        { name: 'Synthetic Distemper', path: '/ShopPage/Paint/Distemper/SyntheticDistemper', description: 'Synthetic Distemper', type: 'sub', parent: 'Paint' },
        
        // Paint - Emulsion
        { name: 'Exterior Emulsion', path: '/ShopPage/Paint/Emulsion/ExteriorEmulsion', description: 'Exterior Emulsion', type: 'sub', parent: 'Paint' },
        { name: 'Interior Emulsion', path: '/ShopPage/Paint/Emulsion/InteriorEmulsion', description: 'Interior Emulsion', type: 'sub', parent: 'Paint' },
        { name: 'Tile Guard', path: '/ShopPage/Paint/Emulsion/TileGuard', description: 'Tile Guard', type: 'sub', parent: 'Paint' },
        { name: 'Wall Texture', path: '/ShopPage/Paint/Emulsion/WallTexture', description: 'Wall Texture', type: 'sub', parent: 'Paint' },
        
        // Paint - Enamel
        { name: 'Gloss Enamel', path: '/ShopPage/Paint/Enamel/GlossEnamel', description: 'Gloss Enamel', type: 'sub', parent: 'Paint' },
        { name: 'Satin Enamel', path: '/ShopPage/Paint/Enamel/SatinEnamel', description: 'Satin Enamel', type: 'sub', parent: 'Paint' },
        { name: 'Synthetic Enamel', path: '/ShopPage/Paint/Enamel/SyntheticEnamel', description: 'Synthetic Enamel', type: 'sub', parent: 'Paint' },
        
        // Paint - Painting Accessories
        { name: 'Painting Tools', path: '/ShopPage/Paint/PaintingAccessories/PaintingTools', description: 'Painting Tools', type: 'sub', parent: 'Paint' },
        { name: 'Sandpaper Rolls', path: '/ShopPage/Paint/PaintingAccessories/SandpaperRolls', description: 'Sandpaper Rolls', type: 'sub', parent: 'Paint' },
        { name: 'Stencils', path: '/ShopPage/Paint/PaintingAccessories/Stencils', description: 'Stencils', type: 'sub', parent: 'Paint' },
        
        // Paint - Primer
        { name: 'Acrylic Primer', path: '/ShopPage/Paint/Primer/AcrylicPrimer', description: 'Acrylic Primer', type: 'sub', parent: 'Paint' },
        { name: 'Cement Primer', path: '/ShopPage/Paint/Primer/CementPrimer', description: 'Cement Primer', type: 'sub', parent: 'Paint' },
        { name: 'Exterior Primer', path: '/ShopPage/Paint/Primer/ExteriorPrimer', description: 'Exterior Primer', type: 'sub', parent: 'Paint' },
        { name: 'Interior Primer', path: '/ShopPage/Paint/Primer/InteriorPrimer', description: 'Interior Primer', type: 'sub', parent: 'Paint' },
        { name: 'Metal Primer', path: '/ShopPage/Paint/Primer/MetalPrimer', description: 'Metal Primer', type: 'sub', parent: 'Paint' },
        { name: 'Solvent Primer', path: '/ShopPage/Paint/Primer/SolventPrimer', description: 'Solvent Primer', type: 'sub', parent: 'Paint' },
        { name: 'Wood Primer', path: '/ShopPage/Paint/Primer/WoodPrimer', description: 'Wood Primer', type: 'sub', parent: 'Paint' },
        
        // Paint - Stainers
        { name: 'Universal Stainers', path: '/ShopPage/Paint/Stainers/UniversalStainers', description: 'Universal Stainers', type: 'sub', parent: 'Paint' },
        { name: 'Wood Stainers', path: '/ShopPage/Paint/Stainers/WoodStainers', description: 'Wood Stainers', type: 'sub', parent: 'Paint' },
        
        // Paint - Top Brands
        { name: 'Asian Paints', path: '/ShopPage/Paint/TopBrands/AsianPaints', description: 'Asian Paints', type: 'sub', parent: 'Paint' },
        { name: 'Dulux', path: '/ShopPage/Paint/TopBrands/Dulux', description: 'Dulux', type: 'sub', parent: 'Paint' },
        { name: 'JK Wall Putty', path: '/ShopPage/Paint/TopBrands/JkWallPutty', description: 'JK Wall Putty', type: 'sub', parent: 'Paint' },
        { name: 'Neroloc', path: '/ShopPage/Paint/TopBrands/Neroloc', description: 'Neroloc', type: 'sub', parent: 'Paint' },
        
        // Paint - Wall Putty
        { name: 'Acrylic Wall Putty', path: '/ShopPage/Paint/WallPutty/AcrylicWallPutty', description: 'Acrylic Wall Putty', type: 'sub', parent: 'Paint' },
        { name: 'KPF Wall Putty', path: '/ShopPage/Paint/WallPutty/KpfWallPutty', description: 'KPF Wall Putty', type: 'sub', parent: 'Paint' },
        { name: 'Powder Wall Putty', path: '/ShopPage/Paint/WallPutty/PowderWallPutty', description: 'Powder Wall Putty', type: 'sub', parent: 'Paint' },
        
        // Paint - Waterproofing
        { name: 'Crack Fillers', path: '/ShopPage/Paint/Waterproofing/CrackFillers', description: 'Crack Fillers', type: 'sub', parent: 'Paint' },
        { name: 'Waterproof Basecoat', path: '/ShopPage/Paint/Waterproofing/WaterproofBasecoat', description: 'Waterproof Basecoat', type: 'sub', parent: 'Paint' },
        
        // Paint - Wood Finishes
        { name: 'Glass Coatings', path: '/ShopPage/Paint/WoodFinishes/GlassCoatings', description: 'Glass Coatings', type: 'sub', parent: 'Paint' },
        { name: 'Melamyne', path: '/ShopPage/Paint/WoodFinishes/Melamyne', description: 'Melamyne', type: 'sub', parent: 'Paint' },
        { name: 'NC', path: '/ShopPage/Paint/WoodFinishes/Nc', description: 'NC', type: 'sub', parent: 'Paint' },
        { name: 'Polish', path: '/ShopPage/Paint/WoodFinishes/Polish', description: 'Polish', type: 'sub', parent: 'Paint' },
        { name: 'PU', path: '/ShopPage/Paint/WoodFinishes/Pu', description: 'PU', type: 'sub', parent: 'Paint' },
        { name: 'Sealer', path: '/ShopPage/Paint/WoodFinishes/Sealer', description: 'Sealer', type: 'sub', parent: 'Paint' },
        { name: 'Varnish Black Board Paint', path: '/ShopPage/Paint/WoodFinishes/VarnishBlackBoardPaint', description: 'Varnish Black Board Paint', type: 'sub', parent: 'Paint' },
        { name: 'Wood Putty', path: '/ShopPage/Paint/WoodFinishes/WoodPutty', description: 'Wood Putty', type: 'sub', parent: 'Paint' },
        
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
      const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      console.log('Category search results:', filteredCategories);
      setSearchResults(filteredCategories);
      setShowSearchResults(true);
    };

    const timeoutId = setTimeout(searchCategories, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };


  const logoutUser = () => {
    setUsername('');
    // Use centralized logout function
    performLogout();
  };

  return (
    <>

      <header className='fixed top-0 left-0 w-full z-[3000] h-16 md:h-24 bg-white border-b shadow'>
        <div className='w-full max-w-[1280px] mx-auto h-full flex items-center justify-between px-1 md:px-2'>
          {/* Left: Hamburger, Logo, Brand */}
          <div className='flex items-center gap-3'>
            {/* Hamburger menu icon */}
            <button
              className={`mr-1 md:mr-2 text-2xl text-gray-500 focus:outline-none lg:hidden ${
                sidebarOpen ? 'abc' : ''
              }`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <IoClose size={24} /> : <FiMenu size={24} />}
            </button>
            <Image
              src={Logo}
              alt='Hardware Shack Logo'
              className='rounded w-[9.5rem] h-10 md:w-[14rem] md:h-[3rem] lg:w-[18.563rem] lg:h-[4.25rem] object-contain'
            />
          </div>
          {/* Right: Mobile cart */}
          <div className='md:hidden flex items-center gap-2'>
            <Link href='/cart' className='relative block'>
              <span className='w-10 h-10 rounded-full bg-yellow-300 text-white flex items-center justify-center shadow-md'>
                <svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                  <circle cx='9' cy='21' r='1.5' />
                  <circle cx='20' cy='21' r='1.5' />
                  <path d='M5 6h18l-2 10H7z' />
                </svg>
              </span>
              {count > 0 && (
                <span className='absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none'>{count}</span>
              )}
            </Link>
          </div>
          {/* Hide on mobile: Search and Login/Register */}
          <div className='hidden md:flex items-center flex-none md:w-[400px] lg:w-[480px] mx-4 lg:mx-6'>
            <div className='flex items-center w-full'>
              {/* Small All chip with image */}
              <div className='relative' ref={allRef}>
                <button onClick={() => setAllOpen((v) => !v)} className='h-8 px-2 rounded-full text-gray-400 text-sm  transition-colors shadow-md flex items-center font-medium' aria-haspopup='true' aria-expanded={allOpen}>
                  <span>All</span>
                  <svg className='ml-1 w-3 h-6' fill='currentColor' viewBox='0 0 20 20'>
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
                    <Link href='/ShopPage/Electrical' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Electrical Items</Link>
                    <Link href='/ShopPage/Hardware' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>House Hold Ladder</Link>
                    <Link href='/ShopPage/Locks' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Locks & accessories</Link>
                    <Link href='/ShopPage/Cleaning' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Mask & Sanitizers</Link>
                    <Link href='/ShopPage/Paint' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Paints</Link>
                    <Link href='/ShopPage/Pipe' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Pipes & Fittings</Link>
                    <Link href='/ShopPage/Sanitary' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Sanitary Ware & faucets</Link>
                    <Link href='/ShopPage/Tools' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Tools</Link>
                    <Link href='/ShopPage/Uncategorized' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>Uncategorized</Link>
                    <Link href='/ShopPage/WaterProofing' className='block px-4 py-1.5 hover:bg-yellow-300 text-sm text-gray-700 hover:text-white'>WaterProofing</Link>
                  </div>
                </div>
              </div>
              <div className='w-2'></div>
              {/* Big search pill */}
              <div className='flex-1 relative' ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className='h-8 rounded-full bg-gray-50 border border-gray-300 shadow-sm flex items-center'>
                  <input
                    type='text'
                    placeholder='Search products...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                    className='flex-1 h-full px-4 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none'
                  />
                  <button type='submit' className='px-4 h-full flex items-center justify-center text-gray-500 hover:text-gray-700'>
                    <svg
                      width='20'
                      height='20'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                    >
                      <circle cx='11' cy='11' r='8' />
                      <line x1='21' y1='21' x2='16.65' y2='16.65' />
                    </svg>
                  </button>
                </form>
                
                {/* Search Results Dropdown */}
                {console.log('Search debug:', { showSearchResults, resultsLength: searchResults.length, searchResults })}
                {(showSearchResults || searchResults.length > 0) && searchResults.length > 0 && (
                  <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[2000] max-h-80 overflow-y-auto'>
                    {searchResults.slice(0, 8).map((category, index) => (
                      <div
                        key={category.name}
                        onClick={() => {
                          router.push(category.path);
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${index < 7 ? 'border-b border-gray-100' : ''}`}
                      >
                        <div className='flex items-center gap-3'>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            category.type === 'main' ? 'bg-yellow-300' : 'bg-blue-100'
                          }`}>
                            <span className={`font-bold text-sm ${
                              category.type === 'main' ? 'text-yellow-300' : 'text-blue-600'
                            }`}>
                              {category.name.charAt(0)}
                            </span>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium text-gray-900 truncate'>{category.name}</p>
                            <p className='text-xs text-gray-500'>{category.description}</p>
                            {category.type === 'sub' && (
                              <p className='text-xs text-blue-600'>Under {category.parent}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchResults.length > 8 && (
                      <div className='px-4 py-2 text-center text-sm text-gray-500 border-t border-gray-100'>
                        <button
                          onClick={() => {
                            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                            setShowSearchResults(false);
                          }}
                          className='text-blue-600 hover:text-blue-800'
                        >
                          View all {searchResults.length} results
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right actions */}
          <div className='hidden md:flex items-center gap-4 whitespace-nowrap'>
            {username ? (
              <div className='relative' onMouseEnter={() => setUserOpen(true)} onMouseLeave={() => setUserOpen(false)}>
                <button className='bg-yellow-300 hover:bg-yellow-300 text-white font-bold h-8 px-2 rounded-full transition flex items-center gap-2 uppercase tracking-wide text-sm shadow-md max-w-[360px] overflow-hidden'>
                  <span className='truncate'>{String(username).toUpperCase()}</span>
                  <span className='inline-block text-white text-base leading-none'>👤</span>
                </button>
                {userOpen && (
                  <div className='absolute right-0 top-full mt-2 w-[22rem] bg-white rounded-xl border shadow-2xl text-[15px] z-[1000] cursor-default'>
                    {/* caret */}
                    <div className='absolute -top-2 right-10 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white'></div>
                    <div className='py-2'>
                      <Link href='/AccountDetails' className='block px-6 py-3 hover:bg-gray-50 font-medium'>Dashboard</Link>
                      <Link href='/Orders' className='block px-6 py-3 hover:bg-gray-50'>Orders</Link>
                      <Link href='/downloads' className='block px-6 py-3 hover:bg-gray-50'>Downloads</Link>
                      <Link href='/Address' className='block px-6 py-3 hover:bg-gray-50'>Addresses</Link>
                      <Link href='/AccountDetails' className='block px-6 py-3 hover:bg-gray-50'>Account details</Link>
                      <button onClick={logoutUser} className='w-full text-left px-6 py-3 hover:bg-gray-50'>Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button  onClick={() => setShowLogin(true)} className='bg-yellow-300 hover:bg-yellow-300 text-white font-bold h-8 px-2 rounded-full transition shadow-md uppercase tracking-wide text-sm'>Login / Register</button>
                <LoginRegisterModal open={showLogin} onClose={() => setShowLogin(false)} />
              </>
            )}
            <span className='h-8 border-l border-gray-300'></span>
            <div className='relative' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <Link href='/cart' className='relative block'>
                <p className='bg-yellow-300 hover:bg-yellow-300 text-white font-bold h-8 px-2 rounded-full flex items-center justify-center gap-2 transition shadow-md uppercase tracking-wide text-sm'>
                  <span>CART</span>
                  <svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                    <circle cx='9' cy='21' r='1.5' />
                    <circle cx='20' cy='21' r='1.5' />
                    <path d='M5 6h18l-2 10H7z' />
                  </svg>
                </p>
                {count > 0 && (
                  <span className='absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1 py-0.5'>{count}</span>
                )}
              </Link>
              <CartPreview open={hover} />
            </div>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
