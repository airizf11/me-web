// src/components/MenuItemCard.tsx
import Image from "next/image";
import { type MenuItem } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

type MenuItemCardProps = {
  item: MenuItem;
};

export function MenuItemCard({ item }: MenuItemCardProps) {
  const imageUrl =
    item.image_url || "https://via.placeholder.com/600x600?text=Menurutmu+Menu";

  return (
    <div
      className="bg-light-cream text-deep-mocha rounded-xl shadow-lg overflow-hidden 
                    transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative w-full aspect-square bg-warm-brown overflow-hidden">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-5 flex flex-col items-center text-center">
        <h2 className="text-2xl font-display lowercase mb-2 leading-tight">
          {item.name}
        </h2>
        <p className="text-md font-body text-warm-brown mb-4 flex-grow">
          {item.description}
        </p>

        <div className="flex items-center justify-between w-full mt-auto">
          <span className="text-xl font-semibold font-body text-deep-mocha">
            {item.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
          <button
            onClick={() =>
              alert(`Anda ingin menambahkan ${item.name} ke keranjang!`)
            }
            className="p-2 rounded-full bg-clay-pink text-deep-mocha hover:bg-warm-brown hover:text-light-cream 
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-deep-mocha focus:ring-offset-2"
            aria-label={`Add ${item.name} to cart`}
          >
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
