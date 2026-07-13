# Contrato de integração

## Objetivo

Receber todos os registros confirmados da campanha em uma única página pós-registro, independentemente da LP de origem.

## Entrada permitida

Cada LP P1 deve redirecionar para a URL pública deste projeto somente depois que o GHL confirmar o registro.

Parâmetros permitidos:

```text
?cid=GHL_CONTACT_ID&event_id=IDENTIFICADOR_TECNICO
```

`cid` é o identificador pseudônimo do contato no GHL e `event_id` é o identificador técnico opcional para deduplicação. Não enviar nome, email, telefone, WhatsApp, banda de ingresso ou qualquer valor de formulário na URL. O script remove todos os parâmetros diferentes de `cid` e `event_id` antes da medição.

## Comportamento da página

1. Confirma o registro sem criar outro contato.
2. Mostra o VSL e dados oficiais da sessão.
3. Orienta inbox, promoções, spam e calendário.
4. Emite `thank_you_viewed` com `contact_id` pseudônimo e `event_id` técnico.
5. Emite `registration_completed` para fechar a jornada analítica do registro já confirmado, sem criar um novo contato.
6. Emite `vsl_started` quando o vídeo é iniciado.
7. Pode emitir `qualifier_cta_clicked` no CTA P2.
8. Nunca emite `Lead`, `QualifiedApplication`, `BookedCall` ou `ClosedWon`.

## Medição e consentimento

Por decisão explícita de 2026-07-13, GTM e os eventos iniciais carregam no modelo `LIGHT/opt-out` antes da escolha no banner. O estado inicial é `granted_default`, salvo quando já existe uma escolha anterior `necessary_only`. Aceite e recusa são persistidos no cookie compartilhado `stepup_consent_state` para `*.stepupandco.com`; a recusa atualiza Google Consent Mode para `denied` e os eventos posteriores carregam `consent_state: necessary_only`.

Como `cid` pode ser relacionado a uma pessoa no GHL, ele deve constar no aviso de privacidade, junto com as finalidades, os terceiros envolvidos e os mecanismos de oposição/ARCO. Identificadores diretos continuam proibidos.

## Saída P2

O CTA fica oculto enquanto `p2.qualifierUrl` estiver vazio. Quando configurado, leva ao qualificador. A aprovação e o evento `QualifiedApplication` pertencem exclusivamente ao P2.

## Dependências de lançamento

- URL pública aprovada deste projeto.
- `src/config.js` preenchido com VSL, sessão e aviso de privacidade que descreva `cid`, GTM/GA4/Meta e o modelo opt-out.
- redirect configurado em cada fluxo GHL.
- teste de sucesso, falha, retry, refresh e back.
- Events Manager Test Events e GTM/GA4 Debug documentados.
- todos os itens aplicáveis em `docs/p0-funnel-status.md` marcados como `VERIFIED`.
