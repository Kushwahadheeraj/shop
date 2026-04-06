import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

export async function GET(request, { params }) {
  const token = request.headers.get('authorization');
  const r = await fetch(`${API_BASE_URL}/gst-shops/${params.id}`, { headers: { 'Authorization': token || '' } });
  const d = await r.json();
  return NextResponse.json(d, { status: r.status });
}

export async function PUT(request, { params }) {
  const token = request.headers.get('authorization');
  const body = await request.json();
  const r = await fetch(`${API_BASE_URL}/gst-shops/${params.id}`, { method: 'PUT', headers: { 'Authorization': token || '', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json();
  return NextResponse.json(d, { status: r.status });
}

export async function DELETE(request, { params }) {
  const token = request.headers.get('authorization');
  const r = await fetch(`${API_BASE_URL}/gst-shops/${params.id}`, { method: 'DELETE', headers: { 'Authorization': token || '' } });
  const d = await r.json();
  return NextResponse.json(d, { status: r.status });
}


