import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, tele, cc, nif, data, email, instrumento, genero } = body;

    if (!nome || !tele || !cc || !nif || !data || !email || !instrumento || !genero) {
      return NextResponse.json(
        { error: 'Por favor preencha todos os campos obrigatórios.' },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      'INSERT INTO tb_inscricoes (nome, telemovel, data_nascimento, instrumento, genero_id, email, numero_cc, nif) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nome, tele, data, instrumento, genero, email, cc, nif]
    );

    // Envio de email de confirmação exatamente como no PHP
    try {
      await sendMail({
        to: email,
        subject: 'Confirmação de inscrição',
        html: `
          <h2 style="color: black;">Olá, ${nome}!</h2>
          <p><h3 style="color: black;">Confirmamos a receção do pedido de inscrição como sócio!</h3></p>
          <p><h3 style="color: black;">Brevemente, o mesmo será analisado e, se tudo estiver correto, aprovado!</h3></p>
          <p><h3 style="color: black;">Receberás, posteriormente um email para definir a tua Password para poderes aceder à tua Área Reservada.</h3></p>
          <br>
          <h4 style="color: black;">Os melhores cumprimentos,</h4>
          <h4 style="color: black;">A direção da Sociedade Musical 1º de Agosto.</h4>
          <p><img style="height: 130px; width: 130px;" src="cid:logo" alt="Logo"></p>
        `,
      });
    } catch (mailError) {
      console.warn('Inscrição guardada mas falha no envio de email:', mailError);
    }

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: 'Inscrição efetuada com sucesso!',
    });
  } catch (err: any) {
    console.error('Erro ao registar inscrição:', err);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao processar a inscrição.' },
      { status: 500 }
    );
  }
}

