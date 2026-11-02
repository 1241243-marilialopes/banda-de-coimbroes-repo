import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const rows = await query('SELECT id_instrumento, nome_instrumento FROM tb_instrumentos ORDER BY nome_instrumento ASC');
    return NextResponse.json(rows);
  } catch (err: any) {
    console.warn('Erro ao consultar instrumentos, usando fallback:', err.message);
    return NextResponse.json([
      { id_instrumento: 1, nome_instrumento: 'Flauta' },
      { id_instrumento: 2, nome_instrumento: 'Clarinete' },
      { id_instrumento: 3, nome_instrumento: 'Saxofone' },
      { id_instrumento: 4, nome_instrumento: 'Trompete' },
      { id_instrumento: 5, nome_instrumento: 'Trombone' },
      { id_instrumento: 6, nome_instrumento: 'Tuba' },
      { id_instrumento: 7, nome_instrumento: 'Percussão' },
    ]);
  }
}

