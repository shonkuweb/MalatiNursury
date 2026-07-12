import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app', 'data', 'products.json');

function readProducts() {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
}

export async function GET() {
  let products = readProducts();
  let changed = false;
  
  const slugCounts = {};
  for (let i = 0; i < products.length; i++) {
    const slug = products[i].slug;
    if (!slugCounts[slug]) {
      slugCounts[slug] = 1;
    } else {
      slugCounts[slug]++;
      // Generate a unique slug for duplicates
      products[i].slug = `${slug}-${Date.now()}-${slugCounts[slug]}`;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
  }

  return NextResponse.json(products);
}

export async function POST(request) {
  try {
    const newProduct = await request.json();
    const products = readProducts();

    newProduct.id = Date.now().toString();

    products.push(newProduct);

    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ message: 'Product added successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    let products = readProducts();
    const initialLength = products.length;
    products = products.filter(p => p.slug !== slug);

    if (products.length === initialLength) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
