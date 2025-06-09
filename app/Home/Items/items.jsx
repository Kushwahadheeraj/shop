"use client";
import Image from "next/image";
import Link from "next/link";

const bannerData = [
  {
    id: 1,
    image: "/images/banner1.jpg", // Replace with your image path
    alt: "Have a list of items? Click here to upload the file.",
    overlay: false, // This banner has a unique layout
    content: (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Image
          src="/images/clipboard.png" // Replace with your clipboard image path
          alt="Clipboard with checklist"
          width={150}
          height={150}
          className="mb-4"
        />
        <h2 className="text-xl md:text-2xl font-bold mb-4">HAVE A LIST OF ITEMS?</h2>
        <Link href="#" passHref>
          <button className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg flex items-center space-x-2 hover:bg-yellow-500 transition">
            <span>CLICK HERE</span>
            <span className="text-xl animate-pulse">👆</span> {/* Simple animation */}
          </button>
        </Link>
        <p className="text-sm text-gray-700 mt-2">& Upload the file</p>
        <p className="text-xl md:text-2xl font-bold mt-4">WE WILL TAKE CARE THE</p>
        <p className="text-xl md:text-2xl font-bold">REST OF THE WORK</p>
      </div>
    ),
  },
  {
    id: 2,
    image: "/images/banner2.jpg", // Replace with your image path
    alt: "More Light, More Magic - Save electricity bills by 80%",
    overlay: true, // This banner has text overlay
    title: "MORE LIGHT",
    subtitle: "MORE MAGIC",
    description: "Save electricity Bills by 80%",
    buttonText: "SHOP NOW",
    link: "#",
    textColor: "text-white",
  },
  {
    id: 3,
    image: "/images/banner3.jpg", // Replace with your image path
    alt: "Beautiful Switch Collections at best price",
    overlay: true, // This banner has text overlay
    title: "Beautiful Switch Collections",
    description: "At Best price",
    buttonText: "SHOP NOW",
    link: "#",
    textColor: "text-white",
  },
];

export default function Items() {
  return (
    <div className="px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bannerData.map((banner) => (
          <div key={banner.id} className="relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={banner.image}
              alt={banner.alt}
              width={600} // Adjust width and height based on your image aspect ratio
              height={400}
              layout="responsive" // Make image responsive
              objectFit="cover" // Cover the area without distortion
              className="w-full h-full"
            />
            {banner.overlay && (
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                  flex flex-col justify-end p-6 ${banner.textColor}`}
              >
                <h3 className="text-2xl font-bold">{banner.title}</h3>
                {banner.subtitle && <p className="text-lg">{banner.subtitle}</p>}
                <p className="text-sm mb-4">{banner.description}</p>
                <Link href={banner.link} passHref>
                  <button className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition self-start">
                    {banner.buttonText}
                  </button>
                </Link>
              </div>
            )}
            {!banner.overlay && (
              // Custom content for the first banner (upload file)
              <div className="absolute inset-0 flex items-center justify-center">
                {banner.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
