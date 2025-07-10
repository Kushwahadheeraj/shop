'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Link from 'next/link';

const sections = [
  { name: 'Dashboard', path: '/Dashboard' },
  {
    name: 'Product Add',
    subItems: [
      { name: 'Adhesives', path: '/Dashboard/ProductAdd/Adhesives' },
      { name: 'Brush', path: '/Dashboard/ProductAdd/Brush' },
      { name: 'Cements & POP', path: '/Dashboard/ProductAdd/Cements' },
      { name: 'Cleaning', path: '/Dashboard/ProductAdd/Cleaning' },
      { name: 'Dry Wall Gypsum Screws', path: '/Dashboard/ProductAdd/Dry' },
      {
        name: 'Electrical Item',
        subItemsName: [
          {
            name: 'Adaptors',
            path: '/Dashboard/ProductAdd/Electrical/Adaptors',
          },
          {
            name: 'Ceiling Roses',
            path: '/Dashboard/ProductAdd/Electrical/CeilingRoses',
          },
          { name: 'Dimmer', path: '/Dashboard/ProductAdd/Electrical/Dimmer' },
          {
            name: 'Distribution Boards',
            path: '/Dashboard/ProductAdd/Electrical/DistributionBoards',
          },
          {
            name: 'Door Bells',
            path: '/Dashboard/ProductAdd/Electrical/DoorBells',
          },
          {
            name: 'DP-switch',
            path: '/Dashboard/ProductAdd/Electrical/DPswitch',
          },
          {
            name: 'Earthing Accessories',
            path: '/Dashboard/ProductAdd/Electrical/EarthingAccessories',
          },
          {
            name: 'ELCBs OR RCCBs',
            path: '/Dashboard/ProductAdd/Electrical/ELCBsRCCBs',
          },
          {
            name: 'Electrical Fittings',
            path: '/Dashboard/ProductAdd/Electrical/ElectricalFittings',
            subItemsNameComponent: [
              {
                name: 'Accessories',
                path: '/Dashboard/ProductAdd/Electrical/ElectricalFittings/Accessories',
              },
              {
                name: 'Circular Deep Box',
                path: '/Dashboard/ProductAdd/Electrical/ElectricalFittings/CircularDeepBox',
              },
              {
                name: 'Circular surface box',
                path: '/Dashboard/ProductAdd/Electrical/ElectricalFittings/CircularSurfaceBox',
              },
              {
                name: 'Rigid type',
                path: '/Dashboard/ProductAdd/Electrical/ElectricalFittings/RigidType',
              },
            ],
          },
          {
            name: 'Fans',
            path: '/Dashboard/ProductAdd/Electrical/Fans',
            subItemsNameComponent: [
              {
                name: 'Cabin Fans',
                path: '/Dashboard/ProductAdd/Electrical/Fans/CabinFans',
              },
              {
                name: 'Ceiling Fans',
                path: '/Dashboard/ProductAdd/Electrical/Fans/CeilingFans',
              },
              {
                name: 'Pedestal Fans',
                path: '/Dashboard/ProductAdd/Electrical/Fans/PedestalFans',
              },
              {
                name: 'Table Fans',
                path: '/Dashboard/ProductAdd/Electrical/Fans/TableFans',
              },
              {
                name: 'Ventilation/Exhaust Fans',
                path: '/Dashboard/ProductAdd/Electrical/Fans/VentilationExhaustFans',
              },
              {
                name: 'Wall Mounting Fans',
                path: '/Dashboard/ProductAdd/Electrical/Fans/WallMountingFans',
              },
            ],
          },
          {
            name: 'Flexible Conduit',
            path: '/Dashboard/ProductAdd/Electrical/FlexibleConduit',
          },
          {
            name: 'Flexible Wires',
            path: '/Dashboard/ProductAdd/Electrical/FlexibleWires',
          },
          {
            name: 'Fuse Carriers',
            path: '/Dashboard/ProductAdd/Electrical/FuseCarriers',
          },
          {
            name: 'Holders',
            path: '/Dashboard/ProductAdd/Electrical/Holders',
          },
          {
            name: 'Indicator',
            path: '/Dashboard/ProductAdd/Electrical/Indicator',
          },
          {
            name: 'Insulation Tapes',
            path: '/Dashboard/ProductAdd/Electrical/InsulationTapes',
          },
          {
            name: 'Isolators',
            path: '/Dashboard/ProductAdd/Electrical/Isolators',
          },
          { name: 'Jacks', path: '/Dashboard/ProductAdd/Electrical/Jacks' },
          {
            name: 'KIT KAT Fuses',
            path: '/Dashboard/ProductAdd/Electrical/KITKATFuses',
          },
          {
            name: 'Lights',
            path: '/Dashboard/ProductAdd/Electrical/Lights',
            subItemsNameComponent: [
              {
                name: 'Ceiling light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/CeilingLight',
              },
              {
                name: 'CFL',
                path: '/Dashboard/ProductAdd/Electrical/Lights/CFL',
              },
              {
                name: 'Desklight',
                path: '/Dashboard/ProductAdd/Electrical/Lights/Desklight',
              },
              {
                name: 'Focus Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/FocusLight',
              },
              {
                name: 'Garden Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/GardenLight',
              },
              {
                name: 'Gate Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/GateLight',
              },
              {
                name: 'GLS',
                path: '/Dashboard/ProductAdd/Electrical/Lights/GLS',
              },
              {
                name: 'Home',
                path: '/Dashboard/ProductAdd/Electrical/Lights/Home',
              },
              {
                name: 'Lamps',
                path: '/Dashboard/ProductAdd/Electrical/Lights/Lamps',
              },
              {
                name: 'LED Batten',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LEDBatten',
              },
              {
                name: 'LED Bulbs',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LEDBulbs',
              },
              {
                name: 'Led DownLighters/Spot Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LedDownLightersSpotLight',
              },
              {
                name: 'LED Luminaires',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LEDLuminaires',
              },
              {
                name: 'LED Panel Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LEDPanelLight',
              },
              {
                name: 'LED Spotlight',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LEDSpotlight',
              },
              {
                name: 'LED Street Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LEDStreetLight',
              },
              {
                name: 'LED Strips',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LEDStrips',
              },
              {
                name: 'Led Surface Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LedSurfaceLight',
              },
              {
                name: 'Light Electronics',
                path: '/Dashboard/ProductAdd/Electrical/Lights/LightElectronics',
              },
              {
                name: 'Mirror Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/MirrorLight',
              },
              {
                name: 'Reflectors',
                path: '/Dashboard/ProductAdd/Electrical/Lights/Reflectors',
              },
              {
                name: 'Standard Incandescent',
                path: '/Dashboard/ProductAdd/Electrical/Lights/StandardIncandescent',
              },
              {
                name: 'T Bulb',
                path: '/Dashboard/ProductAdd/Electrical/Lights/TBulb',
              },
              {
                name: 'Tube Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/TubeLight',
              },
              {
                name: 'Under Water Lights',
                path: '/Dashboard/ProductAdd/Electrical/Lights/UnderWaterLights',
              },
              {
                name: 'Wall Light',
                path: '/Dashboard/ProductAdd/Electrical/Lights/WallLight',
              },
            ],
          },
          {
            name: 'Main Switch',
            path: '/Dashboard/ProductAdd/Electrical/MainSwitch',
          },
          { name: 'MCB', path: '/Dashboard/ProductAdd/Electrical/MCB' },
          {
            name: 'Modular/Surface Box',
            path: '/Dashboard/ProductAdd/Electrical/ModularSurfaceBox',
          },
          {
            name: 'Motor Starters',
            path: '/Dashboard/ProductAdd/Electrical/MotorStarters',
          },
          { name: 'Motors', path: '/Dashboard/ProductAdd/Electrical/Motors' },
          { name: 'Others', path: '/Dashboard/ProductAdd/Electrical/Others' },
          { name: 'Pin top', path: '/Dashboard/ProductAdd/Electrical/PinTop' },
          { name: 'Plug', path: '/Dashboard/ProductAdd/Electrical/Plug' },
          {
            name: 'Power Strips',
            path: '/Dashboard/ProductAdd/Electrical/PowerStrips',
          },
          {
            name: 'PVC Clips',
            path: '/Dashboard/ProductAdd/Electrical/PVCClips',
          },
          {
            name: 'Regulators',
            path: '/Dashboard/ProductAdd/Electrical/Regulators',
          },
          {
            name: 'Rotary Switch',
            path: '/Dashboard/ProductAdd/Electrical/RotarySwitch',
          },
          {
            name: 'Sockets',
            path: '/Dashboard/ProductAdd/Electrical/Sockets',
          },
          {
            name: 'Switch & Socket',
            path: '/Dashboard/ProductAdd/Electrical/SwitchAndSocket',
          },
          {
            name: 'Switch Plates',
            path: '/Dashboard/ProductAdd/Electrical/SwitchPlates',
          },
          {
            name: 'Switches',
            path: '/Dashboard/ProductAdd/Electrical/Switches',
          },
          {
            name: 'Travel adaptor',
            path: '/Dashboard/ProductAdd/Electrical/TravelAdaptor',
          },
          {
            name: 'TV outlets',
            path: '/Dashboard/ProductAdd/Electrical/TVOutlets',
          },
          {
            name: 'Uni Switch Socket Combined Units',
            path: '/Dashboard/ProductAdd/Electrical/UniSwitch',
          },
          {
            name: 'Water Heater',
            path: '/Dashboard/ProductAdd/Electrical/Water Heater',
          },
          {
            name: 'Water Heaters',
            path: '/Dashboard/ProductAdd/Electrical/WaterHeaters',
          },
          {
            name: 'Wires & Cables',
            path: '/Dashboard/ProductAdd/Electrical/WiresAndCables',
          },
        ],
      },
      { name: 'Electrical Fitting', path: '/Dashboard/ProductAdd/Fitting' },
      { name: 'Fiber Sheet', path: '/Dashboard/ProductAdd/Fiber' },
      { name: 'Hardware', path: '/Dashboard/ProductAdd/Hardware' },
      { name: 'Home', path: '/Dashboard/ProductAdd/Home' },
      { name: 'Home Decor', path: '/Dashboard/ProductAdd/HomeDecor' },
      { name: 'House Hold Ladder', path: '/Dashboard/ProductAdd/HouseHold' },
      { name: 'Lighting', path: '/Dashboard/ProductAdd/Lighting' },
      {
        name: 'Locks & accessories',
        subItemsName: [
          {
            name: 'DOOR ACCESSORIES',
            subItemsNameComponent: [
              {
                name: 'Aluminium Tower Bolt',
                path: '/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/AluminiumTowerBolt',
              },
              {
                name: 'Ball Bearing Door Hinges',
                path: '/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/BallBearingDoorHinges',
              },
              {
                name: 'Concealed Hinges',
                path: '/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/ConcealedHinges',
              },
              {
                name: 'Door Eye',
                path: '/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/DoorEye',
              },
              {
                name: 'Door Stopper',
                path: '/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/DoorStopper',
              },
              {
                name: 'HINGES',
                path: '/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/HINGES',
              },
              {
                name: 'Magnetic Door Stoppers',
                path: '/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/MagneticDoorStoppers',
              },
              {
                name: 'Wooden Sliding Door Fittings',
                path: '/Dashboard/ProductAdd/Hardware/Locks/DoorAccessories/WoodenSlidingDoorFittings',
              },
            ],
          },
          {
            name: 'DOOR CONTROLS',
            subItemsNameComponent: [
              {
                name: 'Door Closers',
                path: '/Dashboard/ProductAdd/Locks/DoorControls/Door%20Closers',
              },
              {
                name: 'Door Stopper',
                path: '/Dashboard/ProductAdd/Locks/DoorControls/Door%20Stopper',
              },
              {
                name: 'Hydraulic Door Closers',
                path: '/Dashboard/ProductAdd/Locks/DoorControls/Hydraulic%20Door%20Closers',
              },
            ],
          },
          {
            name: 'DOOR HANDLES',
            subItemsNameComponent: [
              {
                name: 'Door King',
                path: '/Dashboard/ProductAdd/Locks/DoorControls/DoorKing',
              },
              {
                name: 'Door Pulls',
                path: '/Dashboard/ProductAdd/Locks/DoorControls/DoorPulls',
              },
            ],
          },
          {
            name: 'DOOR LOCKS',
            subItemsNameComponent: [
              {
                name: 'Tri Bolt Locks',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Tri%20Bolt%20Locks',
              },
              {
                name: 'Smart Key',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Smart%20Key',
              },
              {
                name: 'Night Latch',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Night%20Latch',
              },
              {
                name: 'Pull Handles For Main Doors',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Pull%20Handles%20For%20Main%20Doors',
              },
              {
                name: 'Rim Dead Lock',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Rim%20Dead%20Lock',
              },
              {
                name: 'Side Lock',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Side%20Lock',
              },
              {
                name: 'Main Door Lock',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Main%20Door%20Lock',
              },
              {
                name: 'Jemmy Proof Door Lock',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Jemmy%20Proof%20Door%20Lock',
              },
              {
                name: 'Knob Locks',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Knob%20Locks',
              },
              {
                name: 'Drawer Lock',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Drawer%20Lock',
              },
              {
                name: 'Dead Locks',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Dead%20Locks',
              },
              {
                name: 'Diamant Padlocks',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Diamant%20Padlocks',
              },
              {
                name: 'Dimple Key',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Dimple%20Key',
              },
              {
                name: 'Disc Pad Locks',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Disc%20Pad%20Locks',
              },
              {
                name: 'Cylindrical Locks',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Cylindrical%20Locks',
              },
              {
                name: 'Centre Shutter Locks',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Centre%20Shutter%20Locks',
              },
              {
                name: 'Cupboard Locks',
                path: '/Dashboard/ProductAdd/Locks/DoorLocks/Cupboard%20Locks',
              },
            ],
          },
          {
            name: 'FURNITURE BRACKETS',
            path: '/Dashboard/ProductAdd/Locks/FurnitureBrackets',
          },
          {
            name: 'FURNITURE FITTINGS',
            subItemsNameComponent: [
              {
                name: 'Ball Bearing Drawer Channel',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Ball%20Bearing%20Drawer%20Channel',
              },
              {
                name: 'Furniture Fittings',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Furniture%20Fittings',
              },
              {
                name: 'Heavy Duty Drawer Slides',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Heavy%20Duty%20Drawer%20Slides',
              },
              {
                name: 'Slip On Hinge',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Slip%20On%20Hinge',
              },
              {
                name: 'Soft Close Drawer Channel',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Soft%20Close%20Drawer%20Channel',
              },
              {
                name: 'Thick Door Hinge',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Thick%20Door%20Hinge',
              },
              {
                name: 'Folding Brackets',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Folding%20Brackets',
              },
              {
                name: 'Cabinet Hinge',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Cabinet%20Hinge',
              },
              {
                name: 'Clip On Soft Hinge',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Clip%20On%20Soft%20Hinge',
              },
              {
                name: 'Clip On Soft Hinge4 Hole',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Clip%20On%20Soft%20Hinge4%20Hole',
              },
              {
                name: 'Drawer Channels',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Drawer%20Channels',
              },
              {
                name: 'Blind Corner Hinge',
                path: '/Dashboard/ProductAdd/Locks/FurnitureFittings/Blind%20Corner%20Hinge',
              },
            ],
          },
          {
            name: 'FURNITURE LOCKS',
            subItemsNameComponent: [
              {
                name: 'Curvo',
                path: '/Dashboard/ProductAdd/Locks/FurnitureLocks/Curvo',
              },
              {
                name: 'CamLock',
                path: '/Dashboard/ProductAdd/Locks/FurnitureLocks/CamLock',
              },
              {
                name: 'Nuvo',
                path: '/Dashboard/ProductAdd/Locks/FurnitureLocks/Nuvo',
              },
              {
                name: 'Supernova',
                path: '/Dashboard/ProductAdd/Locks/FurnitureLocks/Supernova',
              },
              {
                name: 'Table Lock',
                path: '/Dashboard/ProductAdd/Locks/FurnitureLocks/Table%20Lock',
              },
              {
                name: 'Drawer Cupboard Lock',
                path: '/Dashboard/ProductAdd/Locks/FurnitureLocks/Drawer%20Cupboard%20Lock',
              },
              {
                name: 'Drawer Locks',
                path: '/Dashboard/ProductAdd/Locks/FurnitureLocks/Drawer%20Locks',
              },
              {
                name: 'Multi Purpose Lock',
                path: '/Dashboard/ProductAdd/Locks/FurnitureLocks/Multi%20Purpose%20Lock',
              },
            ],
          },
          {
            name: 'GLASS HARDWARE',
            subItemsNameComponent: [
              {
                name: 'Glass Door Pull Handle',
                path: '/Dashboard/ProductAdd/Locks/GlassHardware/Glass%20Door%20Pull%20Handle',
              },
              {
                name: 'Glass Hardware',
                path: '/Dashboard/ProductAdd/Locks/GlassHardware/Glass%20Hardware',
              },
              {
                name: 'Shower Cubicle Hinge',
                path: '/Dashboard/ProductAdd/Locks/GlassHardware/Shower%20Cubicle%20Hinge',
              },
              {
                name: 'Sliding System',
                path: '/Dashboard/ProductAdd/Locks/GlassHardware/Sliding%20System',
              },
              {
                name: 'Glass Door Lock',
                path: '/Dashboard/ProductAdd/Locks/GlassHardware/Glass%20Door%20Lock',
              },
              {
                name: 'Floor Spring Combo Set',
                path: '/Dashboard/ProductAdd/Locks/GlassHardware/Floor%20Spring%20Combo%20Set',
              },
              {
                name: 'Glass Door Fitting',
                path: '/Dashboard/ProductAdd/Locks/GlassHardware/Glass%20Door%20Fitting',
              },
            ],
          },
          {
            name: 'LEVER MORTISE LOCKS',
            subItemsNameComponent: [
              {
                name: 'EXS HI - SECURITY CYLINDERS',
                path: '/Dashboard/ProductAdd/Locks/LeverMortiseLocks/EXS%20HI%20-%20SECURITY%20CYLINDERS',
              },
              {
                name: 'COMBIPACK WITH 6 LEVER MORTISE LOCK',
                path: '/Dashboard/ProductAdd/Locks/LeverMortiseLocks/COMBIPACK%20WITH%206%20LEVER%20MORTISE%20LOCK',
              },
              {
                name: 'Europrofile Mortise Pin Cylinder With Master Key',
                path: '/Dashboard/ProductAdd/Locks/LeverMortiseLocks/Europrofile%20Mortise%20Pin%20Cylinder%20With%20Master%20Key',
              },
              {
                name: 'Europrofile Mortise Pin Cylinder',
                path: '/Dashboard/ProductAdd/Locks/LeverMortiseLocks/Europrofile%20Mortise%20Pin%20Cylinder',
              },
              {
                name: 'Europrofile Mortise Lock Bodies',
                path: '/Dashboard/ProductAdd/Locks/LeverMortiseLocks/Europrofile%20Mortise%20Lock%20Bodies',
              },
            ],
          },
          {
            name: 'Mortice Locks',
            path: '/Dashboard/ProductAdd/Locks/MorticeLocks',
          },
          {
            name: 'Mortise Lock Body',
            path: '/Dashboard/ProductAdd/Locks/MortiseLockBody',
          },

          {
            name: 'Padlocks',
            subItemsNameComponent: [
              {
                name: 'Ultra Shutter Locks',
                path: '/Dashboard/ProductAdd/Locks/Padlocks/Ultra%20Shutter%20Locks',
              },
              {
                name: 'Disc Padlocks',
                path: '/Dashboard/ProductAdd/Locks/Padlocks/Disc%20Padlocks',
              },
              {
                name: 'Padlocks',
                path: '/Dashboard/ProductAdd/Locks/Padlocks/Padlocks',
              },
              {
                name: 'Premium Padlocks',
                path: '/Dashboard/ProductAdd/Locks/Padlocks/Premium%20Padlocks',
              },
              {
                name: 'Round Type Padlock',
                path: '/Dashboard/ProductAdd/Locks/Padlocks/Round%20Type%20Padlock',
              },
              {
                name: 'Square Type Padlock',
                path: '/Dashboard/ProductAdd/Locks/Padlocks/Square%20Type%20Padlock',
              },
            ],
          },
          {
            name: 'Patch Fittings',
            path: '/Dashboard/ProductAdd/Locks/PatchFittings',
          },
          {
            name: 'POPULAR MORTISE SERIES',
            subItemsNameComponent: [
              {
                name: 'S S D Type Tube Lever',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/S%20S%20D%20Type%20Tube%20Lever',
              },
              {
                name: 'Towy Low Height Design',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Towy%20Low%20Height%20Design',
              },
              {
                name: 'Victoria',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Victoria',
              },
              {
                name: 'Pull Handles',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Pull%20Handles',
              },
              {
                name: 'N E H15 Low Height Design',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H15%20Low%20Height%20Design',
              },
              {
                name: 'N E H16',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H16',
              },
              {
                name: 'Oliver',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Oliver',
              },
              {
                name: 'Popular Mortise Series',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Popular%20Mortise%20Series',
              },
              {
                name: 'N E H10',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H10',
              },
              {
                name: 'N E H11',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H11',
              },
              {
                name: 'N E H12',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H12',
              },
              {
                name: 'N E H13',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H13',
              },
              {
                name: 'N E H14',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H14',
              },
              {
                name: 'N E H09',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H09',
              },
              {
                name: 'N E H04',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H04',
              },
              {
                name: 'N E H05',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H05',
              },
              {
                name: 'N E H06',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H06',
              },
              {
                name: 'N E H07',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H07',
              },
              {
                name: 'N E H08',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/N%20E%20H08',
              },
              {
                name: 'Matiz',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Matiz',
              },
              {
                name: 'Corner Fetch Series',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Corner%20Fetch%20Series',
              },
              {
                name: 'Cylindrical Locks',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Cylindrical%20Locks',
              },
              {
                name: 'Gloria',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Gloria',
              },
              {
                name: 'Main Door Set',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Main%20Door%20Set',
              },
              {
                name: 'Combi Set',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Combi%20Set',
              },
              {
                name: 'Classic Lock',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/Classic%20Lock',
              },
              {
                name: 'B M01',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/B%20M01',
              },
              {
                name: 'B M02',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/B%20M02',
              },
              {
                name: 'B M04',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/B%20M04',
              },
              {
                name: 'B M06',
                path: '/Dashboard/ProductAdd/Locks/PopularMortiseSeries/B%20M06',
              },
            ],
          },
          {
            name: 'PREMIUM MORTISE SERIES',
            subItemsNameComponent: [
              {
                name: 'S E H Series',
                path: '/Dashboard/ProductAdd/Locks/PremiumMortiseSeries/S%20E%20H%20Series',
              },
              {
                name: 'Phoenix',
                path: '/Dashboard/ProductAdd/Locks/PremiumMortiseSeries/Phoenix',
              },
              {
                name: 'Premium Mortise Series',
                path: '/Dashboard/ProductAdd/Locks/PremiumMortiseSeries/Premium%20Mortise%20Series',
              },
              {
                name: 'Orbit',
                path: '/Dashboard/ProductAdd/Locks/PremiumMortiseSeries/Orbit',
              },
              {
                name: 'Allure Rossette Series',
                path: '/Dashboard/ProductAdd/Locks/PremiumMortiseSeries/Allure%20Rossette%20Series',
              },
              {
                name: 'Combipack With240mm Euro Mortise Lock',
                path: '/Dashboard/ProductAdd/Locks/PremiumMortiseSeries/Combipack%20With240mm%20Euro%20Mortise%20Lock',
              },
              {
                name: 'Europrofile Brass Handle Set240mm',
                path: '/Dashboard/ProductAdd/Locks/PremiumMortiseSeries/Europrofile%20Brass%20Handle%20Set240mm',
              },
              {
                name: 'Evva3 K S Regalis Mortise',
                path: '/Dashboard/ProductAdd/Locks/PremiumMortiseSeries/Evva3%20K%20S%20Regalis%20Mortise',
              },
              {
                name: 'Mercury',
                path: '/Dashboard/ProductAdd/Locks/PremiumMortiseSeries/Mercury',
              },
            ],
          },
          {
            name: 'Rim Locks',
            subItemsNameComponent: [
              {
                name: 'Ultra X L Tribolt',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Ultra%20X%20L%20Tribolt',
              },
              {
                name: 'Ultra X L Twinbolt',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Ultra%20X%20L%20Twinbolt',
              },
              {
                name: 'Ultra X L Vertibolt',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Ultra%20X%20L%20Vertibolt',
              },
              {
                name: 'Ultra X L Rim Deadbolt',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Ultra%20X%20L%20Rim%20Deadbolt',
              },
              {
                name: 'Ultra Latchbolt Carton',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Ultra%20Latchbolt%20Carton',
              },
              {
                name: 'Ultra Retrofit Adaptor',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Ultra%20Retrofit%20Adaptor',
              },
              {
                name: 'Ultra Tribolt',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Ultra%20Tribolt',
              },
              {
                name: 'Ultra Vertibolt',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Ultra%20Vertibolt',
              },
              {
                name: 'Rim Locks',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Rim%20Locks',
              },
              {
                name: 'E X S Altrix',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/E%20X%20S%20Altrix',
              },
              {
                name: 'E X S Astro',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/E%20X%20S%20Astro',
              },
              {
                name: 'Night Latch7 Lever',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Night%20Latch7%20Lever',
              },
              {
                name: 'Pentabolt Aries',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Pentabolt%20Aries',
              },
              {
                name: 'Pin Cylinder Rim Locks',
                path: '/Dashboard/ProductAdd/Locks/RimLocks/Pin%20Cylinder%20Rim%20Locks',
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
                path: '/Dashboard/ProductAdd/Paint/Emulsion/WallTexture',
              },
              {
                name: 'Tile Guard',
                path: '/Dashboard/ProductAdd/Paint/Emulsion/TileGuard',
              },
              {
                name: 'Exterior Emulsion',
                path: '/Dashboard/ProductAdd/Paint/Emulsion/ExteriorEmulsion',
              },
              {
                name: 'Interior Emulsion',
                path: '/Dashboard/ProductAdd/Paint/Emulsion/InteriorEmulsion',
              },
            ],
          },
          {
            name: 'ENAMEL',
            subItemsNameComponent: [
              {
                name: 'Synthetic Enamel',
                path: '/Dashboard/ProductAdd/Paint/Enamel/SyntheticEnamel',
              },
              {
                name: 'Satin Enamel',
                path: '/Dashboard/ProductAdd/Paint/Enamel/SatinEnamel',
              },
              {
                name: 'Gloss Enamel',
                path: '/Dashboard/ProductAdd/Paint/Enamel/GlossEnamel',
              },
            ],
          },
          {
            name: 'DISTEMPER',
            subItemsNameComponent: [
              {
                name: 'Acrylic Distemper',
                path: '/Dashboard/ProductAdd/Paint/Distemper/AcrylicDistemper',
              },
              {
                name: 'Synthetic Distemper',
                path: '/Dashboard/ProductAdd/Paint/Distemper/SyntheticDistemper',
              },
            ],
          },
          {
            name: 'PRIMER',
            subItemsNameComponent: [
              {
                name: 'Wood Primer',
                path: '/Dashboard/ProductAdd/Paint/Primer/WoodPrimer',
              },
              {
                name: 'Solvent Primer',
                path: '/Dashboard/ProductAdd/Paint/Primer/SolventPrimer',
              },
              {
                name: 'Acrylic Primer',
                path: '/Dashboard/ProductAdd/Paint/Primer/AcrylicPrimer',
              },
              {
                name: 'Cement Primer',
                path: '/Dashboard/ProductAdd/Paint/Primer/CementPrimer',
              },
              {
                name: 'Exterior Primer',
                path: '/Dashboard/ProductAdd/Paint/Primer/ExteriorPrimer',
              },
              {
                name: 'Interior Primer',
                path: '/Dashboard/ProductAdd/Paint/Primer/InteriorPrimer',
              },
              {
                name: 'Metal Primer',
                path: '/Dashboard/ProductAdd/Paint/Primer/MetalPrimer',
              },
            ],
          },
          {
            name: 'STAINERS',
            subItemsNameComponent: [
              {
                name: 'Wood Stainers',
                path: '/Dashboard/ProductAdd/Paint/Stainers/WoodStainers',
              },
              {
                name: 'Universal Stainers',
                path: '/Dashboard/ProductAdd/Paint/Stainers/UniversalStainers',
              },
            ],
          },
          {
            name: 'Brushes & Rollers',
            subItemsNameComponent: [
              {
                name: 'Spray Paints',
                path: '/Dashboard/ProductAdd/Paint/Brushes Rollers/SprayPaints',
              },
              {
                name: 'Paint Brushes',
                path: '/Dashboard/ProductAdd/Paint/Brushes Rollers/PaintBrushes',
              },
              {
                name: 'Rollers',
                path: '/Dashboard/ProductAdd/Paint/Brushes Rollers/Rollers',
              },
            ],
          },
          {
            name: 'WATERPROOFING & FILLERS',
            subItemsNameComponent: [
              {
                name: 'Waterproof Basecoat',
                path: '/Dashboard/ProductAdd/Paint/Waterproofing/WaterproofBasecoat',
              },
              {
                name: 'Crack Fillers',
                path: '/Dashboard/ProductAdd/Paint/Waterproofing/CrackFillers',
              },
            ],
          },
          {
            name: 'PAINTING ACCESSORIES',
            subItemsNameComponent: [
              {
                name: 'Sandpaper Rolls',
                path: '/Dashboard/ProductAdd/Paint/Painting Accessories/SandpaperRolls',
              },
              {
                name: 'Stencils',
                path: '/Dashboard/ProductAdd/Paint/Painting Accessories/Stencils',
              },
              {
                name: 'Painting Tools',
                path: '/Dashboard/ProductAdd/Paint/Painting Accessories/PaintingTools',
              },
            ],
          },
          {
            name: 'WOOD FINISHES',
            subItemsNameComponent: [
              {
                name: 'Pu',
                path: '/Dashboard/ProductAdd/Paint/Wood Finishes/Pu',
              },
              {
                name: 'Sealer',
                path: '/Dashboard/ProductAdd/Paint/Wood Finishes/Sealer',
              },
              {
                name: 'Varnish Black Board Paint',
                path: '/Dashboard/ProductAdd/Paint/Wood Finishes/VarnishBlackBoardPaint',
              },
              {
                name: 'Wood Putty',
                path: '/Dashboard/ProductAdd/Paint/Wood Finishes/WoodPutty',
              },
              {
                name: 'Polish',
                path: '/Dashboard/ProductAdd/Paint/Wood Finishes/Polish',
              },
              {
                name: 'Glass Coatings',
                path: '/Dashboard/ProductAdd/Paint/Wood Finishes/GlassCoatings',
              },
              {
                name: 'Melamyne',
                path: '/Dashboard/ProductAdd/Paint/Wood Finishes/Melamyne',
              },
              {
                name: 'Nc',
                path: '/Dashboard/ProductAdd/Paint/Wood Finishes/Nc',
              },
            ],
          },
          {
            name: 'ADHESIVE & THINNER',
            subItemsNameComponent: [
              {
                name: 'Adhesive',
                path: '/Dashboard/ProductAdd/Paint/Adhesive Thinner/Adhesive',
              },
              {
                name: 'Thinner',
                path: '/Dashboard/ProductAdd/Paint/Adhesive Thinner/Thinner',
              },
            ],
          },
          {
            name: 'WALL PUTTY',
            subItemsNameComponent: [
              {
                name: 'Kpf Wall Putty',
                path: '/Dashboard/ProductAdd/Paint/Wall Putty/KpfWallPutty',
              },
              {
                name: 'Powder Wall Putty',
                path: '/Dashboard/ProductAdd/Paint/Wall Putty/PowderWallPutty',
              },
              {
                name: 'Acrylic Wall Putty',
                path: '/Dashboard/ProductAdd/Paint/Wall Putty/AcrylicWallPutty',
              },
            ],
          },
          {
            name: 'TOP BRANDS',
            subItemsNameComponent: [
              {
                name: 'Neroloc',
                path: '/Dashboard/ProductAdd/Paint/Top Brands/Neroloc',
              },
              {
                name: 'Dulux',
                path: '/Dashboard/ProductAdd/Paint/Top Brands/Dulux',
              },
              {
                name: 'Asian Paints',
                path: '/Dashboard/ProductAdd/Paint/Top Brands/AsianPaints',
              },
              {
                name: 'Gem Paints',
                path: '/Dashboard/ProductAdd/Paint/Top Brands/GemPaints',
              },
              {
                name: 'Jk Wall Putty',
                path: '/Dashboard/ProductAdd/Paint/Top Brands/JkWallPutty',
              },
              {
                name: 'Agsar Paints',
                path: '/Dashboard/ProductAdd/Paint/Top Brands/AgsarPaints',
              },
            ],
          },
          {
            name: 'Acrylic Emulsion Paint',
            path: '/Dashboard/ProductAdd/Paint/AcrylicEmulsionPaint',
          },
          {
            name: 'Aspa Paints',
            path: '/Dashboard/ProductAdd/Paint/AspaPaints',
          },
          {
            name: 'Exterior paints',
            path: '/Dashboard/ProductAdd/Paint/ExteriorPaints',
          },
          {
            name: 'Floor Paints',
            path: '/Dashboard/ProductAdd/Paint/FloorPaints',
          },
          {
            name: 'Industrial Coatings',
            path: '/Dashboard/ProductAdd/Paint/IndustrialCoatings',
          },
          {
            name: 'Interior Paints',
            path: '/Dashboard/ProductAdd/Paint/InteriorPaints',
          },
          {
            name: 'Painting Tools',
            path: '/Dashboard/ProductAdd/Paint/PaintingTools',
          },
          {
            name: 'Primer and Wall Putty',
            path: '/Dashboard/ProductAdd/Paint/PrimerAndWallPutty',
          },
          { name: 'Sanitizer', path: '/Dashboard/ProductAdd/Paint/Sanitizer' },
          {
            name: 'Spray Paints',
            path: '/Dashboard/ProductAdd/Paint/SprayPaints',
          },
          {
            name: 'Stainers&Thinners',
            path: '/Dashboard/ProductAdd/Paint/StainersThinners',
          },
          { name: 'Stencils', path: '/Dashboard/ProductAdd/Paint/Stencils' },
          {
            name: 'Tile Guard',
            path: '/Dashboard/ProductAdd/Paint/TileGuard',
          },
          {
            name: 'wall stickers and wallpapers',
            path: '/Dashboard/ProductAdd/Paint/WallStickersWallpapers',
          },
          {
            name: 'Wood & Metal',
            path: '/Dashboard/ProductAdd/Paint/WoodMetal',
          },
        ],
      },
      {
        name: 'Pipe',
        subItemsName: [
          {
            name: 'Supreme Pipe',
            path: '/Dashboard/ProductAdd/Pipe/SupremePipe',
          },
          { name: 'TSA Pipe', path: '/Dashboard/ProductAdd/Pipe/TSAPipe' },
          {
            name: 'Prince Pipe',
            path: '/Dashboard/ProductAdd/Pipe/PrincePipe',
          },
          { name: 'Birla Pipe', path: '/Dashboard/ProductAdd/Pipe/BirlaPipe' },
          { name: 'Tata Pipe', path: '/Dashboard/ProductAdd/Pipe/TataPipe' },
          {
            name: 'Prakash Pipe',
            path: '/Dashboard/ProductAdd/Pipe/PrakashPipe',
          },
          {
            name: 'Finolex Pipes',
            path: '/Dashboard/ProductAdd/Pipe/FinolexPipes',
          },
          {
            name: 'Ashirvad Pipes',
            path: '/Dashboard/ProductAdd/Pipe/AshirvadPipes',
          },
          {
            name: 'Astral Pipes',
            path: '/Dashboard/ProductAdd/Pipe/AstralPipes',
          },
        ],
      },
      {
        name: 'PVC Mats',
        subItemsName: [
          { name: 'Floor Mats', path: '/Dashboard/ProductAdd/PvcMats/Floor' },
          { name: 'Door Mats', path: '/Dashboard/ProductAdd/PvcMats/Door' },
        ],
      },
      {
        name: 'Roofer',
        subItemsName: [
          { name: 'Shingles', path: '/Dashboard/ProductAdd/Roofer/Shingles' },
          {
            name: 'Metal Roofing',
            path: '/Dashboard/ProductAdd/Roofer/Metal',
          },
        ],
      },
      {
        name: 'Sanitary Ware & faucets',
        subItemsName: [
          {
            name: 'Acrylic Products',
            path: '/Dashboard/ProductAdd/Sanitary/AcrylicProducts',
            subItemsNameComponent: [],
          },
          {
            name: 'Bathroom Accessories',
            path: '/Dashboard/ProductAdd/Sanitary/BathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Bathsense',
            subItemsNameComponent: [
              {
                name: 'Sanitaryware',
                path: '/Dashboard/ProductAdd/Sanitary/Bathsense/Sanitaryware',
              },
              {
                name: 'C Pfittings Faucets',
                path: '/Dashboard/ProductAdd/Sanitary/Bathsense/CPfittingsFaucets',
              },
            ],
          },
          {
            name: 'Closets',
            path: '/Dashboard/ProductAdd/Sanitary/Closets',
            subItemsNameComponent: [],
          },
          {
            name: 'Coral bath fixtures',
            subItemsNameComponent: [
              {
                name: 'Royale Series',
                path: '/Dashboard/ProductAdd/Sanitary/CoralBathFixtures/RoyaleSeries',
              },
              {
                name: 'Treemo Series',
                path: '/Dashboard/ProductAdd/Sanitary/CoralBathFixtures/TreemoSeries',
              },
              {
                name: 'Xrossa Series',
                path: '/Dashboard/ProductAdd/Sanitary/CoralBathFixtures/XrossaSeries',
              },
              {
                name: 'New Super Glow Series',
                path: '/Dashboard/ProductAdd/Sanitary/CoralBathFixtures/NewSuperGlowSeries',
              },
              {
                name: 'Eurosmart Series',
                path: '/Dashboard/ProductAdd/Sanitary/CoralBathFixtures/EurosmartSeries',
              },
              {
                name: 'Flowmore Series',
                path: '/Dashboard/ProductAdd/Sanitary/CoralBathFixtures/FlowmoreSeries',
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
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Ecco',
                  },
                  {
                    name: 'Keti',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Keti',
                  },
                  {
                    name: 'Qubix',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Qubix',
                  },
                  {
                    name: 'Square',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Square',
                  },
                  {
                    name: 'Supreme',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Supreme',
                  },
                  {
                    name: 'Dolphin',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Dolphin',
                  },
                  {
                    name: 'Acrylic Accessories',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/AcrylicAccessories',
                  },
                  {
                    name: 'Almond',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Almond',
                  },
                  {
                    name: 'Anglo',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Anglo',
                  },
                  {
                    name: 'Budget',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BATHROOMACCESSORIES/Budget',
                  },
                ],
              },
              {
                name: 'Bathroom Faucets',
                subItemsNameComponentName: [
                  {
                    name: 'Super',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Super',
                  },
                  {
                    name: 'Tri',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Tri',
                  },
                  {
                    name: 'Square S',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Square S',
                  },
                  {
                    name: 'Royal',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Royal',
                  },
                  {
                    name: 'Slimline',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Slimline',
                  },
                  {
                    name: 'Splash',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Splash',
                  },
                  {
                    name: 'Square F',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Square F',
                  },
                  {
                    name: 'Omega',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Omega',
                  },
                  {
                    name: 'Passion',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Passion',
                  },
                  {
                    name: 'Milano',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Milano',
                  },
                  {
                    name: 'Nano',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Nano',
                  },
                  {
                    name: 'Nexa',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Nexa',
                  },
                  {
                    name: 'Niagra',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Niagra',
                  },
                  {
                    name: 'Nice',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Nice',
                  },
                  {
                    name: 'Ket',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Ket',
                  },
                  {
                    name: 'Expert',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Expert',
                  },
                  {
                    name: 'Florence',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Florence',
                  },
                  {
                    name: 'Glass Bowl Faucet',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Glass Bowl Faucet',
                  },
                  {
                    name: 'Idea',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Idea',
                  },
                  {
                    name: 'Jazz',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Jazz',
                  },
                  {
                    name: 'Eeco',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Eeco',
                  },
                  {
                    name: 'Concept',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Concept',
                  },
                  {
                    name: 'Deluxe',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Deluxe',
                  },
                  {
                    name: 'Almond',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Almond',
                  },
                  {
                    name: 'Arrow',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Arrow',
                  },
                  {
                    name: 'Bold',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Bold',
                  },
                  {
                    name: 'Budget',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/BathroomFaucets/Budget',
                  },
                ],
              },
              {
                name: 'Kitchen',
                subItemsNameComponentName: [
                  {
                    name: 'Kitchen Sink',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/Kitchen/Kitchen Sink',
                  },
                  {
                    name: 'Kitchen Faucets',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/Kitchen/Kitchen Faucets',
                  },
                ],
              },
              {
                name: 'Showers',
                subItemsNameComponentName: [
                  {
                    name: 'Hand Showers',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Showers/Hand Showers',
                  },
                  {
                    name: 'Overhead Showers',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Showers/Overhead Showers',
                  },
                  {
                    name: 'Rainfall Showers',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Showers/Rainfall Showers',
                  },
                  {
                    name: 'Shower Arms',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Showers/Shower Arms',
                  },
                ],
              },

              {
                name: 'Other Useful Items',
                subItemsNameComponentName: [
                  {
                    name: 'Mouth Operated',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Mouth Operated',
                  },
                  {
                    name: 'Pressmatic Push Cock',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Pressmatic Push Cock',
                  },
                  {
                    name: 'Sensor Taps',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Sensor Taps',
                  },
                  {
                    name: 'Soap Dispenser',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Soap Dispenser',
                  },
                  {
                    name: 'Mini Angle Cock',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Mini Angle Cock',
                  },
                  {
                    name: 'Ball Valves',
                    path: '/Dashboard/ProductAdd/Sanitary/Corsa/OtherUsefulItems/Ball Valves',
                  },
                ],
              },
              {
                name: 'Flushing Cistern',
                path: '/Dashboard/ProductAdd/Sanitary/Corsa/FlushingCistern',
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
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Showers/Hand Showers',
                  },
                  {
                    name: 'Overhead Showers',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Showers/Overhead Showers',
                  },
                  {
                    name: 'Rainfall Showers',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Showers/Rainfall Showers',
                  },
                  {
                    name: 'Shower Arms',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Showers/Shower Arms',
                  },
                ],
              },
              {
                name: 'Accessories',
                subItemsNameComponent: [
                  {
                    name: 'Series8 B Series',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Accessories/Series8 B Series',
                  },
                  {
                    name: 'Series7 Deon',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Accessories/Series7 Deon',
                  },
                  {
                    name: 'Series2 Swing',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Accessories/Series2 Swing',
                  },
                  {
                    name: 'Series3 Tarim',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Accessories/Series3 Tarim',
                  },
                  {
                    name: 'Series5 Hotelier Series',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Accessories/Series5 Hotelier Series',
                  },
                  {
                    name: 'Series6 Cruzo',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Accessories/Series6 Cruzo',
                  },
                  {
                    name: 'Series1 Croma',
                    path: '/Dashboard/ProductAdd/Sanitary/Essess/Accessories/Series1 Croma',
                  },
                ],
              },
              {
                name: 'Trand',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Trand',
              },
              {
                name: 'Tarim',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Tarim',
              },
              {
                name: 'Lab Taps',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Lab Taps',
              },
              {
                name: 'New Dune',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/New Dune',
              },
              {
                name: 'New Xess',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/New Xess',
              },
              {
                name: 'Quadra',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Quadra',
              },
              {
                name: 'Sensors',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Sensors',
              },
              {
                name: 'Hotelier Series',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Hotelier Series',
              },
              {
                name: 'Deon',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Deon',
              },
              {
                name: 'Echo',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Echo',
              },
              {
                name: 'Essentials',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Essentials',
              },
              {
                name: 'H S03',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/H S03',
              },
              {
                name: 'D Series',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/D Series',
              },
              {
                name: 'Auto Close Taps',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Auto Close Taps',
              },
              {
                name: 'Celato',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Celato',
              },
              {
                name: 'Croma',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Croma',
              },
              {
                name: 'Cruzo',
                path: '/Dashboard/ProductAdd/Sanitary/Essess/Cruzo',
              },
            ],
          },
          {
            name: 'Faucets',
            path: '/Dashboard/ProductAdd/Sanitary/Faucets',
            subItemsNameComponent: [],
          },
          {
            name: 'Hardware & Bathroom Accessories',
            path: '/Dashboard/ProductAdd/Sanitary/HardwareBathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Health Faucet',
            path: '/Dashboard/ProductAdd/Sanitary/HealthFaucet',
            subItemsNameComponent: [],
          },
          {
            name: 'Hindware',
            subItemsNameComponent: [
              {
                name: 'Wash Basins',
                path: '/Dashboard/ProductAdd/Sanitary/Hindware/WashBasins',
              },
              {
                name: 'Water Closets',
                path: '/Dashboard/ProductAdd/Sanitary/Hindware/WaterClosets',
              },
              {
                name: 'Showers',
                path: '/Dashboard/ProductAdd/Sanitary/Hindware/Showers',
              },
              {
                name: 'Add On',
                path: '/Dashboard/ProductAdd/Sanitary/Hindware/AddOn',
              },
              {
                name: 'Bath Tub',
                path: '/Dashboard/ProductAdd/Sanitary/Hindware/BathTub',
              },
              {
                name: 'Cisterns',
                path: '/Dashboard/ProductAdd/Sanitary/Hindware/Cisterns',
              },
              {
                name: 'Faucets',
                path: '/Dashboard/ProductAdd/Sanitary/Hindware/Faucets',
              },
            ],
          },
          {
            name: 'Jaquar',
            path: '/Dashboard/ProductAdd/Sanitary/Jaquar',
            subItemsNameComponent: [],
          },
          {
            name: 'Kitchen Sinks',
            path: '/Dashboard/ProductAdd/Sanitary/KitchenSinks',
            subItemsNameComponent: [],
          },
          {
            name: 'LEMON Bathroom Accessories',
            path: '/Dashboard/ProductAdd/Sanitary/LemonBathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Leo Bath Fittings',
            subItemsNameComponent: [
              {
                name: 'Valve',
                path: '/Dashboard/ProductAdd/Sanitary/Leo Bath Fittings/Valve',
              },
              {
                name: 'Bathroom Accessories',
                path: '/Dashboard/ProductAdd/Sanitary/Leo Bath Fittings/BathroomAccessories',
              },
              {
                name: 'Faucets',
                path: '/Dashboard/ProductAdd/Sanitary/Leo Bath Fittings/Faucets',
              },
            ],
          },
          {
            name: 'Pamay',
            subItemsNameComponent: [
              {
                name: 'Showers',
                path: '/Dashboard/ProductAdd/Sanitary/Pamay/Showers',
              },
              {
                name: 'Faucets',
                path: '/Dashboard/ProductAdd/Sanitary/Pamay/Faucets',
              },
            ],
          },
          {
            name: 'Parryware',
            subItemsNameComponent: [
              {
                name: 'Water Heaters',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/WaterHeaters',
              },
              {
                name: 'Waste Coupling',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/WasteCoupling',
              },
              {
                name: 'Wash Basins',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/WashBasins',
              },
              {
                name: 'Utsav Range',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/UtsavRange',
              },
              {
                name: 'Shower Panels',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/ShowerPanels',
              },
              {
                name: 'Shower Enclosures',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/ShowerEnclosures',
              },
              {
                name: 'Semi Recessed Basins',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/SemiRecessedBasins',
              },
              {
                name: 'Seat Covers',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/SeatCovers',
              },
              {
                name: 'Push Plates',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/PushPlates',
              },
              {
                name: 'Polymer Cisterns',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/PolymerCisterns',
              },
              {
                name: 'F A U C E T S',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/FAUCETS',
              },
              {
                name: 'European Water Closet',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/EuropeanWaterCloset',
              },
              {
                name: 'Concealed Cistern',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/ConcealedCistern',
              },
              {
                name: 'CLOSETS',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/CLOSETS',
              },
              {
                name: 'Bowl Basins',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/BowlBasins',
              },
              {
                name: 'Below Counter Basins',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/BelowCounterBasins',
              },
              {
                name: 'Angle Valves',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/AngleValves',
              },
              {
                name: 'Accessories',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/Accessories',
              },
              {
                name: 'Showers',
                path: '/Dashboard/ProductAdd/Sanitary/Parryware/Showers',
              },
            ],
          },
          {
            name: 'Pearl Precious Products',
            path: '/Dashboard/ProductAdd/Sanitary/PearlPreciousProducts',
            subItemsNameComponent: [],
          },
          {
            name: 'Showers',
            path: '/Dashboard/ProductAdd/Sanitary/Showers',
            subItemsNameComponent: [],
          },
          {
            name: 'Taps',
            path: '/Dashboard/ProductAdd/Sanitary/Taps',
            subItemsNameComponent: [],
          },
          {
            name: 'Washbasins',
            path: '/Dashboard/ProductAdd/Sanitary/Washbasins',
            subItemsNameComponent: [],
          },
          {
            name: 'Waterman',
            subItemsNameComponent: [
              {
                name: 'Wall Showers Without Arm',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/WallShowersWithoutArm',
              },
              {
                name: 'Wall Showers With Arm',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/WallShowersWithArm',
              },
              {
                name: 'Shower Tubes',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/ShowerTubes',
              },
              {
                name: 'Roman',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Roman',
              },
              {
                name: 'Rain Showers',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/RainShowers',
              },
              {
                name: 'Ikon',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Ikon',
              },
              {
                name: 'Evoque',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Evoque',
              },
              {
                name: 'Health Faucet Abs',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/HealthFaucetAbs',
              },
              {
                name: 'Health Faucets Brass',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/HealthFaucetsBrass',
              },
              {
                name: 'Eco',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Eco',
              },
              {
                name: 'Aura',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Aura',
              },
              {
                name: 'Dell',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Dell',
              },
              {
                name: 'Deluxe',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Deluxe',
              },
              {
                name: 'Aria',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Aria',
              },
              {
                name: 'Accessories',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Accessories',
              },
            ],
          },
          {
            name: 'Water Tec',
            subItemsNameComponent: [
              {
                name: 'Taps',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Taps',
              },
              {
                name: 'Toilet Seat Covers',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/ToiletSeatCovers',
              },
              {
                name: 'Valves',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Valves',
              },
              {
                name: 'T Series Alt',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/TSeriesAlt',
              },
              {
                name: 'Health Faucets',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/HealthFaucets',
              },
              {
                name: 'Quattro',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Quattro',
              },
              {
                name: 'Showers',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Showers',
              },
              {
                name: 'T Series',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/TSeries',
              },
              {
                name: 'Concealed Cistern',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/ConcealedCistern',
              },
              {
                name: 'Connection Tube',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/ConnectionTube',
              },
              {
                name: 'Ebony',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Ebony',
              },
              {
                name: 'Eco',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Eco',
              },
              {
                name: 'Eva',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Eva',
              },
              {
                name: 'Flora',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Flora',
              },
              {
                name: 'Bathroom Accessories',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/BathroomAccessories',
              },
              {
                name: 'Cistern',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Cistern',
              },
              {
                name: 'Allied',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Allied',
              },
              {
                name: 'Aqua',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Aqua',
              },
              {
                name: 'Aspire',
                path: '/Dashboard/ProductAdd/Sanitary/Water Tec/Aspire',
              },
            ],
          },
          {
            name: 'Waterman',
            subItemsNameComponent: [
              {
                name: 'Wall Showers Without Arm',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/WallShowersWithoutArm',
              },
              {
                name: 'Wall Showers With Arm',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/WallShowersWithArm',
              },
              {
                name: 'Shower Tubes',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/ShowerTubes',
              },
              {
                name: 'Roman',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Roman',
              },
              {
                name: 'Rain Showers',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/RainShowers',
              },
              {
                name: 'Ikon',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Ikon',
              },
              {
                name: 'Evoque',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Evoque',
              },
              {
                name: 'Hand Showers',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/HandShowers',
              },
              {
                name: 'Health Faucet Abs',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/HealthFaucetAbs',
              },
              {
                name: 'Health Faucets Brass',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/HealthFaucetsBrass',
              },
              {
                name: 'Eco',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Eco',
              },
              {
                name: 'Aura',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Aura',
              },
              {
                name: 'Dell',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Dell',
              },
              {
                name: 'Deluxe',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Deluxe',
              },
              {
                name: 'Aria',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Aria',
              },
              {
                name: 'Accessories',
                path: '/Dashboard/ProductAdd/Sanitary/Waterman/Accessories',
              },
            ],
          },
          {
            name: 'Pearl Precious Products',
            subItemsNameComponent: [
              {
                name: 'Edge',
                path: '/Dashboard/ProductAdd/Sanitary/Pearl Precious Products/Edge',
              },
            ],
          },
          {
            name: 'Coral Bath Fixtures',
            subItemsNameComponent: [
              {
                name: 'Royale Series',
                path: '/Dashboard/ProductAdd/Sanitary/Coral bath fixtures/RoyaleSeries',
              },
              {
                name: 'Treemo Series',
                path: '/Dashboard/ProductAdd/Sanitary/Coral bath fixtures/TreemoSeries',
              },
              {
                name: 'Xrossa Series',
                path: '/Dashboard/ProductAdd/Sanitary/Coral bath fixtures/XrossaSeries',
              },
              {
                name: 'New Super Glow Series',
                path: '/Dashboard/ProductAdd/Sanitary/Coral bath fixtures/NewSuperGlowSeries',
              },
              {
                name: 'Eurosmart Series',
                path: '/Dashboard/ProductAdd/Sanitary/Coral bath fixtures/EurosmartSeries',
              },
              {
                name: 'Flowmore Series',
                path: '/Dashboard/ProductAdd/Sanitary/Coral bath fixtures/FlowmoreSeries',
              },
            ],
          },
        ],
      },
      {
        name: 'Tools',
        subItemsName: [
          {
            name: 'abrasives',
            path: '/Dashboard/ProductAdd/Tools/abrasives',
            subItemsNameComponent: [
              {
                name: 'Cut Off Wheel',
                path: '/Dashboard/ProductAdd/Tools/abrasives/CutOffWheel',
              },
              {
                name: 'Diamond Blades',
                path: '/Dashboard/ProductAdd/Tools/DiamondBlades',
              },
            ],
          },
          {
            name: 'Allen Keys',
            path: '/Dashboard/ProductAdd/Tools/AllenKeys',
            subItemsNameComponent: [],
          },
          {
            name: 'Brush',
            path: '/Dashboard/ProductAdd/Tools/Brush',
            subItemsNameComponent: [],
          },
          {
            name: 'Carpenter Pincer',
            path: '/Dashboard/ProductAdd/Tools/CarpenterPincer',
            subItemsNameComponent: [],
          },
          {
            name: 'Centre Punches',
            path: '/Dashboard/ProductAdd/Tools/CentrePunches',
            subItemsNameComponent: [],
          },
          {
            name: 'Chisels',
            path: '/Dashboard/ProductAdd/Tools/Chisels',
            subItemsNameComponent: [],
          },
          {
            name: 'Clamps',
            path: '/Dashboard/ProductAdd/Tools/Clamps',
            subItemsNameComponent: [],
          },
          {
            name: 'Crowbar',
            path: '/Dashboard/ProductAdd/Tools/Crowbar',
            subItemsNameComponent: [],
          },
          {
            name: 'Cutters',
            path: '/Dashboard/ProductAdd/Tools/Cutters',
            subItemsNameComponent: [],
          },
          {
            name: 'files',
            path: '/Dashboard/ProductAdd/Tools/files',
            subItemsNameComponent: [],
          },
          {
            name: 'Garden Tools',
            path: '/Dashboard/ProductAdd/Tools/GardenTools',
            subItemsNameComponent: [],
          },
          {
            name: 'Gear Pullers',
            path: '/Dashboard/ProductAdd/Tools/GearPullers',
            subItemsNameComponent: [],
          },
          {
            name: 'Glass cutter',
            path: '/Dashboard/ProductAdd/Tools/GlassCutter',
            subItemsNameComponent: [],
          },
          {
            name: 'glue gun',
            path: '/Dashboard/ProductAdd/Tools/gluegun',
            subItemsNameComponent: [],
          },
          {
            name: 'Grease Gun',
            path: '/Dashboard/ProductAdd/Tools/GreaseGun',
            subItemsNameComponent: [],
          },
          {
            name: 'Hacksaw Blades',
            path: '/Dashboard/ProductAdd/Tools/HacksawBlades',
            subItemsNameComponent: [],
          },
          {
            name: 'Hammer',
            path: '/Dashboard/ProductAdd/Tools/Hammer',
            subItemsNameComponent: [],
          },
          {
            name: 'Hammer Drills',
            path: '/Dashboard/ProductAdd/Tools/HammerDrills',
            subItemsNameComponent: [],
          },
          {
            name: 'hand tools',
            path: '/Dashboard/ProductAdd/Tools/handtools',
            subItemsNameComponent: [],
          },
          {
            name: 'level',
            path: '/Dashboard/ProductAdd/Tools/level',
            subItemsNameComponent: [],
          },
          {
            name: 'Lubrications',
            path: '/Dashboard/ProductAdd/Tools/Lubrications',
            subItemsNameComponent: [],
          },
          {
            name: 'Measurement Scale',
            path: '/Dashboard/ProductAdd/Tools/MeasurementScale',
            subItemsNameComponent: [],
          },
          {
            name: 'Measuring Tape',
            path: '/Dashboard/ProductAdd/Tools/MeasuringTape',
            subItemsNameComponent: [],
          },
          {
            name: 'Multimeter',
            path: '/Dashboard/ProductAdd/Tools/Multimeter',
            subItemsNameComponent: [],
          },
          {
            name: 'Plier',
            path: '/Dashboard/ProductAdd/Tools/Plier',
            subItemsNameComponent: [],
          },
          {
            name: 'Polishing Accessories',
            path: '/Dashboard/ProductAdd/Tools/PolishingAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Power Tools',
            subItemsNameComponent: [
              {
                name: 'Drill',
                path: '/Dashboard/ProductAdd/Tools/PowerTools/Drill',
              },
              {
                name: 'Grinders',
                path: '/Dashboard/ProductAdd/Tools/PowerTools/Grinders',
              },
              {
                name: 'Marble Cutter',
                path: '/Dashboard/ProductAdd/Tools/PowerTools/MarbleCutter',
              },
            ],
          },
          {
            name: 'Saw',
            path: '/Dashboard/ProductAdd/Tools/saw',
            subItemsNameComponent: [],
          },
          {
            name: 'Screw Driver',
            path: '/Dashboard/ProductAdd/Tools/ScrewDriver',
            subItemsNameComponent: [],
          },
          {
            name: 'Silicon Gun',
            path: '/Dashboard/ProductAdd/Tools/SiliconGun',
            subItemsNameComponent: [],
          },
          {
            name: 'Socket set',
            path: '/Dashboard/ProductAdd/Tools/Socketset',
            subItemsNameComponent: [],
          },
          {
            name: 'Spanners',
            path: '/Dashboard/ProductAdd/Tools/Spanners',
            subItemsNameComponent: [],
          },
          {
            name: 'Spare Malets',
            path: '/Dashboard/ProductAdd/Tools/SpareMalets',
            subItemsNameComponent: [],
          },
          {
            name: 'Tool Compartments',
            path: '/Dashboard/ProductAdd/Tools/ToolCompartments',
            subItemsNameComponent: [],
          },
          {
            name: 'toolkit set',
            path: '/Dashboard/ProductAdd/Tools/toolkitset',
            subItemsNameComponent: [],
          },
          {
            name: 'various tool bits',
            path: '/Dashboard/ProductAdd/Tools/varioustoolbits',
            subItemsNameComponent: [],
          },
          {
            name: 'wood chisel',
            path: '/Dashboard/ProductAdd/Tools/woodChisel',
            subItemsNameComponent: [],
          },
          {
            name: 'wood items',
            path: '/Dashboard/ProductAdd/Tools/woodItems',
            subItemsNameComponent: [],
          },
          {
            name: 'Wrench',
            path: '/Dashboard/ProductAdd/Tools/Wrench',
            subItemsNameComponent: [],
          },
        ],
      },
      { name: 'Uncategorized', path: '/Dashboard/ProductAdd/Uncategorized' },
      {
        name: 'WaterProofing',
        subItemsName: [
          {
            name: 'Bathrooms',
            path: '/Dashboard/ProductAdd/WaterProofing/Bathrooms',
            subItemsNameComponent: [],
          },
          {
            name: 'Cracks & Joints',
            path: '/Dashboard/ProductAdd/WaterProofing/CracksJoints',
            subItemsNameComponent: [],
          },
          {
            name: 'Interiors',
            path: '/Dashboard/ProductAdd/WaterProofing/Interiors',
            subItemsNameComponent: [],
          },
        ],
      },
    ],
  },
  {
    name: 'Product List',
    subItems: [
      { name: 'Adhesives', path: '/Dashboard/ProductList/Adhesives' },
      { name: 'Brush', path: '/Dashboard/ProductList/Brush' },
      { name: 'Cements & POP', path: '/Dashboard/ProductList/Cements' },
      { name: 'Cleaning', path: '/Dashboard/ProductList/Cleaning' },
      { name: 'Dry Wall Gypsum Screws', path: '/Dashboard/ProductList/Dry' },
      {
        name: 'Electrical Item',
        subItemsName: [
          {
            name: 'Adaptors',
            path: '/Dashboard/ProductList/Electrical/Adaptors',
          },
          {
            name: 'Ceiling Roses',
            path: '/Dashboard/ProductList/Electrical/CeilingRoses',
          },
          { name: 'Dimmer', path: '/Dashboard/ProductList/Electrical/Dimmer' },
          {
            name: 'Distribution Boards',
            path: '/Dashboard/ProductList/Electrical/DistributionBoards',
          },
          {
            name: 'Door Bells',
            path: '/Dashboard/ProductList/Electrical/DoorBells',
          },
          {
            name: 'DP-switch',
            path: '/Dashboard/ProductList/Electrical/DPswitch',
          },
          {
            name: 'Earthing Accessories',
            path: '/Dashboard/ProductList/Electrical/EarthingAccessories',
          },
          {
            name: 'ELCBs OR RCCBs',
            path: '/Dashboard/ProductList/Electrical/ELCBsRCCBs',
          },
          {
            name: 'Electrical Fittings',
            path: '/Dashboard/ProductList/Electrical/ElectricalFittings',
            subItemsNameComponent: [
              {
                name: 'Accessories',
                path: '/Dashboard/ProductList/Electrical/ElectricalFittings/Accessories',
              },
              {
                name: 'Circular Deep Box',
                path: '/Dashboard/ProductList/Electrical/ElectricalFittings/CircularDeepBox',
              },
              {
                name: 'Circular surface box',
                path: '/Dashboard/ProductList/Electrical/ElectricalFittings/CircularSurfaceBox',
              },
              {
                name: 'Rigid type',
                path: '/Dashboard/ProductList/Electrical/ElectricalFittings/RigidType',
              },
            ],
          },
          {
            name: 'Fans',
            path: '/Dashboard/ProductList/Electrical/Fans',
            subItemsNameComponent: [
              {
                name: 'Cabin Fans',
                path: '/Dashboard/ProductList/Electrical/Fans/CabinFans',
              },
              {
                name: 'Ceiling Fans',
                path: '/Dashboard/ProductList/Electrical/Fans/CeilingFans',
              },
              {
                name: 'Pedestal Fans',
                path: '/Dashboard/ProductList/Electrical/Fans/PedestalFans',
              },
              {
                name: 'Table Fans',
                path: '/Dashboard/ProductList/Electrical/Fans/TableFans',
              },
              {
                name: 'Ventilation/Exhaust Fans',
                path: '/Dashboard/ProductList/Electrical/Fans/VentilationExhaustFans',
              },
              {
                name: 'Wall Mounting Fans',
                path: '/Dashboard/ProductList/Electrical/Fans/WallMountingFans',
              },
            ],
          },
          {
            name: 'Flexible Conduit',
            path: '/Dashboard/ProductList/Electrical/FlexibleConduit',
          },
          {
            name: 'Flexible Wires',
            path: '/Dashboard/ProductList/Electrical/FlexibleWires',
          },
          {
            name: 'Fuse Carriers',
            path: '/Dashboard/ProductList/Electrical/FuseCarriers',
          },
          {
            name: 'Holders',
            path: '/Dashboard/ProductList/Electrical/Holders',
          },
          {
            name: 'Indicator',
            path: '/Dashboard/ProductList/Electrical/Indicator',
          },
          {
            name: 'Insulation Tapes',
            path: '/Dashboard/ProductList/Electrical/InsulationTapes',
          },
          {
            name: 'Isolators',
            path: '/Dashboard/ProductList/Electrical/Isolators',
          },
          { name: 'Jacks', path: '/Dashboard/ProductList/Electrical/Jacks' },
          {
            name: 'KIT KAT Fuses',
            path: '/Dashboard/ProductList/Electrical/KITKATFuses',
          },
          {
            name: 'Lights',
            path: '/Dashboard/ProductList/Electrical/Lights',
            subItemsNameComponent: [
              {
                name: 'Ceiling light',
                path: '/Dashboard/ProductList/Electrical/Lights/CeilingLight',
              },
              {
                name: 'CFL',
                path: '/Dashboard/ProductList/Electrical/Lights/CFL',
              },
              {
                name: 'Desklight',
                path: '/Dashboard/ProductList/Electrical/Lights/Desklight',
              },
              {
                name: 'Focus Light',
                path: '/Dashboard/ProductList/Electrical/Lights/FocusLight',
              },
              {
                name: 'Garden Light',
                path: '/Dashboard/ProductList/Electrical/Lights/GardenLight',
              },
              {
                name: 'Gate Light',
                path: '/Dashboard/ProductList/Electrical/Lights/GateLight',
              },
              {
                name: 'GLS',
                path: '/Dashboard/ProductList/Electrical/Lights/GLS',
              },
              {
                name: 'Home',
                path: '/Dashboard/ProductList/Electrical/Lights/Home',
              },
              {
                name: 'Lamps',
                path: '/Dashboard/ProductList/Electrical/Lights/Lamps',
              },
              {
                name: 'LED Batten',
                path: '/Dashboard/ProductList/Electrical/Lights/LEDBatten',
              },
              {
                name: 'LED Bulbs',
                path: '/Dashboard/ProductList/Electrical/Lights/LEDBulbs',
              },
              {
                name: 'Led DownLighters/Spot Light',
                path: '/Dashboard/ProductList/Electrical/Lights/LedDownLightersSpotLight',
              },
              {
                name: 'LED Luminaires',
                path: '/Dashboard/ProductList/Electrical/Lights/LEDLuminaires',
              },
              {
                name: 'LED Panel Light',
                path: '/Dashboard/ProductList/Electrical/Lights/LEDPanelLight',
              },
              {
                name: 'LED Spotlight',
                path: '/Dashboard/ProductList/Electrical/Lights/LEDSpotlight',
              },
              {
                name: 'LED Street Light',
                path: '/Dashboard/ProductList/Electrical/Lights/LEDStreetLight',
              },
              {
                name: 'LED Strips',
                path: '/Dashboard/ProductList/Electrical/Lights/LEDStrips',
              },
              {
                name: 'Led Surface Light',
                path: '/Dashboard/ProductList/Electrical/Lights/LedSurfaceLight',
              },
              {
                name: 'Light Electronics',
                path: '/Dashboard/ProductList/Electrical/Lights/LightElectronics',
              },
              {
                name: 'Mirror Light',
                path: '/Dashboard/ProductList/Electrical/Lights/MirrorLight',
              },
              {
                name: 'Reflectors',
                path: '/Dashboard/ProductList/Electrical/Lights/Reflectors',
              },
              {
                name: 'Standard Incandescent',
                path: '/Dashboard/ProductList/Electrical/Lights/StandardIncandescent',
              },
              {
                name: 'T Bulb',
                path: '/Dashboard/ProductList/Electrical/Lights/TBulb',
              },
              {
                name: 'Tube Light',
                path: '/Dashboard/ProductList/Electrical/Lights/TubeLight',
              },
              {
                name: 'Under Water Lights',
                path: '/Dashboard/ProductList/Electrical/Lights/UnderWaterLights',
              },
              {
                name: 'Wall Light',
                path: '/Dashboard/ProductList/Electrical/Lights/WallLight',
              },
            ],
          },
          {
            name: 'Main Switch',
            path: '/Dashboard/ProductList/Electrical/MainSwitch',
          },
          { name: 'MCB', path: '/Dashboard/ProductList/Electrical/MCB' },
          {
            name: 'Modular/Surface Box',
            path: '/Dashboard/ProductList/Electrical/ModularSurfaceBox',
          },
          {
            name: 'Motor Starters',
            path: '/Dashboard/ProductList/Electrical/MotorStarters',
          },
          { name: 'Motors', path: '/Dashboard/ProductList/Electrical/Motors' },
          { name: 'Others', path: '/Dashboard/ProductList/Electrical/Others' },
          { name: 'Pin top', path: '/Dashboard/ProductList/Electrical/PinTop' },
          { name: 'Plug', path: '/Dashboard/ProductList/Electrical/Plug' },
          {
            name: 'Power Strips',
            path: '/Dashboard/ProductList/Electrical/PowerStrips',
          },
          {
            name: 'PVC Clips',
            path: '/Dashboard/ProductList/Electrical/PVCClips',
          },
          {
            name: 'Regulators',
            path: '/Dashboard/ProductList/Electrical/Regulators',
          },
          {
            name: 'Rotary Switch',
            path: '/Dashboard/ProductList/Electrical/RotarySwitch',
          },
          {
            name: 'Sockets',
            path: '/Dashboard/ProductList/Electrical/Sockets',
          },
          {
            name: 'Switch & Socket',
            path: '/Dashboard/ProductList/Electrical/SwitchAndSocket',
          },
          {
            name: 'Switch Plates',
            path: '/Dashboard/ProductList/Electrical/SwitchPlates',
          },
          {
            name: 'Switches',
            path: '/Dashboard/ProductList/Electrical/Switches',
          },
          {
            name: 'Travel adaptor',
            path: '/Dashboard/ProductList/Electrical/TravelAdaptor',
          },
          {
            name: 'TV outlets',
            path: '/Dashboard/ProductList/Electrical/TVOutlets',
          },
          {
            name: 'Uni Switch Socket Combined Units',
            path: '/Dashboard/ProductList/Electrical/UniSwitch',
          },
          {
            name: 'Water Heater',
            path: '/Dashboard/ProductList/Electrical/Water Heater',
          },
          {
            name: 'Water Heaters',
            path: '/Dashboard/ProductList/Electrical/WaterHeaters',
          },
          {
            name: 'Wires & Cables',
            path: '/Dashboard/ProductList/Electrical/WiresAndCables',
          },
        ],
      },
      { name: 'Electrical Fitting', path: '/Dashboard/ProductList/Fitting' },
      { name: 'Fiber Sheet', path: '/Dashboard/ProductList/Fiber' },
      { name: 'Hardware', path: '/Dashboard/ProductList/Hardware' },
      { name: 'Home', path: '/Dashboard/ProductList/Home' },
      { name: 'Home Decor', path: '/Dashboard/ProductList/HomeDecor' },
      { name: 'House Hold Ladder', path: '/Dashboard/ProductList/HouseHold' },
      { name: 'Lighting', path: '/Dashboard/ProductList/Lighting' },
      {
        name: 'Locks & accessories',
        subItemsName: [
          {
            name: 'DOOR ACCESSORIES',
            subItemsNameComponent: [
              {
                name: 'Aluminium Tower Bolt',
                path: '/Dashboard/ProductList/Hardware/Locks/DoorAccessories/AluminiumTowerBolt',
              },
              {
                name: 'Ball Bearing Door Hinges',
                path: '/Dashboard/ProductList/Hardware/Locks/DoorAccessories/BallBearingDoorHinges',
              },
              {
                name: 'Concealed Hinges',
                path: '/Dashboard/ProductList/Hardware/Locks/DoorAccessories/ConcealedHinges',
              },
              {
                name: 'Door Eye',
                path: '/Dashboard/ProductList/Hardware/Locks/DoorAccessories/DoorEye',
              },
              {
                name: 'Door Stopper',
                path: '/Dashboard/ProductList/Hardware/Locks/DoorAccessories/DoorStopper',
              },
              {
                name: 'HINGES',
                path: '/Dashboard/ProductList/Hardware/Locks/DoorAccessories/HINGES',
              },
              {
                name: 'Magnetic Door Stoppers',
                path: '/Dashboard/ProductList/Hardware/Locks/DoorAccessories/MagneticDoorStoppers',
              },
              {
                name: 'Wooden Sliding Door Fittings',
                path: '/Dashboard/ProductList/Hardware/Locks/DoorAccessories/WoodenSlidingDoorFittings',
              },
            ],
          },
          {
            name: 'DOOR CONTROLS',
            subItemsNameComponent: [
              {
                name: 'Door Closers',
                path: '/Dashboard/ProductList/Locks/DoorControls/Door%20Closers',
              },
              {
                name: 'Door Stopper',
                path: '/Dashboard/ProductList/Locks/DoorControls/Door%20Stopper',
              },
              {
                name: 'Hydraulic Door Closers',
                path: '/Dashboard/ProductList/Locks/DoorControls/Hydraulic%20Door%20Closers',
              },
            ],
          },
          {
            name: 'DOOR HANDLES',
            subItemsNameComponent: [
              {
                name: 'Door King',
                path: '/Dashboard/ProductList/Locks/DoorControls/DoorKing',
              },
              {
                name: 'Door Pulls',
                path: '/Dashboard/ProductList/Locks/DoorControls/DoorPulls',
              },
            ],
          },
          {
            name: 'DOOR LOCKS',
            subItemsNameComponent: [
              {
                name: 'Tri Bolt Locks',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Tri%20Bolt%20Locks',
              },
              {
                name: 'Smart Key',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Smart%20Key',
              },
              {
                name: 'Night Latch',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Night%20Latch',
              },
              {
                name: 'Pull Handles For Main Doors',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Pull%20Handles%20For%20Main%20Doors',
              },
              {
                name: 'Rim Dead Lock',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Rim%20Dead%20Lock',
              },
              {
                name: 'Side Lock',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Side%20Lock',
              },
              {
                name: 'Main Door Lock',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Main%20Door%20Lock',
              },
              {
                name: 'Jemmy Proof Door Lock',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Jemmy%20Proof%20Door%20Lock',
              },
              {
                name: 'Knob Locks',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Knob%20Locks',
              },
              {
                name: 'Drawer Lock',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Drawer%20Lock',
              },
              {
                name: 'Dead Locks',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Dead%20Locks',
              },
              {
                name: 'Diamant Padlocks',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Diamant%20Padlocks',
              },
              {
                name: 'Dimple Key',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Dimple%20Key',
              },
              {
                name: 'Disc Pad Locks',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Disc%20Pad%20Locks',
              },
              {
                name: 'Cylindrical Locks',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Cylindrical%20Locks',
              },
              {
                name: 'Centre Shutter Locks',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Centre%20Shutter%20Locks',
              },
              {
                name: 'Cupboard Locks',
                path: '/Dashboard/ProductList/Locks/DoorLocks/Cupboard%20Locks',
              },
            ],
          },
          {
            name: 'FURNITURE BRACKETS',
            path: '/Dashboard/ProductList/Locks/FurnitureBrackets',
          },
          {
            name: 'FURNITURE FITTINGS',
            subItemsNameComponent: [
              {
                name: 'Ball Bearing Drawer Channel',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Ball%20Bearing%20Drawer%20Channel',
              },
              {
                name: 'Furniture Fittings',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Furniture%20Fittings',
              },
              {
                name: 'Heavy Duty Drawer Slides',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Heavy%20Duty%20Drawer%20Slides',
              },
              {
                name: 'Slip On Hinge',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Slip%20On%20Hinge',
              },
              {
                name: 'Soft Close Drawer Channel',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Soft%20Close%20Drawer%20Channel',
              },
              {
                name: 'Thick Door Hinge',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Thick%20Door%20Hinge',
              },
              {
                name: 'Folding Brackets',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Folding%20Brackets',
              },
              {
                name: 'Cabinet Hinge',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Cabinet%20Hinge',
              },
              {
                name: 'Clip On Soft Hinge',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Clip%20On%20Soft%20Hinge',
              },
              {
                name: 'Clip On Soft Hinge4 Hole',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Clip%20On%20Soft%20Hinge4%20Hole',
              },
              {
                name: 'Drawer Channels',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Drawer%20Channels',
              },
              {
                name: 'Blind Corner Hinge',
                path: '/Dashboard/ProductList/Locks/FurnitureFittings/Blind%20Corner%20Hinge',
              },
            ],
          },
          {
            name: 'FURNITURE LOCKS',
            subItemsNameComponent: [
              {
                name: 'Curvo',
                path: '/Dashboard/ProductList/Locks/FurnitureLocks/Curvo',
              },
              {
                name: 'CamLock',
                path: '/Dashboard/ProductList/Locks/FurnitureLocks/CamLock',
              },
              {
                name: 'Nuvo',
                path: '/Dashboard/ProductList/Locks/FurnitureLocks/Nuvo',
              },
              {
                name: 'Supernova',
                path: '/Dashboard/ProductList/Locks/FurnitureLocks/Supernova',
              },
              {
                name: 'Table Lock',
                path: '/Dashboard/ProductList/Locks/FurnitureLocks/Table%20Lock',
              },
              {
                name: 'Drawer Cupboard Lock',
                path: '/Dashboard/ProductList/Locks/FurnitureLocks/Drawer%20Cupboard%20Lock',
              },
              {
                name: 'Drawer Locks',
                path: '/Dashboard/ProductList/Locks/FurnitureLocks/Drawer%20Locks',
              },
              {
                name: 'Multi Purpose Lock',
                path: '/Dashboard/ProductList/Locks/FurnitureLocks/Multi%20Purpose%20Lock',
              },
            ],
          },
          {
            name: 'GLASS HARDWARE',
            subItemsNameComponent: [
              {
                name: 'Glass Door Pull Handle',
                path: '/Dashboard/ProductList/Locks/GlassHardware/Glass%20Door%20Pull%20Handle',
              },
              {
                name: 'Glass Hardware',
                path: '/Dashboard/ProductList/Locks/GlassHardware/Glass%20Hardware',
              },
              {
                name: 'Shower Cubicle Hinge',
                path: '/Dashboard/ProductList/Locks/GlassHardware/Shower%20Cubicle%20Hinge',
              },
              {
                name: 'Sliding System',
                path: '/Dashboard/ProductList/Locks/GlassHardware/Sliding%20System',
              },
              {
                name: 'Glass Door Lock',
                path: '/Dashboard/ProductList/Locks/GlassHardware/Glass%20Door%20Lock',
              },
              {
                name: 'Floor Spring Combo Set',
                path: '/Dashboard/ProductList/Locks/GlassHardware/Floor%20Spring%20Combo%20Set',
              },
              {
                name: 'Glass Door Fitting',
                path: '/Dashboard/ProductList/Locks/GlassHardware/Glass%20Door%20Fitting',
              },
            ],
          },
          {
            name: 'LEVER MORTISE LOCKS',
            subItemsNameComponent: [
              {
                name: 'EXS HI - SECURITY CYLINDERS',
                path: '/Dashboard/ProductList/Locks/LeverMortiseLocks/EXS%20HI%20-%20SECURITY%20CYLINDERS',
              },
              {
                name: 'COMBIPACK WITH 6 LEVER MORTISE LOCK',
                path: '/Dashboard/ProductList/Locks/LeverMortiseLocks/COMBIPACK%20WITH%206%20LEVER%20MORTISE%20LOCK',
              },
              {
                name: 'Europrofile Mortise Pin Cylinder With Master Key',
                path: '/Dashboard/ProductList/Locks/LeverMortiseLocks/Europrofile%20Mortise%20Pin%20Cylinder%20With%20Master%20Key',
              },
              {
                name: 'Europrofile Mortise Pin Cylinder',
                path: '/Dashboard/ProductList/Locks/LeverMortiseLocks/Europrofile%20Mortise%20Pin%20Cylinder',
              },
              {
                name: 'Europrofile Mortise Lock Bodies',
                path: '/Dashboard/ProductList/Locks/LeverMortiseLocks/Europrofile%20Mortise%20Lock%20Bodies',
              },
            ],
          },
          {
            name: 'Mortice Locks',
            path: '/Dashboard/ProductList/Locks/MorticeLocks',
          },
          {
            name: 'Mortise Lock Body',
            path: '/Dashboard/ProductList/Locks/MortiseLockBody',
          },

          {
            name: 'Padlocks',
            subItemsNameComponent: [
              {
                name: 'Ultra Shutter Locks',
                path: '/Dashboard/ProductList/Locks/Padlocks/Ultra%20Shutter%20Locks',
              },
              {
                name: 'Disc Padlocks',
                path: '/Dashboard/ProductList/Locks/Padlocks/Disc%20Padlocks',
              },
              {
                name: 'Padlocks',
                path: '/Dashboard/ProductList/Locks/Padlocks/Padlocks',
              },
              {
                name: 'Premium Padlocks',
                path: '/Dashboard/ProductList/Locks/Padlocks/Premium%20Padlocks',
              },
              {
                name: 'Round Type Padlock',
                path: '/Dashboard/ProductList/Locks/Padlocks/Round%20Type%20Padlock',
              },
              {
                name: 'Square Type Padlock',
                path: '/Dashboard/ProductList/Locks/Padlocks/Square%20Type%20Padlock',
              },
            ],
          },
          {
            name: 'Patch Fittings',
            path: '/Dashboard/ProductList/Locks/PatchFittings',
          },
          {
            name: 'POPULAR MORTISE SERIES',
            subItemsNameComponent: [
              {
                name: 'S S D Type Tube Lever',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/S%20S%20D%20Type%20Tube%20Lever',
              },
              {
                name: 'Towy Low Height Design',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Towy%20Low%20Height%20Design',
              },
              {
                name: 'Victoria',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Victoria',
              },
              {
                name: 'Pull Handles',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Pull%20Handles',
              },
              {
                name: 'N E H15 Low Height Design',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H15%20Low%20Height%20Design',
              },
              {
                name: 'N E H16',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H16',
              },
              {
                name: 'Oliver',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Oliver',
              },
              {
                name: 'Popular Mortise Series',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Popular%20Mortise%20Series',
              },
              {
                name: 'N E H10',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H10',
              },
              {
                name: 'N E H11',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H11',
              },
              {
                name: 'N E H12',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H12',
              },
              {
                name: 'N E H13',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H13',
              },
              {
                name: 'N E H14',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H14',
              },
              {
                name: 'N E H09',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H09',
              },
              {
                name: 'N E H04',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H04',
              },
              {
                name: 'N E H05',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H05',
              },
              {
                name: 'N E H06',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H06',
              },
              {
                name: 'N E H07',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H07',
              },
              {
                name: 'N E H08',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/N%20E%20H08',
              },
              {
                name: 'Matiz',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Matiz',
              },
              {
                name: 'Corner Fetch Series',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Corner%20Fetch%20Series',
              },
              {
                name: 'Cylindrical Locks',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Cylindrical%20Locks',
              },
              {
                name: 'Gloria',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Gloria',
              },
              {
                name: 'Main Door Set',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Main%20Door%20Set',
              },
              {
                name: 'Combi Set',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Combi%20Set',
              },
              {
                name: 'Classic Lock',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/Classic%20Lock',
              },
              {
                name: 'B M01',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/B%20M01',
              },
              {
                name: 'B M02',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/B%20M02',
              },
              {
                name: 'B M04',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/B%20M04',
              },
              {
                name: 'B M06',
                path: '/Dashboard/ProductList/Locks/PopularMortiseSeries/B%20M06',
              },
            ],
          },
          {
            name: 'PREMIUM MORTISE SERIES',
            subItemsNameComponent: [
              {
                name: 'S E H Series',
                path: '/Dashboard/ProductList/Locks/PremiumMortiseSeries/S%20E%20H%20Series',
              },
              {
                name: 'Phoenix',
                path: '/Dashboard/ProductList/Locks/PremiumMortiseSeries/Phoenix',
              },
              {
                name: 'Premium Mortise Series',
                path: '/Dashboard/ProductList/Locks/PremiumMortiseSeries/Premium%20Mortise%20Series',
              },
              {
                name: 'Orbit',
                path: '/Dashboard/ProductList/Locks/PremiumMortiseSeries/Orbit',
              },
              {
                name: 'Allure Rossette Series',
                path: '/Dashboard/ProductList/Locks/PremiumMortiseSeries/Allure%20Rossette%20Series',
              },
              {
                name: 'Combipack With240mm Euro Mortise Lock',
                path: '/Dashboard/ProductList/Locks/PremiumMortiseSeries/Combipack%20With240mm%20Euro%20Mortise%20Lock',
              },
              {
                name: 'Europrofile Brass Handle Set240mm',
                path: '/Dashboard/ProductList/Locks/PremiumMortiseSeries/Europrofile%20Brass%20Handle%20Set240mm',
              },
              {
                name: 'Evva3 K S Regalis Mortise',
                path: '/Dashboard/ProductList/Locks/PremiumMortiseSeries/Evva3%20K%20S%20Regalis%20Mortise',
              },
              {
                name: 'Mercury',
                path: '/Dashboard/ProductList/Locks/PremiumMortiseSeries/Mercury',
              },
            ],
          },
          {
            name: 'Rim Locks',
            subItemsNameComponent: [
              {
                name: 'Ultra X L Tribolt',
                path: '/Dashboard/ProductList/Locks/RimLocks/Ultra%20X%20L%20Tribolt',
              },
              {
                name: 'Ultra X L Twinbolt',
                path: '/Dashboard/ProductList/Locks/RimLocks/Ultra%20X%20L%20Twinbolt',
              },
              {
                name: 'Ultra X L Vertibolt',
                path: '/Dashboard/ProductList/Locks/RimLocks/Ultra%20X%20L%20Vertibolt',
              },
              {
                name: 'Ultra X L Rim Deadbolt',
                path: '/Dashboard/ProductList/Locks/RimLocks/Ultra%20X%20L%20Rim%20Deadbolt',
              },
              {
                name: 'Ultra Latchbolt Carton',
                path: '/Dashboard/ProductList/Locks/RimLocks/Ultra%20Latchbolt%20Carton',
              },
              {
                name: 'Ultra Retrofit Adaptor',
                path: '/Dashboard/ProductList/Locks/RimLocks/Ultra%20Retrofit%20Adaptor',
              },
              {
                name: 'Ultra Tribolt',
                path: '/Dashboard/ProductList/Locks/RimLocks/Ultra%20Tribolt',
              },
              {
                name: 'Ultra Vertibolt',
                path: '/Dashboard/ProductList/Locks/RimLocks/Ultra%20Vertibolt',
              },
              {
                name: 'Rim Locks',
                path: '/Dashboard/ProductList/Locks/RimLocks/Rim%20Locks',
              },
              {
                name: 'E X S Altrix',
                path: '/Dashboard/ProductList/Locks/RimLocks/E%20X%20S%20Altrix',
              },
              {
                name: 'E X S Astro',
                path: '/Dashboard/ProductList/Locks/RimLocks/E%20X%20S%20Astro',
              },
              {
                name: 'Night Latch7 Lever',
                path: '/Dashboard/ProductList/Locks/RimLocks/Night%20Latch7%20Lever',
              },
              {
                name: 'Pentabolt Aries',
                path: '/Dashboard/ProductList/Locks/RimLocks/Pentabolt%20Aries',
              },
              {
                name: 'Pin Cylinder Rim Locks',
                path: '/Dashboard/ProductList/Locks/RimLocks/Pin%20Cylinder%20Rim%20Locks',
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
                path: '/Dashboard/ProductList/Paint/Emulsion/WallTexture',
              },
              {
                name: 'Tile Guard',
                path: '/Dashboard/ProductList/Paint/Emulsion/TileGuard',
              },
              {
                name: 'Exterior Emulsion',
                path: '/Dashboard/ProductList/Paint/Emulsion/ExteriorEmulsion',
              },
              {
                name: 'Interior Emulsion',
                path: '/Dashboard/ProductList/Paint/Emulsion/InteriorEmulsion',
              },
            ],
          },
          {
            name: 'ENAMEL',
            subItemsNameComponent: [
              {
                name: 'Synthetic Enamel',
                path: '/Dashboard/ProductList/Paint/Enamel/SyntheticEnamel',
              },
              {
                name: 'Satin Enamel',
                path: '/Dashboard/ProductList/Paint/Enamel/SatinEnamel',
              },
              {
                name: 'Gloss Enamel',
                path: '/Dashboard/ProductList/Paint/Enamel/GlossEnamel',
              },
            ],
          },
          {
            name: 'DISTEMPER',
            subItemsNameComponent: [
              {
                name: 'Acrylic Distemper',
                path: '/Dashboard/ProductList/Paint/Distemper/AcrylicDistemper',
              },
              {
                name: 'Synthetic Distemper',
                path: '/Dashboard/ProductList/Paint/Distemper/SyntheticDistemper',
              },
            ],
          },
          {
            name: 'PRIMER',
            subItemsNameComponent: [
              {
                name: 'Wood Primer',
                path: '/Dashboard/ProductList/Paint/Primer/WoodPrimer',
              },
              {
                name: 'Solvent Primer',
                path: '/Dashboard/ProductList/Paint/Primer/SolventPrimer',
              },
              {
                name: 'Acrylic Primer',
                path: '/Dashboard/ProductList/Paint/Primer/AcrylicPrimer',
              },
              {
                name: 'Cement Primer',
                path: '/Dashboard/ProductList/Paint/Primer/CementPrimer',
              },
              {
                name: 'Exterior Primer',
                path: '/Dashboard/ProductList/Paint/Primer/ExteriorPrimer',
              },
              {
                name: 'Interior Primer',
                path: '/Dashboard/ProductList/Paint/Primer/InteriorPrimer',
              },
              {
                name: 'Metal Primer',
                path: '/Dashboard/ProductList/Paint/Primer/MetalPrimer',
              },
            ],
          },
          {
            name: 'STAINERS',
            subItemsNameComponent: [
              {
                name: 'Wood Stainers',
                path: '/Dashboard/ProductList/Paint/Stainers/WoodStainers',
              },
              {
                name: 'Universal Stainers',
                path: '/Dashboard/ProductList/Paint/Stainers/UniversalStainers',
              },
            ],
          },
          {
            name: 'Brushes & Rollers',
            subItemsNameComponent: [
              {
                name: 'Spray Paints',
                path: '/Dashboard/ProductList/Paint/Brushes Rollers/SprayPaints',
              },
              {
                name: 'Paint Brushes',
                path: '/Dashboard/ProductList/Paint/Brushes Rollers/PaintBrushes',
              },
              {
                name: 'Rollers',
                path: '/Dashboard/ProductList/Paint/Brushes Rollers/Rollers',
              },
            ],
          },
          {
            name: 'WATERPROOFING & FILLERS',
            subItemsNameComponent: [
              {
                name: 'Waterproof Basecoat',
                path: '/Dashboard/ProductList/Paint/Waterproofing/WaterproofBasecoat',
              },
              {
                name: 'Crack Fillers',
                path: '/Dashboard/ProductList/Paint/Waterproofing/CrackFillers',
              },
            ],
          },
          {
            name: 'PAINTING ACCESSORIES',
            subItemsNameComponent: [
              {
                name: 'Sandpaper Rolls',
                path: '/Dashboard/ProductList/Paint/Painting Accessories/SandpaperRolls',
              },
              {
                name: 'Stencils',
                path: '/Dashboard/ProductList/Paint/Painting Accessories/Stencils',
              },
              {
                name: 'Painting Tools',
                path: '/Dashboard/ProductList/Paint/Painting Accessories/PaintingTools',
              },
            ],
          },
          {
            name: 'WOOD FINISHES',
            subItemsNameComponent: [
              {
                name: 'Pu',
                path: '/Dashboard/ProductList/Paint/Wood Finishes/Pu',
              },
              {
                name: 'Sealer',
                path: '/Dashboard/ProductList/Paint/Wood Finishes/Sealer',
              },
              {
                name: 'Varnish Black Board Paint',
                path: '/Dashboard/ProductList/Paint/Wood Finishes/VarnishBlackBoardPaint',
              },
              {
                name: 'Wood Putty',
                path: '/Dashboard/ProductList/Paint/Wood Finishes/WoodPutty',
              },
              {
                name: 'Polish',
                path: '/Dashboard/ProductList/Paint/Wood Finishes/Polish',
              },
              {
                name: 'Glass Coatings',
                path: '/Dashboard/ProductList/Paint/Wood Finishes/GlassCoatings',
              },
              {
                name: 'Melamyne',
                path: '/Dashboard/ProductList/Paint/Wood Finishes/Melamyne',
              },
              {
                name: 'Nc',
                path: '/Dashboard/ProductList/Paint/Wood Finishes/Nc',
              },
            ],
          },
          {
            name: 'ADHESIVE & THINNER',
            subItemsNameComponent: [
              {
                name: 'Adhesive',
                path: '/Dashboard/ProductList/Paint/Adhesive Thinner/Adhesive',
              },
              {
                name: 'Thinner',
                path: '/Dashboard/ProductList/Paint/Adhesive Thinner/Thinner',
              },
            ],
          },
          {
            name: 'WALL PUTTY',
            subItemsNameComponent: [
              {
                name: 'Kpf Wall Putty',
                path: '/Dashboard/ProductList/Paint/Wall Putty/KpfWallPutty',
              },
              {
                name: 'Powder Wall Putty',
                path: '/Dashboard/ProductList/Paint/Wall Putty/PowderWallPutty',
              },
              {
                name: 'Acrylic Wall Putty',
                path: '/Dashboard/ProductList/Paint/Wall Putty/AcrylicWallPutty',
              },
            ],
          },
          {
            name: 'TOP BRANDS',
            subItemsNameComponent: [
              {
                name: 'Neroloc',
                path: '/Dashboard/ProductList/Paint/Top Brands/Neroloc',
              },
              {
                name: 'Dulux',
                path: '/Dashboard/ProductList/Paint/Top Brands/Dulux',
              },
              {
                name: 'Asian Paints',
                path: '/Dashboard/ProductList/Paint/Top Brands/AsianPaints',
              },
              {
                name: 'Gem Paints',
                path: '/Dashboard/ProductList/Paint/Top Brands/GemPaints',
              },
              {
                name: 'Jk Wall Putty',
                path: '/Dashboard/ProductList/Paint/Top Brands/JkWallPutty',
              },
              {
                name: 'Agsar Paints',
                path: '/Dashboard/ProductList/Paint/Top Brands/AgsarPaints',
              },
            ],
          },
          {
            name: 'Acrylic Emulsion Paint',
            path: '/Dashboard/ProductList/Paint/AcrylicEmulsionPaint',
          },
          {
            name: 'Aspa Paints',
            path: '/Dashboard/ProductList/Paint/AspaPaints',
          },
          {
            name: 'Exterior paints',
            path: '/Dashboard/ProductList/Paint/ExteriorPaints',
          },
          {
            name: 'Floor Paints',
            path: '/Dashboard/ProductList/Paint/FloorPaints',
          },
          {
            name: 'Industrial Coatings',
            path: '/Dashboard/ProductList/Paint/IndustrialCoatings',
          },
          {
            name: 'Interior Paints',
            path: '/Dashboard/ProductList/Paint/InteriorPaints',
          },
          {
            name: 'Painting Tools',
            path: '/Dashboard/ProductList/Paint/PaintingTools',
          },
          {
            name: 'Primer and Wall Putty',
            path: '/Dashboard/ProductList/Paint/PrimerAndWallPutty',
          },
          { name: 'Sanitizer', path: '/Dashboard/ProductList/Paint/Sanitizer' },
          {
            name: 'Spray Paints',
            path: '/Dashboard/ProductList/Paint/SprayPaints',
          },
          {
            name: 'Stainers&Thinners',
            path: '/Dashboard/ProductList/Paint/StainersThinners',
          },
          { name: 'Stencils', path: '/Dashboard/ProductList/Paint/Stencils' },
          {
            name: 'Tile Guard',
            path: '/Dashboard/ProductList/Paint/TileGuard',
          },
          {
            name: 'wall stickers and wallpapers',
            path: '/Dashboard/ProductList/Paint/WallStickersWallpapers',
          },
          {
            name: 'Wood & Metal',
            path: '/Dashboard/ProductList/Paint/WoodMetal',
          },
        ],
      },
      {
        name: 'Pipe',
        subItemsName: [
          {
            name: 'Supreme Pipe',
            path: '/Dashboard/ProductList/Pipe/SupremePipe',
          },
          { name: 'TSA Pipe', path: '/Dashboard/ProductList/Pipe/TSAPipe' },
          {
            name: 'Prince Pipe',
            path: '/Dashboard/ProductList/Pipe/PrincePipe',
          },
          { name: 'Birla Pipe', path: '/Dashboard/ProductList/Pipe/BirlaPipe' },
          { name: 'Tata Pipe', path: '/Dashboard/ProductList/Pipe/TataPipe' },
          {
            name: 'Prakash Pipe',
            path: '/Dashboard/ProductList/Pipe/PrakashPipe',
          },
          {
            name: 'Finolex Pipes',
            path: '/Dashboard/ProductList/Pipe/FinolexPipes',
          },
          {
            name: 'Ashirvad Pipes',
            path: '/Dashboard/ProductList/Pipe/AshirvadPipes',
          },
          {
            name: 'Astral Pipes',
            path: '/Dashboard/ProductList/Pipe/AstralPipes',
          },
        ],
      },
      {
        name: 'PVC Mats',
        subItemsName: [
          { name: 'Floor Mats', path: '/Dashboard/ProductList/PvcMats/Floor' },
          { name: 'Door Mats', path: '/Dashboard/ProductList/PvcMats/Door' },
        ],
      },
      {
        name: 'Roofer',
        subItemsName: [
          { name: 'Shingles', path: '/Dashboard/ProductList/Roofer/Shingles' },
          {
            name: 'Metal Roofing',
            path: '/Dashboard/ProductList/Roofer/Metal',
          },
        ],
      },
      {
        name: 'Sanitary Ware & faucets',
        subItemsName: [
          {
            name: 'Acrylic Products',
            path: '/Dashboard/ProductList/Sanitary/AcrylicProducts',
            subItemsNameComponent: [],
          },
          {
            name: 'Bathroom Accessories',
            path: '/Dashboard/ProductList/Sanitary/BathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Bathsense',
            subItemsNameComponent: [
              {
                name: 'Sanitaryware',
                path: '/Dashboard/ProductList/Sanitary/Bathsense/Sanitaryware',
              },
              {
                name: 'C Pfittings Faucets',
                path: '/Dashboard/ProductList/Sanitary/Bathsense/CPfittingsFaucets',
              },
            ],
          },
          {
            name: 'Closets',
            path: '/Dashboard/ProductList/Sanitary/Closets',
            subItemsNameComponent: [],
          },
          {
            name: 'Coral bath fixtures',
            subItemsNameComponent: [
              {
                name: 'Royale Series',
                path: '/Dashboard/ProductList/Sanitary/CoralBathFixtures/RoyaleSeries',
              },
              {
                name: 'Treemo Series',
                path: '/Dashboard/ProductList/Sanitary/CoralBathFixtures/TreemoSeries',
              },
              {
                name: 'Xrossa Series',
                path: '/Dashboard/ProductList/Sanitary/CoralBathFixtures/XrossaSeries',
              },
              {
                name: 'New Super Glow Series',
                path: '/Dashboard/ProductList/Sanitary/CoralBathFixtures/NewSuperGlowSeries',
              },
              {
                name: 'Eurosmart Series',
                path: '/Dashboard/ProductList/Sanitary/CoralBathFixtures/EurosmartSeries',
              },
              {
                name: 'Flowmore Series',
                path: '/Dashboard/ProductList/Sanitary/CoralBathFixtures/FlowmoreSeries',
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
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Ecco',
                  },
                  {
                    name: 'Keti',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Keti',
                  },
                  {
                    name: 'Qubix',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Qubix',
                  },
                  {
                    name: 'Square',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Square',
                  },
                  {
                    name: 'Supreme',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Supreme',
                  },
                  {
                    name: 'Dolphin',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Dolphin',
                  },
                  {
                    name: 'Acrylic Accessories',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/AcrylicAccessories',
                  },
                  {
                    name: 'Almond',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Almond',
                  },
                  {
                    name: 'Anglo',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Anglo',
                  },
                  {
                    name: 'Budget',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BATHROOMACCESSORIES/Budget',
                  },
                ],
              },
              {
                name: 'Bathroom Faucets',
                subItemsNameComponentName: [
                  {
                    name: 'Super',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Super',
                  },
                  {
                    name: 'Tri',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Tri',
                  },
                  {
                    name: 'Square S',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Square S',
                  },
                  {
                    name: 'Royal',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Royal',
                  },
                  {
                    name: 'Slimline',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Slimline',
                  },
                  {
                    name: 'Splash',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Splash',
                  },
                  {
                    name: 'Square F',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Square F',
                  },
                  {
                    name: 'Omega',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Omega',
                  },
                  {
                    name: 'Passion',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Passion',
                  },
                  {
                    name: 'Milano',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Milano',
                  },
                  {
                    name: 'Nano',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Nano',
                  },
                  {
                    name: 'Nexa',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Nexa',
                  },
                  {
                    name: 'Niagra',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Niagra',
                  },
                  {
                    name: 'Nice',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Nice',
                  },
                  {
                    name: 'Ket',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Ket',
                  },
                  {
                    name: 'Expert',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Expert',
                  },
                  {
                    name: 'Florence',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Florence',
                  },
                  {
                    name: 'Glass Bowl Faucet',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Glass Bowl Faucet',
                  },
                  {
                    name: 'Idea',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Idea',
                  },
                  {
                    name: 'Jazz',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Jazz',
                  },
                  {
                    name: 'Eeco',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Eeco',
                  },
                  {
                    name: 'Concept',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Concept',
                  },
                  {
                    name: 'Deluxe',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Deluxe',
                  },
                  {
                    name: 'Almond',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Almond',
                  },
                  {
                    name: 'Arrow',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Arrow',
                  },
                  {
                    name: 'Bold',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Bold',
                  },
                  {
                    name: 'Budget',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/BathroomFaucets/Budget',
                  },
                ],
              },
              {
                name: 'Kitchen',
                subItemsNameComponentName: [
                  {
                    name: 'Kitchen Sink',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/Kitchen/Kitchen Sink',
                  },
                  {
                    name: 'Kitchen Faucets',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/Kitchen/Kitchen Faucets',
                  },
                ],
              },
              {
                name: 'Showers',
                subItemsNameComponentName: [
                  {
                    name: 'Hand Showers',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Showers/Hand Showers',
                  },
                  {
                    name: 'Overhead Showers',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Showers/Overhead Showers',
                  },
                  {
                    name: 'Rainfall Showers',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Showers/Rainfall Showers',
                  },
                  {
                    name: 'Shower Arms',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Showers/Shower Arms',
                  },
                ],
              },

              {
                name: 'Other Useful Items',
                subItemsNameComponentName: [
                  {
                    name: 'Mouth Operated',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/OtherUsefulItems/Mouth Operated',
                  },
                  {
                    name: 'Pressmatic Push Cock',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/OtherUsefulItems/Pressmatic Push Cock',
                  },
                  {
                    name: 'Sensor Taps',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/OtherUsefulItems/Sensor Taps',
                  },
                  {
                    name: 'Soap Dispenser',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/OtherUsefulItems/Soap Dispenser',
                  },
                  {
                    name: 'Mini Angle Cock',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/OtherUsefulItems/Mini Angle Cock',
                  },
                  {
                    name: 'Ball Valves',
                    path: '/Dashboard/ProductList/Sanitary/Corsa/OtherUsefulItems/Ball Valves',
                  },
                ],
              },
              {
                name: 'Flushing Cistern',
                path: '/Dashboard/ProductList/Sanitary/Corsa/FlushingCistern',
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
                    path: '/Dashboard/ProductList/Sanitary/Essess/Showers/Hand Showers',
                  },
                  {
                    name: 'Overhead Showers',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Showers/Overhead Showers',
                  },
                  {
                    name: 'Rainfall Showers',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Showers/Rainfall Showers',
                  },
                  {
                    name: 'Shower Arms',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Showers/Shower Arms',
                  },
                ],
              },
              {
                name: 'Accessories',
                subItemsNameComponent: [
                  {
                    name: 'Series8 B Series',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Accessories/Series8 B Series',
                  },
                  {
                    name: 'Series7 Deon',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Accessories/Series7 Deon',
                  },
                  {
                    name: 'Series2 Swing',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Accessories/Series2 Swing',
                  },
                  {
                    name: 'Series3 Tarim',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Accessories/Series3 Tarim',
                  },
                  {
                    name: 'Series5 Hotelier Series',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Accessories/Series5 Hotelier Series',
                  },
                  {
                    name: 'Series6 Cruzo',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Accessories/Series6 Cruzo',
                  },
                  {
                    name: 'Series1 Croma',
                    path: '/Dashboard/ProductList/Sanitary/Essess/Accessories/Series1 Croma',
                  },
                ],
              },
              {
                name: 'Trand',
                path: '/Dashboard/ProductList/Sanitary/Essess/Trand',
              },
              {
                name: 'Tarim',
                path: '/Dashboard/ProductList/Sanitary/Essess/Tarim',
              },
              {
                name: 'Lab Taps',
                path: '/Dashboard/ProductList/Sanitary/Essess/Lab Taps',
              },
              {
                name: 'New Dune',
                path: '/Dashboard/ProductList/Sanitary/Essess/New Dune',
              },
              {
                name: 'New Xess',
                path: '/Dashboard/ProductList/Sanitary/Essess/New Xess',
              },
              {
                name: 'Quadra',
                path: '/Dashboard/ProductList/Sanitary/Essess/Quadra',
              },
              {
                name: 'Sensors',
                path: '/Dashboard/ProductList/Sanitary/Essess/Sensors',
              },
              {
                name: 'Hotelier Series',
                path: '/Dashboard/ProductList/Sanitary/Essess/Hotelier Series',
              },
              {
                name: 'Deon',
                path: '/Dashboard/ProductList/Sanitary/Essess/Deon',
              },
              {
                name: 'Echo',
                path: '/Dashboard/ProductList/Sanitary/Essess/Echo',
              },
              {
                name: 'Essentials',
                path: '/Dashboard/ProductList/Sanitary/Essess/Essentials',
              },
              {
                name: 'H S03',
                path: '/Dashboard/ProductList/Sanitary/Essess/H S03',
              },
              {
                name: 'D Series',
                path: '/Dashboard/ProductList/Sanitary/Essess/D Series',
              },
              {
                name: 'Auto Close Taps',
                path: '/Dashboard/ProductList/Sanitary/Essess/Auto Close Taps',
              },
              {
                name: 'Celato',
                path: '/Dashboard/ProductList/Sanitary/Essess/Celato',
              },
              {
                name: 'Croma',
                path: '/Dashboard/ProductList/Sanitary/Essess/Croma',
              },
              {
                name: 'Cruzo',
                path: '/Dashboard/ProductList/Sanitary/Essess/Cruzo',
              },
            ],
          },
          {
            name: 'Faucets',
            path: '/Dashboard/ProductList/Sanitary/Faucets',
            subItemsNameComponent: [],
          },
          {
            name: 'Hardware & Bathroom Accessories',
            path: '/Dashboard/ProductList/Sanitary/HardwareBathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Health Faucet',
            path: '/Dashboard/ProductList/Sanitary/HealthFaucet',
            subItemsNameComponent: [],
          },
          {
            name: 'Hindware',
            subItemsNameComponent: [
              {
                name: 'Wash Basins',
                path: '/Dashboard/ProductList/Sanitary/Hindware/WashBasins',
              },
              {
                name: 'Water Closets',
                path: '/Dashboard/ProductList/Sanitary/Hindware/WaterClosets',
              },
              {
                name: 'Showers',
                path: '/Dashboard/ProductList/Sanitary/Hindware/Showers',
              },
              {
                name: 'Add On',
                path: '/Dashboard/ProductList/Sanitary/Hindware/AddOn',
              },
              {
                name: 'Bath Tub',
                path: '/Dashboard/ProductList/Sanitary/Hindware/BathTub',
              },
              {
                name: 'Cisterns',
                path: '/Dashboard/ProductList/Sanitary/Hindware/Cisterns',
              },
              {
                name: 'Faucets',
                path: '/Dashboard/ProductList/Sanitary/Hindware/Faucets',
              },
            ],
          },
          {
            name: 'Jaquar',
            path: '/Dashboard/ProductList/Sanitary/Jaquar',
            subItemsNameComponent: [],
          },
          {
            name: 'Kitchen Sinks',
            path: '/Dashboard/ProductList/Sanitary/KitchenSinks',
            subItemsNameComponent: [],
          },
          {
            name: 'LEMON Bathroom Accessories',
            path: '/Dashboard/ProductList/Sanitary/LemonBathroomAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Leo Bath Fittings',
            subItemsNameComponent: [
              {
                name: 'Valve',
                path: '/Dashboard/ProductList/Sanitary/Leo Bath Fittings/Valve',
              },
              {
                name: 'Bathroom Accessories',
                path: '/Dashboard/ProductList/Sanitary/Leo Bath Fittings/BathroomAccessories',
              },
              {
                name: 'Faucets',
                path: '/Dashboard/ProductList/Sanitary/Leo Bath Fittings/Faucets',
              },
            ],
          },
          {
            name: 'Pamay',
            subItemsNameComponent: [
              {
                name: 'Showers',
                path: '/Dashboard/ProductList/Sanitary/Pamay/Showers',
              },
              {
                name: 'Faucets',
                path: '/Dashboard/ProductList/Sanitary/Pamay/Faucets',
              },
            ],
          },
          {
            name: 'Parryware',
            subItemsNameComponent: [
              {
                name: 'Water Heaters',
                path: '/Dashboard/ProductList/Sanitary/Parryware/WaterHeaters',
              },
              {
                name: 'Waste Coupling',
                path: '/Dashboard/ProductList/Sanitary/Parryware/WasteCoupling',
              },
              {
                name: 'Wash Basins',
                path: '/Dashboard/ProductList/Sanitary/Parryware/WashBasins',
              },
              {
                name: 'Utsav Range',
                path: '/Dashboard/ProductList/Sanitary/Parryware/UtsavRange',
              },
              {
                name: 'Shower Panels',
                path: '/Dashboard/ProductList/Sanitary/Parryware/ShowerPanels',
              },
              {
                name: 'Shower Enclosures',
                path: '/Dashboard/ProductList/Sanitary/Parryware/ShowerEnclosures',
              },
              {
                name: 'Semi Recessed Basins',
                path: '/Dashboard/ProductList/Sanitary/Parryware/SemiRecessedBasins',
              },
              {
                name: 'Seat Covers',
                path: '/Dashboard/ProductList/Sanitary/Parryware/SeatCovers',
              },
              {
                name: 'Push Plates',
                path: '/Dashboard/ProductList/Sanitary/Parryware/PushPlates',
              },
              {
                name: 'Polymer Cisterns',
                path: '/Dashboard/ProductList/Sanitary/Parryware/PolymerCisterns',
              },
              {
                name: 'F A U C E T S',
                path: '/Dashboard/ProductList/Sanitary/Parryware/FAUCETS',
              },
              {
                name: 'European Water Closet',
                path: '/Dashboard/ProductList/Sanitary/Parryware/EuropeanWaterCloset',
              },
              {
                name: 'Concealed Cistern',
                path: '/Dashboard/ProductList/Sanitary/Parryware/ConcealedCistern',
              },
              {
                name: 'CLOSETS',
                path: '/Dashboard/ProductList/Sanitary/Parryware/CLOSETS',
              },
              {
                name: 'Bowl Basins',
                path: '/Dashboard/ProductList/Sanitary/Parryware/BowlBasins',
              },
              {
                name: 'Below Counter Basins',
                path: '/Dashboard/ProductList/Sanitary/Parryware/BelowCounterBasins',
              },
              {
                name: 'Angle Valves',
                path: '/Dashboard/ProductList/Sanitary/Parryware/AngleValves',
              },
              {
                name: 'Accessories',
                path: '/Dashboard/ProductList/Sanitary/Parryware/Accessories',
              },
              {
                name: 'Showers',
                path: '/Dashboard/ProductList/Sanitary/Parryware/Showers',
              },
            ],
          },
          {
            name: 'Pearl Precious Products',
            path: '/Dashboard/ProductList/Sanitary/PearlPreciousProducts',
            subItemsNameComponent: [],
          },
          {
            name: 'Showers',
            path: '/Dashboard/ProductList/Sanitary/Showers',
            subItemsNameComponent: [],
          },
          {
            name: 'Taps',
            path: '/Dashboard/ProductList/Sanitary/Taps',
            subItemsNameComponent: [],
          },
          {
            name: 'Washbasins',
            path: '/Dashboard/ProductList/Sanitary/Washbasins',
            subItemsNameComponent: [],
          },
          {
            name: 'Waterman',
            subItemsNameComponent: [
              {
                name: 'Wall Showers Without Arm',
                path: '/Dashboard/ProductList/Sanitary/Waterman/WallShowersWithoutArm',
              },
              {
                name: 'Wall Showers With Arm',
                path: '/Dashboard/ProductList/Sanitary/Waterman/WallShowersWithArm',
              },
              {
                name: 'Shower Tubes',
                path: '/Dashboard/ProductList/Sanitary/Waterman/ShowerTubes',
              },
              {
                name: 'Roman',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Roman',
              },
              {
                name: 'Rain Showers',
                path: '/Dashboard/ProductList/Sanitary/Waterman/RainShowers',
              },
              {
                name: 'Ikon',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Ikon',
              },
              {
                name: 'Evoque',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Evoque',
              },
              {
                name: 'Health Faucet Abs',
                path: '/Dashboard/ProductList/Sanitary/Waterman/HealthFaucetAbs',
              },
              {
                name: 'Health Faucets Brass',
                path: '/Dashboard/ProductList/Sanitary/Waterman/HealthFaucetsBrass',
              },
              {
                name: 'Eco',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Eco',
              },
              {
                name: 'Aura',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Aura',
              },
              {
                name: 'Dell',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Dell',
              },
              {
                name: 'Deluxe',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Deluxe',
              },
              {
                name: 'Aria',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Aria',
              },
              {
                name: 'Accessories',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Accessories',
              },
            ],
          },
          {
            name: 'Water Tec',
            subItemsNameComponent: [
              {
                name: 'Taps',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Taps',
              },
              {
                name: 'Toilet Seat Covers',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/ToiletSeatCovers',
              },
              {
                name: 'Valves',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Valves',
              },
              {
                name: 'T Series Alt',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/TSeriesAlt',
              },
              {
                name: 'Health Faucets',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/HealthFaucets',
              },
              {
                name: 'Quattro',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Quattro',
              },
              {
                name: 'Showers',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Showers',
              },
              {
                name: 'T Series',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/TSeries',
              },
              {
                name: 'Concealed Cistern',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/ConcealedCistern',
              },
              {
                name: 'Connection Tube',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/ConnectionTube',
              },
              {
                name: 'Ebony',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Ebony',
              },
              {
                name: 'Eco',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Eco',
              },
              {
                name: 'Eva',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Eva',
              },
              {
                name: 'Flora',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Flora',
              },
              {
                name: 'Bathroom Accessories',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/BathroomAccessories',
              },
              {
                name: 'Cistern',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Cistern',
              },
              {
                name: 'Allied',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Allied',
              },
              {
                name: 'Aqua',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Aqua',
              },
              {
                name: 'Aspire',
                path: '/Dashboard/ProductList/Sanitary/Water Tec/Aspire',
              },
            ],
          },
          {
            name: 'Waterman',
            subItemsNameComponent: [
              {
                name: 'Wall Showers Without Arm',
                path: '/Dashboard/ProductList/Sanitary/Waterman/WallShowersWithoutArm',
              },
              {
                name: 'Wall Showers With Arm',
                path: '/Dashboard/ProductList/Sanitary/Waterman/WallShowersWithArm',
              },
              {
                name: 'Shower Tubes',
                path: '/Dashboard/ProductList/Sanitary/Waterman/ShowerTubes',
              },
              {
                name: 'Roman',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Roman',
              },
              {
                name: 'Rain Showers',
                path: '/Dashboard/ProductList/Sanitary/Waterman/RainShowers',
              },
              {
                name: 'Ikon',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Ikon',
              },
              {
                name: 'Evoque',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Evoque',
              },
              {
                name: 'Hand Showers',
                path: '/Dashboard/ProductList/Sanitary/Waterman/HandShowers',
              },
              {
                name: 'Health Faucet Abs',
                path: '/Dashboard/ProductList/Sanitary/Waterman/HealthFaucetAbs',
              },
              {
                name: 'Health Faucets Brass',
                path: '/Dashboard/ProductList/Sanitary/Waterman/HealthFaucetsBrass',
              },
              {
                name: 'Eco',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Eco',
              },
              {
                name: 'Aura',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Aura',
              },
              {
                name: 'Dell',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Dell',
              },
              {
                name: 'Deluxe',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Deluxe',
              },
              {
                name: 'Aria',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Aria',
              },
              {
                name: 'Accessories',
                path: '/Dashboard/ProductList/Sanitary/Waterman/Accessories',
              },
            ],
          },
          {
            name: 'Pearl Precious Products',
            subItemsNameComponent: [
              {
                name: 'Edge',
                path: '/Dashboard/ProductList/Sanitary/Pearl Precious Products/Edge',
              },
            ],
          },
          {
            name: 'Coral Bath Fixtures',
            subItemsNameComponent: [
              {
                name: 'Royale Series',
                path: '/Dashboard/ProductList/Sanitary/Coral bath fixtures/RoyaleSeries',
              },
              {
                name: 'Treemo Series',
                path: '/Dashboard/ProductList/Sanitary/Coral bath fixtures/TreemoSeries',
              },
              {
                name: 'Xrossa Series',
                path: '/Dashboard/ProductList/Sanitary/Coral bath fixtures/XrossaSeries',
              },
              {
                name: 'New Super Glow Series',
                path: '/Dashboard/ProductList/Sanitary/Coral bath fixtures/NewSuperGlowSeries',
              },
              {
                name: 'Eurosmart Series',
                path: '/Dashboard/ProductList/Sanitary/Coral bath fixtures/EurosmartSeries',
              },
              {
                name: 'Flowmore Series',
                path: '/Dashboard/ProductList/Sanitary/Coral bath fixtures/FlowmoreSeries',
              },
            ],
          },
        ],
      },
      {
        name: 'Tools',
        subItemsName: [
          {
            name: 'abrasives',
            path: '/Dashboard/ProductList/Tools/abrasives',
            subItemsNameComponent: [
              {
                name: 'Cut Off Wheel',
                path: '/Dashboard/ProductList/Tools/abrasives/CutOffWheel',
              },
              {
                name: 'Diamond Blades',
                path: '/Dashboard/ProductList/Tools/DiamondBlades',
              },
            ],
          },
          {
            name: 'Allen Keys',
            path: '/Dashboard/ProductList/Tools/AllenKeys',
            subItemsNameComponent: [],
          },
          {
            name: 'Brush',
            path: '/Dashboard/ProductList/Tools/Brush',
            subItemsNameComponent: [],
          },
          {
            name: 'Carpenter Pincer',
            path: '/Dashboard/ProductList/Tools/CarpenterPincer',
            subItemsNameComponent: [],
          },
          {
            name: 'Centre Punches',
            path: '/Dashboard/ProductList/Tools/CentrePunches',
            subItemsNameComponent: [],
          },
          {
            name: 'Chisels',
            path: '/Dashboard/ProductList/Tools/Chisels',
            subItemsNameComponent: [],
          },
          {
            name: 'Clamps',
            path: '/Dashboard/ProductList/Tools/Clamps',
            subItemsNameComponent: [],
          },
          {
            name: 'Crowbar',
            path: '/Dashboard/ProductList/Tools/Crowbar',
            subItemsNameComponent: [],
          },
          {
            name: 'Cutters',
            path: '/Dashboard/ProductList/Tools/Cutters',
            subItemsNameComponent: [],
          },
          {
            name: 'files',
            path: '/Dashboard/ProductList/Tools/files',
            subItemsNameComponent: [],
          },
          {
            name: 'Garden Tools',
            path: '/Dashboard/ProductList/Tools/GardenTools',
            subItemsNameComponent: [],
          },
          {
            name: 'Gear Pullers',
            path: '/Dashboard/ProductList/Tools/GearPullers',
            subItemsNameComponent: [],
          },
          {
            name: 'Glass cutter',
            path: '/Dashboard/ProductList/Tools/GlassCutter',
            subItemsNameComponent: [],
          },
          {
            name: 'glue gun',
            path: '/Dashboard/ProductList/Tools/gluegun',
            subItemsNameComponent: [],
          },
          {
            name: 'Grease Gun',
            path: '/Dashboard/ProductList/Tools/GreaseGun',
            subItemsNameComponent: [],
          },
          {
            name: 'Hacksaw Blades',
            path: '/Dashboard/ProductList/Tools/HacksawBlades',
            subItemsNameComponent: [],
          },
          {
            name: 'Hammer',
            path: '/Dashboard/ProductList/Tools/Hammer',
            subItemsNameComponent: [],
          },
          {
            name: 'Hammer Drills',
            path: '/Dashboard/ProductList/Tools/HammerDrills',
            subItemsNameComponent: [],
          },
          {
            name: 'hand tools',
            path: '/Dashboard/ProductList/Tools/handtools',
            subItemsNameComponent: [],
          },
          {
            name: 'level',
            path: '/Dashboard/ProductList/Tools/level',
            subItemsNameComponent: [],
          },
          {
            name: 'Lubrications',
            path: '/Dashboard/ProductList/Tools/Lubrications',
            subItemsNameComponent: [],
          },
          {
            name: 'Measurement Scale',
            path: '/Dashboard/ProductList/Tools/MeasurementScale',
            subItemsNameComponent: [],
          },
          {
            name: 'Measuring Tape',
            path: '/Dashboard/ProductList/Tools/MeasuringTape',
            subItemsNameComponent: [],
          },
          {
            name: 'Multimeter',
            path: '/Dashboard/ProductList/Tools/Multimeter',
            subItemsNameComponent: [],
          },
          {
            name: 'Plier',
            path: '/Dashboard/ProductList/Tools/Plier',
            subItemsNameComponent: [],
          },
          {
            name: 'Polishing Accessories',
            path: '/Dashboard/ProductList/Tools/PolishingAccessories',
            subItemsNameComponent: [],
          },
          {
            name: 'Power Tools',
            subItemsNameComponent: [
              {
                name: 'Drill',
                path: '/Dashboard/ProductList/Tools/PowerTools/Drill',
              },
              {
                name: 'Grinders',
                path: '/Dashboard/ProductList/Tools/PowerTools/Grinders',
              },
              {
                name: 'Marble Cutter',
                path: '/Dashboard/ProductList/Tools/PowerTools/MarbleCutter',
              },
            ],
          },
          {
            name: 'Saw',
            path: '/Dashboard/ProductList/Tools/saw',
            subItemsNameComponent: [],
          },
          {
            name: 'Screw Driver',
            path: '/Dashboard/ProductList/Tools/ScrewDriver',
            subItemsNameComponent: [],
          },
          {
            name: 'Silicon Gun',
            path: '/Dashboard/ProductList/Tools/SiliconGun',
            subItemsNameComponent: [],
          },
          {
            name: 'Socket set',
            path: '/Dashboard/ProductList/Tools/Socketset',
            subItemsNameComponent: [],
          },
          {
            name: 'Spanners',
            path: '/Dashboard/ProductList/Tools/Spanners',
            subItemsNameComponent: [],
          },
          {
            name: 'Spare Malets',
            path: '/Dashboard/ProductList/Tools/SpareMalets',
            subItemsNameComponent: [],
          },
          {
            name: 'Tool Compartments',
            path: '/Dashboard/ProductList/Tools/ToolCompartments',
            subItemsNameComponent: [],
          },
          {
            name: 'toolkit set',
            path: '/Dashboard/ProductList/Tools/toolkitset',
            subItemsNameComponent: [],
          },
          {
            name: 'various tool bits',
            path: '/Dashboard/ProductList/Tools/varioustoolbits',
            subItemsNameComponent: [],
          },
          {
            name: 'wood chisel',
            path: '/Dashboard/ProductList/Tools/woodChisel',
            subItemsNameComponent: [],
          },
          {
            name: 'wood items',
            path: '/Dashboard/ProductList/Tools/woodItems',
            subItemsNameComponent: [],
          },
          {
            name: 'Wrench',
            path: '/Dashboard/ProductList/Tools/Wrench',
            subItemsNameComponent: [],
          },
        ],
      },
      { name: 'Uncategorized', path: '/Dashboard/ProductList/Uncategorized' },
      {
        name: 'WaterProofing',
        subItemsName: [
          {
            name: 'Bathrooms',
            path: '/Dashboard/ProductList/WaterProofing/Bathrooms',
            subItemsNameComponent: [],
          },
          {
            name: 'Cracks & Joints',
            path: '/Dashboard/ProductList/WaterProofing/CracksJoints',
            subItemsNameComponent: [],
          },
          {
            name: 'Interiors',
            path: '/Dashboard/ProductList/WaterProofing/Interiors',
            subItemsNameComponent: [],
          },
        ],
      },
    ],
  },
  { name: 'Order List', path: '/Dashboard/OrderList' },
  { name: 'User List', path: '/Dashboard/UserList' },
  { name: 'Category List', path: '/Dashboard/CategoryList' },
  { name: 'Brand List', path: '/Dashboard/BrandList' },
  { name: 'Banner List', path: '/Dashboard/BannerList' },
  { name: 'Coupon List', path: '/Dashboard/CouponList' },
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

export default function Sidebar({ onSetting, onLogout, open, onClose }) {
  // Track open state for each collapsible item by name
  const [openSection, setOpenSection] = useState(null);
  const [openSubSection, setOpenSubSection] = useState(null);

  // Sort sections before rendering
  const sortedSections = sortSidebarItems(sections);

  const handleToggle = (name) => {
    setOpenSection(openSection === name ? null : name);
  };
  return (
    <aside className='w-64 h-screen bg-white rounded-2xl shadow-lg p-2 flex flex-col text-zinc-800 border border-zinc-100'>
      <div className='p-2 font-bold text-xl'>LOGO</div>
      <nav className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900'>
        <ul className='p-2 space-y-2'>
          {sortedSections.map((section) => (
            <div key={section.name} className='mb-2'>
              <div className='flex items-center w-full'>
                {section.path ? (
                  <Link
                    href={section.path}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition group cursor-pointer ${
                      openSection === section.name
                        ? 'bg-zinc-100 font-semibold shadow'
                        : 'hover:bg-zinc-100'
                    }`}
                    onClick={() => handleToggle(section.name)}
                  >
                    {section.name}
                  </Link>
                ) : (
                  <span className='flex-1 text-left px-2 py-2 rounded text-sm font-semibold'>
                    {section.name}
                  </span>
                )}
                {section.subItems && section.subItems.length > 0 && (
                  <button
                    className='ml-2'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(section.name);
                    }}
                  >
                    {openSection === section.name ? (
                      <FiChevronUp className='transition-transform' />
                    ) : (
                      <FiChevronDown className='transition-transform' />
                    )}
                  </button>
                )}
                {section.subItemsName && section.subItemsName.length > 0 && (
                  <button
                    className='ml-2'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(section.name);
                    }}
                  >
                    {openSection === section.name ? (
                      <FiChevronUp className='transition-transform' />
                    ) : (
                      <FiChevronDown className='transition-transform' />
                    )}
                  </button>
                )}
                {section.subItemsNameComponent &&
                  section.subItemsNameComponent.length > 0 && (
                    <button
                      className='ml-2'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(section.name);
                      }}
                    >
                      {openSection === section.name ? (
                        <FiChevronUp className='transition-transform' />
                      ) : (
                        <FiChevronDown className='transition-transform' />
                      )}
                    </button>
                  )}
                  {section.subItemsNameComponentName &&
                  section.subItemsNameComponentName.length > 0 && (
                    <button
                      className='ml-2'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(section.name);
                      }}
                    >
                      {openSection === section.name ? (
                        <FiChevronUp className='transition-transform' />
                      ) : (
                        <FiChevronDown className='transition-transform' />
                      )}
                    </button>
                  )}
              </div>
              {openSection === section.name &&
                (section.subItems ||
                  section.subItemsName ||
                  section.subItemsNameComponent ||
                  section.subItemsNameComponentName) && (
                  <ul className='pl-4'>
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
          ))}
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
}

function SidebarItem({ item }) {
  const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0;
  const hasSubItemsName = Array.isArray(item.subItemsName) && item.subItemsName.length > 0;
  const hasSubItemsNameComponent = Array.isArray(item.subItemsNameComponent) && item.subItemsNameComponent.length > 0;
  const hasSubItemsNameComponentName = Array.isArray(item.subItemsNameComponentName) && item.subItemsNameComponentName.length > 0;

  // Local state for this item's expand/collapse
  const [isOpen, setIsOpen] = useState(false);

  const handleRowClick = () => {
    if (hasSubItems || hasSubItemsName || hasSubItemsNameComponent || hasSubItemsNameComponentName) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <li>
      <div
        className={`flex items-center cursor-pointer ${
          (hasSubItems || hasSubItemsName || hasSubItemsNameComponent || hasSubItemsNameComponentName) ? 'hover:bg-zinc-100' : ''
        }`}
        onClick={handleRowClick}
      >
        {item.path && !(hasSubItems || hasSubItemsName || hasSubItemsNameComponent || hasSubItemsNameComponentName) ? (
          <Link
            href={item.path}
            className='block px-2 py-2 rounded text-sm hover:bg-zinc-700 transition flex-1'
          >
            <span className='align-middle'>{item.name}</span>
          </Link>
        ) : (
          <span className='block px-2 py-2 rounded text-sm flex-1'>
            <span className='align-middle'>{item.name}</span>
          </span>
        )}
        {(hasSubItems || hasSubItemsName || hasSubItemsNameComponent || hasSubItemsNameComponentName) && (
          <span className='ml-2'>
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        )}
      </div>
      {isOpen && (
        <ul className='pl-4'>
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
}
