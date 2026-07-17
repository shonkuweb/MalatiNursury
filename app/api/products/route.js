import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Convert adeniumOptions to JSON string if it exists
    let adeniumOptionsStr = null;
    if (data.adeniumOptions) {
      adeniumOptionsStr = JSON.stringify(data.adeniumOptions);
    }
    
    const newProduct = await prisma.product.create({
      data: {
        slug: data.slug,
        title: data.title,
        price: data.price,
        description: data.description || null,
        image: data.image || null,
        type: data.type || null,
        rating: data.rating || 5.0,
        reviews: data.reviews || 120,
        adeniumOptions: adeniumOptionsStr,
      }
    });

    return NextResponse.json({ message: 'Product added successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json({ error: error.message || 'Failed to add product' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: 'Product ID is required for update' }, { status: 400 });
    }

    let adeniumOptionsStr = null;
    if (data.adeniumOptions) {
      adeniumOptionsStr = JSON.stringify(data.adeniumOptions);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: data.id },
      data: {
        slug: data.slug,
        title: data.title,
        price: data.price,
        description: data.description || null,
        image: data.image || null,
        type: data.type || null,
        rating: data.rating || 5.0,
        reviews: data.reviews || 120,
        adeniumOptions: adeniumOptionsStr,
      }
    });

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { slug }
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
