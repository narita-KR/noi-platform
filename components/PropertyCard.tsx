import Link from "next/link";
import { MapPin, TrainFront, Calendar, Heart } from "lucide-react";

export interface PropertyCardProps {
  id: number;
  title: string;
  price: number;
  yield: number;
  location: string;
  station: string;
  walkTime: string;
  builtYear: string;
  age: number;
  structure: string;
  category: string;
  registeredDate: string;
  image: string;
  isNew?: boolean;
}

function formatPrice(priceManYen: number): string {
  if (priceManYen >= 10000) {
    const oku = Math.floor(priceManYen / 10000);
    const man = priceManYen % 10000;
    if (man === 0) return `${oku}億円`;
    return `${oku}億${man.toLocaleString()}万円`;
  }
  return `${priceManYen.toLocaleString()}万円`;
}

export default function PropertyCard(props: PropertyCardProps) {
  const {
    id,
    title,
    price,
    yield: yieldRate,
    location,
    station,
    walkTime,
    builtYear,
    age,
    structure,
    category,
    registeredDate,
    image,
    isNew,
  } = props;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white shadow-md transition-shadow duration-200 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-48 w-full bg-gray-200">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400">
            物件画像
          </div>
        )}

        {/* NEW badge */}
        {isNew && (
          <span className="new-badge absolute left-2 top-2 shadow-sm">
            {registeredDate} 登録 NEW
          </span>
        )}

        {/* Category badge */}
        <span className="category-badge absolute right-2 top-2 shadow-sm">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold leading-snug text-gray-800">
          {title}
        </h3>

        {/* Price + Yield */}
        <div className="mb-2 flex flex-wrap items-baseline gap-2">
          <p className="property-price">{formatPrice(price)}</p>
          <span className="yield-badge">
            表面利回り {yieldRate.toFixed(1)}%
          </span>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
            {location}
          </p>
          <p className="flex items-center gap-2">
            <TrainFront className="h-4 w-4 shrink-0 text-gray-400" />
            {station} {walkTime}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
            {builtYear}（築{age}年）{structure}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-1 gap-3">
          <button
            type="button"
            className="btn-secondary w-full px-6 py-2.5 font-medium"
          >
            <Heart className="h-4 w-4" />
            お気に入りに登録
          </button>
          <Link
            href={`/properties/${id}`}
            className="btn-primary w-full px-6 py-2.5 font-medium no-underline"
          >
            物件詳細
          </Link>
          <Link
            href={`/inquiry?property=${id}`}
            className="btn-success w-full px-6 py-2.5 font-medium no-underline"
          >
            問合せする
          </Link>
        </div>
      </div>
    </div>
  );
}
