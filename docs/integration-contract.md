# Contrato de integração

## Objetivo

Receber todos os registros confirmados da campanha em uma única página pós-registro, independentemente da LP de origem.

## Entrada permitida

Cada LP P1 deve redirecionar para a URL pública deste projeto somente depois que o GHL confirmar o registro.

Parâmetro técnico opcional:

```text
?event_id=IDENTIFICADOR_TECNICO
```

Não enviar nome, email, telefone, WhatsApp, banda de ingresso ou qualquer valor de formulário na URL. O script remove todos os parâmetros diferentes de `event_id` antes da medição.

## Comportamento da página

1. Confirma o registro sem criar outro contato.
2. Mostra o VSL e dados oficiais da sessão.
3. Orienta inbox, promoções, spam e calendário.
4. Emite `thank_you_viewed` sem PII.
5. Emite `vsl_started` quando o vídeo é iniciado.
6. Pode emitir `qualifier_cta_clicked` no CTA P2.
7. Nunca emite `Lead`, `QualifiedApplication`, `BookedCall` ou `ClosedWon`.

## Saída P2

O CTA fica oculto enquanto `p2.qualifierUrl` estiver vazio. Quando configurado, leva ao qualificador. A aprovação e o evento `QualifiedApplication` pertencem exclusivamente ao P2.

## Dependências de lançamento

- URL pública aprovada deste projeto.
- `src/config.js` preenchido com VSL, sessão e aviso de privacidade.
- redirect configurado em cada fluxo GHL.
- teste de sucesso, falha, retry, refresh e back.
- Events Manager Test Events e GTM/GA4 Debug documentados.
- todos os itens aplicáveis em `docs/p0-funnel-status.md` marcados como `VERIFIED`.
