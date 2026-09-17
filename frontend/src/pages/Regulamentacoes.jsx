import React from 'react';
import {
  ShieldCheck,
  Scale,
  FileCheck2,
  Globe2,
  CheckCircle2,
  Info,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Regulamentacoes() {
  const regulations = [
    {
      id: 'lgpd',
      title: 'LGPD — Lei Geral de Proteção de Dados',
      lawNumber: 'Lei Federal nº 13.709/2018',
      icon: ShieldCheck,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Privacidade & Dados',
      summary:
        'Regulamenta o tratamento de dados pessoais em meios físicos e digitais por pessoas físicas e jurídicas no Brasil, assegurando direitos fundamentais de liberdade e privacidade.',
      keyPoints: [
        'Consentimento claro para coleta e publicação de currículos e propostas.',
        'Direito à exclusão permanente ou retificação dos dados pelo titular.',
        'Armazenamento seguro de informações de contato e remunerações.',
        'Aplicação estrita na plataforma Óbidos Connect para proteger os profissionais da região.',
      ],
      officialLink: 'http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
    },
    {
      id: 'clt',
      title: 'CLT — Consolidação das Leis do Trabalho',
      lawNumber: 'Decreto-Lei nº 5.452/1943 e atualizações',
      icon: Scale,
      color: 'from-indigo-600 to-purple-600',
      badge: 'Vínculo Empregatício',
      summary:
        'Normatiza as relações individuais e coletivas de trabalho no Brasil, estabelecendo direitos como salário mínimo, férias, 13º salário, jornada e FGTS.',
      keyPoints: [
        'Diferenciação clara entre vínculo empregatício e prestação autônoma eventual.',
        'Regras para o Teletrabalho / Home Office introduzidas pela Reforma Trabalhista.',
        'Jornada legal máxima de 44 horas semanais para contratos formais.',
        'Garantias de saúde, segurança e medicina do trabalho em atividades regionais.',
      ],
      officialLink: 'http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm',
    },
    {
      id: 'mei',
      title: 'Lei do MEI — Microempreendedor Individual',
      lawNumber: 'Lei Complementar nº 128/2008',
      icon: FileCheck2,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Empreendedorismo',
      summary:
        'Permite a formalização de autônomos e pequenos negócios com carga tributária simplificada (SIMEI) e acesso à Previdência Social.',
      keyPoints: [
        'Limite de faturamento anual simplificado e emissão simplificada de Nota Fiscal.',
        'Contribuição única mensal (DAS-MEI) com cobertura do INSS (aposentadoria, auxílio-doença).',
        'Facilidade para firmar contratos formais com cooperativas e prefeituras do Pará.',
        'Possibilidade de contratação legal de 01 empregado registrado.',
      ],
      officialLink: 'http://www.planalto.gov.br/ccivil_03/leis/lcp/lcp128.htm',
    },
    {
      id: 'marcocivil',
      title: 'Marco Civil da Internet',
      lawNumber: 'Lei Federal nº 12.965/2014',
      icon: Globe2,
      color: 'from-amber-600 to-orange-600',
      badge: 'Direito Digital',
      summary:
        'Estabelece princípios, garantias, direitos e deveres para o uso da Internet no Brasil, assegurando neutralidade de rede e liberdade de expressão.',
      keyPoints: [
        'Inviolabilidade da intimidade e do sigilo das comunicações privadas online.',
        'Padrões éticos e de responsabilidade sobre conteúdos postados em fóruns comunitários.',
        'Preservação e estabilidade das conexões na região amazônica.',
        'Transparência nas políticas de uso e termos de serviço de plataformas digitais.',
      ],
      officialLink: 'http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Marcos Regulatórios & Segurança Jurídica
        </h1>
        <p className="text-sm text-slate-500 max-w-3xl">
          Conheça as principais normas jurídicas que fundamentam a contratação, privacidade e relações de trabalho no Óbidos Connect.
        </p>
      </div>

      {/* Aviso de Conformidade */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Compromisso com a Conformidade Regional:</p>
          <p className="text-blue-800 leading-relaxed">
            O Óbidos Connect incentiva a formalização das relações profissionais no oeste paraense. Ao utilizar nossos contratos e murais, recomendamos que contratantes e contratados observem as normas trabalhistas, tributárias e civis vigentes.
          </p>
        </div>
      </div>

      {/* Grid de Cards Estáticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regulations.map((reg) => {
          const Icon = reg.icon;

          return (
            <Card
              key={reg.id}
              className="flex flex-col justify-between border-slate-200/80 bg-white shadow-sm hover:border-blue-300 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${reg.color} flex items-center justify-center text-white shadow-md shadow-blue-500/10 shrink-0`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <Badge variant="subtle" className="text-[11px] mb-1">
                        {reg.badge}
                      </Badge>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {reg.title}
                      </CardTitle>
                      <span className="text-[11px] font-medium text-slate-400 block">
                        {reg.lawNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <CardDescription className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {reg.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2 pt-0">
                <span className="text-xs font-bold text-slate-800 block">
                  Pontos Fundamentais:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {reg.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-[11px] text-slate-400">Legislação Federal Oficial</span>
                <a
                  href={reg.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Consultar no Planalto <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
