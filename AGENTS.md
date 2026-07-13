# Instruções do projeto

## Objetivo invariável

Manter uma única página pós-registro para toda a campanha Masterclass A. Charly. A conversão principal desta página é ativação e comparecimento. O evento analítico `registration_completed` pode espelhar o registro já confirmado pelo GHL, mas não cria um novo contato nem dispara um novo `Lead`.

## Fonte central

Este diretório é a única fonte editável da página de agradecimento:

`/Volumes/Toshiba/CODEX.CODE /Agencia 007/masterclass-a-charly-thank-you`

As landing pages de cada público devem redirecionar para a URL publicada deste modelo após sucesso confirmado no GHL. Não criar cópias locais sem aprovação explícita.

## Regras inegociáveis

1. Página pública em espanhol.
2. A URL pode receber somente `cid`, como identificador pseudônimo do contato no GHL, e `event_id`, como identificador técnico de deduplicação. Ambos podem entrar no dataLayer; nome, email, telefone, WhatsApp, receita e valores brutos de formulário continuam proibidos.
3. Não disparar `Lead` nesta página.
4. Não disparar `QualifiedApplication` no clique do CTA P2.
5. Manter o VSL no primeiro bloco e carregar YouTube somente após clique.
6. Não esconder nem cobrir o rosto de Harold.
7. Não inventar datas, urgência, depoimentos, resultados ou credenciais.
8. Por decisão explícita de 2026-07-13, a página usa medição `LIGHT/opt-out`: GTM e os eventos iniciais carregam antes da escolha no banner. A opção `Solo esenciales` deve atualizar o estado para `necessary_only` e bloquear medição posterior conforme a configuração do container.
9. Alterações de tracking devem respeitar `../LANDING_PAGE_FUNNEL_STANDARD.md`, exceto a decisão específica documentada neste projeto para `cid`, `registration_completed` e medição inicial.
10. Não publicar nem conectar domínio sem autorização explícita.
11. Editar arquivos públicos somente em `src/`; `public/` é um artefato gerado.

## Aceite

- um único `h1`;
- sem overflow horizontal a 360 px;
- vídeo estável em `16:9` no desktop e mobile;
- links e VSL configurados sem placeholders antes de tráfego;
- `sh scripts/validate.sh` aprovado;
- `thank_you_viewed` e `registration_completed` emitidos com `contact_id` pseudônimo e `event_id`, sem identificadores diretos;
- nenhuma chamada de `Lead`, `QualifiedApplication`, `BookedCall` ou `ClosedWon` nesta página;
- redirect P1 → thank-you verificado após sucesso real no GHL.
