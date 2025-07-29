import Image1 from '@/public/yellowbackground.png'
import Image2 from '@/public/intrialpaint.jpg'
import Image3 from '@/public/roofer.jpg'
import Image4 from '@/public/sanitaryware.webp'
import Image from 'next/image'
const dataSlider = [
    {
        id: "1",
        imageUrl: Image1,
        mainText: "Top selling Products",
        text: "Shop Now",
    },
    {
        id: "2",
        imageUrl: Image2,
        text: "shop now",
        mainText: "wood stainer",
    },
    {
        id: "3",
        imageUrl: Image3,
        text: "shop now",
        mainText: "Interior PAINTS",
    },
    {
        id: "4",
        imageUrl: Image4,
        text: "Shop Now",
        mainText: "TruGrip Adhesive",
    },
]

export default function Card() {
    return (
        <>
            <div className="flex min-h-screen items-center justify-center">
                <div className="grid grid-cols-1 shadow-gray-800 shadow-lg md:grid-cols-2 lg:grid-cols-4">
                    {dataSlider.map((slider,a) => (
                        <div key={a} className="group relative  cursor-pointer items-center justify-center overflow-hidden transition duration-300 hover:-translate-y-2">
                            <div className="h-96 w-72">
                                <Image className="h-full w-full stroke-black object-cover"
                                    src={slider.imageUrl}
                                    alt={slider.mainText}
                                    />
                            </div>
                            
                            <div className="absolute inset-0 from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70" />
                            <div className="absolute inset-0 flex  flex-col mt-48 px-9 text-center transition-all duration-500">
                                <h1 className="font-dmserif uppercase text-4xl mb-4 font-bold text-black">
                                    {slider.mainText}
                                </h1>
                                <button className="rounded-full cursor-pointer bg-white py-2 px-2 font-com text-base uppercase text-gray-900 hover:bg-black hover:text-white shadow shadow-black/60">
                                    {slider.text}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}