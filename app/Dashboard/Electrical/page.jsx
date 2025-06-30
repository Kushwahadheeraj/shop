import Link from "next/link";
import ProductForm from './ProductForm';

export default function ElectricalPage() {
  const subItems = [
    "Adaptors","CeilingRoses","Dimmer","DistributionBoards","DoorBells","DPswitch","EarthingAccessories","ELCBsRCCBs","ElectricalFittings","Fans","FlexibleConduit","FlexibleWires","FuseCarriers","Holders","Indicator","InsulationTapes","Isolators","Jacks","KITKATFuses","Lights","MainSwitch","MCB","ModularSurfaceBox","MotorStarters","Motors","Others","PinTop","Plug","PowerStrips","PVCClips","Regulators","RotarySwitch","Sockets","SwitchAndSocket","SwitchPlates","Switches","TravelAdaptor","TVOutlets","UniSwitch","WaterHeater","WaterHeaters","WiresAndCables"
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Electrical Products</h1>
      <ProductForm />
      <p>This is the Electrical section of the dashboard. You can add electrical-related content here.</p>
      <ul className="mt-4 space-y-2">
        {subItems.map((item) => (
          <li key={item}>
            <Link href={`/Dashboard/Electrical/${item}`}>{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 