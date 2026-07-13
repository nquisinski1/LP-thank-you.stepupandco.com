# Estado P0 do projeto exclusivo

Data da revisão local: 2026-07-13.

| Item | Estado | Evidência / bloqueio |
|---|---|---|
| Modelo visual `harold-editorial-v5` | IMPLEMENTED_UNVERIFIED | Direção anterior rejeitada. Nova versão editorial implementada com preto, marfim, fotografia inteira, hierarquia tipográfica e remoção dos recursos decorativos; aguarda aprovação humana. |
| Conteúdo público em espanhol | VERIFIED_LOCAL | Texto revisado por sequência de confirmação, reciprocidade, autoridade, antecipação de valor, prova externa e convite. Claims públicos mantêm contexto e limite de responsabilidade. |
| Estrutura HTML e conteúdo comum | VERIFIED_LOCAL | Um `h1`, VSL no primeiro bloco, três ações, perfil, quatro credenciais, três perguntas de valor, reportagem, canais, convite e fechamento implementados. |
| Responsive desktop/mobile | VERIFIED_LOCAL | Breakpoints em 800 px e 420 px; inspeção local em 1440 px e mobile sem overflow horizontal, com VSL em `16:9`. |
| Reportagem Investor Lifestyle | VERIFIED_LOCAL | Imagem, título, data e link direto para `Nadie construye los cimientos` integrados. Falta aprovação humana de uso editorial. |
| Canais sociais | VERIFIED_LOCAL | LinkedIn e Instagram de Harold ativos. YouTube está preparado e oculto até confirmar a URL oficial. |
| Convite para outros líderes | VERIFIED_LOCAL | Uma única ação compartilha a P1 `https://ceo.stepupandco.com`; quando o compartilhamento nativo não existe, copia o mesmo endereço sem PII. |
| Importação Hostinger Node.js | VERIFIED_REMOTE | A branch remota `main` existe no GitHub; `package.json` contém `npm start`; `app.js` serve `src/`, respeita `PORT` e expõe `/healthz`. GitHub Actions validou o commit `245410c` com sucesso. |
| Otimização de imagens | VERIFIED_LOCAL | Pacote recebido em 2026-07-13 incorporado com a foto principal reduzida de 8,3 MB para 217 KB e demais imagens equivalentes otimizadas, sem alterar o enquadramento editorial. |
| GTM `GTM-K3DFK7M7` | IMPLEMENTED_UNVERIFIED | ID recebido no pacote e configurado para carregamento inicial no modelo `LIGHT/opt-out`. Falta validar tags, Consent Mode e bloqueio posterior a `necessary_only` no GTM Preview. |
| VSL privacy-enhanced | BLOCKED_ACCOUNT | Lazy embed implementado; falta `vsl.youtubeId` oficial. |
| Dados oficiais da sessão | BLOCKED_ACCOUNT | Falta confirmar título final, data, hora e instrução de acesso. |
| Aviso LFPDPPP | BLOCKED_ACCOUNT | Falta `links.privacyUrl` descrevendo `cid`, finalidades, terceiros e oposição/ARCO. A medição inicial está implementada por decisão explícita, mas o tráfego permanece bloqueado sem o aviso. |
| URL pública compartilhada | NOT_STARTED | Domínio/rota ainda não aprovado nem publicado. |
| Redirect de cada LP após GHL | NOT_STARTED | Depende da URL pública e de teste real em cada fluxo P1. |
| Jornada `cid` + `event_id` | IMPLEMENTED_UNVERIFIED | Query é reduzida aos dois identificadores permitidos; `contact_id` e `event_id` entram em `thank_you_viewed` e `registration_completed`; `page_location` exclui query string. Faltam redirect real e GTM/GA4 Debug. |
| Meta/GTM no modelo opt-out | IMPLEMENTED_UNVERIFIED | GTM carrega no primeiro acesso com `granted_default` e atualiza Consent Mode após aceite ou recusa. Falta confirmar as tags reais no GTM Preview e Events Manager. |
| Ausência de segundo `Lead` | IMPLEMENTED_UNVERIFIED | Não existe chamada de `Lead`, `QualifiedApplication` ou `ViewContent` em `script.js`. Falta QA no ambiente publicado. |
| CTA P2 | BLOCKED_ACCOUNT | Oculto até configurar `p2.qualifierUrl`; clique emite apenas `qualifier_cta_clicked`. |
| YouTube oficial de Harold | BLOCKED_ACCOUNT | Nenhuma URL oficial confirmada; o cartão permanece oculto. |

## Decisão de tráfego

**BLOQUEADO.** Este modelo é revisável localmente, mas não está liberado para tráfego até todos os itens P0 aplicáveis estarem `VERIFIED`.
