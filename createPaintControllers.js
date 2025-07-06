const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'backend', 'controllers', 'paint');

const structure = {
  Emulsion: [
    'interiorEmulsionController.js',
    'exteriorEmulsionController.js',
    'wallTextureController.js',
    'tileGuardController.js',
  ],
  Enamel: [
    'satinEnamelController.js',
    'glossEnamelController.js',
    'syntheticEnamelController.js',
  ],
  Distemper: [
    'acrylicDistemperController.js',
    'syntheticDistemperController.js',
  ],
  Primer: [
    'interiorPrimerController.js',
    'exteriorPrimerController.js',
    'cementPrimerController.js',
    'woodPrimerController.js',
    'metalPrimerController.js',
    'acrylicPrimerController.js',
    'solventPrimerController.js',
  ],
  Stainers: [
    'universalStainersController.js',
    'woodStainersController.js',
  ],
  BrushesRollers: [
    'paintBrushesController.js',
    'rollersController.js',
    'sprayPaintsController.js',
  ],
  Waterproofing: [
    'crackFillersController.js',
    'waterproofBasecoatController.js',
  ],
  PaintingAccessories: [
    'sandpaperRollsController.js',
    'paintingToolsController.js',
    'stencilsController.js',
  ],
  WoodFinishes: [
    'polishController.js',
    'varnishBlackBoardPaintController.js',
    'melamyneController.js',
    'puController.js',
    'sealerController.js',
    'ncController.js',
    'glassCoatingsController.js',
    'woodPuttyController.js',
  ],
  AdhesiveThinner: [
    'adhesiveController.js',
    'thinnerController.js',
  ],
  WallPutty: [
    'powderWallPuttyController.js',
    'acrylicWallPuttyController.js',
    'kpfWallPuttyController.js',
  ],
  AutomativePaints: [
    'aspaPaintsController.js',
  ],
  TopBrands: [
    'asianPaintsController.js',
    'jkWallPuttyController.js',
    'gemPaintsController.js',
    'agsarPaintsController.js',
  ],
};

for (const [folder, files] of Object.entries(structure)) {
  const dir = path.join(base, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
      console.log('Created:', filePath);
    } else {
      console.log('Exists:', filePath);
    }
  }
} 