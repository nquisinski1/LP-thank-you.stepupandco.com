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
| Importação Hostinger Node.js | VERIFIED_LOCAL | `package.json` contém `npm start`; `app.js` serve `src/`, respeita `PORT` e expõe `/healthz`. Falta o primeiro push para criar a branch remota `main`. |
| VSL privacy-enhanced | BLOCKED_ACCOUNT | Lazy embed implementado; falta `vsl.youtubeId` oficial. |
| Dados oficiais da sessão | BLOCKED_ACCOUNT | Falta confirmar título final, data, hora e instrução de acesso. |
| Aviso LFPDPPP | BLOCKED_ACCOUNT | Falta `links.privacyUrl`; sem essa URL, o código impede carregamento de medição. |
| URL pública compartilhada | NOT_STARTED | Domínio/rota ainda não aprovado nem publicado. |
| Redirect de cada LP após GHL | NOT_STARTED | Depende da URL pública e de teste real em cada fluxo P1. |
| `thank_you_viewed` sem PII | IMPLEMENTED_UNVERIFIED | Query é reduzida a `event_id`; `page_location` exclui query string. Falta validar em GTM/GA4 Debug. |
| Meta `PageView` com consentimento | IMPLEMENTED_UNVERIFIED | Pixel permitido travado; carga depende de consentimento e URL de privacidade. Falta Events Manager. |
| Ausência de segundo `Lead` | IMPLEMENTED_UNVERIFIED | Não existe chamada de `Lead`, `QualifiedApplication` ou `ViewContent` em `script.js`. Falta QA no ambiente publicado. |
| CTA P2 | BLOCKED_ACCOUNT | Oculto até configurar `p2.qualifierUrl`; clique emite apenas `qualifier_cta_clicked`. |
| YouTube oficial de Harold | BLOCKED_ACCOUNT | Nenhuma URL oficial confirmada; o cartão permanece oculto. |

## Decisão de tráfego

**BLOQUEADO.** Este modelo é revisável localmente, mas não está liberado para tráfego até todos os itens P0 aplicáveis estarem `VERIFIED`.
