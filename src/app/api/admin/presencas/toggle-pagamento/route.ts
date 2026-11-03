import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const { id_presenca } = await req.json();

    if (!id_presenca) {
      return NextResponse.json({ error: 'ID de presença inválido' }, { status: 400 });
    }

    const rows: any = await query(
      'SELECT pago, confirmado FROM tb_presencas WHERE id_presenca = ?',
      [id_presenca]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Presença não encontrada' }, { status: 404 });
    }

    const currentPago = rows[0].pago === 1 || rows[0].pago === '1';
    const confirmado = rows[0].confirmado;

    // REGRA DE NEGÓCIO: Só pode ser paga se a confirmação estiver "Confirmada"
    if (!currentPago && confirmado !== 'Confirmada') {
      return NextResponse.json(
        { error: 'A presença não está confirmada.' },
        { status: 400 }
      );
    }

    const nextPago = currentPago ? 0 : 1;
    const corBotao = nextPago === 1 ? 'success' : 'danger';
    const textoPagar = nextPago === 1 ? 'Pago' : 'Pagar';

    await query(
      `UPDATE tb_presencas 
       SET pago = ?, cor_botao_pagar = ?, texto_pagar = ?, musico_label_pago = ?, cor_pago_musico = ?
       WHERE id_presenca = ?`,
      [nextPago, corBotao, textoPagar, textoPagar, nextPago === 1 ? 'green' : 'red', id_presenca]
    );

    // Send email notification when payment is confirmed
    if (nextPago === 1) {
      try {
        const infoRows: any = await query(
          `SELECT u.email, u.nome_utilizador, s.nome_servico 
           FROM tb_presencas p 
           JOIN tb_utilizadores u ON u.id_utilizador = p.musico_id
           JOIN tb_servicos s ON s.id_servico = p.servico_id
           WHERE p.id_presenca = ?`,
          [id_presenca]
        );

        if (infoRows && infoRows.length > 0) {
          const { email, nome_utilizador, nome_servico } = infoRows[0];
          const now = new Date();
          const dateStr = now.toLocaleString('pt-PT', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          });

          // Dynamic import to avoid build-time issues
          const nodemailer = await import('nodemailer');
          const transporter = nodemailer.default.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'sociedademusical1agosto@gmail.com',
              pass: 'zvqn ojbm sjdb xklx',
            },
          });

          await transporter.sendMail({
            from: '"Banda de Coimbrões" <sociedademusical1agosto@gmail.com>',
            to: email,
            subject: 'Confirmação de pagamento!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #dc2626;">Confirmação de Pagamento</h2>
                <p>Olá, <strong>${nome_utilizador}</strong>!</p>
                <p>O seu pagamento relativo ao serviço <strong>${nome_servico}</strong> foi confirmado.</p>
                <p><strong>Data de confirmação:</strong> ${dateStr}</p>
                <p>Obrigado pela sua participação!</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="color: #6b7280; font-size: 12px;">Sociedade Musical 1º de Agosto — Banda de Coimbrões</p>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error('Erro ao enviar email de confirmação de pagamento:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      pago: nextPago,
      message: nextPago === 1 ? 'Serviço pago com sucesso!' : 'Pagamento cancelado com sucesso!',
    });
  } catch (err: any) {
    console.error('Erro ao alternar pagamento de presença:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
