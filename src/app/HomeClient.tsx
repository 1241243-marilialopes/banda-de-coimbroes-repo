'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import CookieBanner from '@/components/CookieBanner';
import DirectionModal from '@/components/DirectionModal';
import { MapPin, Phone, Mail, Plus, ChevronRight, Facebook, Instagram, Youtube } from 'lucide-react';

interface HomeClientProps {
  contentMap: Record<string, string>;
  imageMap: Record<string, string>;
}

export default function HomeClient({ contentMap, imageMap }: HomeClientProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const heroImage = imageMap['1'] || '/assets/img/bg-1.jpg';
  const quemSomosImage = imageMap['4'] || '/assets/img/bg-2.jpg';

  const quemSomosText =
    contentMap['quem_somos'] ||
    'A Sociedade Musical 1º de Agosto, vulgarmente conhecida como Banda de Coimbrões, foi fundada a 1 de Agosto de 1900. Ao longo de mais de um século de história, tem desempenhado um papel vital no desenvolvimento cultural e musical da comunidade gaiense e do país.';

  const escolaText =
    contentMap['escola'] ||
    'A Escola de Música da Banda de Coimbrões tem como missão formar jovens músicos com rigor técnico e paixão pela música, proporcionando ensino especializado em instrumentos de sopro, percussão e teoria musical.';

  const directionItems = [
    {
      id: 1,
      title: contentMap['modal1_title'] || 'Presidente da Direção',
      name: contentMap['modal1_name'] || 'Direção da Sociedade',
      desc:
        contentMap['modal1_descricao'] ||
        'Responsável pela coordenação geral e representação oficial da Sociedade Musical 1º de Agosto.',
      img: imageMap['5'] || '/assets/img/utilizador.jpg',
    },
    {
      id: 2,
      title: contentMap['modal2_title'] || 'Maestro / Diretor Artístico',
      name: contentMap['modal2_name'] || 'Direção Artística',
      desc:
        contentMap['modal2_descricao'] ||
        'Responsável pela direção musical, preparação de concertos e repertório da banda sinfónica.',
      img: imageMap['6'] || '/assets/img/partitura.jpg',
    },
    {
      id: 3,
      title: contentMap['modal3_title'] || 'Escola de Música',
      name: contentMap['modal3_name'] || 'Coordenação Pedagógica',
      desc:
        contentMap['modal3_descricao'] ||
        'Coordenação pedagógica e tutoria dos alunos e classes instrumentais.',
      img: imageMap['7'] || '/assets/img/chapeu.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      <Navbar onOpenLogin={() => setLoginOpen(true)} />

      {/* HERO SECTION */}
      <header className="relative w-full h-[85vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Banda de Coimbrões"
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest">
            Desde 1900
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white drop-shadow-lg">
            Sociedade Musical <br />
            <span className="text-amber-400">1º de Agosto</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 font-medium max-w-2xl mx-auto drop-shadow">
            Mais de um século de tradição, cultura e paixão pela música em Vila Nova de Gaia.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="#quemsomos"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg shadow-lg hover:shadow-amber-500/20 transition"
            >
              Conheça a Nossa História
            </Link>
            <Link
              href="/inscricao"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg backdrop-blur border border-white/20 transition flex items-center gap-2"
            >
              <span>Tornar-se Sócio</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* QUEM SOMOS */}
      <section id="quemsomos" className="py-24 bg-white text-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
              Quem Somos
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 mb-6"></div>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {quemSomosText}
            </p>
          </div>

          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={quemSomosImage}
              alt="Quem Somos"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* DIREÇÃO */}
      <section id="portfolio" className="py-24 bg-neutral-100 text-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
              Direção
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 mb-6"></div>
            <p className="text-base text-neutral-600">
              Conheça os órgãos sociais e equipa responsável pela dinamização da associação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {directionItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModal(item.id)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 border border-neutral-200 flex flex-col"
              >
                <div className="relative h-64 w-full bg-neutral-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/70 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Plus className="w-12 h-12 text-slate-900" />
                  </div>
                </div>
                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-bold uppercase text-neutral-900 group-hover:text-amber-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1 font-medium">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESCOLA DE MÚSICA */}
      <section id="escola" className="py-24 bg-neutral-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Escola de Música
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 mb-8"></div>
          <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-3xl mx-auto mb-10">
            {escolaText}
          </p>
          <Link
            href="/inscricao"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold rounded-lg shadow-lg hover:shadow-amber-500/20 transition text-base"
          >
            <span>Inscrever Aluno / Sócio</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER & CONTACTOS */}
      <footer id="footer" className="bg-neutral-950 text-white border-t border-neutral-800 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white">Contacte-nos</h2>
            <p className="text-sm text-neutral-400 mt-2">Requisite os nossos serviços e atuações musicais</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-neutral-800">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-wider">Sede</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  {contentMap['morada'] || 'Rua do Agro, Coimbrões, Vila Nova de Gaia'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-wider">Telefone</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  {contentMap['telefone'] || '+351 912 345 678'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-wider">Email</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  {contentMap['email'] || 'sociedademusical1agosto@gmail.com'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} Sociedade Musical 1º de Agosto (Banda de Coimbrões). Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              {contentMap['facebook'] && (
                <a
                  href={contentMap['facebook']}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {contentMap['instagram'] && (
                <a
                  href={contentMap['instagram']}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {contentMap['youtube'] && (
                <a
                  href={contentMap['youtube']}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* MODAIS */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <CookieBanner />

      {directionItems.map((item) => (
        <DirectionModal
          key={item.id}
          isOpen={activeModal === item.id}
          onClose={() => setActiveModal(null)}
          title={item.title}
          name={item.name}
          description={item.desc}
          imageUrl={item.img}
        />
      ))}
    </div>
  );
}

