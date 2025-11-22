import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Import all your product models
import ElectricalProduct from '@backend/models/ElectricalModels';
import PaintProduct from '@backend/models/PaintModels';
import SanitaryProduct from '@backend/models/SanitaryModels';
import PipeProduct from '@backend/models/PipeModels';
import CementProduct from '@backend/models/CementsModels';
import RooferProduct from '@backend/models/RooferModels';
import ToolProduct from '@backend/models/ToolsModels';
import AdhesiveProduct from '@backend/models/AdhesivesModels';
import CleaningProduct from '@backend/models/CleaningModels';
import LockProduct from '@backend/models/LocksModels';
import LightProduct from '@backend/models/LightingModels';
import WaterproofingProduct from '@backend/models/WaterProofingModels';
import HardwareProduct from '@backend/models/HardwareModels';
import HomeDecorProduct from '@backend/models/HomeDecorModels';
import HomeElectricalProduct from '@backend/models/HomeElectricalModel';
import HomePaintsProduct from '@backend/models/HomePaintsModel';
import PvcMatsProduct from '@backend/models/PvcMatsModels';
import SheetProduct from '@backend/models/SheetModels';
import DryProduct from '@backend/models/DryModels';
import FiberProduct from '@backend/models/FiberModels';
import FittingProduct from '@backend/models/FittingModels';
import BrushProduct from '@backend/models/BrushModels';
import UncategorizedProduct from '@backend/models/UncategorizedModels';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop';

export async function GET() {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
    }

    // Define all product models
    const productModels = [
      { model: ElectricalProduct, category: 'Electrical' },
      { model: PaintProduct, category: 'Paints' },
      { model: SanitaryProduct, category: 'Sanitary' },
      { model: PipeProduct, category: 'Pipes' },
      { model: CementProduct, category: 'Cement' },
      { model: RooferProduct, category: 'Roofer' },
      { model: ToolProduct, category: 'Tools' },
      { model: AdhesiveProduct, category: 'Adhesives' },
      { model: CleaningProduct, category: 'Cleaning' },
      { model: LockProduct, category: 'Locks' },
      { model: LightProduct, category: 'Lights' },
      { model: WaterproofingProduct, category: 'Waterproofing' },
      { model: HardwareProduct, category: 'Hardware' },
      { model: HomeDecorProduct, category: 'Home Decor' },
      { model: HomeElectricalProduct, category: 'Home Electrical' },
      { model: HomePaintsProduct, category: 'Home Paints' },
      { model: PvcMatsProduct, category: 'PVC Mats' },
      { model: SheetProduct, category: 'Sheets' },
      { model: DryProduct, category: 'Dry' },
      { model: FiberProduct, category: 'Fiber' },
      { model: FittingProduct, category: 'Fittings' },
      { model: BrushProduct, category: 'Brushes' },
      { model: UncategorizedProduct, category: 'Uncategorized' }
    ];

    // Fetch products from all models
    const allProducts = [];
    
    for (const { model, category } of productModels) {
      try {
        const products = await model.find({}).lean();
        console.log(`Found ${products.length} products in ${category}`);
        if (products.length > 0) {
          console.log(`Sample product from ${category}:`, {
            id: products[0]._id,
            name: products[0].name,
            category: category
          });
        }
        const productsWithCategory = products.map(product => ({
          ...product,
          category,
          _id: product._id.toString()
        }));
        allProducts.push(...productsWithCategory);
      } catch (error) {
        console.error(`Error fetching products from ${category}:`, error);
        // Continue with other models even if one fails
      }
    }

    // Sort by name for consistent ordering
    allProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    return NextResponse.json(allProducts);

  } catch (error) {
    console.error('Error fetching all products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
