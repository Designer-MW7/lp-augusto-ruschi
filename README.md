# Documentação de Entrega — Landing Page Colégio Augusto Ruschi

Esta pasta contém os arquivos finais de produção da Landing Page de alta conversão do Colégio Augusto Ruschi, em Guarulhos. O projeto foi projetado para tráfego pago (Google Ads e Meta Ads), com total responsividade mobile-first e acompanhamento analítico robusto.

---

## 📂 ESTRUTURA DE ARQUIVOS

```
Landing Page/
├── index.html              # Landing Page principal (14 seções animadas)
├── obrigado.html           # Página de agradecimento pós-conversão
├── README.md               # Este arquivo de documentação e guia técnico
└── assets/
    ├── css/
    │   └── style.css       # Design System, variáveis CSS, @font-face e responsivo
    ├── js/
    │   └── main.js         # UTM routing, Smart WhatsApp, Accordion e Validações
    ├── fonts/
    │   ├── chillax/        # Família tipográfica Chillax (woff2, woff, ttf, eot)
    │   └── satoshi/        # Família tipográfica Satoshi (woff2, woff, ttf, eot)
    ├── images/
    │   ├── logo/           # Logotipos oficiais PNG da marca (01.png, 03.png, etc.)
    │   ├── fotos/          # Diretório para fotos reais do colégio
    │   └── elementos/      # Grafismos ou patterns adicionais
    └── icons/              # Família de ícones da marca em PNG
```

---

## ⚙️ CONFIGURAÇÃO DE TAGS E RASTREAMENTO

Todas as tags essenciais estão inseridas no `<head>` e `<body>` dos arquivos `index.html` e `obrigado.html`. Para ativá-las com os IDs do cliente, substitua as seguintes strings:

### 1. Google Tag Manager (GTM)
*   Procure por `GTM-XXXXXXX` nos arquivos `index.html` e `obrigado.html` e substitua pelo ID do GTM do colégio.
*   *Nota:* O script está presente no `<head>` e o respectivo `<noscript>` de fallback no início do `<body>`.

### 2. Google Analytics (GA4) e Google Ads
*   Procure por `G-XXXXXXXXXX` e substitua pelo ID de fluxo de dados do GA4.
*   Procure por `AW-XXXXXXXXXX` e substitua pelo Conversion ID do Google Ads.
*   Na página `obrigado.html`, configure a tag de conversão de leads substituindo `AW-XXXXXXXXXX/XXXXXXXXXXXXXXXX` pelo ID e Label de conversão criados no Google Ads.

### 3. Meta Pixel (Facebook Ads)
*   Procure por `PIXEL_ID_HERE` no bloco do Pixel e substitua pelo ID numérico do Pixel do Meta do cliente.
*   O evento padrão `Lead` é disparado automaticamente na página `obrigado.html`.

---

## 📞 CONFIGURAÇÃO DO WHATSAPP (SMART ROUTING)

A inteligência de WhatsApp está concentrada no arquivo [assets/js/main.js](file:///Users/pachonacho/Library/CloudStorage/GoogleDrive-designer1master12@gmail.com/Meu%20Drive/CLIENTES%20AGÊNCIAS/C/COLÉGIO%20AUGUSTO%20RUSCHI/Site/Landing%20Page/Landing%20Page/assets/js/main.js).

*   **Número de WhatsApp Base**: Definido na constante `BASE_WA_NUMBER` (atualmente setado como `551124533535`). Se o colégio definir um número de WhatsApp exclusivo para matrículas, altere esse valor no JS (apenas números, incluindo o código do país `55` e o DDD `11`).
*   **Captura de UTMs**: O script captura automaticamente os parâmetros da URL (`utm_source`, `utm_medium`, `utm_campaign`, etc.) e os persiste no `localStorage` por **30 dias**.
*   **Mensagem Dinâmica**: Quando o visitante clica nos botões wa.me, o script reescreve a mensagem padrão para o WhatsApp adicionando contexto (Ex: *"Olá! Vim pelo anúncio no Instagram/Facebook..."* ou *"Olá! Vim pelo Google Ads..."*). No caso do formulário do site, a mensagem inclui a série de interesse selecionada pelo pai/responsável.

---

## 🖼️ SUBSTITUIÇÃO DE IMAGENS PLACEHOLDERS

Para esta primeira versão, foram utilizadas imagens conceituais de alta qualidade provenientes do Unsplash. Para colocar as fotos reais do colégio (do Padlet fornecido ou arquivos próprios):

1.  Salve as fotos reais no diretório `assets/images/fotos/`.
2.  Altere a propriedade `src` das tags `<img>` correspondentes no `index.html`:
    *   **Hero Visual (Dobra 1)**: Substitua a imagem na linha correspondente pela foto principal da fachada ou de alunos interagindo.
    *   **Sobre o Colégio (Dobra 4)**: Substitua pela foto representativa de coordenação ou professores.
    *   **Galeria de Estrutura (Dobra 7)**: Substitua as 8 imagens da grade pelas fotos reais da Biblioteca, Laboratório, Quadra, Playground, etc., mantendo as legendas condizentes.

---

## 🔒 ACESSIBILIDADE E LGPD

*   O formulário do site possui um checkbox obrigatório de aceite de **Política de Privacidade**. Para que o site funcione 100%, insira o link da Política de Privacidade oficial do colégio na tag `<a>` dentro da label do checkbox (seção 09 do `index.html`).
*   A folha de estilo `style.css` conta com regra de acessibilidade `@media (prefers-reduced-motion: reduce)` que desativa animações pesadas do GSAP e Lenis para usuários com sensibilidade a movimentos.
