import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { sendMail } from '@/lib/email';

interface UserRow {
  id_utilizador: number;
  nome_utilizador: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, date } = await req.json();

    if (!email || !date) {
      return NextResponse.json(
        { error: 'Por favor preencha todos os campos obrigatórios.' },
        { status: 400 }
      );
    }

    const user = await queryOne<UserRow>(
      'SELECT id_utilizador, nome_utilizador, email FROM tb_utilizadores WHERE email = ? AND data_nascimento = ?',
      [email, date]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Não foi encontrado nenhum utilizador com os dados fornecidos.' },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?id=${user.id_utilizador}&time=${Math.floor(Date.now() / 1000)}`;

    await sendMail({
      to: email,
      subject: 'Recuperar palavra-passe',
      html: `
        <h2 style="color: black;">Olá, ${user.nome_utilizador}!</h2>
        <p><h3 style="color: black;">Parece que precisas de recuperar a tua palavra-passe!</h3></p>
        <p><h3 style="color: black;">Aqui está o <a href="${resetUrl}">link</a> para o poderes fazer!</h3></p>
        <br>
        <h4 style="color: black;">Os melhores cumprimentos,</h4>
        <h4 style="color: black;">A direção da Sociedade Musical 1º de Agosto.</h4>
        <p><img style="height: 130px; width: 130px;" src="cid:logo" alt="Logo"></p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Email de recuperação enviado com sucesso!',
    });
  } catch (err: any) {
    console.error('Erro em forgot-password:', err);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao processar o pedido.' },
      { status: 500 }
    );
  }
}

