import prisma from "@/app/prismadb";
import { NextResponse } from "next/server";
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'

export async function GET(request: Request) {
  try {
   
    const searchParams = new URLSearchParams(request.url.split('?')[1]);
    
    const categories = searchParams.getAll("categories[]");
    const colors = searchParams.getAll("colors[]");
    const sizes = searchParams.getAll("size[]");
console.log(categories)
    const minPrice = parseInt(searchParams.get("price[min]") || "0");
    const maxPrice = parseInt(searchParams.get("price[max]") || "100000");

    const products = await prisma.product.findMany({
      where: {
        
        AND: [
           {OR:categories.map((category) => ({ style: { contains: category } }))} ,
          { OR: sizes.map((size) => ({ size: { contains: size } })) },
          ...colors.map((color) => ({ color: { contains: color } })),
          { price: { gte: minPrice, lte: maxPrice } },
         
        ] 
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error selecting product", error);
    return NextResponse.error();
  }
}
