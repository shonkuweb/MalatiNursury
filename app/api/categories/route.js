import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app', 'data', 'categories.json');

function readCategories() {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
}

export async function GET() {
  const categories = readCategories();
  return NextResponse.json(categories);
}

export async function POST(request) {
  try {
    const newCategory = await request.json();
    const categories = readCategories();

    newCategory.id = Date.now().toString();

    categories.push(newCategory);

    fs.writeFileSync(dataFilePath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ message: 'Category added successfully', category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Failed to add category:", error);
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    let categories = readCategories();
    const initialLength = categories.length;
    categories = categories.filter(c => c.slug !== slug);

    if (categories.length === initialLength) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(categories, null, 2));
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
