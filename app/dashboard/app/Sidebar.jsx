'use client';
import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export const sidebarSections = [
  { name: 'Dashboard', path: '', section: null }, // Neutral - not in any section
  {
    name: 'Product Add',
    section: 'section1', // Section 1: Core Management
    subItems: [
      { name: 'Adhesives', path: '/ProductAdd/Adhesives' },
      { name: 'Brush', path: '/ProductAdd/Brush' },
      { name: 'Cements & POP', path: '/ProductAdd/Cements' },
      { name: 'Cleaning', path: '/ProductAdd/Cleaning' },
      { name: 'Dry Wall Gypsum Screws', path: '/ProductAdd/Dry' },
      {
        name: 'Electrical Item',
        subItemsName: [
          {
            name: 'Adaptors',
            path: '/ProductAdd/Electrical/Adaptors',
          },
          {
            name: 'Ceiling Roses',
            path: '/ProductAdd/Electrical/CeilingRoses',
          },
          { name: 'Dimmer', path: '/ProductAdd/Electrical/Dimmer' },
          {
            name: 'Distribution Boards',
            path: '/ProductAdd/Electrical/DistributionBoards',
          },
          {
            name: 'Door Bells',
            path: '/ProductAdd/Electrical/DoorBells',
          },
          {
            name: 'DP-switch',
            path: '/ProductAdd/Electrical/DPswitch',
          },
          {
            name: 'Earthing Accessories',
            path: '/ProductAdd/Electrical/EarthingAccessories',
          },
          {
            name: 'ELCBs OR RCCBs',
            path: '/ProductAdd/Electrical/ELCBsRCCBs',
          },
          {
            name: 'Electrical Fittings',
            path: '/ProductAdd/Electrical/ElectricalFittings',
            subItemsNameComponent: [
              {
                name: 'Accessories',
                path: '/ProductAdd/Electrical/ElectricalFittings/Accessories',
              },
              {
                name: 'Circular Deep Box',
                path: '/ProductAdd/Electrical/ElectricalFittings/CircularDeepBox',
              },
              {
                name: 'Circular surface box',
                path: '/ProductAdd/Electrical/ElectricalFittings/CircularSurfaceBox',
              },
              {
                name: 'Rigid type',
                path: '/ProductAdd/Electrical/ElectricalFittings/RigidType',
              },
            ],
          },
          {
            name: 'Fans',
            path: '/ProductAdd/Electrical/Fans',
            subItemsNameComponent: [
              {
                name: 'Cabin Fans',
                path: '/ProductAdd/Electrical/Fans/CabinFans',
              },
              {
                name: 'Ceiling Fans',
                path: '/ProductAdd/Electrical/Fans/CeilingFans',
              },
              {
                name: 'Pedestal Fans',
                path: '/ProductAdd/Electrical/Fans/PedestalFans',
              },
              {
                name: 'Table Fans',
                path: '/ProductAdd/Electrical/Fans/TableFans',
              },
              {
                name: 'Ventilation/Exhaust Fans',
                path: '/ProductAdd/Electrical/Fans/VentilationExhaustFans',
              },
              {
                name: 'Wall Mounting Fans',
                path: '/ProductAdd/Electrical/Fans/WallMountingFans',
              },
            ],
          },
          {
            name: 'Flexible Conduit',
            path: '/ProductAdd/Electrical/FlexibleConduit',
          },
          {
            name: 'Flexible Wires',
            path: '/ProductAdd/Electrical/FlexibleWires',
          },
          {
            name: 'Fuse Carriers',
            path: '/ProductAdd/Electrical/FuseCarriers',
          },
          {
            name: 'Holders',
            path: '/ProductAdd/Electrical/Holders',
          },
          {
            name: 'Indicator',
            path: '/ProductAdd/Electrical/Indicator',
          },
          {
            name: 'Insulation Tapes',
            path: '/ProductAdd/Electrical/InsulationTapes',
          },
          {
            name: 'Isolators',
            path: '/ProductAdd/Electrical/Isolators',
          },
          { name: 'Jacks', path: '/ProductAdd/Electrical/Jacks' },
          {
            name: 'KIT KAT Fuses',
            path: '/ProductAdd/Electrical/KITKATFuses',
          },
          {
            name: 'Lights',
            path: '/ProductAdd/Electrical/Lights',
            subItemsNameComponent: [
              {
                name: 'Ceiling light',
                path: '/ProductAdd/Electrical/Lights/CeilingLight',
              },
              {
                name: 'CFL',
                path: '/ProductAdd/Electrical/Lights/CFL',
              },
              {
                name: 'Desklight',
                path: '/ProductAdd/Electrical/Lights/Desklight',
              },
              {
                name: 'Focus Light',
                path: '/ProductAdd/Electrical/Lights/FocusLight',
              },
              {
                name: 'Garden Light',
                path: '/ProductAdd/Electrical/Lights/GardenLight',
              },
              {
                name: 'Gate Light',
                path: '/ProductAdd/Electrical/Lights/GateLight',
              },
              {
                name: 'GLS',
                path: '/ProductAdd/Electrical/Lights/GLS',
              },
              {
                name: 'Home',
                path: '/ProductAdd/Electrical/Lights/Home',
              },
              {
                name: 'Lamps',
                path: '/ProductAdd/Electrical/Lights/Lamps',
              },
              {
                name: 'LED Batten',
                path: '/ProductAdd/Electrical/Lights/LEDBatten',
              },
              {
                name: 'LED Bulbs',
                path: '/ProductAdd/Electrical/Lights/LEDBulbs',
              },
              {
                name: 'Led DownLighters/Spot Light',
                path: '/ProductAdd/Electrical/Lights/LedDownLightersSpotLight',
              },
              {
                name: 'LED Luminaires',
                path: '/ProductAdd/Electrical/Lights/LEDLuminaires',
              },
              {
                name: 'LED Panel Light',
                path: '/ProductAdd/Electrical/Lights/LEDPanelLight',
              },
              {
                name: 'LED Spotlight',
                path: '/ProductAdd/Electrical/Lights/LEDSpotlight',
              },
              {
                name: 'LED Street Light',
                path: '/ProductAdd/Electrical/Lights/LEDStreetLight',
              },
              {
                name: 'LED Strips',
                path: '/ProductAdd/Electrical/Lights/LEDStrips',
              },
              {
                name: 'Led Surface Light',
                path: '/ProductAdd/Electrical/Lights/LedSurfaceLight',
              },
              {
                name: 'Light Electronics',
                path: '/ProductAdd/Electrical/Lights/LightElectronics',
              },
              {
                name: 'Mirror Light',
                path: '/ProductAdd/Electrical/Lights/MirrorLight',
              },
              {
                name: 'Reflectors',
                path: '/ProductAdd/Electrical/Lights/Reflectors',
              },
              {
                name: 'Standard Incandescent',
                path: '/ProductAdd/Electrical/Lights/StandardIncandescent',
              },
              {
                name: 'T Bulb',
                path: '/ProductAdd/Electrical/Lights/TBulb',
              },
              {
                name: 'Tube Light',
                path: '/ProductAdd/Electrical/Lights/TubeLight',
              },
              {
                name: 'Under Water Lights',
                path: '/ProductAdd/Electrical/Lights/UnderWaterLights',
              },
              {
                name: 'Wall Light',
                path: '/ProductAdd/Electrical/Lights/WallLight',
              },
            ],
          },
          {
            name: 'Main Switch',
            path: '/ProductAdd/Electrical/MainSwitch',
          },
          { name: 'MCB', path: '/ProductAdd/Electrical/MCB' },
          {
            name: 'Modular/Surface Box',
            path: '/ProductAdd/Electrical/ModularSurfaceBox',
          },
          {
            name: 'Motor Starters',
            path: '/ProductAdd/Electrical/MotorStarters',
          },
          { name: 'Motors', path: '/ProductAdd/Electrical/Motors' },
          { name: 'Others', path: '/ProductAdd/Electrical/Others' },
          { name: 'Pin top', path: '/ProductAdd/Electrical/PinTop' },
          { name: 'Plug', path: '/ProductAdd/Electrical/Plug' },
          {
            name: 'Power Strips',
            path: '/ProductAdd/Electrical/PowerStrips',
          },
          {
            name: 'PVC Clips',
            path: '/ProductAdd/Electrical/PVCClips',
          },
          {
            name: 'Regulators',
            path: '/ProductAdd/Electrical/Regulators',
          },
          {
            name: 'Rotary Switch',
            path: '/ProductAdd/Electrical/RotarySwitch',
          },
          {
            name: 'Sockets',
            path: '/ProductAdd/Electrical/Sockets',
          },
          {
            name: 'Switch & Socket',
            path: '/ProductAdd/Electrical/SwitchAndSocket',
          },
          {
            name: 'Switch Plates',
            path: '/ProductAdd/Electrical/SwitchPlates',
          },
          {
            name: 'Switches',
            path: '/ProductAdd/Electrical/Switches',
          },
          {
            name: 'Travel adaptor',
            path: '/ProductAdd/Electrical/TravelAdaptor',
          },
          {
            name: 'TV outlets',
            path: '/ProductAdd/Electrical/TVOutlets',
          },
          {
            name: 'Uni Switch Socket Combined Units',
            path: '/ProductAdd/Electrical/UniSwitch',
          },
          {
            name: 'Water Heater',
            path: '/ProductAdd/Electrical/Water Heater',
          },
          {
            name: 'Water Heaters',
            path: '/ProductAdd/Electrical/WaterHeaters',
          },
          {
            name: 'Wires & Cables',
            path: '/ProductAdd/Electrical/WiresAndCables',
          },
        ],
      },
      { name: 'Electrical Fitting', path: '/ProductAdd/Fitting' },
      { name: 'Fiber Sheet', path: '/ProductAdd/Fiber' },
      { name: 'Hardware', path: '/ProductAdd/Hardware' },
      {
        name: 'Home',
        subItemsName: [
          {
            name: 'Brands',
            path: '/ProductAdd/Home/Brands',
          },
          {
            name: 'Card',
            path: '/ProductAdd/Home/Card',
          },
          {
            name: 'Card Slider',
            path: '/ProductAdd/Home/CardSlider',
          },
          {
            name: 'Categories',
            path: '/ProductAdd/Home/Categories',
          },
          {
            name: 'Electrical',
            path: '/ProductAdd/Home/ElectricalHome',
          },
          {
            name: 'Image Slider',
            subItemsNameComponent: [
              {
                name: 'Electrical Image',
                path: '/ProductAdd/Home/ImageSlider/ElectricImage',
              },
              {
                name: 'Faucet Image',
                path: '/ProductAdd/Home/ImageSlider/FaucetImage',
              },
              {
                name: 'Paints Image',
                path: '/ProductAdd/Home/ImageSlider/PaintsImage',
              },
              {
                name: 'Sanitary Image',
                path: '/ProductAdd/Home/ImageSlider/SanitaryImage',
              },
              {
                name: 'Tools Image',
                path: '/ProductAdd/Home/ImageSlider/ToolsImage',
              },
            ],
          },
          {
            name: 'Items',
            path: '/ProductAdd/Home/Items',
          },
          {
            name: 'Paints',
            path: '/ProductAdd/Home/Paints',
          },
          {
            name: 'Popular Products',
            path: '/ProductAdd/Home/PopularProducts',
          },
          {
            name: 'Product Tools',
            path: '/ProductAdd/Home/ProductTools',
          },
          {
            name: 'Service',
            path: '/ProductAdd/Home/Service',
          },
          {
            name: 'Offer',
            path: '/ProductAdd/Home/Offer',
          },
        ],
      },
      { name: 'Home Decor', path: '/ProductAdd/HomeDecor' },
      // { name: 'House Hold Ladder', path: '/ProductAdd/HouseHold' },
      // { name: 'Lighting', path: '/ProductAdd/Lighting' },
      {
        name: 'Locks & accessories',
        subItemsName: [
          {
            name: 'DOOR ACCESSORIES',
            subItemsNameComponent: [
              {
                name: 'Aluminium Tower Bolt',
                path: '/ProductAdd/Locks/DoorAccessories/AluminiumTowerBolt',
              },
              {
                name: 'Ball Bearing Door Hinges',
                path: '/ProductAdd/Locks/DoorAccessories/BallBearingDoorHinges',
              },
              {
                name: 'Concealed Hinges',
                path: '/ProductAdd/Locks/DoorAccessories/ConcealedHinges',
              },
              {
                name: 'Door Eye',
                path: '/ProductAdd/Locks/DoorAccessories/DoorEye',
              },
              {
                name: 'Door Stopper',
                path: '/ProductAdd/Locks/DoorAccessories/DoorStopper',
              },
              {
                name: 'HINGES',
                path: '/ProductAdd/Locks/DoorAccessories/HINGES',
              },
              {
                name: 'Magnetic Door Stoppers',
                path: '/ProductAdd/Locks/DoorAccessories/MagneticDoorStoppers',
              },
              {
                name: 'Wooden Sliding Door Fittings',
                path: '/ProductAdd/Locks/DoorAccessories/WoodenSlidingDoorFittings',
              },
            ],
          },
          {
            name: 'DOOR CONTROLS',
            subItemsNameComponent: [
              {
                name: 'Door Closers',
                path: '/ProductAdd/Locks/DoorControls/DoorCloser',
              },
              {
                name: 'Door Stopper',
                path: '/ProductAdd/Locks/DoorControls/DoorStopper',
              },
              {
                name: 'Hydraulic Door Closers',
                path: '/ProductAdd/Locks/DoorControls/HydraulicDoorClosers',
              },
            ],
          },
          {
            name: 'DOOR HANDLES',
            subItemsNameComponent: [
              {
                name: 'Door King',
                path: '/ProductAdd/Locks/DoorControls/DoorKing',
              },
              {
                name: 'Door Pulls',
                path: '/ProductAdd/Locks/DoorControls/DoorPulls',
              },
            ],
          },
          {
            name: 'DOOR LOCKS',
            subItemsNameComponent: [
              {
                name: 'Tri Bolt Locks',
                path: '/ProductAdd/Locks/DoorLocks/TriBoltLocks',
              },
              {
                name: 'Smart Key',
                path: '/ProductAdd/Locks/DoorLocks/SmartKey',
              },
              {
                name: 'Night Latch',
                path: '/ProductAdd/Locks/DoorLocks/NightLatch',
              },
              {
                name: 'Pull Handles For Main Doors',
                path: '/ProductAdd/Locks/DoorLocks/PullHandlesForMainDoors',
              },
              {
                name: 'Rim Dead Lock',
                path: '/ProductAdd/Locks/DoorLocks/RimDeadLock',
              },
              {
                name: 'Side Lock',
                path: '/ProductAdd/Locks/DoorLocks/SideLock',
              },
              {
                name: 'Main Door Lock',
                path: '/ProductAdd/Locks/DoorLocks/MainDoorLock',
              },
              {
                name: 'Jemmy Proof Door Lock',
                path: '/ProductAdd/Locks/DoorLocks/JemmyProofDoorLock',
              },
              {
                name: 'Knob Locks',
                path: '/ProductAdd/Locks/DoorLocks/KnobLocks',
              },
              {
                name: 'Drawer Lock',
                path: '/ProductAdd/Locks/DoorLocks/DrawerLock',
              },
              {
                name: 'Dead Locks',
                path: '/ProductAdd/Locks/DoorLocks/DeadLocks',
              },
              {
                name: 'Diamant Padlocks',
                path: '/ProductAdd/Locks/DoorLocks/DiamantPadlocks',
              },
              {
                name: 'Dimple Key',
                path: '/ProductAdd/Locks/DoorLocks/DimpleKey',
              },
              {
                name: 'Disc Pad Locks',
                path: '/ProductAdd/Locks/DoorLocks/DiscPadLocks',
              },
              {
                name: 'Cylindrical Locks',
                path: '/ProductAdd/Locks/DoorLocks/CylindricalLocks',
              },
              {
                name: 'Centre Shutter Locks',
                path: '/ProductAdd/Locks/DoorLocks/CentreShutterLocks',
              },
              {
                name: 'Cupboard Locks',
                path: '/ProductAdd/Locks/DoorLocks/CupboardLocks',
              },
            ],
          },
          {
            name: 'FURNITURE BRACKETS',
            path: '/ProductAdd/Locks/FurnitureBrackets',
          },
          {
            name: 'FURNITURE FITTINGS',
            subItemsNameComponent: [
              {
                name: 'Ball Bearing Drawer Channel',
                path: '/ProductAdd/Locks/FurnitureFittings/BallBearingDrawerChannel',
              },
              {
                name: 'Furniture Fittings',
                path: '/ProductAdd/Locks/FurnitureFittings/FurnitureFittings',
              },
              {
                name: 'Heavy Duty Drawer Slides',
                path: '/ProductAdd/Locks/FurnitureFittings/HeavyDutyDrawerSlides',
              },
              {
                name: 'Slip On Hinge',
                path: '/ProductAdd/Locks/FurnitureFittings/SlipOnHinge',
              },
              {
                name: 'Soft Close Drawer Channel',
                path: '/ProductAdd/Locks/FurnitureFittings/SoftCloseDrawerChannel',
              },
              {
                name: 'Thick Door Hinge',
                path: '/ProductAdd/Locks/FurnitureFittings/ThickDoorHinge',
              },
              {
                name: 'Folding Brackets',
                path: '/ProductAdd/Locks/FurnitureFittings/FoldingBrackets',
              },
              {
                name: 'Cabinet Hinge',
                path: '/ProductAdd/Locks/FurnitureFittings/CabinetHinge',
              },
              {
                name: 'Clip On Soft Hinge',
                path: '/ProductAdd/Locks/FurnitureFittings/ClipOnSoftHinge',
              },
              {
                name: 'Clip On Soft Hinge4 Hole',
                path: '/ProductAdd/Locks/FurnitureFittings/ClipOnSoftHingeHole',
              },
              {
                name: 'Drawer Channels',
                path: '/ProductAdd/Locks/FurnitureFittings/DrawerChannels',
              },
              {
                name: 'Blind Corner Hinge',
                path: '/ProductAdd/Locks/FurnitureFittings/BlindCornerHinge',
              },
            ],
          },
          {
            name: 'FURNITURE LOCKS',
            subItemsNameComponent: [
              {
                name: 'Curvo',
                path: '/ProductAdd/Locks/FurnitureLocks/Curvo',
              },
              {
                name: 'CamLock',
                path: '/ProductAdd/Locks/FurnitureLocks/CamLock',
              },
              {
                name: 'Nuvo',
                path: '/ProductAdd/Locks/FurnitureLocks/Nuvo',
              },
              {
                name: 'Supernova',
                path: '/ProductAdd/Locks/FurnitureLocks/Supernova',
              },
              {
                name: 'Table Lock',
                path: '/ProductAdd/Locks/FurnitureLocks/TableLock',
              },
              {
                name: 'Drawer Cupboard Lock',
                path: '/ProductAdd/Locks/FurnitureLocks/DrawerCupboardLock',
              },
              {
                name: 'Drawer Locks',
                path: '/ProductAdd/Locks/FurnitureLocks/DrawerLocks',
              },
              {
                name: 'Multi Purpose Lock',
                path: '/ProductAdd/Locks/FurnitureLocks/MultiPurposeLock',
              },
            ],
          },
          {
            name: 'GLASS HARDWARE',
            subItemsNameComponent: [
              {
                name: 'Glass Door Pull Handle',
                path: '/ProductAdd/Locks/GlassHardware/GlassDoorPullHandle',
              },
              {
                name: 'Glass Hardware',
                path: '/ProductAdd/Locks/GlassHardware/GlassHardware',
              },
              {
                name: 'Shower Cubicle Hinge',
                path: '/ProductAdd/Locks/GlassHardware/ShowerCubicleHinge',
              },
              {
                name: 'Sliding System',
                path: '/ProductAdd/Locks/GlassHardware/SlidingSystem',
              },
              {
                name: 'Glass Door Lock',
                path: '/ProductAdd/Locks/GlassHardware/GlassDoorLock',
              },
              {
                name: 'Floor Spring Combo Set',
                path: '/ProductAdd/Locks/GlassHardware/FloorSpringComboSet',
              },
              {
                name: 'Glass Door Fitting',
                path: '/ProductAdd/Locks/GlassHardware/GlassDoorFitting',
              },
            ],
          },
          {
            name: 'LEVER MORTISE LOCKS',
            subItemsNameComponent: [
              {
                name: 'EXS HI - SECURITY CYLINDERS',
                path: '/ProductAdd/Locks/LeverMortiseLocks/EXSHISECURITYCYLINDERS',
              },
              {
                name: 'COMBIPACK WITH 6 LEVER MORTISE LOCK',
                path: '/ProductAdd/Locks/LeverMortiseLocks/COMBIPACKWITHLEVERMORTISELOCK',
              },
              {
                name: 'Europrofile Mortise Pin Cylinder With Master Key',
                path: '/ProductAdd/Locks/LeverMortiseLocks/EuroprofileMortisePinCylinderWithMasterKey',
              },
              {
                name: 'Europrofile Mortise Pin Cylinder',
                path: '/ProductAdd/Locks/LeverMortiseLocks/EuroprofileMortisePinCylinder',
              },
              {
                name: 'Europrofile Mortise Lock Bodies',
                path: '/ProductAdd/Locks/LeverMortiseLocks/EuroprofileMortisLockBodies',
              },
            ],
          },
          {
            name: 'Mortice Locks',
            path: '/ProductAdd/Locks/MorticeLocks',
          },
          {
            name: 'Mortise Lock Body',
            path: '/ProductAdd/Locks/MortiseLockBody',
          },

          {
            name: 'Padlocks',
            subItemsNameComponent: [
              {
                name: 'Ultra Shutter Locks',
                path: '/ProductAdd/Locks/Padlocks/UltraShutterLocks',
              },
              {
                name: 'Disc Padlocks',
                path: '/ProductAdd/Locks/Padlocks/DiscPadlocks',
              },
              {
                name: 'Padlocks',
                path: '/ProductAdd/Locks/Padlocks/Padlocks',
              },
              {
                name: 'Premium Padlocks',
                path: '/ProductAdd/Locks/Padlocks/PremiumPadlocks',
              },
              {
                name: 'Round Type Padlock',
                path: '/ProductAdd/Locks/Padlocks/RoundTypePadlock',
              },
              {
                name: 'Square Type Padlock',
                path: '/ProductAdd/Locks/Padlocks/SquareTypePadlock',
              },
            ],
          },
          {
            name: 'Patch Fittings',
            path: '/ProductAdd/Locks/PatchFittings',
          },
          {
            name: 'POPULAR MORTISE SERIES',
            subItemsNameComponent: [
              {
                name: 'S S D Type Tube Lever',
                path: '/ProductAdd/Locks/PopularMortiseSeriesTypeTubeLever',
              },
              {
                name: 'Towy Low Height Design',
                path: '/ProductAdd/Locks/PopularMortiseSeries/TowyLowHeightDesign',
              },
              {
                name: 'Victoria',
                path: '/ProductAdd/Locks/PopularMortiseSeries/Victoria',
              },
              {
                name: 'Pull Handles',
                path: '/ProductAdd/Locks/PopularMortiseSeries/PullHandles',
              },
              {
                name: 'N E H15 Low Height Design',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEHLowHeightDesign',
              },
              {
                name: 'N E H16',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH16',
              },
              {
                name: 'Oliver',
                path: '/ProductAdd/Locks/PopularMortiseSeries/Oliver',
              },
              {
                name: 'Popular Mortise Series',
                path: '/ProductAdd/Locks/PopularMortiseSeries/PopularMortiseSeries',
              },
              {
                name: 'N E H10',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH10',
              },
              {
                name: 'N E H11',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH11',
              },
              {
                name: 'N E H12',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH12',
              },
              {
                name: 'N E H13',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH13',
              },
              {
                name: 'N E H14',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH14',
              },
              {
                name: 'N E H09',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH09',
              },
              {
                name: 'N E H04',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH04',
              },
              {
                name: 'N E H05',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH05',
              },
              {
                name: 'N E H06',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH06',
              },
              {
                name: 'N E H07',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH07',
              },
              {
                name: 'N E H08',
                path: '/ProductAdd/Locks/PopularMortiseSeries/NEH08',
              },
              {
                name: 'Matiz',
                path: '/ProductAdd/Locks/PopularMortiseSeries/Matiz',
              },
              {
                name: 'Corner Fetch Series',
                path: '/ProductAdd/Locks/PopularMortiseSeries/CornerFetchSeries',
              },
              {
                name: 'Cylindrical Locks',
                path: '/ProductAdd/Locks/PopularMortiseSeries/CylindricalLocks',
              },
              {
                name: 'Gloria',
                path: '/ProductAdd/Locks/PopularMortiseSeries/Gloria',
              },
              {
                name: 'Main Door Set',
                path: '/ProductAdd/Locks/PopularMortiseSeries/MainDoorSet',
              },
              {
                name: 'Combi Set',
                path: '/ProductAdd/Locks/PopularMortiseSeries/CombiSet',
              },
              {
                name: 'Classic Lock',
                path: '/ProductAdd/Locks/PopularMortiseSeries/ClassicLock',
              },
              {
                name: 'B M01',
                path: '/ProductAdd/Locks/PopularMortiseSeries/BM01',
              },
              {
                name: 'B M02',
                path: '/ProductAdd/Locks/PopularMortiseSeries/BM02',
              },
              {
                name: 'B M04',
                path: '/ProductAdd/Locks/PopularMortiseSeries/BM04',
              },
              {
                name: 'B M06',
                path: '/ProductAdd/Locks/PopularMortiseSeries/BM06',
              },
            ],
          },
          {
            name: 'PREMIUM MORTISE SERIES',
            subItemsNameComponent: [
              {
                name: 'S E H Series',
                path: '/ProductAdd/Locks/PremiumMortiseSeries/SEHSeries',
              },
              {
                name: 'Phoenix',
                path: '/ProductAdd/Locks/PremiumMortiseSeries/Phoenix',
              },
              {
                name: 'Premium Mortise Series',
                path: '/ProductAdd/Locks/PremiumMortiseSeries/PremiumMortiseSeries',
              },
              {
                name: 'Orbit',
                path: '/ProductAdd/Locks/PremiumMortiseSeries/Orbit',
              },
              {
                name: 'Allure Rossette Series',
                path: '/ProductAdd/Locks/PremiumMortiseSeries/AllureRossetteSeries',
              },
              {
                name: 'Combipack With240mm Euro Mortise Lock',
                path: '/ProductAdd/Locks/PremiumMortiseSeries/CombipackWithEuroMortiseLock',
              },
              {
                name: 'Europrofile Brass Handle Set240mm',
                path: '/ProductAdd/Locks/PremiumMortiseSeries/EuroprofileBrassHandleSet',
              },
              {
                name: 'Evva3 K S Regalis Mortise',
                path: '/ProductAdd/Locks/PremiumMortiseSeries/EvvaKRegalisMortise',
              },
              {
                name: 'Mercury',
                path: '/ProductAdd/Locks/PremiumMortiseSeries/Mercury',
              },
            ],
          },
          {
            name: 'Rim Locks',
            subItemsNameComponent: [
              {
                name: 'Ultra X L Tribolt',
                path: '/ProductAdd/Locks/RimLocks/UltraXLTribolt',
              },
              {
                name: 'Ultra X L Twinbolt',
                path: '/ProductAdd/Locks/RimLocks/UltraXLTwinbolt',
              },
              {
                name: 'Ultra X L Vertibolt',
                path: '/ProductAdd/Locks/RimLocks/UltraXLVertibolt',
              },
              {
                name: 'Ultra X L Rim Deadbolt',
                path: '/ProductAdd/Locks/RimLocks/UltraXLRimDeadbolt',
              },
              {
                name: 'Ultra Latchbolt Carton',
                path: '/ProductAdd/Locks/RimLocks/UltraLatchboltCarton',
              },
              {
                name: 'Ultra Retrofit Adaptor',
                path: '/ProductAdd/Locks/RimLocks/UltraRetrofitAdaptor',
              },
              {
                name: 'Ultra Tribolt',
                path: '/ProductAdd/Locks/RimLocks/UltraTribolt',
              },
              {
                name: 'Ultra Vertibolt',
                path: '/ProductAdd/Locks/RimLocks/UltraVertibolt',
              },
              {
                name: 'Rim Locks',
                path: '/ProductAdd/Locks/RimLocks/RimLocks',
              },
              {
                name: 'E X S Altrix',
                path: '/ProductAdd/Locks/RimLocks/EXSAltrix',
              },
              {
                name: 'E X S Astro',
                path: '/ProductAdd/Locks/RimLocks/EXSAstro',
              },
              {
                name: 'Night Latch7 Lever',
                path: '/ProductAdd/Locks/RimLocks/NightLatchLever',
              },
              {
                name: 'Pentabolt Aries',
                path: '/ProductAdd/Locks/RimLocks/PentaboltAries',
              },
              {
                name: 'Pin Cylinder Rim Locks',
                path: '/ProductAdd/Locks/RimLocks/PinCylinderRimLocks',
              },
            ],
          },
        ],
      },
      {
        name: 'Paint',
        subItemsName: [
          {
            name: 'EMULSION',
            subItemsNameComponent: [
              {
                name: 'Wall Texture',
                path: '/ProductAdd/Paint/Emulsion/WallTexture',
              },
              {
                name: 'Tile Guard',
                path: '/ProductAdd/Paint/Emulsion/TileGuard',
              },
              {
                name: 'Exterior Emulsion',
                path: '/ProductAdd/Paint/Emulsion/ExteriorEmulsion',
              },
              {
                name: 'Interior Emulsion',
                path: '/ProductAdd/Paint/Emulsion/InteriorEmulsion',
              },
            ],
          },
          {
            name: 'ENAMEL',
            subItemsNameComponent: [
              {
                name: 'Synthetic Enamel',
                path: '/ProductAdd/Paint/Enamel/SyntheticEnamel',
              },
              {
                name: 'Satin Enamel',
                path: '/ProductAdd/Paint/Enamel/SatinEnamel',
              },
              {
                name: 'Gloss Enamel',
                path: '/ProductAdd/Paint/Enamel/GlossEnamel',
              },
            ],
          },
          {
            name: 'DISTEMPER',
            subItemsNameComponent: [
              {
                name: 'Acrylic Distemper',
                path: '/ProductAdd/Paint/Distemper/AcrylicDistemper',
              },
              {
                name: 'Synthetic Distemper',
                path: '/ProductAdd/Paint/Distemper/SyntheticDistemper',
              },
            ],
          },
          {
            name: 'PRIMER',
            subItemsNameComponent: [
              {
                name: 'Wood Primer',
                path: '/ProductAdd/Paint/Primer/WoodPrimer',
              },
              {
                name: 'Solvent Primer',
                path: '/ProductAdd/Paint/Primer/SolventPrimer',
              },
              {
                name: 'Acrylic Primer',
                path: '/ProductAdd/Paint/Primer/AcrylicPrimer',
              },
              {
                name: 'Cement Primer',
                path: '/ProductAdd/Paint/Primer/CementPrimer',
              },
              {
                name: 'Exterior Primer',
                path: '/ProductAdd/Paint/Primer/ExteriorPrimer',
              },
              {
                name: 'Interior Primer',
                path: '/ProductAdd/Paint/Primer/InteriorPrimer',
              },
              {
                name: 'Metal Primer',
                path: '/ProductAdd/Paint/Primer/MetalPrimer',
              },
            ],
          },
          {
            name: 'STAINERS',
            subItemsNameComponent: [
              {
                name: 'Wood Stainers',
                path: '/ProductAdd/Paint/Stainers/WoodStainers',
              },
              {
                name: 'Universal Stainers',
                path: '/ProductAdd/Paint/Stainers/UniversalStainers',
              },
            ],
          },
          {
            name: 'Brushes & Rollers',
            subItemsNameComponent: [
              {
                name: 'Spray Paints',
                path: '/ProductAdd/Paint/BrushesRollers/SprayPaints',
              },
              {
                name: 'Paint Brushes',
                path: '/ProductAdd/Paint/BrushesRollers/PaintBrushes',
              },
              {
                name: 'Rollers',
                path: '/ProductAdd/Paint/BrushesRollers/Rollers',
              },
            ],
          },
          {
            name: 'WATERPROOFING & FILLERS',
            subItemsNameComponent: [
              {
                name: 'Waterproof Basecoat',
                path: '/ProductAdd/Paint/Waterproofing/WaterproofBasecoat',
              },
              {
                name: 'Crack Fillers',
                path: '/ProductAdd/Paint/Waterproofing/CrackFillers',
              },
            ],
          },
          {
            name: 'PAINTING ACCESSORIES',
            subItemsNameComponent: [
              {
                name: 'Sandpaper Rolls',
                path: '/ProductAdd/Paint/PaintingAccessories/SandpaperRolls',
              },
              {
                name: 'Stencils',
                path: '/ProductAdd/Paint/PaintingAccessories/Stencils',
              },
              {
                name: 'Painting Tools',
                path: '/ProductAdd/Paint/PaintingAccessories/PaintingTools',
              },
            ],
          },
          {
            name: 'WOOD FINISHES',
            subItemsNameComponent: [
              {
                name: 'Pu',
                path: '/ProductAdd/Paint/WoodFinishes/Pu',
              },
              {
                name: 'Sealer',
                path: '/ProductAdd/Paint/WoodFinishes/Sealer',
              },
              {
                name: 'Varnish Black Board Paint',
                path: '/ProductAdd/Paint/WoodFinishes/VarnishBlackBoardPaint',
              },
              {
                name: 'Wood Putty',
                path: '/ProductAdd/Paint/WoodFinishes/WoodPutty',
              },
              {
                name: 'Polish',
                path: '/ProductAdd/Paint/WoodFinishes/Polish',
              },
              {
                name: 'Glass Coatings',
                path: '/ProductAdd/Paint/WoodFinishes/GlassCoatings',
              },
              {
                name: 'Melamyne',
                path: '/ProductAdd/Paint/WoodFinishes/Melamyne',
              },
              {
                name: 'Nc',
                path: '/ProductAdd/Paint/WoodFinishes/Nc',
              },
            ],
          },
          {
            name: 'ADHESIVE & THINNER',
            subItemsNameComponent: [
              {
                name: 'Adhesive',
                path: '/ProductAdd/Paint/AdhesiveThinner/Adhesive',
              },
              {
                name: 'Thinner',
                path: '/ProductAdd/Paint/AdhesiveThinner/Thinner',
              },
            ],
          },
          {
            name: 'WALL PUTTY',
            subItemsNameComponent: [
              {
                name: 'Kpf Wall Putty',
                path: '/ProductAdd/Paint/WallPutty/KpfWallPutty',
              },
              {
                name: 'Powder Wall Putty',
                path: '/ProductAdd/Paint/WallPutty/PowderWallPutty',
              },
              {
                name: 'Acrylic Wall Putty',
                path: '/ProductAdd/Paint/WallPutty/AcrylicWallPutty',
              },
            ],
          },
          {
            name: 'TOP BRANDS',
            subItemsNameComponent: [
              {
                name: 'Neroloc',
                path: '/ProductAdd/Paint/TopBrands/Neroloc',
              },
              {
                name: 'Dulux',
                path: '/ProductAdd/Paint/TopBrands/Dulux',
              },
              {
                name: 'Asian Paints',
                path: '/ProductAdd/Paint/TopBrands/AsianPaints',
              },
              {
                name: 'Gem Paints',
                path: '/ProductAdd/Paint/TopBrands/GemPaints',
              },
              {
                name: 'Jk Wall Putty',
                path: '/ProductAdd/Paint/TopBrands/JkWallPutty',
              },
              {
                name: 'Agsar Paints',
                path: '/ProductAdd/Paint/TopBrands/AgsarPaints',
              },
            ],
          },
          {
            name: 'Acrylic Emulsion Paint',
            path: '/ProductAdd/Paint/AcrylicEmulsionPaint',
          },
          {
            name: 'Aspa Paints',
            path: '/ProductAdd/Paint/AspaPaints',
          },
          {
            name: 'Exterior paints',
            path: '/ProductAdd/Paint/ExteriorPaints',
          },
          {
            name: 'Floor Paints',
            path: '/ProductAdd/Paint/FloorPaints',
          },
          {
            name: 'Industrial Coatings',
            path: '/ProductAdd/Paint/IndustrialCoatings',
          },
          {
            name: 'Interior Paints',
            path: '/ProductAdd/Paint/InteriorPaints',
          },
          {
            name: 'Painting Tools',
            path: '/ProductAdd/Paint/PaintingTools',
          },
          {
            name: 'Primer and Wall Putty',
            path: '/ProductAdd/Paint/PrimerAndWallPutty',
          },
          { name: 'Sanitizer', path: '/ProductAdd/Paint/Sanitizer' },
          {
            name: 'Spray Paints',
            path: '/ProductAdd/Paint/SprayPaints',
          },
          {
            name: 'Stainers&Thinners',
            path: '/ProductAdd/Paint/StainersThinners',
          },
          { name: 'Stencils', path: '/ProductAdd/Paint/Stencils' },
          {
            name: 'Tile Guard',
            path: '/ProductAdd/Paint/TileGuard',
          },
          {
            name: 'wall stickers and wallpapers',
            path: '/ProductAdd/Paint/WallStickersWallpapers',
          },
          {
            name: 'Wood & Metal',
            path: '/ProductAdd/Paint/WoodMetal',
          },
        ],
      },
      {
        name: 'Pipe & Fittings',
        subItemsName: [
          {
            name: 'Ashirvad Pipes',
            path: '/ProductAdd/Pipe/AshirvadPipes',
          },
          
          
          {
            name: 'Apollo Pipes',
            path: '/ProductAdd/Pipe/ApolloPipes',
          },
          { name: 'Birla Pipe', path: '/ProductAdd/Pipe/BirlaPipe' },
          {
            name: 'Finolex Pipes',
            path: '/ProductAdd/Pipe/FinolexPipes',
          },
          {
            name: 'Nepul Pipes',
            path: '/ProductAdd/Pipe/NepulPipes',
          },
          {
            name: 'Other Pipe & Fittings',
            path: '/ProductAdd/Pipe/OtherPipes',
          },
          {
            name: 'Prakash Pipe',
            path: '/ProductAdd/Pipe/PrakashPipe',
          },
          {
            name: 'Prinzia Pipes',
            path: '/ProductAdd/Pipe/PrinziaPipes',
          },
          {
            name: 'Prince Pipe',
            path: '/ProductAdd/Pipe/PrincePipe',
          },
          {
            name: 'Supreme Pipe',
            path: '/ProductAdd/Pipe/SupremePipe',
          },
          { name: 'TSA Pipe', path: '/ProductAdd/Pipe/TSAPipe' },
         
          { name: 'Tata Pipe', path: '/ProductAdd/Pipe/TataPipe' },
          
          
          
        ],
      },
      {
        name: 'PVC Mats',
        subItemsName: [
          { name: 'Floor Mats', path: '/ProductAdd/PvcMats/Floor' },
          { name: 'Door Mats', path: '/ProductAdd/PvcMats/Door' },
        ],
      },
      {
        name: 'Roofer',
        subItemsName: [
          { name: 'Aluminium Sheet', path: '/ProductAdd/Roofer/AluminiumSheet'},
          { name: 'Cements Sheet', path: '/ProductAdd/Roofer/CementsSheet'},
          { name: 'Color Sheet', path: '/ProductAdd/Roofer/ColorSheet'},
          { name: 'Fiber Sheet', path: '/ProductAdd/Roofer/FiberSheet'},
          { name: 'Metal Roofing', path: '/ProductAdd/Roofer/Metal'},
          { name: 'Shingles', path: '/ProductAdd/Roofer/Shingles' },
          { name: 'Teen Sheet', path: '/ProductAdd/Roofer/TeenSheet'},
        ],
      },
      {
        name: 'Sanitary Ware & faucets',
        subItemsName: [
          {
            name: 'Acrylic Products',
            path: '/ProductAdd/Sanitary/AcrylicProducts',
          },
          {
            name: 'Bathroom Accessories',
            path: '/ProductAdd/Sanitary/BathroomAccessories',
          },
          {
            name: 'Bathsense',
            subItemsNameComponent: [
              {
                name: 'Sanitaryware',
                path: '/ProductAdd/Sanitary/Bathsense/Sanitaryware',
              },
              {
                name: 'C Pfittings Faucets',
                path: '/ProductAdd/Sanitary/Bathsense/CPfittingsFaucets',
              },
            ],
          },
          {
            name: 'Closets',
            path: '/ProductAdd/Sanitary/Closets',
          },
          {
            name: 'Coral bath fixtures',
            subItemsNameComponent: [
              {
                name: 'Royale Series',
                path: '/ProductAdd/Sanitary/CoralBathFixtures/RoyaleSeries',
              },
              {
                name: 'Treemo Series',
                path: '/ProductAdd/Sanitary/CoralBathFixtures/TreemoSeries',
              },
              {
                name: 'Xrossa Series',
                path: '/ProductAdd/Sanitary/CoralBathFixtures/XrossaSeries',
              },
              {
                name: 'New Super Glow Series',
                path: '/ProductAdd/Sanitary/CoralBathFixtures/NewSuperGlowSeries',
              },
              {
                name: 'Eurosmart Series',
                path: '/ProductAdd/Sanitary/CoralBathFixtures/EurosmartSeries',
              },
              {
                name: 'Flowmore Series',
                path: '/ProductAdd/Sanitary/CoralBathFixtures/FlowmoreSeries',
              },
            ],
          },
          {
            name: 'Corsa',
            subItemsNameComponent: [
              {
                name: 'BATHROOMACCESSORIES',
                subItemsNameComponentName: [
                  {
                    name: 'Ecco',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Ecco',
                  },
                  {
                    name: 'Keti',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Keti',
                  },
                  {
                    name: 'Qubix',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Qubix',
                  },
                  {
                    name: 'Square',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Square',
                  },
                  {
                    name: 'Supreme',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Supreme',
                  },
                  {
                    name: 'Dolphin',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Dolphin',
                  },
                  {
                    name: 'Acrylic Accessories',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/AcrylicAccessories',
                  },
                  {
                    name: 'Almond',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Almond',
                  },
                  {
                    name: 'Anglo',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Anglo',
                  },
                  {
                    name: 'Budget',
                    path: '/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Budget',
                  },
                ],
              },
              {
                name: 'Bathroom Faucets',
                subItemsNameComponentName: [
                  {
                    name: 'Super',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Super',
                  },
                  {
                    name: 'Tri',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Tri',
                  },
                  {
                    name: 'Square S',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Square S',
                  },
                  {
                    name: 'Royal',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Royal',
                  },
                  {
                    name: 'Slimline',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Slimline',
                  },
                  {
                    name: 'Splash',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Splash',
                  },
                  {
                    name: 'Square F',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Square F',
                  },
                  {
                    name: 'Omega',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Omega',
                  },
                  {
                    name: 'Passion',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Passion',
                  },
                  {
                    name: 'Milano',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Milano',
                  },
                  {
                    name: 'Nano',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Nano',
                  },
                  {
                    name: 'Nexa',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Nexa',
                  },
                  {
                    name: 'Niagra',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Niagra',
                  },
                  {
                    name: 'Nice',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Nice',
                  },
                  {
                    name: 'Ket',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Ket',
                  },
                  {
                    name: 'Expert',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Expert',
                  },
                  {
                    name: 'Florence',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Florence',
                  },
                  {
                    name: 'Glass Bowl Faucet',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Glass Bowl Faucet',
                  },
                  {
                    name: 'Idea',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Idea',
                  },
                  {
                    name: 'Jazz',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Jazz',
                  },
                  {
                    name: 'Eeco',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Eeco',
                  },
                  {
                    name: 'Concept',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Concept',
                  },
                  {
                    name: 'Deluxe',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Deluxe',
                  },
                  {
                    name: 'Almond',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Almond',
                  },
                  {
                    name: 'Arrow',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Arrow',
                  },
                  {
                    name: 'Bold',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Bold',
                  },
                  {
                    name: 'Budget',
                    path: '/ProductAdd/Sanitary/Corsa/BathroomFaucets/Budget',
                  },
                ],
              },
              {
                name: 'Kitchen',
                subItemsNameComponentName: [
                  {
                    name: 'Kitchen Sink',
                    path: '/ProductAdd/Sanitary/Corsa/Kitchen/Kitchen Sink',
                  },
                  {
                    name: 'Kitchen Faucets',
                    path: '/ProductAdd/Sanitary/Corsa/Kitchen/Kitchen Faucets',
                  },
                ],
              },
              {
                name: 'Showers',
                subItemsNameComponentName: [
                  {
                    name: 'Hand Showers',
                    path: '/ProductAdd/Sanitary/Essess/Showers/Hand Showers',
                  },
                  {
                    name: 'Overhead Showers',
                    path: '/ProductAdd/Sanitary/Essess/Showers/Overhead Showers',
                  },
                  {
                    name: 'Rainfall Showers',
                    path: '/ProductAdd/Sanitary/Essess/Showers/Rainfall Showers',
                  },
                  {
                    name: 'Shower Arms',
                    path: '/ProductAdd/Sanitary/Essess/Showers/Shower Arms',
                  },
                ],
              },

              {
                name: 'Other Useful Items',
                subItemsNameComponentName: [
                  {
                    name: 'Mouth Operated',
                    path: '/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Mouth Operated',
                  },
                  {
                    name: 'Pressmatic Push Cock',
                    path: '/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Pressmatic Push Cock',
                  },
                  {
                    name: 'Sensor Taps',
                    path: '/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Sensor Taps',
                  },
                  {
                    name: 'Soap Dispenser',
                    path: '/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Soap Dispenser',
                  },
                  {
                    name: 'Mini Angle Cock',
                    path: '/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Mini Angle Cock',
                  },
                  {
                    name: 'Ball Valves',
                    path: '/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Ball Valves',
                  },
                ],
              },
              {
                name: 'Flushing Cistern',
                path: '/ProductAdd/Sanitary/Corsa/FlushingCistern',
              },
            ],
          },
          {
            name: 'Essess',
            subItemsNameComponent: [
              {
                name: 'Showers',
                subItemsNameComponentName: [
                  {
                    name: 'Hand Showers',
                    path: '/ProductAdd/Sanitary/Essess/Showers/HandShowers',
                  },
                  {
                    name: 'Overhead Showers',
                    path: '/ProductAdd/Sanitary/Essess/Showers/OverheadShowers',
                  },
                  {
                    name: 'Rainfall Showers',
                    path: '/ProductAdd/Sanitary/Essess/Showers/RainfallShowers',
                  },
                  {
                    name: 'Shower Arms',
                    path: '/ProductAdd/Sanitary/Essess/Showers/ShowerArms',
                  },
                ],
              },
              {
                name: 'Accessories',
                subItemsNameComponent: [
                  {
                    name: 'Series8 B Series',
                    path: '/ProductAdd/Sanitary/Essess/Accessories/Series8BSeries',
                  },
                  {
                    name: 'Series7 Deon',
                    path: '/ProductAdd/Sanitary/Essess/Accessories/Series7Deon',
                  },
                  {
                    name: 'Series2 Swing',
                    path: '/ProductAdd/Sanitary/Essess/Accessories/Series2Swing',
                  },
                  {
                    name: 'Series3 Tarim',
                    path: '/ProductAdd/Sanitary/Essess/Accessories/Series3Tarim',
                  },
                  {
                    name: 'Series5 Hotelier Series',
                    path: '/ProductAdd/Sanitary/Essess/Accessories/Series5HotelierSeries',
                  },
                  {
                    name: 'Series6 Cruzo',
                    path: '/ProductAdd/Sanitary/Essess/Accessories/Series6Cruzo',
                  },
                  {
                    name: 'Series1 Croma',
                    path: '/ProductAdd/Sanitary/Essess/Accessories/Series1Croma',
                  },
                ],
              },
              {
                name: 'Trand',
                path: '/ProductAdd/Sanitary/Essess/Trand',
              },
              {
                name: 'Tarim',
                path: '/ProductAdd/Sanitary/Essess/Tarim',
              },
              {
                name: 'Lab Taps',
                path: '/ProductAdd/Sanitary/Essess/Lab Taps',
              },
              {
                name: 'New Dune',
                path: '/ProductAdd/Sanitary/Essess/New Dune',
              },
              {
                name: 'New Xess',
                path: '/ProductAdd/Sanitary/Essess/New Xess',
              },
              {
                name: 'Quadra',
                path: '/ProductAdd/Sanitary/Essess/Quadra',
              },
              {
                name: 'Sensors',
                path: '/ProductAdd/Sanitary/Essess/Sensors',
              },
              {
                name: 'Hotelier Series',
                path: '/ProductAdd/Sanitary/Essess/HotelierSeries',
              },
              {
                name: 'Deon',
                path: '/ProductAdd/Sanitary/Essess/Deon',
              },
              {
                name: 'Echo',
                path: '/ProductAdd/Sanitary/Essess/Echo',
              },
              {
                name: 'Essentials',
                path: '/ProductAdd/Sanitary/Essess/Essentials',
              },
              {
                name: 'H S03',
                path: '/ProductAdd/Sanitary/Essess/H S03',
              },
              {
                name: 'D Series',
                path: '/ProductAdd/Sanitary/Essess/D Series',
              },
              {
                name: 'Auto Close Taps',
                path: '/ProductAdd/Sanitary/Essess/AutoCloseTaps',
              },
              {
                name: 'Celato',
                path: '/ProductAdd/Sanitary/Essess/Celato',
              },
              {
                name: 'Croma',
                path: '/ProductAdd/Sanitary/Essess/Croma',
              },
              {
                name: 'Cruzo',
                path: '/ProductAdd/Sanitary/Essess/Cruzo',
              },
            ],
          },
          {
            name: 'Faucets',
            path: '/ProductAdd/Sanitary/Faucets',
            subItemsNameComponent: [],
          },
          {
            name: 'Hardware & Bathroom Accessories',
            path: '/ProductAdd/Sanitary/HardwareBathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Health Faucet',
            path: '/ProductAdd/Sanitary/HealthFaucet',
            subItemsNameComponent: [],
          },
          {
            name: 'Hindware',
            subItemsNameComponent: [
              {
                name: 'Wash Basins',
                path: '/ProductAdd/Sanitary/Hindware/WashBasins',
              },
              {
                name: 'Water Closets',
                path: '/ProductAdd/Sanitary/Hindware/WaterClosets',
              },
              {
                name: 'Showers',
                path: '/ProductAdd/Sanitary/Hindware/Showers',
              },
              {
                name: 'Add On',
                path: '/ProductAdd/Sanitary/Hindware/AddOn',
              },
              {
                name: 'Bath Tub',
                path: '/ProductAdd/Sanitary/Hindware/BathTub',
              },
              {
                name: 'Cisterns',
                path: '/ProductAdd/Sanitary/Hindware/Cisterns',
              },
              {
                name: 'Faucets',
                subItemsNameComponentName: [
                  {
                    name: 'Angular Stop Cock',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/AngularStopCock',
                  },
                  {
                    name: 'Bath Spout',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/BathSpout',
                  },
                  {
                    name: 'Bib Cock',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/BibCock',
                  },
                  {
                    name: 'Chbm',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/Chbm',
                  },
                  {
                    name: 'Concealed Stop Cock',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/ConcealedStopCock',
                  },
                  {
                    name: 'Csc Exp Kit',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/CscExpKit',
                  },
                  {
                    name: 'Deusch Mixer',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/DeuschMixer',
                  },
                  {
                    name: 'Exposed Mixers',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/ExposedMixers',
                  },
                  {
                    name: 'Flush Cock',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/FlushCock',
                  },
                  {
                    name: 'Medical Series',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/MedicalSeries',
                  },
                  {
                    name: 'Mixer Faucet',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/MixerFaucet',
                  },
                  {
                    name: 'Pillar Cock',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/PillarCock',
                  },
                  {
                    name: 'Pillar Cock Tall',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/PillarCockTall',
                  },
                  {
                    name: 'Pillar Faucet',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/PillarFaucet',
                  },
                  {
                    name: 'Pressmatic',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/Pressmatic',
                  },
                  {
                    name: 'Recessed',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/Recessed',
                  },
                  {
                    name: 'Sink Cock',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/SinkCock',
                  },
                  {
                    name: 'Sink Mixer',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/SinkMixer',
                  },
                  {
                    name: 'Single Lever Divertor',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/SingleLeverDivertor',
                  },
                  {
                    name: 'Slbm Faucet',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/SlbmFaucet',
                  },
                  {
                    name: 'Slbm Faucet Tall',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/SlbmFaucetTall',
                  },
                  {
                    name: 'Wall Mixer',
                    path: '/ProductAdd/Sanitary/Hindware/Faucets/WallMixer',
                  },
                ],
              },
            ],
          },
          {
            name: 'Jaquar',
            path: '/ProductAdd/Sanitary/Jaquar',
            subItemsNameComponent: [],
          },
          {
            name: 'Kitchen Sinks',
            path: '/ProductAdd/Sanitary/KitchenSinks',
            subItemsNameComponent: [],
          },
          {
            name: 'LEMON Bathroom Accessories',
            path: '/ProductAdd/Sanitary/LemonBathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Leo Bath Fittings',
            subItemsNameComponent: [
              {
                name: 'Valve',
                path: '/ProductAdd/Sanitary/LeoBathFittings/Valve',
              },
              {
                name: 'Bathroom Accessories',
                path: '/ProductAdd/Sanitary/LeoBathFittings/BathroomAccessories',
              },
              {
                name: 'Faucets',
                path: '/ProductAdd/Sanitary/LeoBathFittings/Faucets',
              },
            ],
          },
          {
            name: 'Pamay',
            subItemsNameComponent: [
              {
                name: 'Showers',
                path: '/ProductAdd/Sanitary/Pamay/Showers',
              },
              {
                name: 'Faucets',
                path: '/ProductAdd/Sanitary/Pamay/Faucets',
              },
            ],
          },
          {
            name: 'Parryware',
            subItemsNameComponent: [
              {
                name: 'Water Heaters',
                path: '/ProductAdd/Sanitary/Parryware/WaterHeaters',
              },
              {
                name: 'Waste Coupling',
                path: '/ProductAdd/Sanitary/Parryware/WasteCoupling',
              },
              {
                name: 'Wash Basins',
                path: '/ProductAdd/Sanitary/Parryware/WashBasins',
              },
              {
                name: 'Utsav Range',
                path: '/ProductAdd/Sanitary/Parryware/UtsavRange',
              },
              {
                name: 'Shower Panels',
                path: '/ProductAdd/Sanitary/Parryware/ShowerPanels',
              },
              {
                name: 'Shower Enclosures',
                path: '/ProductAdd/Sanitary/Parryware/ShowerEnclosures',
              },
              {
                name: 'Semi Recessed Basins',
                path: '/ProductAdd/Sanitary/Parryware/SemiRecessedBasins',
              },
              {
                name: 'Seat Covers',
                path: '/ProductAdd/Sanitary/Parryware/SeatCovers',
              },
              {
                name: 'Push Plates',
                path: '/ProductAdd/Sanitary/Parryware/PushPlates',
              },
              {
                name: 'Polymer Cisterns',
                path: '/ProductAdd/Sanitary/Parryware/PolymerCisterns',
              },
              {
                name: 'F A U C E T S',
                path: '/ProductAdd/Sanitary/Parryware/FAUCETS',
              },
              {
                name: 'European Water Closet',
                path: '/ProductAdd/Sanitary/Parryware/EuropeanWaterCloset',
              },
              {
                name: 'Concealed Cistern',
                path: '/ProductAdd/Sanitary/Parryware/ConcealedCistern',
              },
              {
                name: 'CLOSETS',
                path: '/ProductAdd/Sanitary/Parryware/CLOSETS',
              },
              {
                name: 'Bowl Basins',
                path: '/ProductAdd/Sanitary/Parryware/BowlBasins',
              },
              {
                name: 'Below Counter Basins',
                path: '/ProductAdd/Sanitary/Parryware/BelowCounterBasins',
              },
              {
                name: 'Angle Valves',
                path: '/ProductAdd/Sanitary/Parryware/AngleValves',
              },
              {
                name: 'Accessories',
                path: '/ProductAdd/Sanitary/Parryware/Accessories',
              },
              {
                name: 'Showers',
                path: '/ProductAdd/Sanitary/Parryware/Showers',
              },
            ],
          },
          {
            name: 'Pearl Precious Products',
            subItemsNameComponent: [
              {
                name: 'Edge',
                path: '/ProductAdd/Sanitary/PearlPreciousProducts/Edge',
              },
            ],
          },
          {
            name: 'Showers',
            path: '/ProductAdd/Sanitary/Showers',
          },
          {
            name: 'Taps',
            path: '/ProductAdd/Sanitary/Taps',
          },
          {
            name: 'Washbasins',
            path: '/ProductAdd/Sanitary/Washbasins',
          },
          {
            name: 'Waterman',
            subItemsNameComponent: [
              {
                name: 'Wall Showers Without Arm',
                path: '/ProductAdd/Sanitary/Waterman/WallShowersWithoutArm',
              },
              {
                name: 'Wall Showers With Arm',
                path: '/ProductAdd/Sanitary/Waterman/WallShowersWithArm',
              },
              {
                name: 'Shower Tubes',
                path: '/ProductAdd/Sanitary/Waterman/ShowerTubes',
              },
              {
                name: 'Roman',
                path: '/ProductAdd/Sanitary/Waterman/Roman',
              },
              {
                name: 'Rain Showers',
                path: '/ProductAdd/Sanitary/Waterman/RainShowers',
              },
              {
                name: 'Ikon',
                path: '/ProductAdd/Sanitary/Waterman/Ikon',
              },
              {
                name: 'Evoque',
                path: '/ProductAdd/Sanitary/Waterman/Evoque',
              },
              {
                name: 'Health Faucet Abs',
                path: '/ProductAdd/Sanitary/Waterman/HealthFaucetAbs',
              },
              {
                name: 'Health Faucets Brass',
                path: '/ProductAdd/Sanitary/Waterman/HealthFaucetsBrass',
              },
              {
                name: 'Eco',
                path: '/ProductAdd/Sanitary/Waterman/Eco',
              },
              {
                name: 'Aura',
                path: '/ProductAdd/Sanitary/Waterman/Aura',
              },
              {
                name: 'Dell',
                path: '/ProductAdd/Sanitary/Waterman/Dell',
              },
              {
                name: 'Deluxe',
                path: '/ProductAdd/Sanitary/Waterman/Deluxe',
              },
              {
                name: 'Aria',
                path: '/ProductAdd/Sanitary/Waterman/Aria',
              },
              {
                name: 'Accessories',
                path: '/ProductAdd/Sanitary/Waterman/Accessories',
              },
            ],
          },
          {
            name: 'Water Tec',
            subItemsNameComponent: [
              {
                name: 'Taps',
                path: '/ProductAdd/Sanitary/WaterTec/Taps',
              },
              {
                name: 'Toilet Seat Covers',
                path: '/ProductAdd/Sanitary/WaterTec/ToiletSeatCovers',
              },
              {
                name: 'Valves',
                path: '/ProductAdd/Sanitary/WaterTec/Valves',
              },
              {
                name: 'T Series Alt',
                path: '/ProductAdd/Sanitary/WaterTec/TSeriesAlt',
              },
              {
                name: 'Health Faucets',
                path: '/ProductAdd/Sanitary/WaterTec/HealthFaucets',
              },
              {
                name: 'Quattro',
                path: '/ProductAdd/Sanitary/WaterTec/Quattro',
              },
              {
                name: 'Showers',
                path: '/ProductAdd/Sanitary/WaterTec/Showers',
              },
              {
                name: 'T Series',
                path: '/ProductAdd/Sanitary/WaterTec/TSeries',
              },
              {
                name: 'Concealed Cistern',
                path: '/ProductAdd/Sanitary/WaterTec/ConcealedCistern',
              },
              {
                name: 'Connection Tube',
                path: '/ProductAdd/Sanitary/WaterTec/ConnectionTube',
              },
              {
                name: 'Ebony',
                path: '/ProductAdd/Sanitary/WaterTec/Ebony',
              },
              {
                name: 'Eco',
                path: '/ProductAdd/Sanitary/WaterTec/Eco',
              },
              {
                name: 'Eva',
                path: '/ProductAdd/Sanitary/WaterTec/Eva',
              },
              {
                name: 'Flora',
                path: '/ProductAdd/Sanitary/WaterTec/Flora',
              },
              {
                name: 'Bathroom Accessories',
                path: '/ProductAdd/Sanitary/WaterTec/BathroomAccessories',
              },
              {
                name: 'Cistern',
                path: '/ProductAdd/Sanitary/WaterTec/Cistern',
              },
              {
                name: 'Allied',
                path: '/ProductAdd/Sanitary/WaterTec/Allied',
              },
              {
                name: 'Aqua',
                path: '/ProductAdd/Sanitary/WaterTec/Aqua',
              },
              {
                name: 'Aspire',
                path: '/ProductAdd/Sanitary/WaterTec/Aspire',
              },
            ],
          },
        ],
      },
      { name: 'Shop', path: '/ProductAdd/Shop' },
      {
        name: 'Tools',
        subItemsName: [
          {
            name: 'abrasives',
            path: '/ProductAdd/Tools/abrasives',
            subItemsNameComponent: [
              {
                name: 'Cut Off Wheel',
                path: '/ProductAdd/Tools/abrasives/CutOffWheel',
              },
              {
                name: 'Diamond Blades',
                path: '/ProductAdd/Tools/abrasives/DiamondBlades',
              },
            ],
          },
          {
            name: 'Allen Keys',
            path: '/ProductAdd/Tools/AllenKeys',
            subItemsNameComponent: [],
          },
          {
            name: 'Brush',
            path: '/ProductAdd/Tools/Brush',
            subItemsNameComponent: [],
          },
          {
            name: 'Carpenter Pincer',
            path: '/ProductAdd/Tools/CarpenterPincer',
            subItemsNameComponent: [],
          },
          {
            name: 'Centre Punches',
            path: '/ProductAdd/Tools/CentrePunches',
            subItemsNameComponent: [],
          },
          {
            name: 'Chisels',
            path: '/ProductAdd/Tools/Chisels',
            subItemsNameComponent: [],
          },
          {
            name: 'Clamps',
            path: '/ProductAdd/Tools/Clamps',
            subItemsNameComponent: [],
          },
          {
            name: 'Crowbar',
            path: '/ProductAdd/Tools/Crowbar',
            subItemsNameComponent: [],
          },
          {
            name: 'Cutters',
            path: '/ProductAdd/Tools/Cutters',
            subItemsNameComponent: [],
          },
          {
            name: 'files',
            path: '/ProductAdd/Tools/files',
            subItemsNameComponent: [],
          },
          {
            name: 'Garden Tools',
            path: '/ProductAdd/Tools/GardenTools',
            subItemsNameComponent: [],
          },
          {
            name: 'Gear Pullers',
            path: '/ProductAdd/Tools/GearPullers',
            subItemsNameComponent: [],
          },
          {
            name: 'Glass cutter',
            path: '/ProductAdd/Tools/GlassCutter',
            subItemsNameComponent: [],
          },
          {
            name: 'glue gun',
            path: '/ProductAdd/Tools/gluegun',
            subItemsNameComponent: [],
          },
          {
            name: 'Grease Gun',
            path: '/ProductAdd/Tools/GreaseGun',
            subItemsNameComponent: [],
          },
          {
            name: 'Hacksaw Blades',
            path: '/ProductAdd/Tools/HacksawBlades',
            subItemsNameComponent: [],
          },
          {
            name: 'Hammer',
            path: '/ProductAdd/Tools/Hammer',
            subItemsNameComponent: [],
          },
          {
            name: 'Hammer Drills',
            path: '/ProductAdd/Tools/HammerDrills',
            subItemsNameComponent: [],
          },
          {
            name: 'hand tools',
            path: '/ProductAdd/Tools/handtools',
            subItemsNameComponent: [],
          },
          {
            name: 'level',
            path: '/ProductAdd/Tools/level',
            subItemsNameComponent: [],
          },
          {
            name: 'Lubrications',
            path: '/ProductAdd/Tools/Lubrications',
            subItemsNameComponent: [],
          },
          {
            name: 'Measurement Scale',
            path: '/ProductAdd/Tools/MeasurementScale',
            subItemsNameComponent: [],
          },
          {
            name: 'Measuring Tape',
            path: '/ProductAdd/Tools/MeasuringTape',
            subItemsNameComponent: [],
          },
          {
            name: 'Multimeter',
            path: '/ProductAdd/Tools/Multimeter',
            subItemsNameComponent: [],
          },
          {
            name: 'Plier',
            path: '/ProductAdd/Tools/Plier',
            subItemsNameComponent: [],
          },
          {
            name: 'Polishing Accessories',
            path: '/ProductAdd/Tools/PolishingAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Power Tools',
            subItemsNameComponent: [
              {
                name: 'Drill',
                path: '/ProductAdd/Tools/PowerTools/Drill',
              },
              {
                name: 'Grinders',
                path: '/ProductAdd/Tools/PowerTools/Grinders',
              },
              {
                name: 'Marble Cutter',
                path: '/ProductAdd/Tools/PowerTools/MarbleCutter',
              },
            ],
          },
          {
            name: 'Saw',
            path: '/ProductAdd/Tools/saw',
            subItemsNameComponent: [],
          },
          {
            name: 'Screw Driver',
            path: '/ProductAdd/Tools/ScrewDriver',
            subItemsNameComponent: [],
          },
          {
            name: 'Silicon Gun',
            path: '/ProductAdd/Tools/SiliconGun',
            subItemsNameComponent: [],
          },
          {
            name: 'Socket set',
            path: '/ProductAdd/Tools/Socketset',
            subItemsNameComponent: [],
          },
          {
            name: 'Spanners',
            path: '/ProductAdd/Tools/Spanners',
            subItemsNameComponent: [],
          },
          {
            name: 'Spare Malets',
            path: '/ProductAdd/Tools/SpareMalets',
            subItemsNameComponent: [],
          },
          {
            name: 'Tool Compartments',
            path: '/ProductAdd/Tools/ToolCompartments',
            subItemsNameComponent: [],
          },
          {
            name: 'toolkit set',
            path: '/ProductAdd/Tools/toolkitset',
            subItemsNameComponent: [],
          },
          {
            name: 'various tool bits',
            path: '/ProductAdd/Tools/varioustoolbits',
            subItemsNameComponent: [],
          },
          {
            name: 'wood chisel',
            path: '/ProductAdd/Tools/woodChisel',
            subItemsNameComponent: [],
          },
          {
            name: 'wood items',
            path: '/ProductAdd/Tools/woodItems',
            subItemsNameComponent: [],
          },
          {
            name: 'Wrench',
            path: '/ProductAdd/Tools/Wrench',
            subItemsNameComponent: [],
          },
        ],
      },
      { name: 'Uncategorized', path: '/ProductAdd/Uncategorized' },
      {
        name: 'WaterProofing',
        subItemsName: [
          {
            name: 'Bathrooms',
            path: '/ProductAdd/WaterProofing/Bathrooms',
            subItemsNameComponent: [],
          },
          {
            name: 'Cracks & Joints',
            path: '/ProductAdd/WaterProofing/CracksJoints',
            subItemsNameComponent: [],
          },
          {
            name: 'Interiors',
            path: '/ProductAdd/WaterProofing/Interiors',
            subItemsNameComponent: [],
          },
        ],
      },
    ],
  },
  {
    name: 'Product List',
    section: 'section1', // Section 1: Core Management
    subItems: [
      { name: 'Adhesives', path: '/ProductList/Adhesives' },
      { name: 'Brush', path: '/ProductList/Brush' },
      { name: 'Cements & POP', path: '/ProductList/Cements' },
      { name: 'Cleaning', path: '/ProductList/Cleaning' },
      { name: 'Dry Wall Gypsum Screws', path: '/ProductList/Dry' },
      {
        name: 'Electrical Item',
        subItemsName: [
          {
            name: 'Adaptors',
            path: '/ProductList/Electrical/Adaptors',
          },
          {
            name: 'Ceiling Roses',
            path: '/ProductList/Electrical/CeilingRoses',
          },
          { name: 'Dimmer', path: '/ProductList/Electrical/Dimmer' },
          {
            name: 'Distribution Boards',
            path: '/ProductList/Electrical/DistributionBoards',
          },
          {
            name: 'Door Bells',
            path: '/ProductList/Electrical/DoorBells',
          },
          {
            name: 'DP-switch',
            path: '/ProductList/Electrical/DPswitch',
          },
          {
            name: 'Earthing Accessories',
            path: '/ProductList/Electrical/EarthingAccessories',
          },
          {
            name: 'ELCBs OR RCCBs',
            path: '/ProductList/Electrical/ELCBsRCCBs',
          },
          {
            name: 'Electrical Fittings',
            path: '/ProductList/Electrical/ElectricalFittings',
            subItemsNameComponent: [
              {
                name: 'Accessories',
                path: '/ProductList/Electrical/ElectricalFittings/Accessories',
              },
              {
                name: 'Circular Deep Box',
                path: '/ProductList/Electrical/ElectricalFittings/CircularDeepBox',
              },
              {
                name: 'Circular surface box',
                path: '/ProductList/Electrical/ElectricalFittings/CircularSurfaceBox',
              },
              {
                name: 'Rigid type',
                path: '/ProductList/Electrical/ElectricalFittings/RigidType',
              },
            ],
          },
          {
            name: 'Fans',
            path: '/ProductList/Electrical/Fans',
            subItemsNameComponent: [
              {
                name: 'Cabin Fans',
                path: '/ProductList/Electrical/Fans/CabinFans',
              },
              {
                name: 'Ceiling Fans',
                path: '/ProductList/Electrical/Fans/CeilingFans',
              },
              {
                name: 'Pedestal Fans',
                path: '/ProductList/Electrical/Fans/PedestalFans',
              },
              {
                name: 'Table Fans',
                path: '/ProductList/Electrical/Fans/TableFans',
              },
              {
                name: 'Ventilation/Exhaust Fans',
                path: '/ProductList/Electrical/Fans/VentilationExhaustFans',
              },
              {
                name: 'Wall Mounting Fans',
                path: '/ProductList/Electrical/Fans/WallMountingFans',
              },
            ],
          },
          {
            name: 'Flexible Conduit',
            path: '/ProductList/Electrical/FlexibleConduit',
          },
          {
            name: 'Flexible Wires',
            path: '/ProductList/Electrical/FlexibleWires',
          },
          {
            name: 'Fuse Carriers',
            path: '/ProductList/Electrical/FuseCarriers',
          },
          {
            name: 'Holders',
            path: '/ProductList/Electrical/Holders',
          },
          {
            name: 'Indicator',
            path: '/ProductList/Electrical/Indicator',
          },
          {
            name: 'Insulation Tapes',
            path: '/ProductList/Electrical/InsulationTapes',
          },
          {
            name: 'Isolators',
            path: '/ProductList/Electrical/Isolators',
          },
          { name: 'Jacks', path: '/ProductList/Electrical/Jacks' },
          {
            name: 'KIT KAT Fuses',
            path: '/ProductList/Electrical/KITKATFuses',
          },
          {
            name: 'Lights',
            path: '/ProductList/Electrical/Lights',
            subItemsNameComponent: [
              {
                name: 'Ceiling light',
                path: '/ProductList/Electrical/Lights/CeilingLight',
              },
              {
                name: 'CFL',
                path: '/ProductList/Electrical/Lights/CFL',
              },
              {
                name: 'Desklight',
                path: '/ProductList/Electrical/Lights/Desklight',
              },
              {
                name: 'Focus Light',
                path: '/ProductList/Electrical/Lights/FocusLight',
              },
              {
                name: 'Garden Light',
                path: '/ProductList/Electrical/Lights/GardenLight',
              },
              {
                name: 'Gate Light',
                path: '/ProductList/Electrical/Lights/GateLight',
              },
              {
                name: 'GLS',
                path: '/ProductList/Electrical/Lights/GLS',
              },
              {
                name: 'Home',
                path: '/ProductList/Electrical/Lights/Home',
              },
              {
                name: 'Lamps',
                path: '/ProductList/Electrical/Lights/Lamps',
              },
              {
                name: 'LED Batten',
                path: '/ProductList/Electrical/Lights/LEDBatten',
              },
              {
                name: 'LED Bulbs',
                path: '/ProductList/Electrical/Lights/LEDBulbs',
              },
              {
                name: 'Led DownLighters/Spot Light',
                path: '/ProductList/Electrical/Lights/LedDownLightersSpotLight',
              },
              {
                name: 'LED Luminaires',
                path: '/ProductList/Electrical/Lights/LEDLuminaires',
              },
              {
                name: 'LED Panel Light',
                path: '/ProductList/Electrical/Lights/LEDPanelLight',
              },
              {
                name: 'LED Spotlight',
                path: '/ProductList/Electrical/Lights/LEDSpotlight',
              },
              {
                name: 'LED Street Light',
                path: '/ProductList/Electrical/Lights/LEDStreetLight',
              },
              {
                name: 'LED Strips',
                path: '/ProductList/Electrical/Lights/LEDStrips',
              },
              {
                name: 'Led Surface Light',
                path: '/ProductList/Electrical/Lights/LedSurfaceLight',
              },
              {
                name: 'Light Electronics',
                path: '/ProductList/Electrical/Lights/LightElectronics',
              },
              {
                name: 'Mirror Light',
                path: '/ProductList/Electrical/Lights/MirrorLight',
              },
              {
                name: 'Reflectors',
                path: '/ProductList/Electrical/Lights/Reflectors',
              },
              {
                name: 'Standard Incandescent',
                path: '/ProductList/Electrical/Lights/StandardIncandescent',
              },
              {
                name: 'T Bulb',
                path: '/ProductList/Electrical/Lights/TBulb',
              },
              {
                name: 'Tube Light',
                path: '/ProductList/Electrical/Lights/TubeLight',
              },
              {
                name: 'Under Water Lights',
                path: '/ProductList/Electrical/Lights/UnderWaterLights',
              },
              {
                name: 'Wall Light',
                path: '/ProductList/Electrical/Lights/WallLight',
              },
            ],
          },
          {
            name: 'Main Switch',
            path: '/ProductList/Electrical/MainSwitch',
          },
          { name: 'MCB', path: '/ProductList/Electrical/MCB' },
          {
            name: 'Modular/Surface Box',
            path: '/ProductList/Electrical/ModularSurfaceBox',
          },
          {
            name: 'Motor Starters',
            path: '/ProductList/Electrical/MotorStarters',
          },
          { name: 'Motors', path: '/ProductList/Electrical/Motors' },
          { name: 'Others', path: '/ProductList/Electrical/Others' },
          { name: 'Pin top', path: '/ProductList/Electrical/PinTop' },
          { name: 'Plug', path: '/ProductList/Electrical/Plug' },
          {
            name: 'Power Strips',
            path: '/ProductList/Electrical/PowerStrips',
          },
          {
            name: 'PVC Clips',
            path: '/ProductList/Electrical/PVCClips',
          },
          {
            name: 'Regulators',
            path: '/ProductList/Electrical/Regulators',
          },
          {
            name: 'Rotary Switch',
            path: '/ProductList/Electrical/RotarySwitch',
          },
          {
            name: 'Sockets',
            path: '/ProductList/Electrical/Sockets',
          },
          {
            name: 'Switch & Socket',
            path: '/ProductList/Electrical/SwitchAndSocket',
          },
          {
            name: 'Switch Plates',
            path: '/ProductList/Electrical/SwitchPlates',
          },
          {
            name: 'Switches',
            path: '/ProductList/Electrical/Switches',
          },
          {
            name: 'Travel adaptor',
            path: '/ProductList/Electrical/TravelAdaptor',
          },
          {
            name: 'TV outlets',
            path: '/ProductList/Electrical/TVOutlets',
          },
          {
            name: 'Uni Switch Socket Combined Units',
            path: '/ProductList/Electrical/UniSwitch',
          },
          {
            name: 'Water Heater',
            path: '/ProductList/Electrical/Water Heater',
          },
          {
            name: 'Water Heaters',
            path: '/ProductList/Electrical/WaterHeaters',
          },
          {
            name: 'Wires & Cables',
            path: '/ProductList/Electrical/WiresAndCables',
          },
        ],
      },
      { name: 'Electrical Fitting', path: '/ProductList/Fitting' },
      { name: 'Fiber Sheet', path: '/ProductList/Fiber' },
      { name: 'Hardware', path: '/ProductList/Hardware' },
        {
        name: 'Home',
        subItemsName: [
          {
            name: 'Brands',
            path: '/ProductList/Home/Brands',
          },
          {
            name: 'Card',
            path: '/ProductList/Home/Card',
          },
          {
            name: 'Card Slider',
            path: '/ProductList/Home/CardSlider',
          },
          {
            name: 'Categories',
            path: '/ProductList/Home/Categories',
          },
          {
            name: 'Electrical',
            path: '/ProductList/Home/ElectricalHome',
          },
          {
            name: 'Image Slider',
            subItemsNameComponent: [
              {
                name: 'Electrical Image',
                path: '/ProductList/Home/ImageSlider/ElectricImage',
              },
              {
                name: 'Faucet Image',
                path: '/ProductList/Home/ImageSlider/FaucetImage',
              },
              {
                name: 'Paints Image',
                path: '/ProductList/Home/ImageSlider/PaintsImage',
              },
              {
                name: 'Sanitary Image',
                path: '/ProductList/Home/ImageSlider/SanitaryImage',
              },
              {
                name: 'Tools Image',
                path: '/ProductList/Home/ImageSlider/ToolsImage',
              },
            ],
          },
          {
            name: 'Items',
            path: '/ProductList/Home/Items',
          },
          {
            name: 'Paints',
            path: '/ProductList/Home/Paints',
          },
          {
            name: 'Popular Products',
            path: '/ProductList/Home/PopularProducts',
          },
         
          {
            name: 'Product Tools',
            path: '/ProductList/Home/ProductTools',
          },
          {
            name: 'Service',
            path: '/ProductList/Home/Service',
          },
          {
            name: 'Offer',
            path: '/ProductList/Home/Offer',
          },
        ],
      },
        
         
      { name: 'Home Decor', path: '/ProductList/HomeDecor' },
      // { name: 'House Hold Ladder', path: '/ProductList/HouseHold' },
      // { name: 'Lighting', path: '/ProductList/Lighting' },
      {
        name: 'Locks & accessories',
        subItemsName: [
          {
            name: 'DOOR ACCESSORIES',
            subItemsNameComponent: [
              {
                name: 'Aluminium Tower Bolt',
                path: '/ProductList/Locks/DoorAccessories/AluminiumTowerBolt',
              },
              {
                name: 'Ball Bearing Door Hinges',
                path: '/ProductList/Locks/DoorAccessories/BallBearingDoorHinges',
              },
              {
                name: 'Concealed Hinges',
                path: '/ProductList/Locks/DoorAccessories/ConcealedHinges',
              },
              {
                name: 'Door Eye',
                path: '/ProductList/Locks/DoorAccessories/DoorEye',
              },
              {
                name: 'Door Stopper',
                path: '/ProductList/Locks/DoorAccessories/DoorStopper',
              },
              {
                name: 'HINGES',
                path: '/ProductList/Locks/DoorAccessories/HINGES',
              },
              {
                name: 'Magnetic Door Stoppers',
                path: '/ProductList/Locks/DoorAccessories/MagneticDoorStoppers',
              },
              {
                name: 'Wooden Sliding Door Fittings',
                path: '/ProductList/Locks/DoorAccessories/WoodenSlidingDoorFittings',
              },
            ],
          },
          {
            name: 'DOOR CONTROLS',
            subItemsNameComponent: [
              {
                name: 'Door Closers',
                path: '/ProductList/Locks/DoorControls/DoorClosers',
              },
              {
                name: 'Door Stopper',
                path: '/ProductList/Locks/DoorControls/DoorStopper',
              },
              {
                name: 'Hydraulic Door Closers',
                path: '/ProductList/Locks/DoorControls/HydraulicDoorClosers',
              },
            ],
          },
          {
            name: 'DOOR HANDLES',
            subItemsNameComponent: [
              {
                name: 'Door King',
                path: '/ProductList/Locks/DoorControls/DoorKing',
              },
              {
                name: 'Door Pulls',
                path: '/ProductList/Locks/DoorControls/DoorPulls',
              },
            ],
          },
          {
            name: 'DOOR LOCKS',
            subItemsNameComponent: [
              {
                name: 'Tri Bolt Locks',
                path: '/ProductList/Locks/DoorLocks/TriBoltLocks',
              },
              {
                name: 'Smart Key',
                path: '/ProductList/Locks/DoorLocks/SmartKey',
              },
              {
                name: 'Night Latch',
                path: '/ProductList/Locks/DoorLocks/NightLatch',
              },
              {
                name: 'Pull Handles For Main Doors',
                path: '/ProductList/Locks/DoorLocks/PullHandlesForMainDoors',
              },
              {
                name: 'Rim Dead Lock',
                path: '/ProductList/Locks/DoorLocks/RimDeadLock',
              },
              {
                name: 'Side Lock',
                path: '/ProductList/Locks/DoorLocks/SideLock',
              },
              {
                name: 'Main Door Lock',
                path: '/ProductList/Locks/DoorLocks/MainDoorLock',
              },
              {
                name: 'Jemmy Proof Door Lock',
                path: '/ProductList/Locks/DoorLocks/JemmyProofDoorLock',
              },
              {
                name: 'Knob Locks',
                path: '/ProductList/Locks/DoorLocks/KnobLocks',
              },
              {
                name: 'Drawer Lock',
                path: '/ProductList/Locks/DoorLocks/DrawerLock',
              },
              {
                name: 'Dead Locks',
                path: '/ProductList/Locks/DoorLocks/DeadLocks',
              },
              {
                name: 'Diamant Padlocks',
                path: '/ProductList/Locks/DoorLocks/DiamantPadlocks',
              },
              {
                name: 'Dimple Key',
                path: '/ProductList/Locks/DoorLocks/DimpleKey',
              },
              {
                name: 'Disc Pad Locks',
                path: '/ProductList/Locks/DoorLocks/DiscPadLocks',
              },
              {
                name: 'Cylindrical Locks',
                path: '/ProductList/Locks/DoorLocks/CylindricalLocks',
              },
              {
                name: 'Centre Shutter Locks',
                path: '/ProductList/Locks/DoorLocks/CentreShutterLocks',
              },
              {
                name: 'Cupboard Locks',
                path: '/ProductList/Locks/DoorLocks/CupboardLocks',
              },
            ],
          },
          {
            name: 'FURNITURE BRACKETS',
            path: '/ProductList/Locks/FurnitureBrackets',
          },
          {
            name: 'FURNITURE FITTINGS',
            subItemsNameComponent: [
              {
                name: 'Ball Bearing Drawer Channel',
                path: '/ProductList/Locks/FurnitureFittings/BallBearingDrawerChannel',
              },
              {
                name: 'Furniture Fittings',
                path: '/ProductList/Locks/FurnitureFittings/FurnitureFittings',
              },
              {
                name: 'Heavy Duty Drawer Slides',
                path: '/ProductList/Locks/FurnitureFittings/HeavyDutyDrawerSlides',
              },
              {
                name: 'Slip On Hinge',
                path: '/ProductList/Locks/FurnitureFittings/SlipOnHinge',
              },
              {
                name: 'Soft Close Drawer Channel',
                path: '/ProductList/Locks/FurnitureFittings/SoftCloseDrawerChannel',
              },
              {
                name: 'Thick Door Hinge',
                path: '/ProductList/Locks/FurnitureFittings/ThickDoorHinge',
              },
              {
                name: 'Folding Brackets',
                path: '/ProductList/Locks/FurnitureFittings/FoldingBrackets',
              },
              {
                name: 'Cabinet Hinge',
                path: '/ProductList/Locks/FurnitureFittings/CabinetHinge',
              },
              {
                name: 'Clip On Soft Hinge',
                path: '/ProductList/Locks/FurnitureFittings/ClipOnSoftHinge',
              },
              {
                name: 'Clip On Soft Hinge4 Hole',
                path: '/ProductList/Locks/FurnitureFittings/ClipOnSoftHingeHole',
              },
              {
                name: 'Drawer Channels',
                path: '/ProductList/Locks/FurnitureFittings/DrawerChannels',
              },
              {
                name: 'Blind Corner Hinge',
                path: '/ProductList/Locks/FurnitureFittings/BlindCornerHinge',
              },
            ],
          },
          {
            name: 'FURNITURE LOCKS',
            subItemsNameComponent: [
              {
                name: 'Curvo',
                path: '/ProductList/Locks/FurnitureLocks/Curvo',
              },
              {
                name: 'CamLock',
                path: '/ProductList/Locks/FurnitureLocks/CamLock',
              },
              {
                name: 'Nuvo',
                path: '/ProductList/Locks/FurnitureLocks/Nuvo',
              },
              {
                name: 'Supernova',
                path: '/ProductList/Locks/FurnitureLocks/Supernova',
              },
              {
                name: 'Table Lock',
                path: '/ProductList/Locks/FurnitureLocks/TableLock',
              },
              {
                name: 'Drawer Cupboard Lock',
                path: '/ProductList/Locks/FurnitureLocks/DrawerCupboardLock',
              },
              {
                name: 'Drawer Locks',
                path: '/ProductList/Locks/FurnitureLocks/DrawerLocks',
              },
              {
                name: 'Multi Purpose Lock',
                path: '/ProductList/Locks/FurnitureLocks/MultiPurposeLock',
              },
            ],
          },
          {
            name: 'GLASS HARDWARE',
            subItemsNameComponent: [
              {
                name: 'Glass Door Pull Handle',
                path: '/ProductList/Locks/GlassHardware/GlassDoorPullHandle',
              },
              {
                name: 'Glass Hardware',
                path: '/ProductList/Locks/GlassHardware/GlassHardware',
              },
              {
                name: 'Shower Cubicle Hinge',
                path: '/ProductList/Locks/GlassHardware/ShowerCubicleHinge',
              },
              {
                name: 'Sliding System',
                path: '/ProductList/Locks/GlassHardware/SlidingSystem',
              },
              {
                name: 'Glass Door Lock',
                path: '/ProductList/Locks/GlassHardware/GlassDoorLock',
              },
              {
                name: 'Floor Spring Combo Set',
                path: '/ProductList/Locks/GlassHardware/FloorSpringComboSet',
              },
              {
                name: 'Glass Door Fitting',
                path: '/ProductList/Locks/GlassHardware/GlassDoorFitting',
              },
            ],
          },
          {
            name: 'LEVER MORTISE LOCKS',
            subItemsNameComponent: [
              {
                name: 'EXS HI - SECURITY CYLINDERS',
                path: '/ProductList/Locks/LeverMortiseLocks/EXSHISECURITYCYLINDERS',
              },
              {
                name: 'COMBIPACK WITH 6 LEVER MORTISE LOCK',
                path: '/ProductList/Locks/LeverMortiseLocks/COMBIPACKWITHLEVERMORTISELOCK',
              },
              {
                name: 'Europrofile Mortise Pin Cylinder With Master Key',
                path: '/ProductList/Locks/LeverMortiseLocks/EuroprofileMortisePinCylinderWithMasterKey',
              },
              {
                name: 'Europrofile Mortise Pin Cylinder',
                path: '/ProductList/Locks/LeverMortiseLocks/EuroprofileMortisePinCylinder',
              },
              {
                name: 'Europrofile Mortise Lock Bodies',
                path: '/ProductList/Locks/LeverMortiseLocks/EuroprofileMortisLockBodies',
              },
            ],
          },
          {
            name: 'Mortice Locks',
            path: '/ProductList/Locks/MorticeLocks',
          },
          {
            name: 'Mortise Lock Body',
            path: '/ProductList/Locks/MortiseLockBody',
          },

          {
            name: 'Padlocks',
            subItemsNameComponent: [
              {
                name: 'Ultra Shutter Locks',
                path: '/ProductList/Locks/Padlocks/UltraShutterLocks',
              },
              {
                name: 'Disc Padlocks',
                path: '/ProductList/Locks/Padlocks/DiscPadlocks',
              },
              {
                name: 'Padlocks',
                path: '/ProductList/Locks/Padlocks/Padlocks',
              },
              {
                name: 'Premium Padlocks',
                path: '/ProductList/Locks/Padlocks/PremiumPadlocks',
              },
              {
                name: 'Round Type Padlock',
                path: '/ProductList/Locks/Padlocks/RoundTypePadlock',
              },
              {
                name: 'Square Type Padlock',
                path: '/ProductList/Locks/Padlocks/SquareTypePadlock',
              },
            ],
          },
          {
            name: 'Patch Fittings',
            path: '/ProductList/Locks/PatchFittings',
          },
          {
            name: 'POPULAR MORTISE SERIES',
            subItemsNameComponent: [
              {
                name: 'S S D Type Tube Lever',
                path: '/ProductList/Locks/PopularMortiseSeriesTypeTubeLever',
              },
              {
                name: 'Towy Low Height Design',
                path: '/ProductList/Locks/PopularMortiseSeries/TowyLowHeightDesign',
              },
              {
                name: 'Victoria',
                path: '/ProductList/Locks/PopularMortiseSeries/Victoria',
              },
              {
                name: 'Pull Handles',
                path: '/ProductList/Locks/PopularMortiseSeries/PullHandles',
              },
              {
                name: 'N E H15 Low Height Design',
                path: '/ProductList/Locks/PopularMortiseSeries/NEHLowHeightDesign',
              },
              {
                name: 'N E H16',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH16',
              },
              {
                name: 'Oliver',
                path: '/ProductList/Locks/PopularMortiseSeries/Oliver',
              },
              {
                name: 'Popular Mortise Series',
                path: '/ProductList/Locks/PopularMortiseSeries/PopularMortiseSeries',
              },
              {
                name: 'N E H10',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH10',
              },
              {
                name: 'N E H11',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH11',
              },
              {
                name: 'N E H12',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH12',
              },
              {
                name: 'N E H13',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH13',
              },
              {
                name: 'N E H14',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH14',
              },
              {
                name: 'N E H09',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH09',
              },
              {
                name: 'N E H04',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH04',
              },
              {
                name: 'N E H05',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH05',
              },
              {
                name: 'N E H06',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH06',
              },
              {
                name: 'N E H07',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH07',
              },
              {
                name: 'N E H08',
                path: '/ProductList/Locks/PopularMortiseSeries/NEH08',
              },
              {
                name: 'Matiz',
                path: '/ProductList/Locks/PopularMortiseSeries/Matiz',
              },
              {
                name: 'Corner Fetch Series',
                path: '/ProductList/Locks/PopularMortiseSeries/CornerFetchSeries',
              },
              {
                name: 'Cylindrical Locks',
                path: '/ProductList/Locks/PopularMortiseSeries/CylindricalLocks',
              },
              {
                name: 'Gloria',
                path: '/ProductList/Locks/PopularMortiseSeries/Gloria',
              },
              {
                name: 'Main Door Set',
                path: '/ProductList/Locks/PopularMortiseSeries/MainDoorSet',
              },
              {
                name: 'Combi Set',
                path: '/ProductList/Locks/PopularMortiseSeries/CombiSet',
              },
              {
                name: 'Classic Lock',
                path: '/ProductList/Locks/PopularMortiseSeries/ClassicLock',
              },
              {
                name: 'B M01',
                path: '/ProductList/Locks/PopularMortiseSeries/BM01',
              },
              {
                name: 'B M02',
                path: '/ProductList/Locks/PopularMortiseSeries/BM02',
              },
              {
                name: 'B M04',
                path: '/ProductList/Locks/PopularMortiseSeries/BM04',
              },
              {
                name: 'B M06',
                path: '/ProductList/Locks/PopularMortiseSeries/BM06',
              },
            ],
          },
          {
            name: 'PREMIUM MORTISE SERIES',
            subItemsNameComponent: [
              {
                name: 'S E H Series',
                path: '/ProductList/Locks/PremiumMortiseSeries/SEHSeries',
              },
              {
                name: 'Phoenix',
                path: '/ProductList/Locks/PremiumMortiseSeries/Phoenix',
              },
              {
                name: 'Premium Mortise Series',
                path: '/ProductList/Locks/PremiumMortiseSeries/PremiumMortiseSeries',
              },
              {
                name: 'Orbit',
                path: '/ProductList/Locks/PremiumMortiseSeries/Orbit',
              },
              {
                name: 'Allure Rossette Series',
                path: '/ProductList/Locks/PremiumMortiseSeries/AllureRossetteSeries',
              },
              {
                name: 'Combipack With240mm Euro Mortise Lock',
                path: '/ProductList/Locks/PremiumMortiseSeries/CombipackWithEuroMortiseLock',
              },
              {
                name: 'Europrofile Brass Handle Set240mm',
                path: '/ProductList/Locks/PremiumMortiseSeries/EuroprofileBrassHandleSet',
              },
              {
                name: 'Evva3 K S Regalis Mortise',
                path: '/ProductList/Locks/PremiumMortiseSeries/EvvaKRegalisMortise',
              },
              {
                name: 'Mercury',
                path: '/ProductList/Locks/PremiumMortiseSeries/Mercury',
              },
            ],
          },
          {
            name: 'Rim Locks',
            subItemsNameComponent: [
              {
                name: 'Ultra X L Tribolt',
                path: '/ProductList/Locks/RimLocks/UltraXLTribolt',
              },
              {
                name: 'Ultra X L Twinbolt',
                path: '/ProductList/Locks/RimLocks/UltraXLTwinbolt',
              },
              {
                name: 'Ultra X L Vertibolt',
                path: '/ProductList/Locks/RimLocks/UltraXLVertibolt',
              },
              {
                name: 'Ultra X L Rim Deadbolt',
                path: '/ProductList/Locks/RimLocks/UltraXLRimDeadbolt',
              },
              {
                name: 'Ultra Latchbolt Carton',
                path: '/ProductList/Locks/RimLocks/UltraLatchboltCarton',
              },
              {
                name: 'Ultra Retrofit Adaptor',
                path: '/ProductList/Locks/RimLocks/UltraRetrofitAdaptor',
              },
              {
                name: 'Ultra Tribolt',
                path: '/ProductList/Locks/RimLocks/UltraTribolt',
              },
              {
                name: 'Ultra Vertibolt',
                path: '/ProductList/Locks/RimLocks/UltraVertibolt',
              },
              {
                name: 'Rim Locks',
                path: '/ProductList/Locks/RimLocks/RimLocks',
              },
              {
                name: 'E X S Altrix',
                path: '/ProductList/Locks/RimLocks/EXSAltrix',
              },
              {
                name: 'E X S Astro',
                path: '/ProductList/Locks/RimLocks/EXSAstro',
              },
              {
                name: 'Night Latch7 Lever',
                path: '/ProductList/Locks/RimLocks/NightLatchLever',
              },
              {
                name: 'Pentabolt Aries',
                path: '/ProductList/Locks/RimLocks/PentaboltAries',
              },
              {
                name: 'Pin Cylinder Rim Locks',
                path: '/ProductList/Locks/RimLocks/PinCylinderRimLocks',
              },
            ],
          },
        ],
      },
      {
        name: 'Paint',
        subItemsName: [
          {
            name: 'EMULSION',
            subItemsNameComponent: [
              {
                name: 'Wall Texture',
                path: '/ProductList/Paint/Emulsion/WallTexture',
              },
              {
                name: 'Tile Guard',
                path: '/ProductList/Paint/Emulsion/TileGuard',
              },
              {
                name: 'Exterior Emulsion',
                path: '/ProductList/Paint/Emulsion/ExteriorEmulsion',
              },
              {
                name: 'Interior Emulsion',
                path: '/ProductList/Paint/Emulsion/InteriorEmulsion',
              },
            ],
          },
          {
            name: 'ENAMEL',
            subItemsNameComponent: [
              {
                name: 'Synthetic Enamel',
                path: '/ProductList/Paint/Enamel/SyntheticEnamel',
              },
              {
                name: 'Satin Enamel',
                path: '/ProductList/Paint/Enamel/SatinEnamel',
              },
              {
                name: 'Gloss Enamel',
                path: '/ProductList/Paint/Enamel/GlossEnamel',
              },
            ],
          },
          {
            name: 'DISTEMPER',
            subItemsNameComponent: [
              {
                name: 'Acrylic Distemper',
                path: '/ProductList/Paint/Distemper/AcrylicDistemper',
              },
              {
                name: 'Synthetic Distemper',
                path: '/ProductList/Paint/Distemper/SyntheticDistemper',
              },
            ],
          },
          {
            name: 'PRIMER',
            subItemsNameComponent: [
              {
                name: 'Wood Primer',
                path: '/ProductList/Paint/Primer/WoodPrimer',
              },
              {
                name: 'Solvent Primer',
                path: '/ProductList/Paint/Primer/SolventPrimer',
              },
              {
                name: 'Acrylic Primer',
                path: '/ProductList/Paint/Primer/AcrylicPrimer',
              },
              {
                name: 'Cement Primer',
                path: '/ProductList/Paint/Primer/CementPrimer',
              },
              {
                name: 'Exterior Primer',
                path: '/ProductList/Paint/Primer/ExteriorPrimer',
              },
              {
                name: 'Interior Primer',
                path: '/ProductList/Paint/Primer/InteriorPrimer',
              },
              {
                name: 'Metal Primer',
                path: '/ProductList/Paint/Primer/MetalPrimer',
              },
            ],
          },
          {
            name: 'STAINERS',
            subItemsNameComponent: [
              {
                name: 'Wood Stainers',
                path: '/ProductList/Paint/Stainers/WoodStainers',
              },
              {
                name: 'Universal Stainers',
                path: '/ProductList/Paint/Stainers/UniversalStainers',
              },
            ],
          },
          {
            name: 'Brushes & Rollers',
            subItemsNameComponent: [
              {
                name: 'Spray Paints',
                path: '/ProductList/Paint/BrushesRollers/SprayPaints',
              },
              {
                name: 'Paint Brushes',
                path: '/ProductList/Paint/BrushesRollers/PaintBrushes',
              },
              {
                name: 'Rollers',
                path: '/ProductList/Paint/BrushesRollers/Rollers',
              },
            ],
          },
          {
            name: 'WATERPROOFING & FILLERS',
            subItemsNameComponent: [
              {
                name: 'Waterproof Basecoat',
                path: '/ProductList/Paint/Waterproofing/WaterproofBasecoat',
              },
              {
                name: 'Crack Fillers',
                path: '/ProductList/Paint/Waterproofing/CrackFillers',
              },
            ],
          },
          {
            name: 'PAINTING ACCESSORIES',
            subItemsNameComponent: [
              {
                name: 'Sandpaper Rolls',
                path: '/ProductList/Paint/PaintingAccessories/SandpaperRolls',
              },
              {
                name: 'Stencils',
                path: '/ProductList/Paint/PaintingAccessories/Stencils',
              },
              {
                name: 'Painting Tools',
                path: '/ProductList/Paint/PaintingAccessories/PaintingTools',
              },
            ],
          },
          {
            name: 'WOOD FINISHES',
            subItemsNameComponent: [
              {
                name: 'Pu',
                path: '/ProductList/Paint/WoodFinishes/Pu',
              },
              {
                name: 'Sealer',
                path: '/ProductList/Paint/WoodFinishes/Sealer',
              },
              {
                name: 'Varnish Black Board Paint',
                path: '/ProductList/Paint/WoodFinishes/VarnishBlackBoardPaint',
              },
              {
                name: 'Wood Putty',
                path: '/ProductList/Paint/WoodFinishes/WoodPutty',
              },
              {
                name: 'Polish',
                path: '/ProductList/Paint/WoodFinishes/Polish',
              },
              {
                name: 'Glass Coatings',
                path: '/ProductList/Paint/WoodFinishes/GlassCoatings',
              },
              {
                name: 'Melamyne',
                path: '/ProductList/Paint/WoodFinishes/Melamyne',
              },
              {
                name: 'Nc',
                path: '/ProductList/Paint/WoodFinishes/Nc',
              },
            ],
          },
          {
            name: 'ADHESIVE & THINNER',
            subItemsNameComponent: [
              {
                name: 'Adhesive',
                path: '/ProductList/Paint/AdhesiveThinner/Adhesive',
              },
              {
                name: 'Thinner',
                path: '/ProductList/Paint/AdhesiveThinner/Thinner',
              },
            ],
          },
          {
            name: 'WALL PUTTY',
            subItemsNameComponent: [
              {
                name: 'Kpf Wall Putty',
                path: '/ProductList/Paint/WallPutty/KpfWallPutty',
              },
              {
                name: 'Powder Wall Putty',
                path: '/ProductList/Paint/WallPutty/PowderWallPutty',
              },
              {
                name: 'Acrylic Wall Putty',
                path: '/ProductList/Paint/WallPutty/AcrylicWallPutty',
              },
            ],
          },
          {
            name: 'TOP BRANDS',
            subItemsNameComponent: [
              {
                name: 'Neroloc',
                path: '/ProductList/Paint/TopBrands/Neroloc',
              },
              {
                name: 'Dulux',
                path: '/ProductList/Paint/TopBrands/Dulux',
              },
              {
                name: 'Asian Paints',
                path: '/ProductList/Paint/TopBrands/AsianPaints',
              },
              {
                name: 'Gem Paints',
                path: '/ProductList/Paint/TopBrands/GemPaints',
              },
              {
                name: 'Jk Wall Putty',
                path: '/ProductList/Paint/TopBrands/JkWallPutty',
              },
              {
                name: 'Agsar Paints',
                path: '/ProductList/Paint/TopBrands/AgsarPaints',
              },
            ],
          },
          {
            name: 'Acrylic Emulsion Paint',
            path: '/ProductList/Paint/AcrylicEmulsionPaint',
          },
          {
            name: 'Aspa Paints',
            path: '/ProductList/Paint/AspaPaints',
          },
          {
            name: 'Exterior paints',
            path: '/ProductList/Paint/ExteriorPaints',
          },
          {
            name: 'Floor Paints',
            path: '/ProductList/Paint/FloorPaints',
          },
          {
            name: 'Industrial Coatings',
            path: '/ProductList/Paint/IndustrialCoatings',
          },
          {
            name: 'Interior Paints',
            path: '/ProductList/Paint/InteriorPaints',
          },
          {
            name: 'Painting Tools',
            path: '/ProductList/Paint/PaintingTools',
          },
          {
            name: 'Primer and Wall Putty',
            path: '/ProductList/Paint/PrimerAndWallPutty',
          },
          { name: 'Sanitizer', path: '/ProductList/Paint/Sanitizer' },
          {
            name: 'Spray Paints',
            path: '/ProductList/Paint/SprayPaints',
          },
          {
            name: 'Stainers&Thinners',
            path: '/ProductList/Paint/StainersThinners',
          },
          { name: 'Stencils', path: '/ProductList/Paint/Stencils' },
          {
            name: 'Tile Guard',
            path: '/ProductList/Paint/TileGuard',
          },
          {
            name: 'wall stickers and wallpapers',
            path: '/ProductList/Paint/WallStickersWallpapers',
          },
          {
            name: 'Wood & Metal',
            path: '/ProductList/Paint/WoodMetal',
          },
        ],
      },
      {
        name: 'Pipe & Fittings',
        subItemsName: [
          {
            name: 'Ashirvad Pipes',
            path: '/ProductList/Pipe/AshirvadPipes',
          },
          {
            name: 'Apollo Pipes',
            path: '/ProductList/Pipe/ApolloPipes',
          },
          { name: 'Birla Pipe', path: '/ProductList/Pipe/BirlaPipe' },
          {
            name: 'Finolex Pipes',
            path: '/ProductList/Pipe/FinolexPipes',
          },
          {
            name: 'Nepul Pipes',
            path: '/ProductList/Pipe/NepulPipes',
          },
          {
            name: 'Other Pipe & Fittings',
            path: '/ProductList/Pipe/OtherPipes',
          },
          {
            name: 'Prakash Pipe',
            path: '/ProductList/Pipe/PrakashPipe',
          },
          {
            name: 'Prinzia Pipes',
            path: '/ProductList/Pipe/PrinziaPipes',
          },
          {
            name: 'Prince Pipe',
            path: '/ProductList/Pipe/PrincePipe',
          },
          {
            name: 'Supreme Pipe',
            path: '/ProductList/Pipe/SupremePipe',
          },
          { name: 'TSA Pipe', path: '/ProductList/Pipe/TSAPipe' },
         
          { name: 'Tata Pipe', path: '/ProductList/Pipe/TataPipe' },
          
          
        
          
        ],
      },
      {
        name: 'PVC Mats',
        subItemsName: [
          { name: 'Floor Mats', path: '/ProductList/PvcMats/Floor' },
          { name: 'Door Mats', path: '/ProductList/PvcMats/Door' },
        ],
      },
      {
        name: 'Roofer',
        subItemsName: [
          { name: 'Aluminium Sheet', path: '/ProductList/Roofer/AluminiumSheet'},
          { name: 'Cements Sheet', path: '/ProductList/Roofer/CementsSheet'},
          { name: 'Color Sheet', path: '/ProductList/Roofer/ColorSheet'},
          { name: 'Fiber Sheet', path: '/ProductList/Roofer/FiberSheet'},
          { name: 'Metal Roofing', path: '/ProductList/Roofer/Metal'},
          { name: 'Shingles', path: '/ProductList/Roofer/Shingles' },
          { name: 'Teen Sheet', path: '/ProductList/Roofer/TeenSheet'},
        ],
      },
      {
        name: 'Sanitary Ware & faucets',
        subItemsName: [
          {
            name: 'Acrylic Products',
            path: '/ProductList/Sanitary/AcrylicProducts',
          },
          {
            name: 'Bathroom Accessories',
            path: '/ProductList/Sanitary/BathroomAccessories',
          },
          {
            name: 'Bathsense',
            subItemsNameComponent: [
              {
                name: 'Sanitaryware',
                path: '/ProductList/Sanitary/Bathsense/Sanitaryware',
              },
              {
                name: 'C Pfittings Faucets',
                path: '/ProductList/Sanitary/Bathsense/CPfittingsFaucets',
              },
            ],
          },
          {
            name: 'Closets',
            path: '/ProductList/Sanitary/Closets',
          },
          {
            name: 'Coral bath fixtures',
            subItemsNameComponent: [
              {
                name: 'Royale Series',
                path: '/ProductList/Sanitary/CoralBathFixtures/RoyaleSeries',
              },
              {
                name: 'Treemo Series',
                path: '/ProductList/Sanitary/CoralBathFixtures/TreemoSeries',
              },
              {
                name: 'Xrossa Series',
                path: '/ProductList/Sanitary/CoralBathFixtures/XrossaSeries',
              },
              {
                name: 'New Super Glow Series',
                path: '/ProductList/Sanitary/CoralBathFixtures/NewSuperGlowSeries',
              },
              {
                name: 'Eurosmart Series',
                path: '/ProductList/Sanitary/CoralBathFixtures/EurosmartSeries',
              },
              {
                name: 'Flowmore Series',
                path: '/ProductList/Sanitary/CoralBathFixtures/FlowmoreSeries',
              },
            ],
          },
          {
            name: 'Corsa',
            subItemsNameComponent: [
              {
                name: 'BATHROOMACCESSORIES',
                subItemsNameComponentName: [
                  {
                    name: 'Ecco',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Ecco',
                  },
                  {
                    name: 'Keti',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Keti',
                  },
                  {
                    name: 'Qubix',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Qubix',
                  },
                  {
                    name: 'Square',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Square',
                  },
                  {
                    name: 'Supreme',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Supreme',
                  },
                  {
                    name: 'Dolphin',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Dolphin',
                  },
                  {
                    name: 'Acrylic Accessories',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/AcrylicAccessories',
                  },
                  {
                    name: 'Almond',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Almond',
                  },
                  {
                    name: 'Anglo',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Anglo',
                  },
                  {
                    name: 'Budget',
                    path: '/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Budget',
                  },
                ],
              },
              {
                name: 'Bathroom Faucets',
                subItemsNameComponentName: [
                  {
                    name: 'Super',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Super',
                  },
                  {
                    name: 'Tri',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Tri',
                  },
                  {
                    name: 'Square S',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Square S',
                  },
                  {
                    name: 'Royal',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Royal',
                  },
                  {
                    name: 'Slimline',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Slimline',
                  },
                  {
                    name: 'Splash',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Splash',
                  },
                  {
                    name: 'Square F',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Square F',
                  },
                  {
                    name: 'Omega',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Omega',
                  },
                  {
                    name: 'Passion',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Passion',
                  },
                  {
                    name: 'Milano',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Milano',
                  },
                  {
                    name: 'Nano',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Nano',
                  },
                  {
                    name: 'Nexa',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Nexa',
                  },
                  {
                    name: 'Niagra',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Niagra',
                  },
                  {
                    name: 'Nice',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Nice',
                  },
                  {
                    name: 'Ket',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Ket',
                  },
                  {
                    name: 'Expert',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Expert',
                  },
                  {
                    name: 'Florence',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Florence',
                  },
                  {
                    name: 'Glass Bowl Faucet',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Glass Bowl Faucet',
                  },
                  {
                    name: 'Idea',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Idea',
                  },
                  {
                    name: 'Jazz',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Jazz',
                  },
                  {
                    name: 'Eeco',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Eeco',
                  },
                  {
                    name: 'Concept',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Concept',
                  },
                  {
                    name: 'Deluxe',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Deluxe',
                  },
                  {
                    name: 'Almond',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Almond',
                  },
                  {
                    name: 'Arrow',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Arrow',
                  },
                  {
                    name: 'Bold',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Bold',
                  },
                  {
                    name: 'Budget',
                    path: '/ProductList/Sanitary/Corsa/BathroomFaucets/Budget',
                  },
                ],
              },
              {
                name: 'Kitchen',
                subItemsNameComponentName: [
                  {
                    name: 'Kitchen Sink',
                    path: '/ProductList/Sanitary/Corsa/Kitchen/Kitchen Sink',
                  },
                  {
                    name: 'Kitchen Faucets',
                    path: '/ProductList/Sanitary/Corsa/Kitchen/Kitchen Faucets',
                  },
                ],
              },
              {
                name: 'Showers',
                subItemsNameComponentName: [
                  {
                    name: 'Hand Showers',
                    path: '/ProductList/Sanitary/Essess/Showers/Hand Showers',
                  },
                  {
                    name: 'Overhead Showers',
                    path: '/ProductList/Sanitary/Essess/Showers/Overhead Showers',
                  },
                  {
                    name: 'Rainfall Showers',
                    path: '/ProductList/Sanitary/Essess/Showers/Rainfall Showers',
                  },
                  {
                    name: 'Shower Arms',
                    path: '/ProductList/Sanitary/Essess/Showers/Shower Arms',
                  },
                ],
              },

              {
                name: 'Other Useful Items',
                subItemsNameComponentName: [
                  {
                    name: 'Mouth Operated',
                    path: '/ProductList/Sanitary/Corsa/OtherUsefulItems/Mouth Operated',
                  },
                  {
                    name: 'Pressmatic Push Cock',
                    path: '/ProductList/Sanitary/Corsa/OtherUsefulItems/Pressmatic Push Cock',
                  },
                  {
                    name: 'Sensor Taps',
                    path: '/ProductList/Sanitary/Corsa/OtherUsefulItems/Sensor Taps',
                  },
                  {
                    name: 'Soap Dispenser',
                    path: '/ProductList/Sanitary/Corsa/OtherUsefulItems/Soap Dispenser',
                  },
                  {
                    name: 'Mini Angle Cock',
                    path: '/ProductList/Sanitary/Corsa/OtherUsefulItems/Mini Angle Cock',
                  },
                  {
                    name: 'Ball Valves',
                    path: '/ProductList/Sanitary/Corsa/OtherUsefulItems/Ball Valves',
                  },
                ],
              },
              {
                name: 'Flushing Cistern',
                path: '/ProductList/Sanitary/Corsa/FlushingCistern',
              },
            ],
          },
          {
            name: 'Essess',
            subItemsNameComponent: [
              {
                name: 'Showers',
                subItemsNameComponentName: [
                  {
                    name: 'Hand Showers',
                    path: '/ProductList/Sanitary/Essess/Showers/HandShowers',
                  },
                  {
                    name: 'Overhead Showers',
                    path: '/ProductList/Sanitary/Essess/Showers/OverheadShowers',
                  },
                  {
                    name: 'Rainfall Showers',
                    path: '/ProductList/Sanitary/Essess/Showers/RainfallShowers',
                  },
                  {
                    name: 'Shower Arms',
                    path: '/ProductList/Sanitary/Essess/Showers/ShowerArms',
                  },
                ],
              },
              {
                name: 'Accessories',
                subItemsNameComponent: [
                  {
                    name: 'Series8 B Series',
                    path: '/ProductList/Sanitary/Essess/Accessories/Series8BSeries',
                  },
                  {
                    name: 'Series7 Deon',
                    path: '/ProductList/Sanitary/Essess/Accessories/Series7Deon',
                  },
                  {
                    name: 'Series2 Swing',
                    path: '/ProductList/Sanitary/Essess/Accessories/Series2Swing',
                  },
                  {
                    name: 'Series3 Tarim',
                    path: '/ProductList/Sanitary/Essess/Accessories/Series3Tarim',
                  },
                  {
                    name: 'Series5 Hotelier Series',
                    path: '/ProductList/Sanitary/Essess/Accessories/Series5HotelierSeries',
                  },
                  {
                    name: 'Series6 Cruzo',
                    path: '/ProductList/Sanitary/Essess/Accessories/Series6Cruzo',
                  },
                  {
                    name: 'Series1 Croma',
                    path: '/ProductList/Sanitary/Essess/Accessories/Series1Croma',
                  },
                ],
              },
              {
                name: 'Trand',
                path: '/ProductList/Sanitary/Essess/Trand',
              },
              {
                name: 'Tarim',
                path: '/ProductList/Sanitary/Essess/Tarim',
              },
              {
                name: 'Lab Taps',
                path: '/ProductList/Sanitary/Essess/Lab Taps',
              },
              {
                name: 'New Dune',
                path: '/ProductList/Sanitary/Essess/New Dune',
              },
              {
                name: 'New Xess',
                path: '/ProductList/Sanitary/Essess/New Xess',
              },
              {
                name: 'Quadra',
                path: '/ProductList/Sanitary/Essess/Quadra',
              },
              {
                name: 'Sensors',
                path: '/ProductList/Sanitary/Essess/Sensors',
              },
              {
                name: 'Hotelier Series',
                path: '/ProductList/Sanitary/Essess/HotelierSeries',
              },
              {
                name: 'Deon',
                path: '/ProductList/Sanitary/Essess/Deon',
              },
              {
                name: 'Echo',
                path: '/ProductList/Sanitary/Essess/Echo',
              },
              {
                name: 'Essentials',
                path: '/ProductList/Sanitary/Essess/Essentials',
              },
              {
                name: 'H S03',
                path: '/ProductList/Sanitary/Essess/H S03',
              },
              {
                name: 'D Series',
                path: '/ProductList/Sanitary/Essess/D Series',
              },
              {
                name: 'Auto Close Taps',
                path: '/ProductList/Sanitary/Essess/AutoCloseTaps',
              },
              {
                name: 'Celato',
                path: '/ProductList/Sanitary/Essess/Celato',
              },
              {
                name: 'Croma',
                path: '/ProductList/Sanitary/Essess/Croma',
              },
              {
                name: 'Cruzo',
                path: '/ProductList/Sanitary/Essess/Cruzo',
              },
            ],
          },
          {
            name: 'Faucets',
            path: '/ProductList/Sanitary/Faucets',
            subItemsNameComponent: [],
          },
          {
            name: 'Hardware & Bathroom Accessories',
            path: '/ProductList/Sanitary/HardwareBathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Health Faucet',
            path: '/ProductList/Sanitary/HealthFaucet',
            subItemsNameComponent: [],
          },
          {
            name: 'Hindware',
            subItemsNameComponent: [
              {
                name: 'Wash Basins',
                path: '/ProductList/Sanitary/Hindware/WashBasins',
              },
              {
                name: 'Water Closets',
                path: '/ProductList/Sanitary/Hindware/WaterClosets',
              },
              {
                name: 'Showers',
                path: '/ProductList/Sanitary/Hindware/Showers',
              },
              {
                name: 'Add On',
                path: '/ProductList/Sanitary/Hindware/AddOn',
              },
              {
                name: 'Bath Tub',
                path: '/ProductList/Sanitary/Hindware/BathTub',
              },
              {
                name: 'Cisterns',
                path: '/ProductList/Sanitary/Hindware/Cisterns',
              },
              {
                name: 'Faucets',
                subItemsNameComponentName: [
                  {
                    name: 'Angular Stop Cock',
                    path: '/ProductList/Sanitary/Hindware/Faucets/AngularStopCock',
                  },
                  {
                    name: 'Bath Spout',
                    path: '/ProductList/Sanitary/Hindware/Faucets/BathSpout',
                  },
                  {
                    name: 'Bib Cock',
                    path: '/ProductList/Sanitary/Hindware/Faucets/BibCock',
                  },
                  {
                    name: 'Chbm',
                    path: '/ProductList/Sanitary/Hindware/Faucets/Chbm',
                  },
                  {
                    name: 'Concealed Stop Cock',
                    path: '/ProductList/Sanitary/Hindware/Faucets/ConcealedStopCock',
                  },
                  {
                    name: 'Csc Exp Kit',
                    path: '/ProductList/Sanitary/Hindware/Faucets/CscExpKit',
                  },
                  {
                    name: 'Deusch Mixer',
                    path: '/ProductList/Sanitary/Hindware/Faucets/DeuschMixer',
                  },
                  {
                    name: 'Exposed Mixers',
                    path: '/ProductList/Sanitary/Hindware/Faucets/ExposedMixers',
                  },
                  {
                    name: 'Flush Cock',
                    path: '/ProductList/Sanitary/Hindware/Faucets/FlushCock',
                  },
                  {
                    name: 'Medical Series',
                    path: '/ProductList/Sanitary/Hindware/Faucets/MedicalSeries',
                  },
                  {
                    name: 'Mixer Faucet',
                    path: '/ProductList/Sanitary/Hindware/Faucets/MixerFaucet',
                  },
                  {
                    name: 'Pillar Cock',
                    path: '/ProductList/Sanitary/Hindware/Faucets/PillarCock',
                  },
                  {
                    name: 'Pillar Cock Tall',
                    path: '/ProductList/Sanitary/Hindware/Faucets/PillarCockTall',
                  },
                  {
                    name: 'Pillar Faucet',
                    path: '/ProductList/Sanitary/Hindware/Faucets/PillarFaucet',
                  },
                  {
                    name: 'Pressmatic',
                    path: '/ProductList/Sanitary/Hindware/Faucets/Pressmatic',
                  },
                  {
                    name: 'Recessed',
                    path: '/ProductList/Sanitary/Hindware/Faucets/Recessed',
                  },
                  {
                    name: 'Sink Cock',
                    path: '/ProductList/Sanitary/Hindware/Faucets/SinkCock',
                  },
                  {
                    name: 'Sink Mixer',
                    path: '/ProductList/Sanitary/Hindware/Faucets/SinkMixer',
                  },
                  {
                    name: 'Single Lever Divertor',
                    path: '/ProductList/Sanitary/Hindware/Faucets/SingleLeverDivertor',
                  },
                  {
                    name: 'Slbm Faucet',
                    path: '/ProductList/Sanitary/Hindware/Faucets/SlbmFaucet',
                  },
                  {
                    name: 'Slbm Faucet Tall',
                    path: '/ProductList/Sanitary/Hindware/Faucets/SlbmFaucetTall',
                  },
                  {
                    name: 'Wall Mixer',
                    path: '/ProductList/Sanitary/Hindware/Faucets/WallMixer',
                  },
                ],
              },
            ],
          },
          {
            name: 'Jaquar',
            path: '/ProductList/Sanitary/Jaquar',
            subItemsNameComponent: [],
          },
          {
            name: 'Kitchen Sinks',
            path: '/ProductList/Sanitary/KitchenSinks',
            subItemsNameComponent: [],
          },
          {
            name: 'LEMON Bathroom Accessories',
            path: '/ProductList/Sanitary/LemonBathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Leo Bath Fittings',
            subItemsNameComponent: [
              {
                name: 'Valve',
                path: '/ProductList/Sanitary/LeoBathFittings/Valve',
              },
              {
                name: 'Bathroom Accessories',
                path: '/ProductList/Sanitary/LeoBathFittings/BathroomAccessories',
              },
              {
                name: 'Faucets',
                path: '/ProductList/Sanitary/LeoBathFittings/Faucets',
              },
            ],
          },
          {
            name: 'Pamay',
            subItemsNameComponent: [
              {
                name: 'Showers',
                path: '/ProductList/Sanitary/Pamay/Showers',
              },
              {
                name: 'Faucets',
                path: '/ProductList/Sanitary/Pamay/Faucets',
              },
            ],
          },
          {
            name: 'Parryware',
            subItemsNameComponent: [
              {
                name: 'Water Heaters',
                path: '/ProductList/Sanitary/Parryware/WaterHeaters',
              },
              {
                name: 'Waste Coupling',
                path: '/ProductList/Sanitary/Parryware/WasteCoupling',
              },
              {
                name: 'Wash Basins',
                path: '/ProductList/Sanitary/Parryware/WashBasins',
              },
              {
                name: 'Utsav Range',
                path: '/ProductList/Sanitary/Parryware/UtsavRange',
              },
              {
                name: 'Shower Panels',
                path: '/ProductList/Sanitary/Parryware/ShowerPanels',
              },
              {
                name: 'Shower Enclosures',
                path: '/ProductList/Sanitary/Parryware/ShowerEnclosures',
              },
              {
                name: 'Semi Recessed Basins',
                path: '/ProductList/Sanitary/Parryware/SemiRecessedBasins',
              },
              {
                name: 'Seat Covers',
                path: '/ProductList/Sanitary/Parryware/SeatCovers',
              },
              {
                name: 'Push Plates',
                path: '/ProductList/Sanitary/Parryware/PushPlates',
              },
              {
                name: 'Polymer Cisterns',
                path: '/ProductList/Sanitary/Parryware/PolymerCisterns',
              },
              {
                name: 'F A U C E T S',
                path: '/ProductList/Sanitary/Parryware/FAUCETS',
              },
              {
                name: 'European Water Closet',
                path: '/ProductList/Sanitary/Parryware/EuropeanWaterCloset',
              },
              {
                name: 'Concealed Cistern',
                path: '/ProductList/Sanitary/Parryware/ConcealedCistern',
              },
              {
                name: 'CLOSETS',
                path: '/ProductList/Sanitary/Parryware/CLOSETS',
              },
              {
                name: 'Bowl Basins',
                path: '/ProductList/Sanitary/Parryware/BowlBasins',
              },
              {
                name: 'Below Counter Basins',
                path: '/ProductList/Sanitary/Parryware/BelowCounterBasins',
              },
              {
                name: 'Angle Valves',
                path: '/ProductList/Sanitary/Parryware/AngleValves',
              },
              {
                name: 'Accessories',
                path: '/ProductList/Sanitary/Parryware/Accessories',
              },
              {
                name: 'Showers',
                path: '/ProductList/Sanitary/Parryware/Showers',
              },
            ],
          },
          {
            name: 'Pearl Precious Products',
            subItemsNameComponent: [
              {
                name: 'Edge',
                path: '/ProductList/Sanitary/PearlPreciousProducts/Edge',
              },
            ],
          },
          {
            name: 'Showers',
            path: '/ProductList/Sanitary/Showers',
          },
          {
            name: 'Taps',
            path: '/ProductList/Sanitary/Taps',
          },
          {
            name: 'Washbasins',
            path: '/ProductList/Sanitary/Washbasins',
          },
          {
            name: 'Waterman',
            subItemsNameComponent: [
              {
                name: 'Wall Showers Without Arm',
                path: '/ProductList/Sanitary/Waterman/WallShowersWithoutArm',
              },
              {
                name: 'Wall Showers With Arm',
                path: '/ProductList/Sanitary/Waterman/WallShowersWithArm',
              },
              {
                name: 'Shower Tubes',
                path: '/ProductList/Sanitary/Waterman/ShowerTubes',
              },
              {
                name: 'Roman',
                path: '/ProductList/Sanitary/Waterman/Roman',
              },
              {
                name: 'Rain Showers',
                path: '/ProductList/Sanitary/Waterman/RainShowers',
              },
              {
                name: 'Ikon',
                path: '/ProductList/Sanitary/Waterman/Ikon',
              },
              {
                name: 'Evoque',
                path: '/ProductList/Sanitary/Waterman/Evoque',
              },
              {
                name: 'Health Faucet Abs',
                path: '/ProductList/Sanitary/Waterman/HealthFaucetAbs',
              },
              {
                name: 'Health Faucets Brass',
                path: '/ProductList/Sanitary/Waterman/HealthFaucetsBrass',
              },
              {
                name: 'Eco',
                path: '/ProductList/Sanitary/Waterman/Eco',
              },
              {
                name: 'Aura',
                path: '/ProductList/Sanitary/Waterman/Aura',
              },
              {
                name: 'Dell',
                path: '/ProductList/Sanitary/Waterman/Dell',
              },
              {
                name: 'Deluxe',
                path: '/ProductList/Sanitary/Waterman/Deluxe',
              },
              {
                name: 'Aria',
                path: '/ProductList/Sanitary/Waterman/Aria',
              },
              {
                name: 'Accessories',
                path: '/ProductList/Sanitary/Waterman/Accessories',
              },
            ],
          },
          {
            name: 'Water Tec',
            subItemsNameComponent: [
              {
                name: 'Taps',
                path: '/ProductList/Sanitary/WaterTec/Taps',
              },
              {
                name: 'Toilet Seat Covers',
                path: '/ProductList/Sanitary/WaterTec/ToiletSeatCovers',
              },
              {
                name: 'Valves',
                path: '/ProductList/Sanitary/WaterTec/Valves',
              },
              {
                name: 'T Series Alt',
                path: '/ProductList/Sanitary/WaterTec/TSeriesAlt',
              },
              {
                name: 'Health Faucets',
                path: '/ProductList/Sanitary/WaterTec/HealthFaucets',
              },
              {
                name: 'Quattro',
                path: '/ProductList/Sanitary/WaterTec/Quattro',
              },
              {
                name: 'Showers',
                path: '/ProductList/Sanitary/WaterTec/Showers',
              },
              {
                name: 'T Series',
                path: '/ProductList/Sanitary/WaterTec/TSeries',
              },
              {
                name: 'Concealed Cistern',
                path: '/ProductList/Sanitary/WaterTec/ConcealedCistern',
              },
              {
                name: 'Connection Tube',
                path: '/ProductList/Sanitary/WaterTec/ConnectionTube',
              },
              {
                name: 'Ebony',
                path: '/ProductList/Sanitary/WaterTec/Ebony',
              },
              {
                name: 'Eco',
                path: '/ProductList/Sanitary/WaterTec/Eco',
              },
              {
                name: 'Eva',
                path: '/ProductList/Sanitary/WaterTec/Eva',
              },
              {
                name: 'Flora',
                path: '/ProductList/Sanitary/WaterTec/Flora',
              },
              {
                name: 'Bathroom Accessories',
                path: '/ProductList/Sanitary/WaterTec/BathroomAccessories',
              },
              {
                name: 'Cistern',
                path: '/ProductList/Sanitary/WaterTec/Cistern',
              },
              {
                name: 'Allied',
                path: '/ProductList/Sanitary/WaterTec/Allied',
              },
              {
                name: 'Aqua',
                path: '/ProductList/Sanitary/WaterTec/Aqua',
              },
              {
                name: 'Aspire',
                path: '/ProductList/Sanitary/WaterTec/Aspire',
              },
            ],
          },
        ],
      },
      {name: 'Shop', path: '/ProductList/Shop' },
      {
        name: 'Tools',
        subItemsName: [
          {
            name: 'Abrasives',
            subItemsNameComponent: [
              {
                name: 'Cut Off Wheel',
                path: '/ProductList/Tools/Abrasives/CutOffWheel',
              },
              {
                name: 'Diamond Blades',
                path: '/ProductList/Tools/Abrasives/DiamondBlades',
              },
            ],
          },
          {
            name: 'Allen Keys',
            path: '/ProductList/Tools/AllenKeys',
            subItemsNameComponent: [],
          },
          {
            name: 'Brush',
            path: '/ProductList/Tools/Brush',
            subItemsNameComponent: [],
          },
          {
            name: 'Carpenter Pincer',
            path: '/ProductList/Tools/CarpenterPincer',
            subItemsNameComponent: [],
          },
          {
            name: 'Centre Punches',
            path: '/ProductList/Tools/CentrePunches',
            subItemsNameComponent: [],
          },
          {
            name: 'Chisels',
            path: '/ProductList/Tools/Chisels',
            subItemsNameComponent: [],
          },
          {
            name: 'Clamps',
            path: '/ProductList/Tools/Clamps',
            subItemsNameComponent: [],
          },
          {
            name: 'Crowbar',
            path: '/ProductList/Tools/Crowbar',
            subItemsNameComponent: [],
          },
          {
            name: 'Cutters',
            path: '/ProductList/Tools/Cutters',
            subItemsNameComponent: [],
          },
          {
            name: 'files',
            path: '/ProductList/Tools/files',
            subItemsNameComponent: [],
          },
          {
            name: 'Garden Tools',
            path: '/ProductList/Tools/GardenTools',
            subItemsNameComponent: [],
          },
          {
            name: 'Gear Pullers',
            path: '/ProductList/Tools/GearPullers',
            subItemsNameComponent: [],
          },
          {
            name: 'Glass cutter',
            path: '/ProductList/Tools/GlassCutter',
            subItemsNameComponent: [],
          },
          {
            name: 'glue gun',
            path: '/ProductList/Tools/gluegun',
            subItemsNameComponent: [],
          },
          {
            name: 'Grease Gun',
            path: '/ProductList/Tools/GreaseGun',
            subItemsNameComponent: [],
          },
          {
            name: 'Hacksaw Blades',
            path: '/ProductList/Tools/HacksawBlades',
            subItemsNameComponent: [],
          },
          {
            name: 'Hammer',
            path: '/ProductList/Tools/Hammer',
            subItemsNameComponent: [],
          },
          {
            name: 'Hammer Drills',
            path: '/ProductList/Tools/HammerDrills',
            subItemsNameComponent: [],
          },
          {
            name: 'hand tools',
            path: '/ProductList/Tools/handtools',
            subItemsNameComponent: [],
          },
          {
            name: 'level',
            path: '/ProductList/Tools/level',
            subItemsNameComponent: [],
          },
          {
            name: 'Lubrications',
            path: '/ProductList/Tools/Lubrications',
            subItemsNameComponent: [],
          },
          {
            name: 'Measurement Scale',
            path: '/ProductList/Tools/MeasurementScale',
            subItemsNameComponent: [],
          },
          {
            name: 'Measuring Tape',
            path: '/ProductList/Tools/MeasuringTape',
            subItemsNameComponent: [],
          },
          {
            name: 'Multimeter',
            path: '/ProductList/Tools/Multimeter',
            subItemsNameComponent: [],
          },
          {
            name: 'Plier',
            path: '/ProductList/Tools/Plier',
            subItemsNameComponent: [],
          },
          {
            name: 'Polishing Accessories',
            path: '/ProductList/Tools/PolishingAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Power Tools',
            subItemsNameComponent: [
              {
                name: 'Drill',
                path: '/ProductList/Tools/PowerTools/Drill',
              },
              {
                name: 'Grinders',
                path: '/ProductList/Tools/PowerTools/Grinders',
              },
              {
                name: 'Marble Cutter',
                path: '/ProductList/Tools/PowerTools/MarbleCutter',
              },
            ],
          },
          {
            name: 'Saw',
            path: '/ProductList/Tools/saw',
            subItemsNameComponent: [],
          },
          {
            name: 'Screw Driver',
            path: '/ProductList/Tools/ScrewDriver',
            subItemsNameComponent: [],
          },
          {
            name: 'Silicon Gun',
            path: '/ProductList/Tools/SiliconGun',
            subItemsNameComponent: [],
          },
          {
            name: 'Socket set',
            path: '/ProductList/Tools/Socketset',
            subItemsNameComponent: [],
          },
          {
            name: 'Spanners',
            path: '/ProductList/Tools/Spanners',
            subItemsNameComponent: [],
          },
          {
            name: 'Spare Malets',
            path: '/ProductList/Tools/SpareMalets',
            subItemsNameComponent: [],
          },
          {
            name: 'Tool Compartments',
            path: '/ProductList/Tools/ToolCompartments',
            subItemsNameComponent: [],
          },
          {
            name: 'toolkit set',
            path: '/ProductList/Tools/toolkitset',
            subItemsNameComponent: [],
          },
          {
            name: 'various tool bits',
            path: '/ProductList/Tools/varioustoolbits',
            subItemsNameComponent: [],
          },
          {
            name: 'wood chisel',
            path: '/ProductList/Tools/woodChisel',
            subItemsNameComponent: [],
          },
          {
            name: 'wood items',
            path: '/ProductList/Tools/woodItems',
            subItemsNameComponent: [],
          },
          {
            name: 'Wrench',
            path: '/ProductList/Tools/Wrench',
            subItemsNameComponent: [],
          },
        ],
      },
      { name: 'Uncategorized', path: '/ProductList/Uncategorized' },
      {
        name: 'WaterProofing',
        subItemsName: [
          {
            name: 'Bathrooms',
            path: '/ProductList/WaterProofing/Bathrooms',
            subItemsNameComponent: [],
          },
          {
            name: 'Cracks & Joints',
            path: '/ProductList/WaterProofing/CracksJoints',
            subItemsNameComponent: [],
          },
          {
            name: 'Interiors',
            path: '/ProductList/WaterProofing/Interiors',
            subItemsNameComponent: [],
          },
        ],
      },
    ],
  },
  { name: 'Gallery', path: '/Gallery', section: 'section1' },
  { name: 'Order List', path: '/Orders', section: 'section1' }, // Section 1: Core Management
  { name: 'User List', path: '/EUserList', section: 'section1' }, // Section 1: Core Management
  { name: 'Category List', path: '/CategoryList', section: 'section1' }, // Section 1: Core Management
  { name: 'Coupon List', path: '/Coupons', section: 'section1' }, // Section 1: Core Management
  { name: 'GST Bill Management', path: '/BillManagement', section: 'section2' }, // Section 2: Other
  { name: 'Simple Bill Management', path: '/SimpleBillManagement', section: 'section2' }, // Section 2: Other
  { name: 'Simple Invoice', path: '/InvoiceGenerator', section: 'section2' }, // Section 2: Other
  { name: 'GST Invoice ', path: '/GSTBillManagement', section: 'section2' }, // Section 2: Other
  { name: 'Items Inventory', path: '/ItemsInventory', section: 'section2' }, // Section 2: Other
  { name: 'Bill File Management', path: '/BillFileManagement', section: 'section2' }, // Section 2: Other
  { name: 'Balance Management', path: '/BalanceManagement', section: 'section2' }, // Section 2: Other
  { name: 'Shop Management', path: '/ShopManagement', section: 'section2' }, // Section 2: Other
  { name: 'Shop Details', path: '/ShopDetails', section: 'section2' }, // Section 2: Other
];

// Add this helper function at the top (after imports):
function sortSidebarItems(items) {
  if (!Array.isArray(items)) return items;
  return items
    .map((item) => {
      // Recursively sort subItemsName, subItemsNameComponent, subItemsNameComponentName
      const sorted = { ...item };
      // if (item.subItemsName) {
      //   sorted.subItemsName = sortSidebarItems(item.subItemsName);
      // }
      if (item.subItemsNameComponent) {
        sorted.subItemsNameComponent = sortSidebarItems(
          item.subItemsNameComponent
        );
      }
      if (item.subItemsNameComponentName) {
        sorted.subItemsNameComponentName = sortSidebarItems(
          item.subItemsNameComponentName
        );
      }
      return sorted;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// OPTIMIZED: Memoize Sidebar component
const Sidebar = memo(function Sidebar({ onSetting, onLogout, open, onClose }) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Track open state for each collapsible item by name
  const [openSection, setOpenSection] = useState(null);
  const [openSubSection, setOpenSubSection] = useState(null);
  
  // OPTIMIZED: Memoize admin check
  const isAdminUser = useMemo(() => isAdmin(), [isAdmin]);
  
  // Helper function to check if a path is active
  const isActivePath = useCallback((path) => {
    if (!path) return false;
    // Handle empty path (Dashboard)
    if (path === '' || path === '/') {
      return pathname === '/dashboard/app' || pathname === '/dashboard/app/';
    }
    // Normalize paths for comparison
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const normalizedPathname = pathname || '';
    // Check if pathname matches the path (with or without /dashboard/app prefix)
    const fullPath = normalizedPathname.startsWith('/dashboard/app') 
      ? normalizedPathname 
      : `/dashboard/app${normalizedPathname}`;
    const checkPath = normalizedPath.startsWith('/dashboard/app')
      ? normalizedPath
      : `/dashboard/app${normalizedPath}`;
    return fullPath === checkPath || fullPath.startsWith(checkPath + '/');
  }, [pathname]);
  
  // OPTIMIZED: Memoize prefetch handler
  const handleLinkHover = useCallback((path) => {
    if (path) {
      router.prefetch(path);
    }
  }, [router]);

  // OPTIMIZED: Memoize filtered and sorted sections with grouping
  const [visibilityConfig, setVisibilityConfig] = useState({
    hiddenSections: {},
    hiddenItems: [],
  });
  const [sellerLoginUnread, setSellerLoginUnread] = useState(null);
  const [orderUnread, setOrderUnread] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadVisibility = () => {
      try {
        const raw = localStorage.getItem('sidebar_visibility_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          setVisibilityConfig({
            hiddenSections: parsed.hiddenSections || {},
            hiddenItems: parsed.hiddenItems || [],
          });
        } else {
          setVisibilityConfig({ hiddenSections: {}, hiddenItems: [] });
        }
      } catch (err) {
        console.error('Failed to load sidebar visibility:', err);
      }
    };

    loadVisibility();

    const handleCustom = () => loadVisibility();
    const handleStorage = (e) => {
      if (e.key === 'sidebar_visibility_v1') {
        loadVisibility();
      }
    };

    window.addEventListener('sidebar-visibility-updated', handleCustom);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('sidebar-visibility-updated', handleCustom);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const markSellerLoginRead = useCallback(() => {
    setSellerLoginUnread(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('seller_login_unread', '0');
    }
  }, []);

  const markOrderRead = useCallback(() => {
    setOrderUnread(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('order_unread', '0');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadSellerLoginUnread = async () => {
      try {
        const res = await fetch('/api/notifications/login-unread', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const count = Number(data?.unread ?? 0);
          if (!isMounted) return;
          setSellerLoginUnread(count > 0 ? count : null);
          if (typeof window !== 'undefined') {
            localStorage.setItem('seller_login_unread', String(count));
          }
          return;
        }
      } catch (err) {
        // non-blocking; fall back to localStorage
      }

      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('seller_login_unread');
        const parsed = raw ? Number(raw) : 0;
        if (isMounted) setSellerLoginUnread(parsed > 0 ? parsed : null);
      }
    };

    loadSellerLoginUnread();

    const handleCustom = () => loadSellerLoginUnread();
    const handleStorage = (e) => {
      if (e.key === 'seller_login_unread') {
        loadSellerLoginUnread();
      }
    };

    window.addEventListener('login-notification', handleCustom);
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener('login-notification', handleCustom);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadOrderUnread = async () => {
      try {
        const res = await fetch('/api/notifications/orders-unread', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const count = Number(data?.unread ?? 0);
          if (!isMounted) return;
          setOrderUnread(count > 0 ? count : null);
          if (typeof window !== 'undefined') {
            localStorage.setItem('order_unread', String(count));
          }
          return;
        }
      } catch (err) {
        // non-blocking; fall back to localStorage
      }

      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('order_unread');
        const parsed = raw ? Number(raw) : 0;
        if (isMounted) setOrderUnread(parsed > 0 ? parsed : null);
      }
    };

    loadOrderUnread();

    const handleCustom = () => loadOrderUnread();
    const handleStorage = (e) => {
      if (e.key === 'order_unread') {
        loadOrderUnread();
      }
    };

    window.addEventListener('order-notification', handleCustom);
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener('order-notification', handleCustom);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const organizedSections = useMemo(() => {
    const filteredSections = sidebarSections.filter(section => {
      const hiddenSection = visibilityConfig.hiddenSections?.[section.section];
      if (hiddenSection) return false;
      if (visibilityConfig.hiddenItems?.includes(section.name)) return false;
      return true;
    });
    
    // Organize into groups
    const dashboard = filteredSections.find(s => s.name === 'Dashboard');
    const section1 = filteredSections.filter(s => s.section === 'section1');
    const section2 = filteredSections.filter(s => s.section === 'section2');
    
    return {
      dashboard: dashboard ? [dashboard] : [],
      section1: sortSidebarItems(section1),
      section2: sortSidebarItems(section2)
    };
  }, [isAdminUser, visibilityConfig]);

  // OPTIMIZED: Memoize toggle handler
  const handleToggle = useCallback((name) => {
    setOpenSection(prev => prev === name ? null : name);
  }, []);
  return (
    <aside className='w-64 h-screen bg-white shadow-lg p-2 flex flex-col text-zinc-800 border border-zinc-100'>
      <div className='px-3 py-4 border-b border-gray-100 flex items-center justify-center'>
        <BrandLogo size={64} showText={true} />
      </div>
      <nav className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
        <ul className='p-2.5 space-y-1'>
          {/* Dashboard - Neutral (not in any section) */}
          {organizedSections.dashboard.map((section) => {
            const hasSubItems = section.subItems || section.subItemsName || section.subItemsNameComponent || section.subItemsNameComponentName;
            const isActive = section.path ? isActivePath(section.path) : false;
            const isExpanded = openSection === section.name;
            
            return (
              <div key={section.name} className='mb-1.5'>
                {section.path ? (
                  <Link
                    href={section.path}
                    prefetch={true}
                    onMouseEnter={() => handleLinkHover(section.path)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md'
                        : isExpanded
                        ? 'bg-zinc-100 text-zinc-900 font-medium'
                        : 'text-zinc-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white'
                    }`}
                    onClick={() => handleToggle(section.name)}
                  >
                    <span className="flex-1">{section.name}</span>
                    {hasSubItems && (
                      <span className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-white' : isExpanded ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-white'
                      }`}>
                        {isExpanded ? (
                          <FiChevronUp className='w-4 h-4' />
                        ) : (
                          <FiChevronDown className='w-4 h-4' />
                        )}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                      isExpanded
                        ? 'bg-zinc-100 text-zinc-900 font-medium'
                        : 'text-zinc-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white'
                    }`}
                    onClick={() => handleToggle(section.name)}
                  >
                    <span className="flex-1">{section.name}</span>
                    {hasSubItems && (
                      <span className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'text-zinc-600' : 'text-zinc-400'
                      }`}>
                        {isExpanded ? (
                          <FiChevronUp className='w-4 h-4' />
                        ) : (
                          <FiChevronDown className='w-4 h-4' />
                        )}
                      </span>
                    )}
                  </div>
                )}
                {isExpanded && hasSubItems && (
                  <ul className='pl-4 mt-1 space-y-0.5'>
                    {Array.isArray(section.subItems) &&
                      section.subItems.map((item) => (
                        <SidebarItem
                          key={item.name}
                          item={item}
                          openSubSection={openSubSection}
                          setOpenSubSection={setOpenSubSection}
                        />
                      ))}
                    {Array.isArray(section.subItemsName) &&
                      section.subItemsName.map((item) => (
                        <SidebarItem
                          key={item.name}
                          item={item}
                          openSubSection={openSubSection}
                          setOpenSubSection={setOpenSubSection}
                        />
                      ))}
                    {Array.isArray(section.subItemsNameComponent) &&
                      section.subItemsNameComponent.map((item) => (
                        <SidebarItem
                          key={item.name}
                          item={item}
                          openSubSection={openSubSection}
                          setOpenSubSection={setOpenSubSection}
                        />
                      ))}
                    {Array.isArray(section.subItemsNameComponentName) &&
                      section.subItemsNameComponentName.map((item) => (
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
            );
          })}
          
          {/* Section 1: Core Management */}
          {organizedSections.section1.length > 0 && (
            <>
              <li className='px-3 py-2 mt-4 mb-2'>
                <div className='text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-1'>
                  Core Management
                </div>
              </li>
              {organizedSections.section1.map((section) => {
                const hasSubItems = section.subItems || section.subItemsName || section.subItemsNameComponent || section.subItemsNameComponentName;
                const isActive = section.path ? isActivePath(section.path) : false;
                const isExpanded = openSection === section.name;
                
                return (
                  <div key={section.name} className='mb-1.5'>
                    {section.path ? (
                      <Link
                        href={section.path}
                        prefetch={true}
                        onMouseEnter={() => handleLinkHover(section.path)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer group ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md'
                            : isExpanded
                            ? 'bg-zinc-100 text-zinc-900 font-medium'
                            : 'text-zinc-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white'
                        }`}
                        onClick={() => {
                          if (section.name === 'Order List') {
                            markOrderRead();
                          }
                          handleToggle(section.name);
                        }}
                      >
                        <span className="inline-flex items-center gap-2 flex-1">
                          {section.name}
                          {section.name === 'Order List' && orderUnread ? (
                            <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] leading-none shadow-sm">
                              {orderUnread > 99 ? '99+' : orderUnread}
                            </span>
                          ) : null}
                        </span>
                        {hasSubItems && (
                          <span className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                            isActive ? 'text-white' : isExpanded ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-white'
                          }`}>
                            {isExpanded ? (
                              <FiChevronUp className='w-4 h-4' />
                            ) : (
                              <FiChevronDown className='w-4 h-4' />
                            )}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                          isExpanded
                            ? 'bg-zinc-100 text-zinc-900 font-medium'
                            : 'text-zinc-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white'
                        }`}
                        onClick={() => {
                          handleToggle(section.name);
                        }}
                      >
                        <span className="inline-flex items-center gap-2 flex-1">
                          {section.name}
                        </span>
                        {hasSubItems && (
                          <span className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'text-zinc-600' : 'text-zinc-400'
                          }`}>
                            {isExpanded ? (
                              <FiChevronUp className='w-4 h-4' />
                            ) : (
                              <FiChevronDown className='w-4 h-4' />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                    {isExpanded && hasSubItems && (
                      <ul className='pl-4 mt-1 space-y-0.5'>
                        {Array.isArray(section.subItems) &&
                          section.subItems.map((item) => (
                            <SidebarItem
                              key={item.name}
                              item={item}
                              openSubSection={openSubSection}
                              setOpenSubSection={setOpenSubSection}
                            />
                          ))}
                        {Array.isArray(section.subItemsName) &&
                          section.subItemsName.map((item) => (
                            <SidebarItem
                              key={item.name}
                              item={item}
                              openSubSection={openSubSection}
                              setOpenSubSection={setOpenSubSection}
                            />
                          ))}
                        {Array.isArray(section.subItemsNameComponent) &&
                          section.subItemsNameComponent.map((item) => (
                            <SidebarItem
                              key={item.name}
                              item={item}
                              openSubSection={openSubSection}
                              setOpenSubSection={setOpenSubSection}
                            />
                          ))}
                        {Array.isArray(section.subItemsNameComponentName) &&
                          section.subItemsNameComponentName.map((item) => (
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
                );
              })}
            </>
          )}
          
          {/* Section 2: Other */}
          {organizedSections.section2.length > 0 && (
            <>
              <li className='px-3 py-2 mt-4 mb-2'>
                <div className='text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-1'>
                  Other
                </div>
              </li>
              {organizedSections.section2.map((section) => {
                const hasSubItems = section.subItems || section.subItemsName || section.subItemsNameComponent || section.subItemsNameComponentName;
                const isActive = section.path ? isActivePath(section.path) : false;
                const isExpanded = openSection === section.name;
                
                return (
                  <div key={section.name} className='mb-1.5'>
                    {section.path ? (
                      <Link
                        href={section.path}
                        prefetch={true}
                        onMouseEnter={() => handleLinkHover(section.path)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer group ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md'
                            : isExpanded
                            ? 'bg-zinc-100 text-zinc-900 font-medium'
                            : 'text-zinc-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white'
                        }`}
                        onClick={() => handleToggle(section.name)}
                      >
                        <span className="flex-1">{section.name}</span>
                        {hasSubItems && (
                          <span className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                            isActive ? 'text-white' : isExpanded ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-white'
                          }`}>
                            {isExpanded ? (
                              <FiChevronUp className='w-4 h-4' />
                            ) : (
                              <FiChevronDown className='w-4 h-4' />
                            )}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                          isExpanded
                            ? 'bg-zinc-100 text-zinc-900 font-medium'
                            : 'text-zinc-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white'
                        }`}
                        onClick={() => handleToggle(section.name)}
                      >
                        <span className="flex-1">{section.name}</span>
                        {hasSubItems && (
                          <span className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'text-zinc-600' : 'text-zinc-400'
                          }`}>
                            {isExpanded ? (
                              <FiChevronUp className='w-4 h-4' />
                            ) : (
                              <FiChevronDown className='w-4 h-4' />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                    {isExpanded && hasSubItems && (
                      <ul className='pl-4 mt-1 space-y-0.5'>
                        {Array.isArray(section.subItems) &&
                          section.subItems.map((item) => (
                            <SidebarItem
                              key={item.name}
                              item={item}
                              openSubSection={openSubSection}
                              setOpenSubSection={setOpenSubSection}
                            />
                          ))}
                        {Array.isArray(section.subItemsName) &&
                          section.subItemsName.map((item) => (
                            <SidebarItem
                              key={item.name}
                              item={item}
                              openSubSection={openSubSection}
                              setOpenSubSection={setOpenSubSection}
                            />
                          ))}
                        {Array.isArray(section.subItemsNameComponent) &&
                          section.subItemsNameComponent.map((item) => (
                            <SidebarItem
                              key={item.name}
                              item={item}
                              openSubSection={openSubSection}
                              setOpenSubSection={setOpenSubSection}
                            />
                          ))}
                        {Array.isArray(section.subItemsNameComponentName) &&
                          section.subItemsNameComponentName.map((item) => (
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
                );
              })}
            </>
          )}
        </ul>
      </nav>
      <div className='p-4 border-t text-black border-gray-700 flex flex-col gap-2'>
        <Button
          variant='outline'
          className='w-full text-left cursor-pointer'
          onClick={onSetting}
        >
          Setting
        </Button>
        <Button
          variant='destructive'
          className='w-full text-left cursor-pointer'
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;

// OPTIMIZED: Memoize SidebarItem to prevent unnecessary re-renders
const SidebarItem = memo(function SidebarItem({ item }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0;
  const hasSubItemsName =
    Array.isArray(item.subItemsName) && item.subItemsName.length > 0;
  const hasSubItemsNameComponent =
    Array.isArray(item.subItemsNameComponent) &&
    item.subItemsNameComponent.length > 0;
  const hasSubItemsNameComponentName =
    Array.isArray(item.subItemsNameComponentName) &&
    item.subItemsNameComponentName.length > 0;

  // Helper function to check if a path is active
  const isActivePath = useCallback((path) => {
    if (!path) return false;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const normalizedPathname = pathname || '';
    // Check if pathname matches the path (with or without /dashboard/app prefix)
    const fullPath = normalizedPathname.startsWith('/dashboard/app') 
      ? normalizedPathname 
      : `/dashboard/app${normalizedPathname}`;
    const checkPath = normalizedPath.startsWith('/dashboard/app')
      ? normalizedPath
      : `/dashboard/app${normalizedPath}`;
    return fullPath === checkPath || fullPath.startsWith(checkPath + '/');
  }, [pathname]);

  // Local state for this item's expand/collapse
  const [isOpen, setIsOpen] = useState(false);

  const handleRowClick = () => {
    if (
      hasSubItems ||
      hasSubItemsName ||
      hasSubItemsNameComponent ||
      hasSubItemsNameComponentName
    ) {
      setIsOpen((prev) => !prev);
    }
  };

  const isActive = item.path ? isActivePath(item.path) : false;

  return (
    <li className='mb-0.5'>
      {item.path &&
      !(
        hasSubItems ||
        hasSubItemsName ||
        hasSubItemsNameComponent ||
        hasSubItemsNameComponentName
      ) ? (
        <Link
          href={item.path}
          prefetch={true}
          onMouseEnter={() => router.prefetch(item.path)}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
            isActive
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md'
              : 'text-zinc-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white'
          }`}
        >
          <span className='flex-1'>{item.name}</span>
        </Link>
      ) : (
        <div
          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
            isOpen
              ? 'bg-zinc-50 text-zinc-900 font-medium'
              : 'text-zinc-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white'
          }`}
          onClick={handleRowClick}
        >
          <span className='flex-1'>{item.name}</span>
          <span className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            {isOpen ? (
              <FiChevronUp className='w-4 h-4' />
            ) : (
              <FiChevronDown className='w-4 h-4' />
            )}
          </span>
        </div>
      )}
      {isOpen && (
        <ul className='pl-4 mt-0.5 space-y-0.5'>
          {hasSubItems &&
            item.subItems.map((child) => (
              <SidebarItem key={child.name} item={child} />
            ))}
          {hasSubItemsName &&
            item.subItemsName.map((child) => (
              <SidebarItem key={child.name} item={child} />
            ))}
          {hasSubItemsNameComponent &&
            item.subItemsNameComponent.map((child) => (
              <SidebarItem key={child.name} item={child} />
            ))}
          {hasSubItemsNameComponentName &&
            item.subItemsNameComponentName.map((child) => (
              <SidebarItem key={child.name} item={child} />
            ))}
        </ul>
      )}
    </li>
  );
});

SidebarItem.displayName = 'SidebarItem';
