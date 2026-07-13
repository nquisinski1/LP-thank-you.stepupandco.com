# Modelo visual para aprovação

Data da revisão: 2026-07-13.

## Objetivo preservado

A página pós-registro deve agradecer, confirmar o acesso e transformar a primeira visita em percepção tangível de valor sobre Harold Mesa. Ela não registra novamente, não substitui a landing page P1 e não executa a qualificação P2.

O visitante precisa concluir:

1. meu registro foi recebido;
2. Harold agradece pessoalmente a confiança;
3. existe uma trajetória executiva real por trás da masterclass;
4. já posso consumir conteúdo relevante antes da sessão;
5. conheço outras pessoas que deveriam participar desta conversa.

## Referência estrutural

Referência fornecida: `cardonefreetraining.com/access` e captura em PDF de 2 páginas.

Padrões reutilizados, sem copiar identidade ou claims:

- agradecimento e confirmação no primeiro impacto;
- protagonista visual forte no hero;
- faixa curta de sinais de valor;
- próximo passo operacional imediatamente visível;
- conteúdo que antecede a sessão;
- autoridade sustentada por trajetória e mídia;
- CTA de continuidade claro.

Elementos rejeitados:

- escassez não verificável;
- contador regressivo sem data oficial;
- números de inscritos inventados;
- resultados financeiros ou depoimentos não documentados;
- novo formulário dentro da página de agradecimento.

## Direção selecionada

**Harold Editorial Access** (`harold-editorial-v5`).

O modelo combina a clareza estrutural da referência Cardone com uma linguagem editorial masculina e contida. A composição usa preto, marfim, fotografia inteira e tipografia de revista. Foram eliminados arcos, cápsulas, selos, sobreposições, cores brilhantes e cartões ornamentais. A página funciona como um pequeno perfil editorial de Harold: confirmação, mensagem, trajetória, reportagem, conteúdos, canais e convite compartilhável.

## Alternativas consideradas

| Direção | Probabilidade | Trade-off |
|---|---:|---|
| Harold Editorial Access | 0,95 | Selecionada após rejeição da v4; reduz o ruído e privilegia fotografia, texto e autoridade. |
| Cardone Executive Adaptation | 0,90 | Estrutura forte, mas próxima demais de uma página de inscrição e menos própria para Harold. |
| Executive Media Kit | 0,84 | Excelente para reputação, porém reduz a clareza operacional pós-registro. |
| Social Newsroom | 0,08 | Mantém conteúdos atuais, mas depende de atualização editorial constante. |
| Invitation Network Wall | 0,05 | Amplifica compartilhamento, porém pode parecer prova social artificial sem dados reais. |
| Cinematic Dossier | 0,02 | Alto impacto, mas exige vídeo e produção que ainda não foram entregues. |

## Fontes e ativos verificados

| Ativo | Fonte | Decisão |
|---|---|---|
| Reportagem “Nadie construye los cimientos” | Investor Lifestyle, 17/06/2026 | usar título, data, link e imagens oficiais |
| Perfil de Harold | site oficial StepUp, LinkedIn atual e CV local | usar trajetória pública resumida |
| Logomarca StepUp & Co | arquivo oficial `SetpUp Favicon Youtube White (2).png` | usar no cabeçalho e rodapé com recorte proporcional |
| Slogan oficial | `We architect companies for the future.` | exibir como texto legível somente no rodapé |
| LinkedIn de Harold | `linkedin.com/in/haroldhmesa/` | publicar |
| Instagram de Harold | `instagram.com/imharoldmesa/` | publicar como canal oficial de Harold |
| YouTube | nenhuma URL oficial confirmada | componente preparado e oculto |
| Página de convite | `https://ceo.stepupandco.com` no config da P1 | oferecer uma única ação para compartilhar o registro |

## Arquitetura do modelo

1. Agradecimento explícito e confirmação no hero.
2. Retrato forte de Harold e mensagem pessoal em VSL `16:9` ainda no primeiro bloco.
3. Faixa de sinais: registro, acesso, sessão executiva e convite.
4. Três ações para proteger a participação.
5. Perfil detalhado de Harold com credenciais públicas e verificáveis.
6. Três movimentos da masterclass como valor antecipado.
7. Reportagem da Investor Lifestyle com imagem oficial e link completo.
8. Hub de conteúdo: LinkedIn e Instagram de Harold; YouTube oculto até confirmação.
9. Convite com uma única ação para compartilhar o link da P1; cópia como alternativa técnica.
10. Fechamento e CTA P2 oculto até aprovação da URL.

## Prova social ética

A página não afirma quantidade de inscritos. A sensação de movimento será construída por:

- conteúdo publicado recentemente;
- presença editorial de terceiro;
- trajetória executiva verificável;
- convite para CEOs, fundadores e investidores;
- linguagem de comunidade sem número falso.

Um contador poderá ser habilitado somente quando existir uma fonte real e atualizada.

## Critérios de aprovação humana

- [ ] A nota de agradecimento abre a página com o tom correto.
- [ ] Harold aparece como protagonista, não apenas apresentador.
- [ ] Perfil e credenciais públicas estão aprovados para uso na campanha.
- [ ] Reportagem, imagens e link completo estão aprovados.
- [ ] LinkedIn, Instagram e módulo de convite estão aprovados.
- [ ] Ausência temporária do YouTube está aceita.
- [ ] Desktop e mobile estão aprovados.

## Histórico de decisão

- `harold-authority-v4`: rejeitada por excesso de elementos, cores, recortes e aparência de template.
- `harold-editorial-v5`: substituição completa da linguagem visual; nenhum componente decorativo da v4 foi preservado.

## Critérios técnicos

- um `h1`;
- VSL no primeiro bloco e em `16:9`;
- três ações de ativação;
- pelo menos quatro credenciais públicas;
- reportagem com link externo seguro;
- compartilhamento sem PII e sempre apontando para a P1;
- nenhum número de inscritos ou escassez inventado;
- sem overflow horizontal a 360 px;
- sem `Lead`, `QualifiedApplication` ou eventos de venda;
- P2, medição e privacidade continuam bloqueados quando não configurados.

## Bloqueios preservados

Continuam pendentes o ID do VSL, URL de privacidade, dados oficiais da sessão, URL P2, domínio público da página de agradecimento, YouTube oficial de Harold e QA ponta a ponta do redirect GHL.
