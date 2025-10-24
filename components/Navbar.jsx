'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const getNavItems = (isLoggedIn) => {
  const baseItems = [
    { label: 'HOME', href: '/' },
    { label: 'SHOP', href: '/Shop' },
    { label: 'PAINTS', href: '#', hasDropdown: true },
    { label: 'ELECTRICALS', href: '#', hasDropdown: true },
    { label: 'SANITARY WARE & FAUCETS', href: '#', hasDropdown: true },
    { label: 'CEMENTS & POP', href: '#' },
    { label: 'ADHESIVE', href: '#' },
    { label: 'CLEANING', href: '#' },
    { label: 'TOOLS', href: '#', hasDropdown: true },
  ];

  if (isLoggedIn) {
    baseItems.push({ label: 'TRACKING', href: '/Tracking' });
  }

  return baseItems;
};

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('HOME');
  const router = useRouter();

  const folderMap = {
    'PAINTS': 'Paint',
    'ELECTRICALS': 'Electrical',
    'SANITARY WARE & FAUCETS': 'Sanitary',
    'TOOLS': 'Tools',
  };
  const simpleNavMap = {
    'CEMENTS & POP': 'Cements',
    'ADHESIVE': 'Adhesives',
    'CLEANING': 'Cleaning',
  };
  const slugify = (s) => String(s || '').replace(/&/g, ' ').replace(/[^a-zA-Z0-9]+/g, '').trim();
  const handleMenuClick = (e, menuLabel) => {
    const anchor = e.target.closest('a');
    if (anchor) {
      e.preventDefault();
    }
    const li = e.target.closest('li');
    if (!li) return;
    const group = li.closest('ul')?.dataset?.group;
    const item = li.textContent?.trim();
    if (!item) return;
    const folder = folderMap[menuLabel];
    if (!folder) return;
    const groupSlug = group ? slugify(group) : null;
    const itemSlug = slugify(item);
    const path = groupSlug ? `/ShopPage/${folder}/${groupSlug}/${itemSlug}` : `/ShopPage/${folder}/${itemSlug}`;
    router.push(path);
  };

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

  // Set active page based on current route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setActivePage('HOME');
    } else if (path === '/Shop' || path.startsWith('/ShopPage')) {
      setActivePage('SHOP');
    } else if (path.startsWith('/Tracking')) {
      setActivePage('TRACKING');
    } else {
      setActivePage('HOME');
    }
  }, []);

  const navItems = getNavItems(isLoggedIn);

  return (
    <div className="fixed top-24 left-0 w-full z-60 lg:visible lg:!block md:hidden hidden">
      <nav className="bg-black text-white">
        <ul className='flex items-center px-0.5 py-0.5 space-x-1'>
          {navItems.map((item) => (
            <li
              key={item.label}
              className='relative'
              onMouseEnter={() => item.hasDropdown && setOpenMenu(item.label)}
              onMouseLeave={() => item.hasDropdown && setOpenMenu(null)}
            >
              <a
                href={item.href}
                onClick={(e) => {
                  setActivePage(item.label);
                  if (item.hasDropdown) {
                    e.preventDefault();
                    return;
                  }
                  const folder = simpleNavMap[item.label];
                  if (folder) {
                    e.preventDefault();
                    router.push(`/ShopPage/${folder}`);
                  }
                }}
                className={`text-sm font-medium uppercase transition-all duration-300 flex items-center
                  ${
                    activePage === item.label
                      ? 'bg-yellow-300 text-white px-2 py-1 rounded-full hover:bg-yellow-300'
                      : 'text-gray-300 hover:text-white px-1 py-1'
                  }`}
              >
                {item.label}
                {item.hasDropdown && (
                  <svg
                    className='ml-1 w-3 h-3 inline-block'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.586l3.71-3.356a.75.75 0 1 1 1.02 1.1l-4.25 3.85a.75.75 0 0 1-1.02 0l-4.25-3.85a.75.75 0 0 1 .02-1.06z' />
                  </svg>
                )}
              </a>

            {/* Mega Menu for PAINTS */}
            {item.label === 'PAINTS' && (
              <div onClick={(e)=>handleMenuClick(e,'PAINTS')} className={`absolute top-full left-0 mt-2 w-[70rem] bg-white/95 text-black border border-gray-200 rounded-xl shadow-2xl p-6 ${openMenu === 'PAINTS' ? 'grid' : 'hidden'} grid-cols-5 gap-6 z-60 backdrop-blur-sm`}>
                {/* Column 1 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>EMULSION</h4>
                  <ul data-group='EMULSION' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Interior Emulsion</li>
                    <li className='cursor-pointer py-1'>Exterior Emulsion</li>
                    <li className='cursor-pointer py-1'>Wall Texture</li>
                    <li className='cursor-pointer py-1'>Tile Guard</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>ENAMEL</h4>
                  <ul data-group='ENAMEL' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Satin Enamel</li>
                    <li className='cursor-pointer py-1'>Gloss Enamel</li>
                    <li className='cursor-pointer py-1'>Synthetic Enamel</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>DISTEMPER</h4>
                  <ul data-group='DISTEMPER' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Acrylic Distemper</li>
                    <li className='cursor-pointer py-1'>Synthetic Distemper</li>
                  </ul>
                </div>

                {/* Column 2 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>PRIMER</h4>
                  <ul data-group='PRIMER' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Interior Primer</li>
                    <li className='cursor-pointer py-1'>Exterior Primer</li>
                    <li className='cursor-pointer py-1'>Cement Primer</li>
                    <li className='cursor-pointer py-1'>Wood Primer</li>
                    <li className='cursor-pointer py-1'>Metal Primer</li>
                    <li className='cursor-pointer py-1'>Acrylic Primer</li>
                    <li className='cursor-pointer py-1'>Solvent Primer</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>STAINERS</h4>
                  <ul data-group='STAINERS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Universal Stainers</li>
                    <li className='cursor-pointer py-1'>Wood Stainers</li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>BRUSHES & ROLLERS</h4>
                  <ul data-group='BRUSHES & ROLLERS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Paint Brushes</li>
                    <li className='cursor-pointer py-1'>Rollers</li>
                    <li className='cursor-pointer py-1'>Spray Paints</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>WATERPROOFING & FILLERS</h4>
                  <ul data-group='WATERPROOFING & FILLERS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Crack Fillers</li>
                    <li className='cursor-pointer py-1'>Waterproof Basecoat</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>PAINTING ACCESSORIES</h4>
                  <ul data-group='PAINTING ACCESSORIES' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Sandpaper Rolls</li>
                    <li className='cursor-pointer py-1'>Painting Tools</li>
                    <li className='cursor-pointer py-1'>Stencils</li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>WOOD FINISHES</h4>
                  <ul data-group='WOOD FINISHES' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Polish</li>
                    <li className='cursor-pointer py-1'>Varnish & Black Board Paint</li>
                    <li className='cursor-pointer py-1'>Melamyne</li>
                    <li className='cursor-pointer py-1'>PU</li>
                    <li className='cursor-pointer py-1'>Sealer</li>
                    <li className='cursor-pointer py-1'>NC</li>
                    <li className='cursor-pointer py-1'>Glass Coatings</li>
                    <li className='cursor-pointer py-1'>Wood Putty</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>ADHESIVE & THINNER</h4>
                  <ul data-group='ADHESIVE & THINNER' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Adhesive</li>
                    <li className='cursor-pointer py-1'>Thinner</li>
                  </ul>
                </div>

                {/* Column */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>WALL PUTTY</h4>
                  <ul data-group='WALL PUTTY' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Powder Wall Putty</li>
                    <li className='cursor-pointer py-1'>Acrylic Wall Putty</li>
                    <li className='cursor-pointer py-1'>KPF Wall Putty</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>AUTOMOTIVE PAINTS</h4>
                  <ul data-group='AUTOMOTIVE PAINTS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Aspa paints</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>TOP BRANDS</h4>
                  <ul data-group='TOP BRANDS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Asian Paints</li>
                    <li className='cursor-pointer py-1'>Jk Wall Putty</li>
                    <li className='cursor-pointer py-1'>Gem Paints</li>
                    <li className='cursor-pointer py-1'>Agsar Paints</li>
                  </ul>
                </div>
              </div>
            )}
            {/* Mega Menu for PAINTS */}
            {item.label === 'ELECTRICALS' && (
              <div onClick={(e)=>handleMenuClick(e,'ELECTRICALS')} className={`absolute top-full left-0 mt-2 w-[70rem] bg-white/95 text-black border border-gray-200 rounded-xl shadow-2xl p-6 ${openMenu === 'ELECTRICALS' ? 'grid' : 'hidden'} grid-cols-6 gap-6 z-60 backdrop-blur-sm`}>
                {/* Column 1 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>LIGHTING</h4>
                  <ul data-group='LIGHTING' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Light Electronics</li>
                    <li className='cursor-pointer py-1'>Lamps</li>
                    <li className='cursor-pointer py-1'>Reflectors</li>
                    <li className='cursor-pointer py-1'>Standard Incandescent</li>
                    <li className='cursor-pointer py-1'>CFL</li>
                    <li className='cursor-pointer py-1'>Desk Light</li>
                    <li className='cursor-pointer py-1'>Focus Light</li>
                  </ul>
                </div>
                {/* Column 2 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>LED LIGHTING</h4>
                  <ul data-group='LED LIGHTING' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Tube Light</li>
                    <li className='cursor-pointer py-1'>LED Bulbs</li>
                    <li className='cursor-pointer py-1'>LED DownLighters/Spot Light</li>
                    <li className='cursor-pointer py-1'>LED Strips</li>
                    <li className='cursor-pointer py-1'>Ceiling Light</li>
                    <li className='cursor-pointer py-1'>Wall Light</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'> PLUGS & ADAPTORS</h4>
                  <ul data-group='PLUGS & ADAPTORS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Pin Top</li>
                    <li className='cursor-pointer py-1'>Adaptors</li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>FANS</h4>
                  <ul data-group='FANS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Ceiling Fans</li>
                    <li className='cursor-pointer py-1'>Cabin Fans</li>
                    <li className='cursor-pointer py-1'>Ventilation/Exhaust</li>
                    <li className='cursor-pointer py-1'>Wall Mounting Fans</li>
                    <li className='cursor-pointer py-1'>Pedestal Fans</li>
                    <li className='cursor-pointer py-1'>Table Fans</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>CABLES & WIRES</h4>
                  <ul data-group='CABLES & WIRES' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>House Wires</li>
                    <li className='cursor-pointer py-1'>Flexible Wires</li>
                  </ul>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>WATER PUMPS</h4>
                  <ul data-group='WATER PUMPS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Motors</li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>SWITCHES & GEARS</h4>
                  <ul data-group='SWITCHES & GEARS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Switches</li>
                    <li className='cursor-pointer py-1'>Dimmer</li>
                    <li className='cursor-pointer py-1'>Sockets</li>
                    <li className='cursor-pointer py-1'>Regulators</li>
                    <li className='cursor-pointer py-1'>Indicator</li>
                    <li className='cursor-pointer py-1'>DP-switch</li>
                    <li className='cursor-pointer py-1'>TV Outlets</li>
                    <li className='cursor-pointer py-1'>Switch Socket Combined</li>
                    <li className='cursor-pointer py-1'>Switch Plates</li>
                    <li className='cursor-pointer py-1'>Ceiling Roses</li>
                  </ul>
                </div>

                {/* Column 5 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>PROTECTION DEVICES</h4>
                  <ul data-group='PROTECTION DEVICES' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>MCB</li>
                    <li className='cursor-pointer py-1'>ELCBs OR RCCBs</li>
                    <li className='cursor-pointer py-1'>Distribution Boards</li>
                    <li className='cursor-pointer py-1'>Fuse Carriers</li>
                    <li className='cursor-pointer py-1'>KIT KAT Fuses</li>
                    <li className='cursor-pointer py-1'>Isolators</li>
                  </ul>

                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase mt-4 pb-2 mb-3 border-b'>MODULAR/SURFACE BOX</h4>
                  <ul data-group='MODULAR/SURFACE BOX' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Electrical Fittings</li>
                    <li className='cursor-pointer py-1'>Flexible Conduit</li>
                    <li className='cursor-pointer py-1'>Holders</li>
                  </ul>
                </div>

                {/* Column 6 */}
                <div>
                  <h4 className='text-xs font-bold tracking-wider text-gray-500 uppercase pb-2 mb-3 border-b'>OTHERS</h4>
                  <ul data-group='OTHERS' className='space-y-0 divide-y divide-gray-200 text-sm text-gray-700'>
                    <li className='cursor-pointer py-1'>Rotatory Switch</li>
                    <li className='cursor-pointer py-1'>Power Strips</li>
                    <li className='cursor-pointer py-1'>Insulation Tapes</li>
                    <li className='cursor-pointer py-1'>PVC Clips</li>
                    <li className='cursor-pointer py-1'>Earthing Accessories</li>
                    <li className='cursor-pointer py-1'>Jacks</li>
                  </ul>
                </div>
              </div>
            )}
            {item.label === 'SANITARY WARE & FAUCETS' && (
              <div onClick={(e)=>handleMenuClick(e,'SANITARY WARE & FAUCETS')} className={`absolute top-full left-0 mt-2 w-[32rem] bg-white/95 text-black border border-gray-200 rounded-xl shadow-2xl p-6 ${openMenu === 'SANITARY WARE & FAUCETS' ? 'block' : 'hidden'} z-60 backdrop-blur-sm`}>
                {/* Column 1 */}
                <ul className='grid grid-cols-2 gap-4 text-sm text-gray-700'>
                  <li className='cursor-pointer'>Acrylic Products</li>
                  <li className='cursor-pointer'>Bathsense</li>
                  <li className='cursor-pointer'>Coral bath fixtures</li>
                  <li className='cursor-pointer'>Essess</li>
                  <li className='cursor-pointer'>Corsa</li>
                  <li className='cursor-pointer'>Hindware</li>
                  <li className='cursor-pointer'>Parryware</li>
                  <li className='cursor-pointer'>Leo Bath Fittings</li>
                  <li className='cursor-pointer'>WaterTec</li>
                  <li className='cursor-pointer'>Hardware & Bathroom Accessories</li>
                  <li className='cursor-pointer'>Taps</li>
                </ul>
              </div>
            )}
            {item.label === 'TOOLS' && (
              <div onClick={(e)=>handleMenuClick(e,'TOOLS')} className={`absolute top-full left-0 mt-2 w-[28rem] bg-white/95 text-black border border-gray-200 rounded-xl shadow-2xl p-6 ${openMenu === 'TOOLS' ? 'block' : 'hidden'} z-60 backdrop-blur-sm`}>
                {/* Column 1 */}
                <ul className='grid grid-cols-2 gap-3 text-sm text-gray-700'>
                  <li className='cursor-pointer'>Hand Tools</li>
                  <li className='cursor-pointer'>Abrasives</li>
                  <li className='cursor-pointer'>Allen Keys</li>
                  <li className='cursor-pointer'>Brush</li>
                  <li className='cursor-pointer'>Carpenter Pincer</li>
                  <li className='cursor-pointer'>Chisels</li>
                  <li className='cursor-pointer'>Clamps</li>
                  <li className='cursor-pointer'>Cutters</li>
                  <li className='cursor-pointer'>Files</li>
                  <li className='cursor-pointer'>Garden Tools</li>
                  <li className='cursor-pointer'>Glue Gun</li>
                  <li className='cursor-pointer'>Grease Gun</li>
                  <li className='cursor-pointer'>Hammer</li>
                  <li className='cursor-pointer'>Level</li>
                  <li className='cursor-pointer'>Lubrications</li>
                  <li className='cursor-pointer'>Piler</li>
                  <li className='cursor-pointer'>Polishing Accessories</li>
                  <li className='cursor-pointer'>Power Tools</li>
                  <li className='cursor-pointer'>Screw Driver</li>
                  <li className='cursor-pointer'>Socket Set</li>
                  <li className='cursor-pointer'>Spare Mallets</li>
                  <li className='cursor-pointer'>Spanner</li>
                  <li className='cursor-pointer'>Wrench</li>
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      </nav>
      {/* Bottom strip */}
    </div>
  );
}
