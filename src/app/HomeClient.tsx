'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import CookieBanner from '@/components/CookieBanner';
import DirectionModal from '@/components/DirectionModal';
import FormattedText from '@/components/FormattedText';
import { MapPin, Phone, Mail, Plus, ChevronRight, Facebook, Instagram, Youtube } from 'lucide-react';

interface HomeClientProps {
  contentMap: Record<string, string>;
  imageMap: Record<string, string>;
  isPreview?: boolean;
}

export default function HomeClient({ contentMap, imageMap, isPreview = false }: HomeClientProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const heroImage = imageMap['1'] || '/assets/img/bg-1.jpg';
  const quemSomosImage = imageMap['4'] || '/assets/img/bg-2.jpg';

  const quemSomosText =
    contentMap['quem_somos'] ||
    'No dia 1 de Agosto de 1916, Bernardino Dias, José Pedro de Oliveira, José Pinto, Paulino da Mota, Victor Assunção e Manuel de Almeida fundaram a "Banda Marcial 1.º de Agosto". Foi seu primeiro Maestro o então músico da G.N.R. Manuel Salgueiral, que dirigiu a Banda por mais de quatro décadas. Anos depois, em 1941, por imposição do regime político de então, mudou o nome para "Sociedade Musical 1.º de Agosto". No entanto, para a população de Vila Nova de Gaia, sempre foi e continua a ser a "Banda de Música de Coimbrões".';

  const escolaText =
    contentMap['escola'] ||
    'A Escola de Música da Banda de Coimbrões, constituída por um corpo docente exclusivamente composto por músicos da Banda, visa a formação de jovens músicos com rigor técnico e paixão pela música, proporcionando ensino especializado em instrumentos de sopro, percussão e formação musical.';

  const directionItems = [
    {
      id: 1,
      title: contentMap['modal1_title'] || 'Presidente da Direção',
      name: contentMap['modal1_name'] || 'Direção da Sociedade',
      subtitle: contentMap['modal1_descricao'] || 'Representação oficial e coordenação executiva',
      text:
        contentMap['port1_texto'] ||
        contentMap['modal1_descricao'] ||
        'A Direção da Sociedade Musical 1º de Agosto tem como missão primordial velar pela salvaguarda do património centenário da banda, coordenar todas as atividades culturais e administrativas, e garantir a sustentabilidade e crescimento futuro da instituição na comunidade gaiense.',
      img: imageMap['5'] || '/assets/img/utilizador.jpg',
    },
    {
      id: 2,
      title: contentMap['modal2_title'] || 'Maestro / Diretor Artístico',
      name: contentMap['modal2_name'] || 'Direção Artística',
      subtitle: contentMap['modal2_descricao'] || 'Direção artística e concertística',
      text:
        contentMap['port2_texto'] ||
        contentMap['modal2_descricao'] ||
        'À frente da Direção Musical e Artística, o Maestro coordena o trabalho de ensaio e a preparação técnica de todas as atuações públicas, concertos solenes e romarias tradicionais, assegurando a máxima fidelidade estética e interpretação das peças sinfónicas.',
      img: imageMap['6'] || '/assets/img/partitura.jpg',
    },
    {
      id: 3,
      title: contentMap['modal3_title'] || 'Escola de Música',
      name: contentMap['modal3_name'] || 'Coordenação Pedagógica',
      subtitle: contentMap['modal3_descricao'] || 'Ensino e formação de novos músicos',
      text:
        contentMap['port3_texto'] ||
        contentMap['modal3_descricao'] ||
        'A coordenação pedagógica da Escola de Música da Banda de Coimbrões orienta o ensino instrumental desde as etapas iniciais até à integração efetiva na banda principal, mantendo um padrão rigoroso e humanista de formação musical.',
      img: imageMap['7'] || '/assets/img/chapeu.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col selection:bg-red-600 selection:text-white">
      {isPreview && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-xs sm:text-sm font-bold text-center shadow-lg flex items-center justify-center gap-2 sticky top-0 z-[60]">
          <span className="bg-amber-800 text-amber-100 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-black">
            Modo de Pré-visualização
          </span>
          <span>
            Esta é apenas uma pré-visualização das secções do website público. Login e registo de novos sócios desativados.
          </span>
        </div>
      )}

      <Navbar onOpenLogin={() => !isPreview && setLoginOpen(true)} isPreview={isPreview} />

      {/* HERO SECTION */}
      <header className="relative w-full h-[90vh] sm:h-[94vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Banda de Coimbrões"
            className="w-full h-full object-cover brightness-[0.38]"
          />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 bg-red-600/30 border border-red-500/60 text-red-300 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest shadow-sm">
            Desde 1916
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white drop-shadow-2xl">
            Sociedade Musical <br />
            <span className="text-red-500">1º de Agosto</span>
          </h1>
          <p className="text-base sm:text-xl text-neutral-200 font-medium max-w-3xl mx-auto drop-shadow leading-relaxed">
            Mais de um século de tradição, cultura e paixão pela música em Vila Nova de Gaia.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="#quemsomos"
              className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg shadow-lg shadow-red-900/40 hover:scale-102 transition duration-200 active:scale-98"
            >
              Conheça a Nossa História
            </Link>
            {isPreview ? (
              <button
                type="button"
                onClick={() => alert('Modo de Pré-visualização: A adesão de associados está desativada.')}
                className="px-8 py-3.5 bg-white/10 text-neutral-400 font-bold rounded-lg backdrop-blur border border-white/15 cursor-not-allowed flex items-center gap-2"
              >
                <span>Tornar-se Sócio (Desativado)</span>
              </button>
            ) : (
              <Link
                href="/inscricao"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg backdrop-blur border border-white/25 transition duration-200 flex items-center gap-2 hover:scale-102"
              >
                <span>Tornar-se Sócio</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* QUEM SOMOS */}
      <section id="quemsomos" className="py-20 sm:py-28 bg-white text-neutral-900">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
              Quem Somos
            </h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto mt-3 mb-6"></div>
          </div>

          <div className="w-full bg-neutral-50/90 p-6 sm:p-12 rounded-2xl border border-neutral-200 shadow-sm">
            <FormattedText
              content={quemSomosText}
              className="text-base sm:text-lg text-neutral-700 leading-relaxed text-justify"
            />
          </div>

          <div className="mt-12 relative w-full h-[360px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={quemSomosImage}
              alt="História da Banda de Coimbrões"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* DIREÇÃO */}
      <section id="portfolio" className="py-20 sm:py-28 bg-neutral-100 text-neutral-900 border-t border-neutral-200">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
              Direção
            </h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto mt-3 mb-4"></div>
            <p className="text-base sm:text-lg text-neutral-600 font-medium">
              Conheça os órgãos sociais e equipa responsável pela dinamização da associação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {directionItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModal(item.id)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-neutral-200 flex flex-col hover:-translate-y-1"
              >
                <div className="relative h-64 sm:h-72 w-full bg-neutral-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-red-600/80 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Plus className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-bold uppercase text-neutral-900 group-hover:text-red-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1 font-semibold">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESCOLA DE MÚSICA */}
      <section id="escola" className="py-20 sm:py-28 bg-white text-neutral-900 border-t border-neutral-200">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900">
            Escola de Música
          </h2>
          <div className="w-20 h-1.5 bg-red-600 mx-auto mt-3 mb-10"></div>
          
          <div className="w-full bg-neutral-50/90 p-6 sm:p-12 rounded-2xl border border-neutral-200 shadow-sm mb-12 text-left">
            <FormattedText
              content={escolaText}
              className="text-base sm:text-lg text-neutral-700 leading-relaxed text-justify"
            />
          </div>

          <Link
            href="/inscricao"
            className="inline-flex items-center gap-2 px-9 py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg shadow-lg shadow-red-900/40 hover:scale-102 transition text-base sm:text-lg"
          >
            <span>Inscrever Aluno / Sócio</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER & CONTACTOS */}
      <footer id="footer" className="bg-neutral-950 text-white border-t border-neutral-800 pt-16 pb-12">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white">Contacte-nos</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-3 mb-3"></div>
            <p className="text-sm text-neutral-400">Requisite os nossos serviços e atuações musicais</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-neutral-800">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="p-3 bg-red-600/15 text-red-500 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sede</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  {contentMap['morada'] || 'Rua do Agro, Coimbrões, Vila Nova de Gaia'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="p-3 bg-red-600/15 text-red-500 rounded-xl">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Telefone</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  {contentMap['telefone'] || '+351 912 345 678'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="p-3 bg-red-600/15 text-red-500 rounded-xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Email</h4>
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
                  className="text-neutral-400 hover:text-red-400 transition"
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
                  className="text-neutral-400 hover:text-red-400 transition"
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
                  className="text-neutral-400 hover:text-red-400 transition"
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
      {!isPreview && <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />}
      {!isPreview && <CookieBanner />}

      {directionItems.map((item) => (
        <DirectionModal
          key={item.id}
          isOpen={activeModal === item.id}
          onClose={() => setActiveModal(null)}
          title={item.title}
          name={item.name}
          subtitle={item.subtitle}
          text={item.text}
          imageUrl={item.img}
        />
      ))}
    </div>
  );
}
