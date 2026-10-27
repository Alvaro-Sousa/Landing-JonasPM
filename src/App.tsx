import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Shield,
  Target,
  Calendar,
  Award,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Crosshair,
  FileText,
  Users,
  ArrowUpRight,
  Lock,
  MapPin,
  Instagram
} from 'lucide-react';
import TacticalScene from './components/TacticalScene';

const WHATSAPP_NUMBER = '558381191048';
const INSTAGRAM_URL = 'https://instagram.com/aprovasertao';

interface ApprovedStudent {
  id: number;
  name: string;
  exam: string;
  position: string;
  quote: string;
  status: 'APROVADO' | 'CONVOCADO' | 'CLASSIFICADO';
  year: string;
}

const APPROVED_STUDENTS: ApprovedStudent[] = [
  {
    id: 1,
    name: 'Aluno Mentoria #01',
    exam: 'PMCE - Soldado',
    position: 'Aprovado dentro das vagas',
    quote: 'Eu estudava sem direção há mais de um ano. Com o cronograma tático e o ajuste de metas semanais do Jonas, subi meu percentual de acertos de 62% para 86% em 3 meses.',
    status: 'APROVADO',
    year: 'Turma Recente'
  },
  {
    id: 2,
    name: 'Aluno Mentoria #02',
    exam: 'CFO - Curso de Formação de Oficiais',
    position: 'Classificado 1ª Fase + TAF',
    quote: 'O diferencial é aprender com quem já passou tanto para Praça quanto para Oficial. O material de suporte enxuto corta tudo que a banca não cobra.',
    status: 'CLASSIFICADO',
    year: 'Turma Recente'
  },
  {
    id: 3,
    name: 'Aluno Mentoria #03',
    exam: 'Polícia Penal / Guardas',
    position: 'Dupla Aprovação Policial',
    quote: 'Trabalhava 8h por dia e achava impossível competir. O método de ciclos adaptáveis do Jonas encaixou 3h líquidas de estudo real todos os dias.',
    status: 'APROVADO',
    year: 'Turma Recente'
  },
  {
    id: 4,
    name: 'Espaço Reservado — Próximo Aprovado',
    exam: 'Carreiras Policiais (PM / PC / CFO)',
    position: 'Sua vaga está em construção',
    quote: 'Estrutura pronta para adicionar novos cards de alunos aprovados com foto, colocação e depoimento real a qualquer momento.',
    status: 'CONVOCADO',
    year: 'Próximo Edital'
  }
];

const PILLARS = [
  {
    code: 'PILAR 01',
    icon: Crosshair,
    title: 'Mentoria & Direcionamento Tático',
    description: 'Diagnóstico completo dos seus pontos cegos. Você para de estudar matérias que já domina e ataca cirurgicamente os tópicos que mais derrubam candidatos na sua banca.'
  },
  {
    code: 'PILAR 02',
    icon: Calendar,
    title: 'Cronogramas Individualizados',
    description: 'Planejamento construído para a sua realidade — seja você alguém que trabalha o dia inteiro ou que tem tempo integral. Metas diárias claras, sem sobrecarga irreal.'
  },
  {
    code: 'PILAR 03',
    icon: FileText,
    title: 'Material de Suporte Enxuto',
    description: 'Chega de PDFs de 200 páginas. Receba guias de revisão rápida, mapas de lei seca grifada e cadernos de questões filtradas exatamente no padrão das carreiras policiais.'
  },
  {
    code: 'PILAR 04',
    icon: Target,
    title: 'Estratégia de Prova, Simulados e TAF',
    description: 'Treinamento de gestão de tempo de prova, controle emocional para o dia D e orientação prática de preparação física para não reprovar no TAF.'
  }
];

const EXAMS_LIST = [
  'PMCE — Soldado (Praça)',
  'CFO-CE — Oficialato Polícia Militar',
  'Polícia Militar (Outros Estados - PB, PE, RN, BA)',
  'Polícia Civil (Agente / Escrivão)',
  'Polícia Penal / Guarda Municipal',
  'PRF / PF',
  'Ainda estou decidindo meu foco policial'
];

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

/**
 * GPU-accelerated ParallaxCard using direct DOM style updates inside requestAnimationFrame
 * so zero React re-renders happen during mouse movement or scroll (60+ FPS guaranteed).
 */
function ParallaxCard({
  children,
  className = '',
  intensity = 7,
  scrollContainerRef
}: ParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (!cardRef.current || !glareRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -intensity;
        const rotateY = ((x - centerX) / centerX) * intensity;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
        const gx = ((x / rect.width) * 100).toFixed(1);
        const gy = ((y / rect.height) * 100).toFixed(1);
        glareRef.current.style.opacity = '0.22';
        glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(212, 175, 55, 0.42), rgba(45, 66, 54, 0.18) 45%, transparent 75%)`;
      });
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateOnScroll = () => {
      if (window.innerWidth >= 1024 || !cardRef.current || !glareRef.current) {
        ticking = false;
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      if (rect.bottom < -40 || rect.top > vh + 40) {
        ticking = false;
        return;
      }

      const normY = (rect.top + rect.height / 2 - vh / 2) / (vh / 2);
      const normX = (rect.left + rect.width / 2 - vw / 2) / (vw / 2);

      const rotX = Math.max(-intensity, Math.min(intensity, normY * -(intensity * 0.75)));
      const rotY = Math.max(-intensity, Math.min(intensity, normX * (intensity * 0.85)));
      const liftY = Math.max(-4, (1 - Math.abs(normY)) * -3);

      cardRef.current.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(${liftY.toFixed(1)}px)`;

      const gx = (50 - normX * 35).toFixed(1);
      const gy = (50 - normY * 35).toFixed(1);
      glareRef.current.style.opacity = '0.15';
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(212, 175, 55, 0.35), rgba(45, 66, 54, 0.15) 50%, transparent 75%)`;

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateOnScroll);
      }
    };

    const container = scrollContainerRef?.current;
    window.addEventListener('scroll', onScroll, { passive: true });
    container?.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      container?.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [intensity, scrollContainerRef]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d',
        transition: 'transform 170ms cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform'
      }}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{ opacity: 0 }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: 'translateZ(14px)' }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOutSplash, setFadeOutSplash] = useState(false);
  const [fpsStats, setFpsStats] = useState<{ current: number; avg: number; min: number } | null>(null);
  const [studentName, setStudentName] = useState('');
  const [targetExam, setTargetExam] = useState(EXAMS_LIST[0]);
  const [specificNeed, setSpecificNeed] = useState('');
  const [studyStage, setStudyStage] = useState('Começando do zero');
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOutSplash(true), 1550);
    const removeTimer = setTimeout(() => setIsLoading(false), 2050);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Built-in FPS Telemetry (only runs when ?fps=1 is in URL)
  useEffect(() => {
    const showHud = window.location.search.includes('fps=1');
    if (!showHud) return;
    let frameCount = 0;
    let lastTime = performance.now();
    const samples: number[] = [];
    let animId: number;

    const measure = (now: number) => {
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 500) {
        const currentFps = Math.min(60, Math.round((frameCount * 1000) / delta));
        samples.push(currentFps);
        if (samples.length > 30) samples.shift();
        const avgFps = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
        const minFps = Math.min(...samples);
        (window as unknown as Record<string, unknown>).__FPS_REPORT__ = {
          current: currentFps,
          avg: avgFps,
          min: minFps,
          samplesCount: samples.length
        };
        setFpsStats({ current: currentFps, avg: avgFps, min: minFps });
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, []);

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 380;
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const sanitizeText = (input: string, maxLen: number) =>
    input
      .replace(/[\u0000-\u001F\u007F<>]/g, '')
      .trim()
      .slice(0, maxLen);

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeText(studentName, 80) || 'Candidato(a)';
    const cleanExam = EXAMS_LIST.includes(targetExam) ? targetExam : EXAMS_LIST[0];
    const cleanDetails =
      sanitizeText(specificNeed, 500) ||
      'Preciso de acompanhamento completo, cronograma e estratégia de estudos.';

    const message = [
      `Olá, Jonas! Vim pela página oficial da sua Mentoria Policial.`,
      ``,
      `*DADOS DO CANDIDATO:*`,
      `• *Nome:* ${cleanName}`,
      `• *Concurso Alvo:* ${cleanExam}`,
      `• *Nível Atual:* ${studyStage}`,
      `• *Objetivo / Dificuldade Específica:* ${cleanDetails}`,
      ``,
      `Gostaria de saber como funciona o acompanhamento e garantir minha vaga.`
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openQuickWhatsApp = (customText?: string) => {
    const text =
      customText ||
      'Olá, Jonas! Vim pelo site da Mentoria Policial e quero saber mais sobre o acompanhamento, cronogramas e materiais.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-tactical-bg text-tactical-text relative selection:bg-tactical-gold selection:text-black">
      {/* TACTICAL SVG INTRO SPLASH SCREEN */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-[100] bg-tactical-bg tactical-grid flex flex-col items-center justify-center transition-opacity duration-500 ${
            fadeOutSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="relative flex flex-col items-center">
            <img
              src="/shield-logo.svg"
              alt="Brasão Tático Jonas Filho"
              className="w-28 h-28 sm:w-32 sm:h-32 animate-shield-intro"
            />
            <div className="mt-6 text-center">
              <div className="font-display font-bold text-2xl tracking-[0.25em] uppercase text-white">
                JONAS FILHO
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-tactical-gold mt-1">
                MENTORIA & ESTRATÉGIA POLICIAL
              </div>
            </div>
            <div className="w-48 h-1 bg-tactical-card border border-tactical-border rounded-full overflow-hidden mt-6">
              <div className="h-full bg-gradient-to-r from-tactical-olive via-tactical-gold to-tactical-goldLight animate-loading-bar" />
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-tactical-border/80 bg-tactical-bg/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded bg-tactical-card border border-tactical-gold/50 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-tactical-gold transition p-1.5">
              <img src="/shield-logo.svg" alt="Escudo Jonas Filho" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-display font-bold text-xl tracking-wider uppercase leading-none text-white">
                JONAS FILHO
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-tactical-gold font-medium mt-0.5">
                Mentoria & Estratégia Policial
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-tactical-muted">
            <a href="#metodo" className="hover:text-tactical-gold transition">O Método</a>
            <a href="#mentor" className="hover:text-tactical-gold transition">Quem é Jonas Filho</a>
            <a href="#aprovados" className="hover:text-tactical-gold transition">Mural de Aprovados</a>
            <a href="#aplicacao" className="hover:text-tactical-gold transition">Triagem WhatsApp</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-tactical-card hover:bg-tactical-olive/40 border border-tactical-border hover:border-tactical-gold/60 text-tactical-text rounded transition text-xs font-display font-bold uppercase tracking-wider"
              title="Instagram @aprovasertao"
            >
              <Instagram className="w-4 h-4 text-tactical-gold" />
              <span className="hidden sm:inline">@aprovasertao</span>
            </a>
            <a
              href="#aplicacao"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-tactical-gold hover:bg-tactical-goldLight text-black font-display font-bold uppercase tracking-wider text-sm rounded transition shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              <span>Falar com o Mentor</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden tactical-grid border-b border-tactical-border">
        <TacticalScene />

        {/* Ambient radial glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-tactical-olive/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-tactical-gold/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column on Desktop / Second on Mobile: Copy */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-tactical-card/90 border border-tactical-gold/40 text-xs uppercase tracking-[0.18em] text-tactical-gold font-semibold">
                <span className="w-2 h-2 rounded-full bg-tactical-gold animate-pulse" />
                PMCE Ativo • Aprovado CFO-CE
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.05] text-white">
                Não estude no escuro.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-tactical-gold via-tactical-goldLight to-amber-200">
                  Use a estratégia
                </span>{' '}
                de quem já conquistou a farda e o oficialato.
              </h1>

              <p className="text-base sm:text-lg text-tactical-muted max-w-2xl leading-relaxed">
                Mentoria individualizada, cronogramas táticos de estudo e material de suporte enxuto com{' '}
                <strong className="text-white font-semibold">Jonas Filho</strong>. Pare de acumular teoria inútil e siga um plano de guerra validado nas provas policiais mais disputadas.
              </p>

              {/* Key metrics strip */}
              <div className="grid grid-cols-3 gap-4 pt-2 max-w-xl">
                <ParallaxCard intensity={8} className="p-3.5 rounded bg-tactical-card/80 border border-tactical-border hover:border-tactical-gold/60 hud-corner">
                  <div>
                    <div className="font-display font-bold text-2xl sm:text-3xl text-tactical-gold">2x</div>
                    <div className="text-xs text-tactical-muted uppercase tracking-wider mt-0.5">
                      Aprovado (Praça & CFO)
                    </div>
                  </div>
                </ParallaxCard>
                <ParallaxCard intensity={8} className="p-3.5 rounded bg-tactical-card/80 border border-tactical-border hover:border-tactical-gold/60 hud-corner">
                  <div>
                    <div className="font-display font-bold text-2xl sm:text-3xl text-white">100%</div>
                    <div className="text-xs text-tactical-muted uppercase tracking-wider mt-0.5">
                      Cronograma Sob Medida
                    </div>
                  </div>
                </ParallaxCard>
                <ParallaxCard intensity={8} className="p-3.5 rounded bg-tactical-card/80 border border-tactical-border hover:border-tactical-gold/60 hud-corner">
                  <div>
                    <div className="font-display font-bold text-2xl sm:text-3xl text-tactical-gold">Direto</div>
                    <div className="text-xs text-tactical-muted uppercase tracking-wider mt-0.5">
                      Suporte com o Mentor
                    </div>
                  </div>
                </ParallaxCard>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <a
                  href="#aplicacao"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-tactical-gold hover:bg-tactical-goldLight text-black font-display font-bold text-lg uppercase tracking-wider rounded transition shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                >
                  <span>Montar Meu Plano no WhatsApp</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="#metodo"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-tactical-card/90 hover:bg-tactical-olive/40 text-white border border-tactical-border hover:border-tactical-gold/40 font-display font-semibold text-lg uppercase tracking-wider rounded transition"
                >
                  Conhecer o Método
                </a>
              </div>

              <div className="flex items-center gap-6 text-xs text-tactical-muted pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tactical-gold" />
                  <span>Metas Semanais claras</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tactical-gold" />
                  <span>Material enxuto focado na banca</span>
                </div>
              </div>
            </div>

            {/* Right Column on Desktop / First on Mobile (Compatibility Mode): Tactical Hero Image */}
            <div className="lg:col-span-5 relative order-1 lg:order-2">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-b from-tactical-gold/30 via-tactical-olive/20 to-transparent rounded-xl blur-md opacity-70 pointer-events-none" />
                
                <ParallaxCard intensity={5} className="rounded-xl border border-tactical-gold/40 bg-tactical-card shadow-2xl hud-corner">
                  {/* Top HUD Header */}
                  <div className="px-4 py-2.5 bg-black/80 border-b border-tactical-border flex items-center justify-between text-[11px] font-mono text-tactical-muted">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      OPERACIONAL // PMCE
                    </span>
                    <span className="text-tactical-gold font-semibold">CFO-CE • OFICIALATO</span>
                  </div>

                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <img
                      src="/images/jonas-hero.jpg"
                      alt="Jonas Filho - Policial Militar do Ceará e Mentor"
                      className="w-full h-full object-cover object-top scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tactical-bg via-tactical-bg/20 to-transparent" />

                    {/* Floating badge bottom */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-tactical-bg/90 backdrop-blur-md border border-tactical-gold/40">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-tactical-gold font-semibold">
                            Mentor Responsável
                          </p>
                          <p className="font-display font-bold text-xl text-white uppercase">
                            Jonas Filho
                          </p>
                          <p className="text-xs text-tactical-muted">
                            Policial Militar • Concludente CFO-CE
                          </p>
                        </div>
                        <div className="w-11 h-11 rounded-full bg-tactical-gold/15 border border-tactical-gold flex items-center justify-center">
                          <Award className="w-6 h-6 text-tactical-gold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </ParallaxCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM / TACTICAL REALITY */}
      <section className="py-16 bg-black/50 border-b border-tactical-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ParallaxCard intensity={6} className="p-6 rounded-lg bg-tactical-card/60 border border-tactical-border hover:border-red-500/40 hud-corner">
              <div>
                <div className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2">ERRO COMUM #01</div>
                <h3 className="font-display font-bold text-xl uppercase text-white mb-2">
                  Estudar como se o edital inteiro tivesse o mesmo peso
                </h3>
                <p className="text-sm text-tactical-muted leading-relaxed">
                  O concurseiro amador tenta ler milhares de páginas na mesma velocidade. O aprovado estuda por incidência estatística da banca e revisão ativa.
                </p>
              </div>
            </ParallaxCard>

            <ParallaxCard intensity={6} className="p-6 rounded-lg bg-tactical-card/60 border border-tactical-border hover:border-red-500/40 hud-corner">
              <div>
                <div className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2">ERRO COMUM #02</div>
                <h3 className="font-display font-bold text-xl uppercase text-white mb-2">
                  Cronogramas genéricos que quebram na 2ª semana
                </h3>
                <p className="text-sm text-tactical-muted leading-relaxed">
                  Planilhas prontas da internet ignoram seu trabalho, seu cansaço e sua base atual. Na mentoria, o cronograma se adapta à sua rotina real.
                </p>
              </div>
            </ParallaxCard>

            <ParallaxCard intensity={6} className="p-6 rounded-lg bg-tactical-card/60 border border-tactical-gold/40 hover:border-tactical-gold hud-corner">
              <div>
                <div className="text-xs font-mono text-tactical-gold uppercase tracking-widest mb-2">A SOLUÇÃO TÁTICA</div>
                <h3 className="font-display font-bold text-xl uppercase text-white mb-2">
                  Acompanhamento de quem conhece a prova por dentro
                </h3>
                <p className="text-sm text-tactical-muted leading-relaxed">
                  Você recebe o mapa exato: o que estudar hoje, quando revisar, quantas questões fazer e como blindar sua mente até o dia da prova.
                </p>
              </div>
            </ParallaxCard>
          </div>
        </div>
      </section>

      {/* 4 PILLARS OF THE METHOD */}
      <section id="metodo" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-tactical-gold font-semibold mb-3">
                <Crosshair className="w-4 h-4" />
                Engenharia da Aprovação Policial
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase text-white tracking-tight">
                Os 4 Pilares da <span className="text-tactical-gold">Mentoria Jonas Filho</span>
              </h2>
            </div>
            <p className="text-tactical-muted max-w-md text-sm sm:text-base">
              Um sistema completo que une planejamento individual, material objetivo e cobrança estratégica para garantir constância até o edital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ParallaxCard
                  key={idx}
                  intensity={6}
                  className="group p-8 rounded-xl bg-tactical-card border border-tactical-border hover:border-tactical-gold/60 hud-corner"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-tactical-gold px-2.5 py-1 rounded bg-tactical-gold/10 border border-tactical-gold/30">
                        {pillar.code}
                      </span>
                      <div className="w-12 h-12 rounded-lg bg-tactical-bg border border-tactical-border group-hover:border-tactical-gold flex items-center justify-center transition">
                        <Icon className="w-6 h-6 text-tactical-gold" />
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-2xl uppercase text-white mb-3 group-hover:text-tactical-gold transition">
                      {pillar.title}
                    </h3>
                    <p className="text-tactical-muted leading-relaxed text-sm sm:text-base">
                      {pillar.description}
                    </p>
                  </div>
                </ParallaxCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT MENTOR (JONAS FILHO) */}
      <section id="mentor" className="py-24 bg-tactical-card/50 border-y border-tactical-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5">
              <div className="relative max-w-sm mx-auto lg:max-w-none">
                <ParallaxCard intensity={5} className="rounded-xl border-2 border-tactical-gold/50 bg-tactical-bg shadow-2xl hud-corner">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src="/images/jonas-mentor.jpg"
                      alt="Jonas Filho em serviço na Polícia Militar do Ceará"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tactical-bg via-transparent to-transparent" />
                  </div>
                  <div className="p-5 bg-tactical-bg border-t border-tactical-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display font-bold text-xl uppercase text-white">
                          SD PM Jonas Filho
                        </div>
                        <div className="text-xs text-tactical-gold uppercase tracking-wider font-medium">
                          Policial Militar do Ceará • Concludente CFO-CE
                        </div>
                      </div>
                      <MapPin className="w-5 h-5 text-tactical-gold" />
                    </div>
                  </div>
                </ParallaxCard>
              </div>
            </div>

            {/* Bio Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-tactical-gold font-semibold">
                <Shield className="w-4 h-4" />
                Autoridade Comprovada em Campo e no Papel
              </div>

              <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase text-white leading-tight">
                Quem vai guiar sua aprovação: <span className="text-tactical-gold">Jonas Filho</span>
              </h2>

              <p className="text-tactical-muted text-base sm:text-lg leading-relaxed">
                Diferente de professores teóricos que nunca pisaram em um quartel ou fizeram uma prova policial recente,{' '}
                <strong className="text-white">Jonas Filho vive a realidade operacional da Polícia Militar do Estado do Ceará (PMCE)</strong> e conhece cada etapa que separa o estudante comum da nomeação.
              </p>

              <p className="text-tactical-muted text-base leading-relaxed">
                Além de atuar nas ruas como Policial Militar do Ceará, Jonas também foi{' '}
                <strong className="text-tactical-gold">aprovado no rigoroso Concurso do Curso de Formação de Oficiais (CFO-CE)</strong>, encontrando-se atualmente em conclusão do curso de Oficialato. Isso significa que ele domina na prática tanto a preparação para concursos de Praça (Soldado) quanto a exigência de alto nível para Oficial.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <ParallaxCard intensity={7} className="p-4 rounded-lg bg-tactical-bg border border-tactical-border hover:border-tactical-gold/60 hud-corner">
                  <div className="flex items-start gap-3.5">
                    <Award className="w-6 h-6 text-tactical-gold shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display font-bold uppercase text-white text-lg">Aprovado CFO-CE</h4>
                      <p className="text-xs text-tactical-muted mt-1">
                        Domínio de matérias avançadas, redação discursiva e estratégia de alto desempenho.
                      </p>
                    </div>
                  </div>
                </ParallaxCard>

                <ParallaxCard intensity={7} className="p-4 rounded-lg bg-tactical-bg border border-tactical-border hover:border-tactical-gold/60 hud-corner">
                  <div className="flex items-start gap-3.5">
                    <Shield className="w-6 h-6 text-tactical-gold shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display font-bold uppercase text-white text-lg">Atuação na PMCE</h4>
                      <p className="text-xs text-tactical-muted mt-1">
                        Experiência real em todas as fases do certame: prova objetiva, TAF, psicotécnico e curso de formação.
                      </p>
                    </div>
                  </div>
                </ParallaxCard>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#aplicacao"
                  className="inline-flex items-center gap-3 px-7 py-3.5 bg-tactical-gold hover:bg-tactical-goldLight text-black font-display font-bold uppercase tracking-wider rounded transition"
                >
                  <span>Quero Ser Mentoriado pelo Jonas</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-tactical-bg hover:bg-tactical-olive/30 text-white border border-tactical-gold/40 hover:border-tactical-gold font-display font-bold uppercase tracking-wider rounded transition"
                >
                  <Instagram className="w-5 h-5 text-tactical-gold" />
                  <span>Siga @aprovasertao</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HORIZONTAL CARDS: MURAL DE ALUNOS APROVADOS */}
      <section id="aprovados" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-tactical-gold font-semibold mb-3">
                <Users className="w-4 h-4" />
                Resultados Reais do Método
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase text-white">
                Pelotão de <span className="text-tactical-gold">Alunos Aprovados</span>
              </h2>
              <p className="text-sm text-tactical-muted mt-2 max-w-xl">
                Deslize para o lado e veja quem aplicou o cronograma tático e garantiu o nome no Diário Oficial.
              </p>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollCarousel('left')}
                aria-label="Anterior"
                className="w-11 h-11 rounded-lg bg-tactical-card border border-tactical-border hover:border-tactical-gold text-white flex items-center justify-center transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                aria-label="Próximo"
                className="w-11 h-11 rounded-lg bg-tactical-card border border-tactical-border hover:border-tactical-gold text-white flex items-center justify-center transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Row */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-1"
          >
            {APPROVED_STUDENTS.map((student) => (
              <ParallaxCard
                key={student.id}
                intensity={8}
                scrollContainerRef={carouselRef}
                className="min-w-[310px] sm:min-w-[370px] max-w-[370px] snap-start p-7 rounded-xl bg-tactical-card border border-tactical-border hover:border-tactical-gold/70 hud-corner shrink-0 cursor-pointer select-none shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-tactical-gold/15 text-tactical-gold border border-tactical-gold/40">
                      {student.status}
                    </span>
                    <span className="text-xs text-tactical-muted font-mono">{student.year}</span>
                  </div>

                  <p className="text-sm text-tactical-text/90 italic leading-relaxed mb-6">
                    "{student.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-tactical-border flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-tactical-olive/40 border border-tactical-gold/40 flex items-center justify-center font-display font-bold text-tactical-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg uppercase text-white leading-tight">
                      {student.name}
                    </div>
                    <div className="text-xs text-tactical-gold font-medium">{student.exam}</div>
                    <div className="text-[11px] text-tactical-muted">{student.position}</div>
                  </div>
                </div>
              </ParallaxCard>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP TRIAGE & APPLICATION SECTION */}
      <section id="aplicacao" className="py-24 relative border-t border-tactical-border overflow-hidden">
        {/* Background image with heavy tactical dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/jonas-costas.jpg"
            alt="Polícia Militar Horizonte"
            className="w-full h-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tactical-bg via-tactical-bg/95 to-tactical-bg/85" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-tactical-gold/15 border border-tactical-gold/40 text-xs uppercase tracking-[0.2em] text-tactical-gold font-semibold">
                <MessageSquare className="w-3.5 h-3.5" />
                Atendimento Direto no WhatsApp
              </div>

              <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase text-white leading-tight">
                Defina seu <span className="text-tactical-gold">Concurso Alvo</span> e inicie sua preparação
              </h2>

              <p className="text-tactical-muted text-base sm:text-lg leading-relaxed">
                Preencha ao lado qual concurso você deseja prestar e em que fase de estudos você está. Ao clicar no botão, você será direcionado imediatamente para o{' '}
                <strong className="text-white">WhatsApp oficial do Jonas Filho (+55 83 8119-1048)</strong> já com seu perfil estruturado.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded bg-tactical-card border border-tactical-gold/40 flex items-center justify-center shrink-0 mt-0.5 text-tactical-gold font-display font-bold">
                    01
                  </div>
                  <div>
                    <h4 className="font-display font-bold uppercase text-white text-lg">Escolha da Carreira Policial</h4>
                    <p className="text-sm text-tactical-muted">
                      Informe se o seu foco é Soldado PMCE, CFO, Polícia Civil, PRF ou outro concurso policial.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded bg-tactical-card border border-tactical-gold/40 flex items-center justify-center shrink-0 mt-0.5 text-tactical-gold font-display font-bold">
                    02
                  </div>
                  <div>
                    <h4 className="font-display font-bold uppercase text-white text-lg">Análise de Rotina com o Mentor</h4>
                    <p className="text-sm text-tactical-muted">
                      No WhatsApp, o Jonas avalia sua carga horária disponível e apresenta o formato ideal da mentoria e cronograma.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Form Card */}
            <div className="lg:col-span-6">
              <ParallaxCard
                intensity={4}
                className="p-8 sm:p-10 rounded-2xl bg-tactical-card/95 backdrop-blur-md border border-tactical-gold/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] hud-corner"
              >
                <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
                  <div className="border-b border-tactical-border pb-4 mb-2">
                    <div className="text-xs font-mono text-tactical-gold uppercase tracking-widest">
                      FICHA DE TRIAGEM TÁTICA
                    </div>
                    <h3 className="font-display font-bold text-2xl uppercase text-white mt-1">
                      Direcionamento para Mentoria
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-tactical-muted mb-2">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      autoComplete="name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Ex: Gabriel Oliveira"
                      className="w-full px-4 py-3 rounded-lg bg-tactical-bg border border-tactical-border focus:border-tactical-gold focus:outline-none text-white placeholder:text-tactical-muted/50 text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-tactical-muted mb-2">
                      Qual Concurso Você Quer Cursar?
                    </label>
                    <select
                      value={targetExam}
                      onChange={(e) => setTargetExam(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-tactical-bg border border-tactical-border focus:border-tactical-gold focus:outline-none text-white text-sm transition"
                    >
                      {EXAMS_LIST.map((exam) => (
                        <option key={exam} value={exam} className="bg-tactical-bg text-white">
                          {exam}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-tactical-muted mb-2">
                      Qual Seu Momento Atual de Estudos?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {['Começando do zero', 'Já estudo, mas estagnei', 'Focado em Pós-Edital'].map((stage) => (
                        <button
                          type="button"
                          key={stage}
                          onClick={() => setStudyStage(stage)}
                          className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition text-center ${
                            studyStage === stage
                              ? 'bg-tactical-gold/20 border-tactical-gold text-tactical-gold font-semibold'
                              : 'bg-tactical-bg border-tactical-border text-tactical-muted hover:border-tactical-gold/40'
                          }`}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-tactical-muted mb-2">
                      Para qual concurso/necessidade específica você quer a mentoria?
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={specificNeed}
                      onChange={(e) => setSpecificNeed(e.target.value)}
                      placeholder="Ex: Quero passar na PMCE / CFO, trabalho o dia todo e preciso de cronograma organizado + material direto ao ponto..."
                      className="w-full px-4 py-3 rounded-lg bg-tactical-bg border border-tactical-border focus:border-tactical-gold focus:outline-none text-white placeholder:text-tactical-muted/50 text-sm transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-tactical-gold hover:bg-tactical-goldLight text-black font-display font-bold text-lg uppercase tracking-wider rounded-lg transition shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-3"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Enviar Informações no WhatsApp do Jonas</span>
                  </button>

                  <p className="text-[11px] text-center text-tactical-muted flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-tactical-gold" />
                    Você falará diretamente no número oficial: +55 83 8119-1048
                  </p>
                </form>
              </ParallaxCard>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING WHATSAPP ACTION BUTTON */}
      {fpsStats && (
        <div className="fixed bottom-6 left-6 z-50 px-3.5 py-2 rounded-lg bg-black/90 border border-tactical-gold/60 font-mono text-xs text-tactical-gold shadow-lg">
          FPS: <strong className="text-white">{fpsStats.current}</strong> | MÉDIA: <strong className="text-emerald-400">{fpsStats.avg}</strong> | MÍN: {fpsStats.min}
        </div>
      )}
      <button
        onClick={() => openQuickWhatsApp()}
        aria-label="Chamar no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold uppercase tracking-wider text-xs shadow-[0_0_25px_rgba(16,185,129,0.45)] transition hover:scale-105"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp Jonas Filho</span>
      </button>

      {/* FOOTER */}
      <footer className="py-10 bg-black border-t border-tactical-border text-sm text-tactical-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/shield-logo.svg" alt="Escudo Jonas Filho" className="w-6 h-6" />
              <span className="font-display font-bold text-white uppercase tracking-wider">
                JONAS FILHO • MENTORIA POLICIAL (PMCE / CFO)
              </span>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tactical-card border border-tactical-gold/40 hover:border-tactical-gold text-tactical-gold text-xs font-medium transition"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@aprovasertao</span>
            </a>
          </div>
          <div className="flex flex-col sm:items-end text-xs text-tactical-muted gap-1 text-center sm:text-right">
            <div>
              © {new Date().getFullYear()} Jonas Filho. Todos os direitos reservados. Preparação de Elite para Concursos Policiais.
            </div>
            <div className="text-[11px] tracking-wider uppercase text-tactical-muted/80">
              Feito por <span className="text-tactical-gold font-display font-bold tracking-widest">Alvaro Sousa</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
