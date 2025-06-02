import React from 'react';

const navItems = [
  { label: 'HOME', href: '#', active: true },
  { label: 'SHOP', href: '#' },
  { label: 'PAINTS', href: '#', hasDropdown: true },
  { label: 'ELECTRICALS', href: '#', hasDropdown: true },
  { label: 'SANITARY WARE & FAUCETS', href: '#', hasDropdown: true },
  { label: 'CEMENTS & POP', href: '#' },
  { label: 'ADHESIVE', href: '#' },
  { label: 'CLEANING', href: '#' },
  { label: 'TOOLS', href: '#', hasDropdown: true },
  { label: 'TRACKING', href: '#' },
];

export default function Navbar() {
  return (
    <nav className='bg-black w-full text-white'>
      <ul className='flex items-center px-2 py-2'>
        {navItems.map((item) => (
          <li key={item.label} className='relative group px-3'>
            <a
              href={item.href}
              className={`text-sm px-1 py-2 rounded-full transition-all duration-300
                ${
                  item.active
                    ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                    : 'hover:bg-yellow-400'
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
              <div className='absolute top-full left-0 w-[70rem] bg-white text-black shadow-lg p-6 hidden group-hover:grid grid-cols-5 gap-2 z-50'>
                {/* Column 1 */}
                <div>
                  <h4 className='font-bold mb-2'>EMULSION</h4>
                  <ul className='space-y-1'>
                    <li>Interior Emulsion</li>
                    <li>Exterior Emulsion</li>
                    <li>Wall Texture</li>
                    <li>Tile Guard</li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>ENAMEL</h4>
                  <ul className='space-y-1'>
                    <li>Satin Enamel</li>
                    <li>Gloss Enamel</li>
                    <li>Synthetic Enamel</li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>DISTEMPER</h4>
                  <ul className='space-y-1'>
                    <li>Acrylic Distemper</li>
                    <li>Synthetic Distemper</li>
                  </ul>
                </div>

                {/* Column 2 */}
                <div>
                  <h4 className='font-bold mb-2'>PRIMER</h4>
                  <ul className='space-y-1'>
                    <li>Interior Primer</li>
                    <li>Exterior Primer</li>
                    <li>Cement Primer</li>
                    <li>Wood Primer</li>
                    <li>Metal Primer</li>
                    <li>Acrylic Primer</li>
                    <li>Solvent Primer</li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>STAINERS</h4>
                  <ul className='space-y-1'>
                    <li>Universal Stainers</li>
                    <li>Wood Stainers</li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div>
                  <h4 className='font-bold mb-2'>BRUSHES & ROLLERS</h4>
                  <ul className='space-y-1'>
                    <li>Paint Brushes</li>
                    <li>Rollers</li>
                    <li>Spray Paints</li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>
                    WATERPROOFING & FILLERS
                  </h4>
                  <ul className='space-y-1'>
                    <li>Crack Fillers</li>
                    <li>Waterproof Basecoat</li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>PAINTING ACCESSORIES</h4>
                  <ul className='space-y-1'>
                    <li>Sandpaper Rolls</li>
                    <li>Painting Tools</li>
                    <li>Stencils</li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div>
                  <h4 className='font-bold mb-2'>WOOD FINISHES</h4>
                  <ul className='space-y-1'>
                    <li>Polish</li>
                    <li>Varnish & Black Board Paint</li>
                    <li>Melamyne</li>
                    <li>PU</li>
                    <li>Sealer</li>
                    <li>NC</li>
                    <li>Glass Coatings</li>
                    <li>Wood Putty</li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>ADHESIVE & THINNER</h4>
                  <ul className='space-y-1'>
                    <li>Adhesive</li>
                    <li>Thinner</li>
                  </ul>
                </div>

                {/* Column 5 */}
                <div>
                  <h4 className='font-bold mb-2'>WALL PUTTY</h4>
                  <ul className='space-y-1'>
                    <li>Powder Wall Putty</li>
                    <li>Acrylic Wall Putty</li>
                    <li>KPF Wall Putty</li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>AUTOMOTIVE PAINTS</h4>
                  <ul className='space-y-1'>
                    <li>Aspa paints</li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>TOP BRANDS</h4>
                  <ul className='space-y-1'>
                    <li>Asian Paints</li>
                    <li>Jk Wall Putty</li>
                    <li>Gem Paints</li>
                    <li>Agsar Paints</li>
                  </ul>
                </div>
              </div>
            )}
            {/* Mega Menu for PAINTS */}
            {item.label === 'ELECTRICALS' && (
              <div className='absolute top-full left-0 w-[70rem] bg-white text-black shadow-lg p-6 hidden group-hover:grid grid-cols-6 gap-2 z-50'>
                {/* Column 1 */}
                <div>
                  <h4 className='font-bold mb-2'>LIGHTING</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>Light Electronics</a>
                    </li>
                    <li>
                      <a href='#'>Lamps</a>
                    </li>
                    <li>
                      <a href='#'>Reflectors</a>
                    </li>
                    <li>
                      <a href='#'>Standard Incandescent</a>
                    </li>
                    <li>
                      <a href='#'>CFL</a>
                    </li>
                    <li>
                      <a href='#'>Desk Light</a>
                    </li>
                    <li>
                      <a href='#'>Focus Light</a>
                    </li>
                  </ul>
                </div>
                {/* Column 2 */}
                <div>
                  <h4 className='font-bold mb-2'>LED LIGHTING</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>Tube Light</a>
                    </li>
                    <li>
                      <a href='#'>LED Bulbs</a>
                    </li>
                    <li>
                      <a href='#'>LED DownLighters/Spot Light</a>
                    </li>
                    <li>
                      <a href='#'>LED Strips</a>
                    </li>
                    <li>
                      <a href='#'>Ceiling Light</a>
                    </li>
                    <li>
                      <a href='#'>Wall Light</a>
                    </li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'> PLUGS & ADAPTORS</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>Pin Top</a>
                    </li>
                    <li>
                      <a href='#'>Adaptors</a>
                    </li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div>
                  <h4 className='font-bold mb-2'>FANS</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>Ceiling Fans</a>
                    </li>
                    <li>
                      <a href='#'>Cabin Fans</a>
                    </li>
                    <li>
                      <a href='#'>Ventilation/Exhaust</a>
                    </li>
                    <li>
                      <a href='#'>Wall Mounting Fans</a>
                    </li>
                    <li>
                      <a href='#'>Pedestal Fans</a>
                    </li>
                    <li>
                      <a href='#'>Table Fans</a>
                    </li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>CABLES & WIRES</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>House Wires</a>
                    </li>
                    <li>
                      <a href='#'>Flexible Wires</a>
                    </li>
                  </ul>
                  <h4 className='font-bold mt-4 mb-2'>WATER PUMPS</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>Motors</a>
                    </li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div>
                  <h4 className='font-bold mb-2'>SWITCHES & GEARS</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>Switches</a>
                    </li>
                    <li>
                      <a href='#'>Dimmer</a>
                    </li>
                    <li>
                      <a href='#'>Sockets</a>
                    </li>
                    <li>
                      <a href='#'>Regulators</a>
                    </li>
                    <li>
                      <a href='#'>Indicator</a>
                    </li>
                    <li>
                      <a href='#'>DP-switch</a>
                    </li>
                    <li>
                      <a href='#'>TV Outlets</a>
                    </li>
                    <li>
                      <a href='#'>Switch Socket Combined</a>
                    </li>
                    <li>
                      <a href='#'>Switch Plates</a>
                    </li>
                    <li>
                      <a href='#'>Ceiling Roses</a>
                    </li>
                  </ul>
                </div>

                {/* Column 5 */}
                <div>
                  <h4 className='font-bold mb-2'>PROTECTION DEVICES</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>MCB</a>
                    </li>
                    <li>
                      <a href='#'>ELCBs OR RCCBs</a>
                    </li>
                    <li>
                      <a href='#'>Distribution Boards</a>
                    </li>
                    <li>
                      <a href='#'>Fuse Carriers</a>
                    </li>
                    <li>
                      <a href='#'>KIT KAT Fuses</a>
                    </li>
                    <li>
                      <a href='#'>Isolators</a>
                    </li>
                  </ul>

                  <h4 className='font-bold mt-4 mb-2'>MODULAR/SURFACE BOX</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>Electrical Fittings</a>
                    </li>
                    <li>
                      <a href='#'>Flexible Conduit</a>
                    </li>
                    <li>
                      <a href='#'>Holders</a>
                    </li>
                  </ul>
                </div>

                {/* Column 6 */}
                <div>
                  <h4 className='font-bold mb-2'>OTHERS</h4>
                  <ul className='space-y-1'>
                    <li>
                      <a href='#'>Rotatory Switch</a>
                    </li>
                    <li>
                      <a href='#'>Power Strips</a>
                    </li>
                    <li>
                      <a href='#'>Insulation Tapes</a>
                    </li>
                    <li>
                      <a href='#'>PVC Clips</a>
                    </li>
                    <li>
                      <a href='#'>Earthing Accessories</a>
                    </li>
                    <li>
                      <a href='#'>Jacks</a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {item.label === 'SANITARY WARE & FAUCETS' && (
              <div className='absolute top-full left-0 w-[20rem] bg-white text-black shadow-lg p-6 hidden group-hover:grid  gap-2 z-50'>
                {/* Column 1 */}
                <ul class='submenu'>
                  <li>
                    <a href='#'>Acrylic Products</a>
                  </li>
                  <li>
                    <a href='#'>Bathsense</a>
                  </li>
                  <li>
                    <a href='#'>Coral bath fixtures</a>
                  </li>
                  <li>
                    <a href='#'>Essess</a>
                  </li>
                  <li>
                    <a href='#'>Corsa</a>
                  </li>
                  <li>
                    <a href='#'>Hindware</a>
                  </li>
                  <li>
                    <a href='#'>Parryware</a>
                  </li>
                  <li>
                    <a href='#'>Leo Bath Fittings</a>
                  </li>
                  <li>
                    <a href='#'>WaterTec</a>
                  </li>
                  <li>
                    <a href='#'>Hardware & Bathroom Accessories</a>
                  </li>
                  <li>
                    <a href='#'>Taps</a>
                  </li>
                </ul>
              </div>
            )}
            {item.label === 'TOOLS' && (
              <div className='absolute top-full left-0 w-[15rem] bg-white text-black shadow-lg p-6 hidden group-hover:grid  gap-2 z-50'>
                {/* Column 1 */}
                <ul>
                  <li>
                    <a href='/tools/hand-tools'>hand tools</a>
                  </li>
                  <li>
                    <a href='/tools/abrasives'>abrasives</a>
                  </li>
                  <li>
                    <a href='/tools/allen-keys'>Allen Keys</a>
                  </li>
                  <li>
                    <a href='/tools/brush'>Brush</a>
                  </li>
                  <li>
                    <a href='/tools/carpenter-pincer'>Carpenter Pincer</a>
                  </li>
                  <li>
                    <a href='/tools/chisels'>Chisels</a>
                  </li>
                  <li>
                    <a href='/tools/clamps'>Clamps</a>
                  </li>
                  <li>
                    <a href='/tools/cutters'>Cutters</a>
                  </li>
                  <li>
                    <a href='/tools/files'>files</a>
                  </li>
                  <li>
                    <a href='/tools/garden-tools'>Garden Tools</a>
                  </li>
                  <li>
                    <a href='/tools/glue-gun'>glue gun</a>
                  </li>
                  <li>
                    <a href='/tools/grease-gun'>Grease Gun</a>
                  </li>
                  <li>
                    <a href='/tools/hammer'>Hammer</a>
                  </li>
                  <li>
                    <a href='/tools/level'>level</a>
                  </li>
                  <li>
                    <a href='/tools/lubrications'>Lubrications</a>
                  </li>
                  <li>
                    <a href='/tools/piler'>Piler</a>
                  </li>
                  <li>
                    <a href='/tools/polishing-accessories'>
                      Polishing Accessories
                    </a>
                  </li>
                  <li>
                    <a href='/tools/power-tools'>power tools</a>
                  </li>
                  <li>
                    <a href='/tools/screw-driver'>Screw Driver</a>
                  </li>
                  <li>
                    <a href='/tools/socket-set'>Socket Set</a>
                  </li>
                  <li>
                    <a href='/tools/spare-mallets'>Spare Mallets</a>
                  </li>
                  <li>
                    <a href='/tools/spanner'>spanner</a>
                  </li>
                  <li>
                    <a href='/tools/wrench'>wrench</a>
                  </li>
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
