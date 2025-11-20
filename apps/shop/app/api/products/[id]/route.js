import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Import all your product models
import ElectricalProduct from 'backend/models/ElectricalModels';
import PaintProduct from 'backend/models/PaintModels';
import SanitaryProduct from 'backend/models/SanitaryModels';
import PipeProduct from 'backend/models/PipeModels';
import CementProduct from 'backend/models/CementsModels';
import RooferProduct from 'backend/models/RooferModels';
import ToolProduct from 'backend/models/ToolsModels';
import AdhesiveProduct from 'backend/models/AdhesivesModels';
import CleaningProduct from 'backend/models/CleaningModels';
import LockProduct from 'backend/models/LocksModels';
import LightProduct from 'backend/models/LightingModels';
import WaterproofingProduct from 'backend/models/WaterProofingModels';
import HardwareProduct from 'backend/models/HardwareModels';
import HomeDecorProduct from 'backend/models/HomeDecorModels';
import HomeElectricalProduct from 'backend/models/HomeElectricalModel';
import HomePaintsProduct from 'backend/models/HomePaintsModel';
import PvcMatsProduct from 'backend/models/PvcMatsModels';
import SheetProduct from 'backend/models/SheetModels';
import DryProduct from 'backend/models/DryModels';
import FiberProduct from 'backend/models/FiberModels';
import FittingProduct from 'backend/models/FittingModels';
import BrushProduct from 'backend/models/BrushModels';
import UncategorizedProduct from 'backend/models/UncategorizedModels';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    console.log('Searching for product with ID:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

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

    // Try to narrow search by category if provided as query param
    const url = new URL(request.url);
    const hintCategory = url.searchParams.get('cat');
    const orderedModels = hintCategory
      ? [
          ...productModels.filter((m) => m.category.toLowerCase() === hintCategory.toLowerCase()),
          ...productModels.filter((m) => m.category.toLowerCase() !== hintCategory.toLowerCase())
        ]
      : productModels;

    // Search for the product in all models
    for (const { model, category } of orderedModels) {
      try {
        console.log(`Searching in ${category} model...`);
        
        // Try findById first if valid ObjectId
        let product = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
          try {
            product = await model.findById(id).lean();
          } catch (innerErr) {
            console.error(`findById failed for ${category}:`, innerErr?.message);
          }
        }
        
        // If not found, try searching by name or other fields
        if (!product) {
          console.log(`Trying alternative search in ${category}...`);
          // Try to find by name if ID doesn't work
          const orConditions = [{ name: { $regex: id, $options: 'i' } }];
          // Only add _id match if valid
          if (mongoose.Types.ObjectId.isValid(id)) {
            orConditions.push({ _id: new mongoose.Types.ObjectId(id) });
          }
          product = await model.findOne({ $or: orConditions }).lean();
        }
        
        if (product) {
          console.log(`Found product in ${category}:`, product.name);
          const productWithCategory = {
            ...product,
            category,
            _id: product._id.toString()
          };
          return NextResponse.json(productWithCategory);
        } else {
          console.log(`No product found in ${category} with ID: ${id}`);
        }
      } catch (error) {
        console.error(`Error searching in ${category}:`, error);
        // Continue with other models
      }
    }

    // Product not found in any model
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
