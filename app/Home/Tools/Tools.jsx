import Image from "next/image";
import { Button } from "@/components/ui/button";
import ToolsImage from "@/public/tools.jpg";

export default function Tools() {
  return (
    <div className="flex flex-col md:flex-row items-stretch w-full my-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="w-full md:w-1/2">
        <Image
          src={ToolsImage}
          alt="A collection of various hand tools in a toolbox"
          width={720}
          height={480}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800">
          20% OFF ON TOOLS
        </h2>
        <p className="mt-2 text-base text-gray-600">
          Drill, Hammer, cutter, screwdrivers, abrasives, pliers, etc.
        </p>
        <Button
          variant="outline"
          className="mt-8 rounded-full border-yellow-500 px-10 py-3 text-sm font-semibold text-black hover:bg-yellow-500 hover:text-white transition-colors duration-300"
        >
          SHOP NOW
        </Button>
      </div>
    </div>
  );
}
