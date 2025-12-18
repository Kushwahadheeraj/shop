"use client";
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import API_BASE_URL from '@/lib/apiConfig'

export default function Card() {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        const fetchCards = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/home/card/get`)
                const json = await res.json()
                let list = []
                if (json && json.success && Array.isArray(json.data)) list = json.data
                else if (Array.isArray(json)) list = json
                else if (json && Array.isArray(json.cards)) list = json.cards
                if (isMounted) setCards(list)
            } catch (e) {
                if (isMounted) setCards([])
            } finally {
                if (isMounted) setLoading(false)
            }
        }
        fetchCards()
        return () => { isMounted = false }
    }, [])

    if (!loading && cards.length === 0) {
        return null
    }

    return (
        <>
            <div className="flex min-h-screen items-center justify-center">
                <div className="grid grid-cols-1 shadow-gray-800 shadow-lg md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((slider,a) => (
                        <div key={slider._id || a} className="group relative  cursor-pointer items-center justify-center overflow-hidden transition duration-300 hover:-translate-y-2">
                            <div className="h-96 w-72">
                                <Image className="h-full w-full stroke-black object-cover"
                                    src={slider.image}
                                    alt={slider.mainText}
                                    width={288}
                                    height={384}
                                />
                            </div>
                            <div className="absolute inset-0 from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70" />
                            <div className="absolute inset-0 flex  flex-col mt-48 px-9 text-center transition-all duration-500">
                                <h1 className="font-dmserif uppercase text-4xl mb-4 font-bold text-black">
                                    {slider.mainText}
                                </h1>
                                <Link href="/Shop" className="inline-block">
                                    <button className="rounded-full cursor-pointer bg-white py-2 px-2 font-com text-base uppercase text-gray-900 hover:bg-black hover:text-white shadow shadow-black/60">
                                        {slider.text || 'Shop Now'}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}