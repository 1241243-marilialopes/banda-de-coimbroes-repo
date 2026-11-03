import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { verifyPassword, createSessionToken, getDashboardPath, COOKIE_NAME } from '@/lib/auth';

interface DbUser {
  id_utilizador: number;
  nome_utilizador: string;
  senha: string;
  cargo_id: number;
  instrumento?: number | null;
  tipo_socio?: number | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { login, senha } = body;

    if (!login || !senha) {
      return NextResponse.json(
        { error: 'Preencha os dados do Utilizador' },
        { status: 400 }
      );
    }

    const user = await queryOne<DbUser>(
      'SELECT id_utilizador, nome_utilizador, senha, cargo_id, instrumento, tipo_socio FROM tb_utilizadores WHERE email = ?',
      [login]
    );

    if (!user) {
      return NextResponse.json({ error: 'Email Incorreto' }, { status: 401 });
    }

    // REGRA DE NEGÓCIO: Se o sócio estiver inativo (tipo_socio = 7), perde acesso ao site
    if (user.tipo_socio === 7) {
      return NextResponse.json(
        { error: 'A sua conta de sócio encontra-se inativa. Contacte a direção.' },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(senha, user.senha);
    if (!isValid) {
      return NextResponse.json({ error: 'Password Incorreta' }, { status: 401 });
    }

    const token = await createSessionToken({
      id: user.id_utilizador,
      nome: user.nome_utilizador,
      email: login,
      cargo: user.cargo_id,
      instrumento: user.instrumento,
    });

    const response = NextResponse.json({
      success: true,
      redirectUrl: getDashboardPath(user.cargo_id),
      user: {
        id: user.id_utilizador,
        nome: user.nome_utilizador,
        cargo: user.cargo_id,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (err: any) {
    console.error('Erro no login:', err);
    return NextResponse.json(
      { error: 'Erro no servidor ao processar autenticação' },
      { status: 500 }
    );
  }
}

