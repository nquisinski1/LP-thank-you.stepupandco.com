# Instruções do projeto

## Objetivo invariável

Manter uma única página pós-registro para toda a campanha Masterclass A. Charly. A conversão desta página é ativação e comparecimento, não um novo registro.

## Fonte central

Este diretório é a única fonte editável da página de agradecimento:

`/Volumes/Toshiba/CODEX.CODE /Agencia 007/masterclass-a-charly-thank-you`

As landing pages de cada público devem redirecionar para a URL publicada deste modelo após sucesso confirmado no GHL. Não criar cópias locais sem aprovação explícita.

## Regras inegociáveis

1. Página pública em espanhol.
2. Não usar dados pessoais na URL, DOM, dataLayer, GA4 ou GTM.
3. Não disparar `Lead` nesta página.
4. Não disparar `QualifiedApplication` no clique do CTA P2.
5. Manter o VSL no primeiro bloco e carregar YouTube somente após clique.
6. Não esconder nem cobrir o rosto de Harold.
7. Não inventar datas, urgência, depoimentos, resultados ou credenciais.
8. Tags não essenciais dependem de consentimento.
9. Alterações de tracking devem respeitar `../LANDING_PAGE_FUNNEL_STANDARD.md`.
10. Não publicar nem conectar domínio sem autorização explícita.
11. Editar arquivos públicos somente em `src/`; `public/` é um artefato gerado.

## Aceite

- um único `h1`;
- sem overflow horizontal a 360 px;
- vídeo estável em `16:9` no desktop e mobile;
- links e VSL configurados sem placeholders antes de tráfego;
- `sh scripts/validate.sh` aprovado;
- nenhuma chamada de evento de conversão nesta página;
- redirect P1 → thank-you verificado após sucesso real no GHL.
