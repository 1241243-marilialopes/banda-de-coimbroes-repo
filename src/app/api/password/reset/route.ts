import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { id, time, password, confirm } = await req.json();

    if (!id || !password || !confirm) {
      return NextResponse.json(
        { error: 'Dados incompletos fornecidos.' },
        { status: 400 }
      );
    }

    if (time) {
      const sentTime = Number(time);
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime - sentTime >= 1800) {
        return NextResponse.json(
          { error: 'O link de recuperação expirou (máximo 30 minutos).' },
          { status: 410 }
        );
      }
    }

    if (password !== confirm) {
      return NextResponse.json(
        { error: 'As passwords não coincidem.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'A password deve ter pelo menos 8 caracteres.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await pool.execute(
      'UPDATE tb_utilizadores SET senha = ? WHERE id_utilizador = ?',
      [hashedPassword, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Palavra-passe atualizada com sucesso!',
    });
  } catch (err: any) {
    console.error('Erro em reset-password:', err);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao atualizar a palavra-passe.' },
      { status: 500 }
    );
  }
}

