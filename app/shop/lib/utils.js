import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const getCategoryPath = (productName) => {
  const name = (productName || "").toLowerCase();

  if (name.includes("adhesive") || name.includes("fevicol") || name.includes("glue")) {
    return "/ShopPage/Adhesives";
  } else if (name.includes("cement") || name.includes("pop") || name.includes("birla")) {
    return "/ShopPage/Cements";
  } else if (name.includes("cleaning") || name.includes("brush") || name.includes("mop")) {
    return "/ShopPage/Cleaning";
  } else if (
    name.includes("electrical") ||
    name.includes("wire") ||
    name.includes("switch") ||
    name.includes("bulb") ||
    name.includes("fan")
  ) {
    return "/ShopPage/Electrical/Adaptors";
  } else if (name.includes("paint") || name.includes("emulsion") || name.includes("primer")) {
    return "/ShopPage/Paint/AcrylicEmulsionPaint";
  } else if (
    name.includes("tool") ||
    name.includes("hammer") ||
    name.includes("screwdriver") ||
    name.includes("wrench")
  ) {
    return "/ShopPage/Tools/abrasives";
  } else if (
    name.includes("sanitary") ||
    name.includes("faucet") ||
    name.includes("sink") ||
    name.includes("bathroom")
  ) {
    return "/ShopPage/Sanitary/AcrylicProducts";
  } else if (name.includes("lock") || name.includes("key") || name.includes("door")) {
    return "/ShopPage/Locks/DoorAccessories";
  } else if (
    name.includes("pipe") ||
    name.includes("fitting") ||
    name.includes("plumbing")
  ) {
    return "/ShopPage/Pipe/AshirvadPipes";
  } else if (
    name.includes("roof") ||
    name.includes("sheet") ||
    name.includes("aluminium")
  ) {
    return "/ShopPage/Roofer/AluminiumSheet";
  } else if (name.includes("waterproof") || name.includes("water proof")) {
    return "/ShopPage/WaterProofing/Bathrooms";
  } else if (
    name.includes("hardware") ||
    name.includes("screw") ||
    name.includes("bolt") ||
    name.includes("nut")
  ) {
    return "/ShopPage/Hardware";
  } else if (name.includes("fiber") || name.includes("fiberglass")) {
    return "/ShopPage/Fiber";
  } else if (name.includes("fitting") || name.includes("joint")) {
    return "/ShopPage/Fitting";
  } else if (
    name.includes("home") ||
    name.includes("decor") ||
    name.includes("decoration")
  ) {
    return "/ShopPage/HomeDecor";
  } else if (name.includes("pvc") || name.includes("mat")) {
    return "/ShopPage/PvcMats";
  } else {
    return "/ShopPage/Uncategorized";
  }
};
