# Masterclass A. Charly · Página de agradecimento

Projeto exclusivo e fonte central da página pós-registro da campanha Masterclass A. Charly.

## Regra operacional

Todas as landing pages P1 redirecionam para esta página somente depois da confirmação real do registro no GHL. Não copie esta página para os projetos de CEO, fundador, empresária, investidor-anjo ou fundo. Corrija e publique uma única fonte.

## Configuração

Edite apenas `src/config.js` para conectar:

- título, data, hora e instrução de acesso da sessão;
- ID de 11 caracteres do vídeo no YouTube;
- duração exibida do VSL;
- URL opcional do qualificador P2;
- URL pública do aviso de privacidade;
- URL institucional da StepUp;
- URLs verificadas de LinkedIn, Instagram, YouTube e reportagem;
- URL única da landing page P1 usada no convite;
- IDs aprovados de GTM e GA4.

O pixel Meta está travado em `2249459879220653`. Os IDs `978621541831814` e `2014625735818543` permanecem bloqueados.

## Contrato do funil

- A página recebe apenas `event_id` como identificador técnico opcional.
- Nunca inclua nome, email, telefone ou WhatsApp na URL.
- A página dispara `thank_you_viewed`, `vsl_started`, `authority_content_clicked`, `invite_shared` e, se houver P2, `qualifier_cta_clicked`.
- `invite_shared` registra somente a ação de compartilhar ou copiar. O link sempre aponta para a P1 e não contém PII.
- A página nunca dispara `Lead`, `QualifiedApplication` ou eventos de venda.
- `QualifiedApplication` pertence ao P2 e só ocorre quando o qualificador confirma aprovação.
- O vídeo usa `youtube-nocookie.com` e só é carregado após o clique.
- Tags não essenciais são carregadas somente após consentimento.

## Bloqueios antes de publicar

O modelo está pronto para revisão visual, mas não para tráfego enquanto estes itens estiverem vazios ou sem validação:

1. `vsl.youtubeId`.
2. `links.privacyUrl`.
3. data e hora oficiais da sessão.
4. URL pública definitiva da página.
5. GTM/GA4 aprovados, se usados.
6. teste ponta a ponta do redirect após sucesso no GHL.
7. URL oficial do YouTube de Harold, se o canal for exibido.

## Validação mínima

```sh
sh scripts/validate.sh
```

## Gerar pacote de publicação

```sh
sh scripts/prepare-public.sh
```

O pacote estático será criado em `public/`. Essa pasta é gerada e não deve ser editada manualmente.

## Estrutura

```text
masterclass-a-charly-thank-you/
├── src/                         # HTML, CSS, JavaScript, configuração e ativos
├── docs/                        # contrato de integração e estado P0
├── scripts/                     # validação e geração do pacote público
├── .github/workflows/           # validação automática para GitHub
├── AGENTS.md                    # regras permanentes do projeto
└── README.md                    # operação do projeto
```

Arquivo para revisão local: `src/index.html`.

Critérios e direção do modelo: `docs/design-approval.md`.

Estratégia e critérios do texto: `docs/copy-strategy.md`.

## Publicação

O projeto inclui uma entrada Node.js mínima para a importação de repositório da Hostinger:

- `package.json` declara `npm start`;
- `app.js` serve exclusivamente os arquivos aprovados em `src/`;
- a porta é recebida de `process.env.PORT`;
- `GET /healthz` permite confirmar que a aplicação iniciou.

Na Hostinger, atualize a lista de repositórios e selecione a branch `main`. O domínio e o teste do redirect no GHL continuam sendo etapas separadas do deploy técnico.
