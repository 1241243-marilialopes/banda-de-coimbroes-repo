'use client';

import { useState } from 'react';

interface CartaoSocioCardProps {
  numeroSocio: number | string;
  nome: string;
  dataNascimento: string;
  idUtilizador: number;
  isRegular: boolean;
  mesCorrenteTexto: string;
}

export default function CartaoSocioCard({
  numeroSocio,
  nome,
  dataNascimento,
  idUtilizador,
  isRegular,
  mesCorrenteTexto,
}: CartaoSocioCardProps) {
  const [imgSrc, setImgSrc] = useState(`/api/utilizadores/foto/${idUtilizador}`);

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/80 shadow-md relative max-w-xl mx-auto">
      {/* Cabeçalho do Cartão */}
      <div className="flex items-start justify-between">
        <span className="text-base font-semibold text-neutral-500 tracking-wide">
          Cartão de Sócio
        </span>

        <div className="flex flex-col items-end gap-1.5">
          {/* Bola indicadora: Verde se regular, Amarelo se em atraso */}
          <span
            className={`w-4 h-4 rounded-full inline-block shadow-sm ${
              isRegular
                ? 'bg-emerald-500 shadow-emerald-500/50'
                : 'bg-amber-500 shadow-amber-500/50'
            }`}
            title={isRegular ? 'Quotas regularizadas' : 'Quotas em atraso'}
          />
          <span className="text-xs font-medium text-neutral-400">
            {mesCorrenteTexto}
          </span>
        </div>
      </div>

      {/* Conteúdo do Cartão: Foto à esquerda e Informações à direita */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-10 mt-8 mb-2">
        {/* Foto Circular */}
        <div className="w-36 h-36 rounded-full overflow-hidden bg-neutral-200 shrink-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={nome}
            className="w-full h-full object-cover"
            onError={() => {
              setImgSrc('/assets/img/utilizador.jpg');
            }}
          />
        </div>

        {/* Dados do Sócio */}
        <div className="space-y-4 text-center sm:text-left flex-1">
          <div>
            <h4 className="text-base font-black text-neutral-900 tracking-tight">
              Nº de Sócio
            </h4>
            <p className="text-sm text-neutral-700 font-medium mt-0.5">
              {numeroSocio}
            </p>
          </div>

          <div>
            <h4 className="text-base font-black text-neutral-900 tracking-tight">
              Nome
            </h4>
            <p className="text-sm text-neutral-700 font-medium mt-0.5">
              {nome}
            </p>
          </div>

          <div>
            <h4 className="text-base font-black text-neutral-900 tracking-tight">
              Data de Nascimento
            </h4>
            <p className="text-sm text-neutral-700 font-medium mt-0.5">
              {dataNascimento}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
