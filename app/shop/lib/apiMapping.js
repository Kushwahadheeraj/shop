// Comprehensive API mapping for all ShopPage endpoints
// This file maps URL paths to their corresponding API endpoints

export const API_MAPPINGS = {
  // Main categories
  'adhesives': 'adhesives/get',
  'brush': 'brush/get',
  'cements': 'cements/get',
  'cleaning': 'cleaning/get',
  'dry': 'dry/get',
  'fiber': 'fiber/get',
  'fitting': 'fitting/get',
  'hardware': 'hardware/get',
  'home': 'home/get',
  'homedecor': 'homedecor/get',
  'uncategorized': 'uncategorized/get',
  'pvcmats': 'pvcmats/get',
  'roofer': 'roofer/get',
  'waterproofing': 'waterproofing/get',

  // Electrical subcategories
  'electrical': 'electrical/get',
  'electrical/adaptors': 'electrical/adaptors/get',
  'electrical/ceilingroses': 'electrical/ceilingRoses/get',
  'electrical/dimmer': 'electrical/dimmer/get',
  'electrical/distributionboards': 'electrical/distributionBoards/get',
  'electrical/doorbells': 'electrical/doorBells/get',
  'electrical/dpswitch': 'electrical/dPswitch/get',
  'electrical/earthingaccessories': 'electrical/earthingAccessories/get',
  'electrical/elcbsrccbs': 'electrical/eLCBsRCCBs/get', // Backend route: /eLCBsRCCBs/get (exact case match)
  'electrical/elcbsorrccbs': 'electrical/eLCBsRCCBs/get', // Alternative spelling: "ELCBs OR RCCBs" -> elcbsorrccbs
  'electrical/flexibleconduit': 'electrical/flexibleConduit/get',
  'electrical/flexiblewires': 'electrical/flexibleWires/get',
  'electrical/fusecarriers': 'electrical/fuseCarriers/get',
  'electrical/holders': 'electrical/holders/get',
  'electrical/indicator': 'electrical/indicator/get',
  'electrical/insulationtapes': 'electrical/insulationTapes/get',
  'electrical/isolators': 'electrical/isolators/get',
  'electrical/jacks': 'electrical/jacks/get',
  'electrical/kitkatfuses': 'electrical/kITKATFuses/get',
  'electrical/mainswitch': 'electrical/mainSwitch/get',
  'electrical/mcb': 'electrical/mCB/get',
  'electrical/modularsurfacebox': 'electrical/modularSurfaceBox/get',
  'electrical/motors': 'electrical/motors/get',
  'electrical/motorstarters': 'electrical/motorStarters/get',
  'electrical/others': 'electrical/others/get',
  'electrical/pintop': 'electrical/pinTop/get',
  'electrical/plug': 'electrical/plug/get',
  'electrical/powerstrips': 'electrical/powerStrips/get',
  'electrical/pvcclips': 'electrical/pvCClips/get',
  'electrical/regulators': 'electrical/regulators/get',
  'electrical/rotaryswitch': 'electrical/rotarySwitch/get',
  'electrical/sockets': 'electrical/sockets/get',
  'electrical/switchandsocket': 'electrical/switchAndSocket/get',
  'electrical/switches': 'electrical/switches/get',
  'electrical/switchplates': 'electrical/switchPlates/get',
  'electrical/traveladaptor': 'electrical/travelAdaptor/get',
  'electrical/tvoutlets': 'electrical/tVOutlets/get',
  'electrical/uniswitch': 'electrical/uniSwitch/get',
  'electrical/waterheater': 'electrical/waterHeater/get',
  'electrical/wiresandcables': 'electrical/wiresAndCables/get',

  // Electrical Fittings
  'electrical/accessories': 'electrical/accessories/get',
  'electrical/circulardeepbox': 'electrical/circulardeepbox/get',
  'electrical/circularsurfacebox': 'electrical/circularsurfacebox/get',
  'electrical/rigidtype': 'electrical/rigidtype/get',

  // Fans
  'electrical/cabinfans': 'electrical/cabinfans/get',
  'electrical/ceilingfans': 'electrical/ceilingfans/get',
  'electrical/pedestalfans': 'electrical/pedestalfans/get',
  'electrical/tablefans': 'electrical/tablefans/get',
  'electrical/ventilationexhaustfans': 'electrical/ventilationexhaustfans/get',
  'electrical/wallmountingfans': 'electrical/wallmountingfans/get',

  // Lights (direct paths)
  'electrical/ceilinglight': 'electrical/ceilinglight/get',
  'electrical/cfl': 'electrical/cfl/get',
  'electrical/desklight': 'electrical/desklight/get',
  'electrical/focuslight': 'electrical/focuslight/get',
  'electrical/gardenlight': 'electrical/gardenlight/get',
  'electrical/gatelight': 'electrical/gatelight/get',
  'electrical/gls': 'electrical/gls/get',
  'electrical/home': 'electrical/home/get',
  'electrical/lamps': 'electrical/lamps/get',
  'electrical/ledbatten': 'electrical/ledbatten/get',
  'electrical/ledbulbs': 'electrical/ledbulbs/get',
  'electrical/leddownlightersspotlight': 'electrical/leddownlightersspotlight/get',
  'electrical/ledluminaires': 'electrical/ledluminaires/get',
  'electrical/ledpanellight': 'electrical/ledpanellight/get',
  'electrical/ledspotlight': 'electrical/ledspotlight/get',
  'electrical/ledstreetlight': 'electrical/ledstreetlight/get',
  'electrical/ledstrips': 'electrical/ledstrips/get',
  'electrical/ledsurfacelight': 'electrical/ledsurfacelight/get',
  'electrical/lightelectronics': 'electrical/lightelectronics/get',
  'electrical/mirrorlight': 'electrical/mirrorlight/get',
  'electrical/reflections': 'electrical/reflections/get',
  'electrical/standardincandescent': 'electrical/standardincandescent/get',
  'electrical/tbulb': 'electrical/tbulb/get',
  'electrical/tubelight': 'electrical/tubelight/get',
  'electrical/underwaterlights': 'electrical/underwaterlights/get',
  'electrical/walllight': 'electrical/walllight/get',
  
  // Lights group (skip "lights" group name - all light types are direct routes)
  'electrical/lights/ceilinglight': 'electrical/ceilinglight/get',
  'electrical/lights/cfl': 'electrical/cfl/get',
  'electrical/lights/desklight': 'electrical/desklight/get',
  'electrical/lights/focuslight': 'electrical/focuslight/get',
  'electrical/lights/gardenlight': 'electrical/gardenlight/get',
  'electrical/lights/gatelight': 'electrical/gatelight/get',
  'electrical/lights/gls': 'electrical/gls/get',
  'electrical/lights/home': 'electrical/home/get',
  'electrical/lights/lamps': 'electrical/lamps/get',
  'electrical/lights/ledbatten': 'electrical/ledbatten/get',
  'electrical/lights/ledbulbs': 'electrical/ledbulbs/get',
  'electrical/lights/leddownlightersspotlight': 'electrical/leddownlightersspotlight/get',
  'electrical/lights/ledluminaires': 'electrical/ledluminaires/get',
  'electrical/lights/ledpanellight': 'electrical/ledpanellight/get',
  'electrical/lights/ledspotlight': 'electrical/ledspotlight/get',
  'electrical/lights/ledstreetlight': 'electrical/ledstreetlight/get',
  'electrical/lights/ledstrips': 'electrical/ledstrips/get',
  'electrical/lights/ledsurfacelight': 'electrical/ledsurfacelight/get',
  'electrical/lights/lightelectronics': 'electrical/lightelectronics/get',
  'electrical/lights/mirrorlight': 'electrical/mirrorlight/get',
  'electrical/lights/reflections': 'electrical/reflections/get',
  'electrical/lights/standardincandescent': 'electrical/standardincandescent/get',
  'electrical/lights/tbulb': 'electrical/tbulb/get',
  'electrical/lights/tubelight': 'electrical/tubelight/get',
  'electrical/lights/underwaterlights': 'electrical/underwaterlights/get',
  'electrical/lights/walllight': 'electrical/walllight/get',

  // Lights with LIGHTING group (skip group name)
  'electrical/lighting/lightelectronics': 'electrical/lightelectronics/get',
  'electrical/lighting/lamps': 'electrical/lamps/get',
  'electrical/lighting/reflections': 'electrical/reflections/get',
  'electrical/lighting/reflectors': 'electrical/reflections/get',
  'electrical/lighting/standardincandescent': 'electrical/standardincandescent/get',
  'electrical/lighting/cfl': 'electrical/cfl/get',
  'electrical/lighting/desklight': 'electrical/desklight/get',
  'electrical/lighting/focuslight': 'electrical/focuslight/get',

  // LED LIGHTING group (skip group name)
  'electrical/ledlighting/tubelight': 'electrical/tubelight/get',
  'electrical/ledlighting/ledbulbs': 'electrical/ledbulbs/get',
  'electrical/ledlighting/leddownlightersspotlight': 'electrical/leddownlightersspotlight/get',
  'electrical/ledlighting/ledstrips': 'electrical/ledstrips/get',
  'electrical/ledlighting/ceilinglight': 'electrical/ceilinglight/get',
  'electrical/ledlighting/walllight': 'electrical/walllight/get',

  // FANS group (skip group name)
  'electrical/fans/ceilingfans': 'electrical/ceilingfans/get',
  'electrical/fans/cabinfans': 'electrical/cabinfans/get',
  'electrical/fans/ventilationexhaustfans': 'electrical/ventilationexhaustfans/get',
  'electrical/fans/ventilationexhaust': 'electrical/ventilationexhaustfans/get',
  'electrical/fans/wallmountingfans': 'electrical/wallmountingfans/get',
  'electrical/fans/pedestalfans': 'electrical/pedestalfans/get',
  'electrical/fans/tablefans': 'electrical/tablefans/get',

  // CABLES & WIRES group
  'electrical/cableswires/housewires': 'electrical/wiresandcables/get',
  'electrical/cableswires/flexiblewires': 'electrical/flexiblewires/get',

  // WATER PUMPS group
  'electrical/waterpumps/motors': 'electrical/motors/get',

  // PLUGS & ADAPTORS group
  'electrical/plugsadaptors/pintop': 'electrical/pintop/get',
  'electrical/plugsadaptors/adaptors': 'electrical/adaptors/get',

  // SWITCHES & GEARS group
  'electrical/switchesgears/switches': 'electrical/switches/get',
  'electrical/switchesgears/dimmer': 'electrical/dimmer/get',
  'electrical/switchesgears/sockets': 'electrical/sockets/get',
  'electrical/switchesgears/regulators': 'electrical/regulators/get',
  'electrical/switchesgears/indicator': 'electrical/indicator/get',
  'electrical/switchesgears/dpswitch': 'electrical/dPswitch/get',
  'electrical/switchesgears/tvoutlets': 'electrical/tVOutlets/get',
  'electrical/switchesgears/switchsocketcombined': 'electrical/switchAndSocket/get',
  'electrical/switchesgears/switchplates': 'electrical/switchPlates/get',
  'electrical/switchesgears/ceilingroses': 'electrical/ceilingRoses/get',

  // PROTECTION DEVICES group
  'electrical/protectiondevices/mcb': 'electrical/mCB/get',
  'electrical/protectiondevices/elcbsorrccbs': 'electrical/eLCBsRCCBs/get', // "ELCBs OR RCCBs" -> elcbsorrccbs
  'electrical/protectiondevices/elcbsrccbs': 'electrical/eLCBsRCCBs/get', // Alternative: elcbsrccbs
  'electrical/protectiondevices/distributionboards': 'electrical/distributionBoards/get',
  'electrical/protectiondevices/fusecarriers': 'electrical/fuseCarriers/get',
  'electrical/protectiondevices/kitkatfuses': 'electrical/kITKATFuses/get',
  'electrical/protectiondevices/isolators': 'electrical/isolators/get',

  // MODULAR/SURFACE BOX group
  'electrical/modularsurfacebox/electricalfittings': 'electrical/electricalFittings/get',
  'electrical/modularsurfacebox/flexibleconduit': 'electrical/flexibleConduit/get',
  'electrical/modularsurfacebox/holders': 'electrical/holders/get',
  
  // ELECTRICAL FITTINGS group (accessories, circulardeepbox, etc. are direct routes, not nested)
  'electrical/electricalfittings/accessories': 'electrical/accessories/get',
  'electrical/electricalfittings/circulardeepbox': 'electrical/circulardeepbox/get',
  'electrical/electricalfittings/circularsurfacebox': 'electrical/circularsurfacebox/get',
  'electrical/electricalfittings/rigidtype': 'electrical/rigidtype/get',

  // Locks subcategories
  'locks': 'locks/get',
  'locks/patchfittings': 'locks/patch-fittings/get',
  'locks/mortiselockbody': 'locks/mortise-lock-body/get',
  'locks/morticelocks': 'locks/mortice-locks/get',

  // Door Accessories
  'locks/dooraccessories': 'locks/door-accessories/get',
  'locks/dooraccessories/concealedhinges': 'locks/door-accessories/concealed-hinges/get',
  'locks/dooraccessories/dooreye': 'locks/door-accessories/door-eye/get',
  'locks/dooraccessories/doorstopper': 'locks/door-accessories/door-stopper/get',
  'locks/dooraccessories/hinges': 'locks/door-accessories/hinges/get',
  'locks/dooraccessories/magneticdoorstoppers': 'locks/door-accessories/magnetic-door-stoppers/get',
  'locks/dooraccessories/woodenslidingdoorfittings': 'locks/door-accessories/wooden-sliding-door-fittings/get',
  'locks/dooraccessories/ballbearingdoorhinges': 'locks/door-accessories/ball-bearing-door-hinges/get',

  // Door Controls
  'locks/doorcontrols': 'locks/door-controls/get',
  'locks/doorcontrols/doorcloser': 'locks/door-controls/door-closer/get',
  'locks/doorcontrols/doorstopper': 'locks/door-controls/door-stopper/get',
  'locks/doorcontrols/hydraulicdoorclosers': 'locks/door-controls/hydraulic-door-closers/get',

  // Door Handles
  'locks/doorhandles': 'locks/door-handles/get',
  'locks/doorhandles/doorkings': 'locks/door-handles/door-kings/get',
  'locks/doorhandles/doorpulls': 'locks/door-handles/door-pulls/get',

  // Door Locks
  'locks/doorlocks': 'locks/door-locks/get',
  'locks/doorlocks/dimplekey': 'locks/door-locks/dimple-key/get',
  'locks/doorlocks/diamantpadlocks': 'locks/door-locks/diamant-padlocks/get',
  'locks/doorlocks/deadlocks': 'locks/door-locks/dead-locks/get',
  'locks/doorlocks/cylindricallocks': 'locks/door-locks/cylindrical-locks/get',
  'locks/doorlocks/cupboardlocks': 'locks/door-locks/cupboard-locks/get',
  'locks/doorlocks/centreshutterlocks': 'locks/door-locks/centre-shutter-locks/get',
  'locks/doorlocks/triboltlocks': 'locks/door-locks/tri-bolt-locks/get',
  'locks/doorlocks/smartkey': 'locks/door-locks/smart-key/get',
  'locks/doorlocks/sidelock': 'locks/door-locks/side-lock/get',
  'locks/doorlocks/rimdeadlock': 'locks/door-locks/rim-dead-lock/get',
  'locks/doorlocks/pullhandlesformaindoors': 'locks/door-locks/pull-handles-for-main-doors/get',
  'locks/doorlocks/nightlatch': 'locks/door-locks/night-latch/get',
  'locks/doorlocks/maindoorlock': 'locks/door-locks/main-door-lock/get',
  'locks/doorlocks/knoblocks': 'locks/door-locks/knob-locks/get',
  'locks/doorlocks/jemmyproofdoorlock': 'locks/door-locks/jemmy-proof-door-lock/get',
  'locks/doorlocks/drawerlock': 'locks/door-locks/drawer-lock/get',
  'locks/doorlocks/discpadlocks': 'locks/door-locks/disc-pad-locks/get',

  // Folding Brackets
  'locks/foldingbrackets': 'locks/folding-brackets/get',
  'locks/foldingbrackets/thickdoorhinge': 'locks/folding-brackets/thick-door-hinge/get',
  'locks/foldingbrackets/softclosedrawerchannel': 'locks/folding-brackets/soft-close-drawer-channel/get',
  'locks/foldingbrackets/sliponhinge': 'locks/folding-brackets/slip-on-hinge/get',
  'locks/foldingbrackets/heavydutydrawerslides': 'locks/folding-brackets/heavy-duty-drawer-slides/get',
  'locks/foldingbrackets/foldingbrackets': 'locks/folding-brackets/folding-brackets/get',
  'locks/foldingbrackets/drawerchannels': 'locks/folding-brackets/drawer-channels/get',
  'locks/foldingbrackets/cliponsofthinge': 'locks/folding-brackets/clip-on-soft-hinge/get',
  'locks/foldingbrackets/cliponsofthinge4hole': 'locks/folding-brackets/clip-on-soft-hinge-4-hole/get',
  'locks/foldingbrackets/cabinethinge': 'locks/folding-brackets/cabinet-hinge/get',
  'locks/foldingbrackets/blindcornerhinge': 'locks/folding-brackets/blind-corner-hinge/get',

  // Furniture Fittings
  'locks/furniturefittings': 'locks/furniture-fittings/get',
  'locks/furniturefittings/nuvo': 'locks/furniture-fittings/nuvo/get',
  'locks/furniturefittings/multipurposelock': 'locks/furniture-fittings/multi-purpose-lock/get',
  'locks/furniturefittings/furniturefittings': 'locks/furniture-fittings/furniture-fittings/get',
  'locks/furniturefittings/drawerlocks': 'locks/furniture-fittings/drawer-locks/get',
  'locks/furniturefittings/drawercupboardlock': 'locks/furniture-fittings/drawer-cupboard-lock/get',
  'locks/furniturefittings/curvo': 'locks/furniture-fittings/curvo/get',
  'locks/furniturefittings/supernova': 'locks/furniture-fittings/supernova/get',
  'locks/furniturefittings/tablelock': 'locks/furniture-fittings/table-lock/get',

  // Glass Hardware
  'locks/glasshardware': 'locks/glass-hardware/get',
  'locks/glasshardware/slidingsystem': 'locks/glass-hardware/sliding-system/get',
  'locks/glasshardware/showercubiclehinge': 'locks/glass-hardware/shower-cubicle-hinge/get',
  'locks/glasshardware/glasshardware': 'locks/glass-hardware/glass-hardware/get',
  'locks/glasshardware/glassdoorpullhandle': 'locks/glass-hardware/glass-door-pull-handle/get',
  'locks/glasshardware/glassdoorlock': 'locks/glass-hardware/glass-door-lock/get',
  'locks/glasshardware/glassdoorfitting': 'locks/glass-hardware/glass-door-fitting/get',
  'locks/glasshardware/floorspring': 'locks/glass-hardware/floor-spring/get',
  'locks/glasshardware/floorspringcomboset': 'locks/glass-hardware/floor-spring-combo-set/get',

  // Lever Mortise Locks
  'locks/levermortiselocks': 'locks/lever-mortise-locks/get',
  'locks/levermortiselocks/levermortiselocks': 'locks/lever-mortise-locks/lever-mortise-locks/get',
  'locks/levermortiselocks/exshisecuritycylinders': 'locks/lever-mortise-locks/exshi-security-cylinders/get',
  'locks/levermortiselocks/europrofilemortisepincylinderwithmasterkey': 'locks/lever-mortise-locks/europrofile-mortise-pin-cylinder-with-master-key/get',
  'locks/levermortiselocks/europrofilemortisepincylinder': 'locks/lever-mortise-locks/europrofile-mortise-pin-cylinder/get',
  'locks/levermortiselocks/europrofilemortiselockbodies': 'locks/lever-mortise-locks/europrofile-mortise-lock-bodies/get',
  'locks/levermortiselocks/combipackwith6levermortiselock': 'locks/lever-mortise-locks/combipack-with-6-lever-mortise-lock/get',

  // Padlocks
  'locks/padlocks': 'locks/padlocks/get',
  'locks/padlocks/ultrashutterlocks': 'locks/padlocks/ultra-shutter-locks/get',
  'locks/padlocks/squaretypepadlock': 'locks/padlocks/square-type-padlock/get',
  'locks/padlocks/roundtypepadlock': 'locks/padlocks/round-type-padlock/get',
  'locks/padlocks/premiumpadlocks': 'locks/padlocks/premium-padlocks/get',
  'locks/padlocks/padlocks': 'locks/padlocks/padlocks/get',
  'locks/padlocks/discpadlocks': 'locks/padlocks/disc-padlocks/get',

  // Popular Mortise Series
  'locks/popularmortiseseries': 'locks/popular-mortise-series/get',
  'locks/popularmortiseseries/victoria': 'locks/popular-mortise-series/victoria/get',
  'locks/popularmortiseseries/towylowheightdesign': 'locks/popular-mortise-series/towy-low-height-design/get',
  'locks/popularmortiseseries/ssdtypetubelever': 'locks/popular-mortise-series/ssd-type-tube-lever/get',
  'locks/popularmortiseseries/pullhandles': 'locks/popular-mortise-series/pull-handles/get',
  'locks/popularmortiseseries/popularmortiseseries': 'locks/popular-mortise-series/popular-mortise-series/get',
  'locks/popularmortiseseries/oliver': 'locks/popular-mortise-series/oliver/get',
  'locks/popularmortiseseries/neh16': 'locks/popular-mortise-series/neh16/get',
  'locks/popularmortiseseries/neh15lowheightdesign': 'locks/popular-mortise-series/neh15-low-height-design/get',
  'locks/popularmortiseseries/neh14': 'locks/popular-mortise-series/neh14/get',
  'locks/popularmortiseseries/neh13': 'locks/popular-mortise-series/neh13/get',
  'locks/popularmortiseseries/neh12': 'locks/popular-mortise-series/neh12/get',
  'locks/popularmortiseseries/neh06': 'locks/popular-mortise-series/neh06/get',
  'locks/popularmortiseseries/neh11': 'locks/popular-mortise-series/neh11/get',
  'locks/popularmortiseseries/neh10': 'locks/popular-mortise-series/neh10/get',
  'locks/popularmortiseseries/neh09': 'locks/popular-mortise-series/neh09/get',
  'locks/popularmortiseseries/neh08': 'locks/popular-mortise-series/neh08/get',
  'locks/popularmortiseseries/neh07': 'locks/popular-mortise-series/neh07/get',
  'locks/popularmortiseseries/neh05': 'locks/popular-mortise-series/neh05/get',
  'locks/popularmortiseseries/neh04': 'locks/popular-mortise-series/neh04/get',
  'locks/popularmortiseseries/matiz': 'locks/popular-mortise-series/matiz/get',
  'locks/popularmortiseseries/maindoorset': 'locks/popular-mortise-series/main-door-set/get',
  'locks/popularmortiseseries/gloria': 'locks/popular-mortise-series/gloria/get',
  'locks/popularmortiseseries/cylindricallocks': 'locks/popular-mortise-series/cylindrical-locks/get',
  'locks/popularmortiseseries/cornerfetchseries': 'locks/popular-mortise-series/corner-fetch-series/get',
  'locks/popularmortiseseries/combiset': 'locks/popular-mortise-series/combi-set/get',
  'locks/popularmortiseseries/classiclock': 'locks/popular-mortise-series/classic-lock/get',
  'locks/popularmortiseseries/bm06': 'locks/popular-mortise-series/bm06/get',
  'locks/popularmortiseseries/bm04': 'locks/popular-mortise-series/bm04/get',
  'locks/popularmortiseseries/bm02': 'locks/popular-mortise-series/bm02/get',
  'locks/popularmortiseseries/bm01': 'locks/popular-mortise-series/bm01/get',

  // Premium Mortise Series
  'locks/premiummortiseseries': 'locks/premium-mortise-series/get',
  'locks/premiummortiseseries/sehseries': 'locks/premium-mortise-series/seh-series/get',
  'locks/premiummortiseseries/premiummortiseseries': 'locks/premium-mortise-series/premium-mortise-series/get',
  'locks/premiummortiseseries/phoenix': 'locks/premium-mortise-series/phoenix/get',
  'locks/premiummortiseseries/orbit': 'locks/premium-mortise-series/orbit/get',
  'locks/premiummortiseseries/mercury': 'locks/premium-mortise-series/mercury/get',
  'locks/premiummortiseseries/evva3ksregalismortise': 'locks/premium-mortise-series/evva3ks-regalis-mortise/get',
  'locks/premiummortiseseries/europrofilebrasshandleset240mm': 'locks/premium-mortise-series/europrofile-brass-handle-set-240mm/get',
  'locks/premiummortiseseries/combipackwith240mmeuromortiselock': 'locks/premium-mortise-series/combipack-with-240mm-euro-mortise-lock/get',
  'locks/premiummortiseseries/allurerossetteseries': 'locks/premium-mortise-series/allure-rossette-series/get',

  // Rim Locks
  'locks/rimlocks': 'locks/rim-locks/get',
  'locks/rimlocks/ultraxlvertibolt': 'locks/rim-locks/ultra-xl-vertibolt/get',
  'locks/rimlocks/ultraxlttwinbolt': 'locks/rim-locks/ultra-xl-twinbolt/get',
  'locks/rimlocks/ultraxlttribolt': 'locks/rim-locks/ultra-xl-tribolt/get',
  'locks/rimlocks/ultraxlrimdeadbolt': 'locks/rim-locks/ultra-xl-rim-deadbolt/get',
  'locks/rimlocks/ultravertibolt': 'locks/rim-locks/ultra-vertibolt/get',
  'locks/rimlocks/ultratribolt': 'locks/rim-locks/ultra-tribolt/get',
  'locks/rimlocks/ultraretrofitadaptor': 'locks/rim-locks/ultra-retrofit-adaptor/get',
  'locks/rimlocks/ultralatchboltcarton': 'locks/rim-locks/ultra-latchbolt-carton/get',
  'locks/rimlocks/rimlocks': 'locks/rim-locks/rim-locks/get',
  'locks/rimlocks/pincylinderrimlocks': 'locks/rim-locks/pin-cylinder-rim-locks/get',
  'locks/rimlocks/pentaboltaries': 'locks/rim-locks/pentabolt-aries/get',
  'locks/rimlocks/nightlatch7lever': 'locks/rim-locks/night-latch-7-lever/get',
  'locks/rimlocks/exsastro': 'locks/rim-locks/exs-astro/get',
  'locks/rimlocks/exsaltrix': 'locks/rim-locks/exs-altrix/get',

  // Paint subcategories
  'paint': 'paint/get',
  'paint/acrylicemulsionpaint': 'paint/acrylic-emulsion-paint/get',
  'paint/adhesivethinneradhesive': 'paint/adhesive-thinner-adhesive/get',
  'paint/adhesivethinnerthinner': 'paint/adhesive-thinner-thinner/get',
  'paint/aspapaints': 'paint/aspa-paints/get',
  'paint/automativepaintsaspapaints': 'paint/automative-paints-aspa-paints/get',
  'paint/brushesrollerspaintbrushes': 'paint/brushes-rollers-paint-brushes/get',
  'paint/brushesrollersrollers': 'paint/brushes-rollers-rollers/get',
  'paint/brushesrollersspraypaints': 'paint/brushes-rollers-spray-paints/get',
  'paint/distemperacrylicdistemper': 'paint/distemper-acrylic-distemper/get',
  'paint/distempersyntheticdistemper': 'paint/distemper-synthetic-distemper/get',
  'paint/emulsionexterioremulsion': 'paint/emulsion-exterior-emulsion/get',
  'paint/emulsioninterioremulsion': 'paint/emulsion-interior-emulsion/get',
  'paint/emulsiontileguard': 'paint/emulsion-tile-guard/get',
  'paint/emulsionwalltexture': 'paint/emulsion-wall-texture/get',
  'paint/enamelglossenamel': 'paint/enamel-gloss-enamel/get',
  'paint/enamelsatinenamel': 'paint/enamel-satin-enamel/get',
  'paint/enamelsyntheticenamel': 'paint/enamel-synthetic-enamel/get',
  'paint/exteriorpaints': 'paint/exterior-paints/get',
  'paint/floorpaints': 'paint/floor-paints/get',
  'paint/industrialcoatings': 'paint/industrial-coatings/get',
  'paint/interiorpaints': 'paint/interior-paints/get',
  'paint/paintingaccessoriespaintingtools': 'paint/painting-accessories-painting-tools/get',
  'paint/paintingaccessoriessandpaperrolls': 'paint/painting-accessories-sandpaper-rolls/get',
  'paint/paintingaccessoriesstencils': 'paint/painting-accessories-stencils/get',
  'paint/paintingtools': 'paint/painting-tools/get',
  'paint/primeracrylicprimer': 'paint/primer-acrylic-primer/get',
  'paint/primercementprimer': 'paint/primer-cement-primer/get',
  'paint/primerexteriorprimer': 'paint/primer-exterior-primer/get',
  'paint/primerinteriorprimer': 'paint/primer-interior-primer/get',
  'paint/primermetalprimer': 'paint/primer-metal-primer/get',
  'paint/primersolventprimer': 'paint/primer-solvent-primer/get',
  'paint/primerwoodprimer': 'paint/primer-wood-primer/get',
  'paint/primerandwallputty': 'paint/primer-and-wall-putty/get',
  'paint/sanitizer': 'paint/sanitizer/get',
  'paint/spraypaints': 'paint/spray-paints/get',
  'paint/stainersuniversalstainers': 'paint/stainers-universal-stainers/get',
  'paint/stainerswoodstainers': 'paint/stainers-wood-stainers/get',
  'paint/stainersthinners': 'paint/stainers-thinners/get',
  'paint/stencils': 'paint/stencils/get',
  'paint/tileguard': 'paint/tile-guard/get',
  'paint/topbrandsdulexpaints': 'paint/top-brands-dulex-paints/get',
  'paint/topbrandsasianpaints': 'paint/top-brands-asian-paints/get',
  'paint/topbrandsnerolocpaints': 'paint/top-brands-neroloc-paints/get',
  'paint/topbrandsjkwallputty': 'paint/top-brands-jk-wall-putty/get',
  'paint/wallputtyacrylicwallputty': 'paint/wall-putty-acrylic-wall-putty/get',
  'paint/wallputtykpfwallputty': 'paint/wall-putty-kpf-wall-putty/get',
  'paint/wallputtypowderwallputty': 'paint/wall-putty-powder-wall-putty/get',
  'paint/wallstickerswallpapers': 'paint/wall-stickers-wallpapers/get',
  'paint/waterproofingcrackfillers': 'paint/waterproofing-crack-fillers/get',
  'paint/waterproofingwaterproofbasecoat': 'paint/waterproofing-waterproof-basecoat/get',
  'paint/woodfinishesglasscoatings': 'paint/wood-finishes-glass-coatings/get',
  'paint/woodfinishesmelamyne': 'paint/wood-finishes-melamyne/get',
  'paint/woodfinishesnc': 'paint/wood-finishes-nc/get',
  'paint/woodfinishespolish': 'paint/wood-finishes-polish/get',
  'paint/woodfinishespu': 'paint/wood-finishes-pu/get',
  'paint/woodfinishessealer': 'paint/wood-finishes-sealer/get',
  'paint/woodfinishesvarnishblackboardpaint': 'paint/wood-finishes-varnish-black-board-paint/get',
  'paint/woodfinisheswoodputty': 'paint/wood-finishes-wood-putty/get',
  'paint/woodmetal': 'paint/wood-metal/get',

  // Paint with EMULSION group
  'paint/emulsion/interioremulsion': 'paint/emulsion-interior-emulsion/get',
  'paint/emulsion/exterioremulsion': 'paint/emulsion-exterior-emulsion/get',
  'paint/emulsion/walltexture': 'paint/emulsion-wall-texture/get',
  'paint/emulsion/tileguard': 'paint/emulsion-tile-guard/get',

  // Paint with ENAMEL group
  'paint/enamel/satenamel': 'paint/enamel-satin-enamel/get',
  'paint/enamel/satinenamel': 'paint/enamel-satin-enamel/get', // Alternative spelling
  'paint/enamel/glossenamel': 'paint/enamel-gloss-enamel/get',
  'paint/enamel/syntheticenamel': 'paint/enamel-synthetic-enamel/get',

  // Paint with DISTEMPER group
  'paint/distemper/acrylicdistemper': 'paint/distemper-acrylic-distemper/get',
  'paint/distemper/syntheticdistemper': 'paint/distemper-synthetic-distemper/get',

  // Paint with PRIMER group
  'paint/primer/interiorprimer': 'paint/primer-interior-primer/get',
  'paint/primer/exteriorprimer': 'paint/primer-exterior-primer/get',
  'paint/primer/cementprimer': 'paint/primer-cement-primer/get',
  'paint/primer/woodprimer': 'paint/primer-wood-primer/get',
  'paint/primer/metalprimer': 'paint/primer-metal-primer/get',
  'paint/primer/acrylicprimer': 'paint/primer-acrylic-primer/get',
  'paint/primer/solventprimer': 'paint/primer-solvent-primer/get',

  // Paint with STAINERS group
  'paint/stainers/universalstainers': 'paint/stainers-universal-stainers/get',
  'paint/stainers/woodstainers': 'paint/stainers-wood-stainers/get',

  // Paint with BRUSHES & ROLLERS group
  'paint/brushesrollers/paintbrushes': 'paint/brushes-rollers-paint-brushes/get',
  'paint/brushesrollers/rollers': 'paint/brushes-rollers-rollers/get',
  'paint/brushesrollers/spraypaints': 'paint/brushes-rollers-spray-paints/get',

  // Paint with WATERPROOFING & FILLERS group
  'paint/waterproofingfillers/crackfillers': 'paint/waterproofing-crack-fillers/get',
  'paint/waterproofingfillers/waterproofbasecoat': 'paint/waterproofing-waterproof-basecoat/get',

  // Paint with PAINTING ACCESSORIES group
  'paint/paintingaccessories/sandpaperrolls': 'paint/painting-accessories-sandpaper-rolls/get',
  'paint/paintingaccessories/paintingtools': 'paint/painting-accessories-painting-tools/get',
  'paint/paintingaccessories/stencils': 'paint/painting-accessories-stencils/get',

  // Paint with WOOD FINISHES group
  'paint/woodfinishes/polish': 'paint/wood-finishes-polish/get',
  'paint/woodfinishes/varnishblackboardpaint': 'paint/wood-finishes-varnish-black-board-paint/get',
  'paint/woodfinishes/melamyne': 'paint/wood-finishes-melamyne/get',
  'paint/woodfinishes/pu': 'paint/wood-finishes-pu/get',
  'paint/woodfinishes/sealer': 'paint/wood-finishes-sealer/get',
  'paint/woodfinishes/nc': 'paint/wood-finishes-nc/get',
  'paint/woodfinishes/glasscoatings': 'paint/wood-finishes-glass-coatings/get',
  'paint/woodfinishes/woodputty': 'paint/wood-finishes-wood-putty/get',

  // Paint with ADHESIVE & THINNER group
  'paint/adhesivethinner/adhesive': 'paint/adhesive-thinner-adhesive/get',
  'paint/adhesivethinner/thinner': 'paint/adhesive-thinner-thinner/get',

  // Paint with WALL PUTTY group
  'paint/wallputty/powderwallputty': 'paint/wall-putty-powder-wall-putty/get',
  'paint/wallputty/acrylicwallputty': 'paint/wall-putty-acrylic-wall-putty/get',
  'paint/wallputty/kpfwallputty': 'paint/wall-putty-kpf-wall-putty/get',

  // Paint with AUTOMOTIVE PAINTS group
  'paint/automotivepaints/aspapaints': 'paint/automative-paints-aspa-paints/get',

  // Paint with TOP BRANDS group
  'paint/topbrands/asianpaints': 'paint/top-brands-asian-paints/get',
  'paint/topbrands/jkwallputty': 'paint/top-brands-jk-wall-putty/get',
  'paint/topbrands/gempaints': 'paint/top-brands-asian-paints/get', // Fallback if gem paints doesn't exist
  'paint/topbrands/agsarpaints': 'paint/top-brands-asian-paints/get', // Fallback if agsar paints doesn't exist

  // Pipe subcategories
  'pipe': 'pipe/get',
  'pipe/finolexpipes': 'pipe/finolex-pipes/get',
  'pipe/ashirvadpipes': 'pipe/ashirvad-pipes/get',
  'pipe/Apollopipes': 'pipe/apollo-pipes/get',
  'pipe/nepulpipes': 'pipe/nepul-pipes/get',
  'pipe/otherpipes': 'pipe/other-pipes/get',
  'pipe/prinziapipes': 'pipe/prinzia-pipes/get',
  'pipe/birlapipes': 'pipe/birla-pipes/get',
  'pipe/princepipes': 'pipe/prince-pipes/get',
  'pipe/prakashpipes': 'pipe/prakash-pipes/get',
  'pipe/supremepipes': 'pipe/supreme-pipes/get',
  'pipe/tatapipes': 'pipe/tata-pipes/get',
  'pipe/tsapipes': 'pipe/tsa-pipes/get',

  // PVC Mats
  'pvcmats': 'pvcmats/get',
  'pvcmats/door': 'pvcmats/door/get',
  'pvcmats/floor': 'pvcmats/floor/get',

  // Roofer
  'roofer': 'roofer/get',
  'roofer/metal': 'roofer/metal/get',
  'roofer/shingles': 'roofer/shingles/get',

  // Sanitary subcategories
  'sanitary': 'sanitary/get',
  'sanitary/acrylicproducts': 'sanitary/acrylic-products/get',
  'sanitary/bathroomaccessories': 'sanitary/bathroom-accessories/get',
  
  // Sanitary - Bathsense mappings
  'sanitary/bathsense': 'sanitary/bathsense-pfittings-faucets-bathsense-essentials/get', // Default
  'sanitary/bathsensepfittingsfaucetsaltius': 'sanitary/bathsense-pfittings-faucets-altius/get',
  'sanitary/bathsensepfittingsfaucetsbathsenseessentials': 'sanitary/bathsense-pfittings-faucets-bathsense-essentials/get',
  'sanitary/bathsensepfittingsfaucetsbathsenseshowers': 'sanitary/bathsense-pfittings-faucets-bathsense-showers/get',
  'sanitary/bathsensepfittingsfaucetscolossus': 'sanitary/bathsense-pfittings-faucets-colossus/get',
  'sanitary/bathsensepfittingsfaucetsinvictus': 'sanitary/bathsense-pfittings-faucets-invictus/get',
  'sanitary/bathsensepfittingsfaucetsmaximus': 'sanitary/bathsense-pfittings-faucets-maximus/get',
  'sanitary/bathsensepfittingsfaucetsspry': 'sanitary/bathsense-pfittings-faucets-spry/get',
  'sanitary/bathsensepfittingsfaucetstheta': 'sanitary/bathsense-pfittings-faucets-theta/get',
  'sanitary/bathsensesanitarywareessentials': 'sanitary/bathsense-sanitaryware-essentials/get',
  'sanitary/bathsensesanitarywarepedestals': 'sanitary/bathsense-sanitaryware-pedestals/get',
  'sanitary/bathsensesanitarywarevenus': 'sanitary/bathsense-sanitaryware-venus/get',
  'sanitary/bathsensesanitarywarewashbasins': 'sanitary/bathsense-sanitaryware-washbasins/get',
  'sanitary/bathsensesanitarywarewatercloset': 'sanitary/bathsense-sanitaryware-water-closet/get',
  'sanitary/closets': 'sanitary/closets/get',
  
  // Sanitary - Coral Bath Fixtures mappings
  'sanitary/coralbathfixtures': 'sanitary/coral-bath-fixtures-eurosmart-series/get', // Default
  'sanitary/coralbathfixtureseurosmartseries': 'sanitary/coral-bath-fixtures-eurosmart-series/get',
  'sanitary/coralbathfixturesflowmoreseries': 'sanitary/coral-bath-fixtures-flowmore-series/get',
  'sanitary/coralbathfixturesnewsuperglowseries': 'sanitary/coral-bath-fixtures-new-super-glow-series/get',
  'sanitary/coralbathfixturesroyaleseries': 'sanitary/coral-bath-fixtures-royale-series/get',
  'sanitary/coralbathfixturestreemoseries': 'sanitary/coral-bath-fixtures-treemo-series/get',
  'sanitary/coralbathfixturesxrossaseries': 'sanitary/coral-bath-fixtures-xrossa-series/get',
  
  // Sanitary - Corsa mappings (simplified, direct item names)
  'sanitary/corsa': 'sanitary/corsa-bathroom-faucets-almond/get', // Default
  'sanitary/corsabathroomfaucetsalmond': 'sanitary/corsa-bathroom-faucets-almond/get',
  'sanitary/corsabathroomfaucetsarrow': 'sanitary/corsa-bathroom-faucets-arrow/get',
  'sanitary/corsabathroomfaucetsbold': 'sanitary/corsa-bathroom-faucets-bold/get',
  'sanitary/corsabathroomfaucetsbudget': 'sanitary/corsa-bathroom-faucets-budget/get',
  'sanitary/corsabathroomfaucetsconcept': 'sanitary/corsa-bathroom-faucets-concept/get',
  'sanitary/corsabathroomfaucetsdeluxe': 'sanitary/corsa-bathroom-faucets-deluxe/get',
  'sanitary/corsabathroomfaucetseeco': 'sanitary/corsa-bathroom-faucets-eeco/get',
  'sanitary/corsabathroomfaucetsexpert': 'sanitary/corsa-bathroom-faucets-expert/get',
  'sanitary/corsabathroomfaucetsflorence': 'sanitary/corsa-bathroom-faucets-florence/get',
  'sanitary/corsabathroomfaucetsglassbowlfaucet': 'sanitary/corsa-bathroom-faucets-glass-bowl-faucet/get',
  'sanitary/corsabathroomfaucetsidea': 'sanitary/corsa-bathroom-faucets-idea/get',
  'sanitary/corsabathroomfaucetsjazz': 'sanitary/corsa-bathroom-faucets-jazz/get',
  'sanitary/corsabathroomfaucetsket': 'sanitary/corsa-bathroom-faucets-ket/get',
  'sanitary/corsabathroomfaucetsmilano': 'sanitary/corsa-bathroom-faucets-milano/get',
  'sanitary/corsabathroomfaucetsnano': 'sanitary/corsa-bathroom-faucets-nano/get',
  'sanitary/corsabathroomfaucetsnexa': 'sanitary/corsa-bathroom-faucets-nexa/get',
  'sanitary/corsabathroomfaucetsniagra': 'sanitary/corsa-bathroom-faucets-niagra/get',
  'sanitary/corsabathroomfaucetsnice': 'sanitary/corsa-bathroom-faucets-nice/get',
  'sanitary/corsabathroomfaucetsomega': 'sanitary/corsa-bathroom-faucets-omega/get',
  'sanitary/corsabathroomfaucetspassion': 'sanitary/corsa-bathroom-faucets-passion/get',
  'sanitary/corsabathroomfaucetsroyal': 'sanitary/corsa-bathroom-faucets-royal/get',
  'sanitary/corsabathroomfaucetsslimline': 'sanitary/corsa-bathroom-faucets-slimline/get',
  'sanitary/corsabathroomfaucetssplash': 'sanitary/corsa-bathroom-faucets-splash/get',
  'sanitary/corsabathroomfaucetssquaref': 'sanitary/corsa-bathroom-faucets-square-f/get',
  'sanitary/corsabathroomfaucetssquares': 'sanitary/corsa-bathroom-faucets-square-s/get',
  'sanitary/corsabathroomfaucetssuper': 'sanitary/corsa-bathroom-faucets-super/get',
  'sanitary/corsabathroomfaucetstri': 'sanitary/corsa-bathroom-faucets-tri/get',
  
  // Sanitary - Essess mappings (no single endpoint, use first available)
  'sanitary/essess': 'sanitary/essess-accessories-series1-croma/get', // Default - fixed route name (series1 not series-1)
  
  // Sanitary - Hindware mappings (no single endpoint, use first available)
  'sanitary/hindware': 'sanitary/hindware-faucets-angular-stop-cock/get', // Default - first hindware faucet route
  
  // Sanitary - Parryware mappings (no single endpoint, use first available)
  'sanitary/parryware': 'sanitary/parryware-accessories-accessories/get', // Default - first parryware route
  
  // Sanitary - Leo Bath Fittings mappings
  'sanitary/leobathfittings': 'sanitary/leo-bath-fittings-bathroom-accessories-bathroom-accessories/get', // Default - note duplicate in route name
  
  // Sanitary - WaterTec (already added above)
  
  // Sanitary - Hardware & Bathroom Accessories
  'sanitary/hardwarebathroomaccessories': 'sanitary/bathroom-accessories/get',
  'sanitary/hardware': 'sanitary/bathroom-accessories/get',
  
  // Sanitary - Taps
  'sanitary/taps': 'sanitary/water-tec-taps/get', // Default to water-tec-taps
  
  // WaterTec subcategories
  'sanitary/watertec': 'sanitary/water-tec-showers/get', // Default to showers if no subcategory
  'sanitary/water-tec': 'sanitary/water-tec-showers/get', // Handle hyphenated version
  'sanitary/watertec/showers': 'sanitary/water-tec-showers/get',
  'sanitary/watertec/taps': 'sanitary/water-tec-taps/get',
  'sanitary/watertec/bathroomaccessories': 'sanitary/water-tec-bathroom-accessories/get',
  'sanitary/watertec/allied': 'sanitary/water-tec-allied/get',
  'sanitary/watertec/aqua': 'sanitary/water-tec-aqua/get',
  'sanitary/watertec/aspire': 'sanitary/water-tec-aspire/get',
  'sanitary/watertec/cistern': 'sanitary/water-tec-cistern/get',
  'sanitary/watertec/concealedcistern': 'sanitary/water-tec-concealed-cistern/get',
  'sanitary/watertec/connectiontube': 'sanitary/water-tec-connection-tube/get',
  'sanitary/watertec/ebony': 'sanitary/water-tec-ebony/get',
  'sanitary/watertec/eco': 'sanitary/water-tec-eco/get',
  'sanitary/watertec/eva': 'sanitary/water-tec-eva/get',
  'sanitary/watertec/flora': 'sanitary/water-tec-flora/get',
  'sanitary/watertec/healthfaucets': 'sanitary/water-tec-health-faucets/get',
  'sanitary/watertec/quattro': 'sanitary/water-tec-quattro/get',
  'sanitary/watertec/toiletseatcovers': 'sanitary/water-tec-toilet-seat-covers/get',
  'sanitary/watertec/tseries': 'sanitary/water-tec-t-series/get',
  'sanitary/watertec/tseriesalt': 'sanitary/water-tec-t-series-alt/get',
  'sanitary/watertec/valves': 'sanitary/water-tec-valves/get',

  // Tools subcategories
  'tools': 'tools/get',
  'tools/handtools': 'tools/handtools/get',
  'tools/abrasives': 'tools/abrasives/cutOffWheel/get', // No single endpoint, use cutOffWheel as default
  'tools/abrasives/cutoffwheel': 'tools/abrasives/cutOffWheel/get',
  'tools/abrasives/diamondblades': 'tools/abrasives/diamondBlades/get',
  'tools/allenkeys': 'tools/allen-keys/get',
  'tools/brush': 'tools/brush/get',
  'tools/carpenterpincer': 'tools/carpenter-pincer/get',
  'tools/chisels': 'tools/chisels/get',
  'tools/clamps': 'tools/clamps/get',
  'tools/cutters': 'tools/cutters/get',
  'tools/files': 'tools/files/get',
  'tools/gardentools': 'tools/garden-tools/get',
  'tools/gluegun': 'tools/gluegun/get',
  'tools/greasegun': 'tools/grease-gun/get',
  'tools/hammer': 'tools/hammer/get',
  'tools/level': 'tools/level/get',
  'tools/lubrications': 'tools/lubrications/get',
  'tools/plier': 'tools/plier/get',
  'tools/piler': 'tools/plier/get', // Alternative spelling
  'tools/polishingaccessories': 'tools/polishing-accessories/get',
  'tools/powertools': 'tools/powertools/drill/get', // No single endpoint, use drill as default
  'tools/powertools/drill': 'tools/powertools/drill/get',
  'tools/powertools/grinders': 'tools/powertools/grinders/get',
  'tools/powertools/marblecutter': 'tools/powertools/marble-cutter/get',
  'tools/screwdriver': 'tools/screw-driver/get',
  'tools/silicongun': 'tools/silicon-gun/get',
  'tools/socketset': 'tools/socketset/get',
  'tools/sparemallets': 'tools/spare-malets/get', // Fixed: "Spare Mallets" -> "sparemallets"
  'tools/sparemalets': 'tools/spare-malets/get', // Alternative spelling
  'tools/spanners': 'tools/spanners/get',
  'tools/spanner': 'tools/spanners/get', // Singular form
  'tools/saw': 'tools/saw/get',
  'tools/toolcompartments': 'tools/tool-compartments/get',
  'tools/toolkitset': 'tools/toolkitset/get',
  'tools/varioustoolbits': 'tools/various-tool-bits/get',
  'tools/woodchisel': 'tools/wood-chisel/get',
  'tools/wooditems': 'tools/wood-items/get',
  'tools/wrench': 'tools/wrench/get',
  'tools/centrepunches': 'tools/centre-punches/get',
  'tools/gearpullers': 'tools/gear-pullers/get',
  'tools/glasscutter': 'tools/glass-cutter/get',
  'tools/hacksawblades': 'tools/hacksaw-blades/get',
  'tools/hammerdrlls': 'tools/hammer-drlls/get',
  'tools/measurementscale': 'tools/measurement-scale/get',
  'tools/measuringtape': 'tools/measuring-tape/get',
  'tools/multimeter': 'tools/multimeter/get',

  // Waterproofing subcategories (backend uses "water-proofing" and "cracks-joints")
  'waterproofing': 'water-proofing/get',
  'waterproofing/bathrooms': 'water-proofing/bathrooms/get',
  // URL segment comes in as "CracksJoints" -> "cracksjoints"
  'waterproofing/cracksjoints': 'water-proofing/cracks-joints/get',
  'waterproofing/interiors': 'water-proofing/interiors/get',
};

// Known segment slug exceptions to match backend route slugs
const SEGMENT_EXCEPTIONS = {
  // Locks groups
  dooraccessories: 'door-accessories',
  doorcontrols: 'door-controls',
  doorhandles: 'door-handles',
  doorlocks: 'door-locks',
  foldingbrackets: 'folding-brackets',
  furniturefittings: 'furniture-fittings',
  glasshardware: 'glass-hardware',
  levermortiselocks: 'lever-mortise-locks',
  morticelocks: 'mortice-locks',
  mortiselockbody: 'mortise-lock-body',
  padlocks: 'padlocks',
  popularmortiseseries: 'popular-mortise-series',
  premiummortiseseries: 'premium-mortise-series',
  rimlocks: 'rim-locks',

  // Tools groups
  powertools: 'powertools',
  abrasives: 'abrasives',

  // Paint groups
  brushesrollers: 'brushes-rollers',
  paintingaccessories: 'painting-accessories',
  woodfinishes: 'wood-finishes',
  wallputty: 'wall-putty',
  topbrands: 'top-brands',

  // Electrical sub-groups
  circulardeepbox: 'circulardeepbox',
  circularsurfacebox: 'circularsurfacebox',
  lightelectronics: 'lightelectronics',
};

function normalizeSegment(segment) {
  const raw = String(segment).trim();
  const lowerAlnum = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (SEGMENT_EXCEPTIONS[lowerAlnum]) {
    return SEGMENT_EXCEPTIONS[lowerAlnum];
  }
  // Insert hyphens between camelCase boundaries, then kebab-case
  return raw
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

// Function to convert URL path to API endpoint
export function getApiEndpoint(pathSegments) {
  if (!pathSegments || pathSegments.length === 0) return null;
  
  // Normalize to lookup key used in API_MAPPINGS: lowercase alphanumeric only
  const pathKey = pathSegments
    .map(segment => segment.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .join('/');
  
  // Look up the API endpoint
  const apiPath = API_MAPPINGS[pathKey];
  if (apiPath) {
    return apiPath; // already includes trailing /get
  }

  // Some categories in the API map combine trailing segments (group + item)
  // e.g. ['paint','emulsion','interioremulsion'] -> 'paint/emulsioninterioremulsion'
  //      ['electrical','ledlighting','leddownlightersspotlight'] -> 'electrical/leddownlightersspotlight'
  if (pathSegments.length >= 2) {
    const head = pathSegments[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const tailCombined = pathSegments
      .slice(1)
      .map(s => s.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .join('');
    const collapsedKey = `${head}/${tailCombined}`;
    const collapsedPath = API_MAPPINGS[collapsedKey];
    if (collapsedPath) {
      return collapsedPath;
    }
  }

  // Handle nested paths with group names (e.g., electrical/lighting/lamps -> electrical/lamps)
  // Common group names that should be skipped
  const groupNamesToSkip = [
    // Electrical groups
    'lighting', 'ledlighting', 'fans', 'cableswires', 'waterpumps', 
    'plugsadaptors', 'switchesgears', 'protectiondevices', 'modularsurfacebox',
    'electricalfittings', // Skip electricalfittings group - accessories, circulardeepbox are direct routes
    'lights', // Skip lights group - all light types are direct routes under electrical
    // Paint groups
    'emulsion', 'enamel', 'distemper', 'primer', 'stainers', 'brushesrollers',
    'waterproofingfillers', 'paintingaccessories', 'woodfinishes', 'adhesivethinner',
    'wallputty', 'automotivepaints', 'topbrands',
    // Sanitary groups (if any)
    'bathsense', 'coralbathfixtures', 'corsa', 'essess', 'hindware', 'parryware',
    'leobathfittings', 'watertec', 'hardwarebathroomaccessories',
    // Tools groups
    'powertools', 'abrasives', 'handtools'
  ];

  if (pathSegments.length >= 3) {
    const head = pathSegments[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const middle = pathSegments[1].toLowerCase().replace(/[^a-z0-9]/g, '');
    const tail = pathSegments[pathSegments.length - 1].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // If middle segment is a group name, skip it and try direct mapping
    if (groupNamesToSkip.includes(middle)) {
      const directKey = `${head}/${tail}`;
      const directPath = API_MAPPINGS[directKey];
      if (directPath) {
        return directPath;
      }
    }
  }

  // Fallback: build kebab-case path that matches backend route names
  const kebabPath = pathSegments.map(normalizeSegment).join('/');

  return `${kebabPath}/get`;
}
