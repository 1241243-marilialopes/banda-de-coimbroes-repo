'use client';

import { useState } from 'react';
import Image from 'next/image';

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
    <div className="relative max-w-xl mx-auto rounded-3xl p-7 sm:p-9 overflow-hidden bg-gradient-to-br from-[#800a0a] via-[#9e1616] to-[#260505] text-white shadow-2xl border-2 border-amber-400/40">
      {/* Elementos decorativos de fundo */}
      <div className="absolute -top-16 -right-16 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none w-56 h-56">
        <Image
          src="/assets/banda.png"
          alt="Marca de água"
          width={224}
          height={224}
          className="object-contain"
        />
      </div>

      {/* Cabeçalho do Cartão com Identidade Institucional */}
      <div className="relative z-10 flex items-start justify-between border-b border-white/15 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-xs shrink-0 shadow-xs">
            <Image
              src="/assets/banda.png"
              alt="Logo Banda de Coimbrões"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black tracking-wider uppercase text-amber-300 drop-shadow-xs">
              Banda de Coimbrões
            </h3>
            <p className="text-[11px] text-white/80 font-medium tracking-tight">
              Sociedade Musical 1º de Agosto
            </p>
          </div>
        </div>

        {/* Indicador de Estado das Quotas & Mês */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-xs border ${
              isRegular
                ? 'bg-emerald-950/70 border-emerald-400/50 text-emerald-200'
                : 'bg-amber-950/70 border-amber-400/50 text-amber-200'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shadow-xs ${
                isRegular
                  ? 'bg-emerald-400 shadow-emerald-400/80 animate-pulse'
                  : 'bg-amber-400 shadow-amber-400/80 animate-pulse'
              }`}
            />
            <span className="text-[11px] tracking-wide">
              {isRegular ? 'Quotas em Dia' : 'Quotas Pendentes'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">
            {mesCorrenteTexto}
          </span>
        </div>
      </div>

      {/* Conteúdo Central do Cartão */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-7 sm:gap-9 my-7">
        {/* Foto do Associado com Moldura Dourada */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-neutral-900 ring-4 ring-amber-400/60 ring-offset-4 ring-offset-[#800a0a] shadow-xl flex items-center justify-center">
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
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-amber-400 text-neutral-950 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">
            Associado
          </div>
        </div>

        {/* Informações Pessoais do Associado */}
        <div className="space-y-3.5 text-center sm:text-left flex-1 min-w-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/90 block">
              Nº de Sócio
            </span>
            <p className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              #{numeroSocio}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/90 block">
              Nome do Associado
            </span>
            <p className="text-base sm:text-lg font-bold text-white tracking-tight truncate mt-0.5">
              {nome}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/90 block">
              Data de Nascimento
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white/90 mt-0.5">
              {dataNascimento || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Rodapé do Cartão */}
      <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[10px] sm:text-[11px] text-white/70 font-semibold tracking-wide">
        <span>Cartão Oficial de Associado</span>
        <span className="text-amber-300/80">Desde 1916 • V. N. Gaia</span>
      </div>
    </div>
  );
}
