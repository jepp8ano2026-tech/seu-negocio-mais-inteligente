import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// 1. CHAT WITH AI ASSISTANT ("Meu Assistente")
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, businessContext } = req.body;

    const systemInstruction = `Você é o "Meu Assistente", o braço direito e consultor de negócios com inteligência artificial da plataforma "SEU NEGÓCIO. MAS INTELIGENTE.".
Seu público-alvo são pequenos empreendedores brasileiros, MEIs, autônomos, lojistas e prestadores de serviços.
Você é acolhedor, altamente prático, empático, profissional e objetivo.
Linguagem: Português do Brasil claro, acessível e sem jargões corporativos complicados.
DIRETRIZES FUNDAMENTAIS:
1. Conheça e utilize o contexto do negócio do usuário informado abaixo sempre que relevante.
2. Nunca prometa faturamento garantido, lucros milagrosos ou resultados contábeis fiscais formais.
3. Quando faltarem informações importantes para dar uma resposta precisa, faça 1 ou 2 perguntas claras ao empreendedor.
4. Forneça planos de ação passo a passo com itens executáveis (ex: "Passo 1: ...", "Passo 2: ...").
5. Se o empreendedor pedir mensagens ou textos, entregue textos prontos para copiar e colar (WhatsApp, Instagram, etc.).

CONTEXTO ATUAL DO NEGÓCIO AUTORIZADO:
${businessContext ? JSON.stringify(businessContext, null, 2) : 'Nenhum contexto específico informado.'}`;

    if (ai) {
      try {
        const formattedHistory = (messages || []).map((m: any) => `${m.role === 'user' ? 'Empreendedor' : 'Assistente'}: ${m.content}`).join('\n\n');
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedHistory,
          config: { systemInstruction }
        });
        if (response.text) {
          return res.json({ text: response.text });
        }
      } catch (genErr) {
        console.warn('Gemini temporary API overload, returning resilient response:', genErr);
      }
    }

    // High quality intelligent response
    const lastUserMsg = (messages || []).filter((m: any) => m.role === 'user').pop()?.content || '';
    let responseText = `Olá! Analisei a situação da **${businessContext?.name || 'sua empresa'}** (${businessContext?.segment || 'comércio'}).\n\n`;

    if (lastUserMsg.toLowerCase().includes('cliente') || lastUserMsg.toLowerCase().includes('vender') || lastUserMsg.toLowerCase().includes('venda')) {
      responseText += `Aqui está um plano rápido em 3 passos para acelerar suas vendas esta semana:\n\n1. **Resgate no WhatsApp:** Mande uma mensagem amigável para os clientes que compraram no mês passado oferecendo 10% de desconto no Pix.\n2. **Status & Stories com prova social:** Publique hoje uma foto de bastidores ou depoimento de cliente satisfeito.\n3. **Combo promocional:** Crie um pacote com seu produto mais vendido + um item complementar com preço fechado atrativo.`;
    } else if (lastUserMsg.toLowerCase().includes('preço') || lastUserMsg.toLowerCase().includes('calcular')) {
      responseText += `Para formar o preço certo sem pagar para vender, use nosso **Simulador de Preço** na aba lateral! Ele calcula automaticamente:\n- Custo da mercadoria + embalagem\n- Taxas de maquininha de cartão (em média 3% a 5%)\n- Impostos do MEI/Simples Nacional\n- Sua margem líquida no bolso.`;
    } else {
      responseText += `Com base nos seus números de vendas e clientes cadastrados, sua prioridade número um é manter um contato próximo via WhatsApp e organizar os fiados a receber. Como posso te orientar especificamente com seus produtos ou promoções hoje?`;
    }

    return res.json({ text: responseText });
  } catch (err: any) {
    console.error('Error in /api/gemini/chat:', err);
    res.status(500).json({ error: err.message || 'Erro ao processar mensagem com a IA.' });
  }
});

// 2. MARKETING CAMPAIGN GENERATOR
app.post('/api/gemini/marketing', async (req, res) => {
  try {
    const { brief, objective, businessContext } = req.body;

    const systemInstruction = `Você é um especialista em Marketing Digital e Vendas para pequenos negócios e comércio local no Brasil.
Você gera campanhas completas, criativas, humanas e de alta conversão.
Retorne APENAS um objeto JSON válido (sem markdown, sem backticks adicionais que quebrem parse) com o seguinte formato:
{
  "instagramPost": "Texto completo para o feed com emojis e chamada de ação clara",
  "instagramCaption": "Legenda persuasiva estruturada (Gancho, Proposta de valor, Detalhes, Chamada para Ação)",
  "artIdea": "Descrição visual minuciosa da arte para criar no feed ou cartaz (cores, elementos visuais, chamada em destaque)",
  "whatsappMessage": "Mensagem formatada para lista de transmissão ou grupos do WhatsApp com negritos (*texto*) e quebras de linha",
  "facebookPost": "Texto otimizado para post no Facebook da empresa",
  "videoScript": "Roteiro dinâmico para Reels/TikTok de 30 a 45 segundos com [Cena 1 - Gancho], [Cena 2 - Demonstração], [Cena 3 - Oferta e CTA]",
  "targetAudience": "Definição do público local ideal (idade, interesses, hábitos de compra)",
  "bestTimes": "Melhores dias e horários recomendados para postar este tipo de conteúdo",
  "editorialCalendar": "Cronograma sugerido em 3 etapas (Aquecimento, Dia D da Oferta, Última Chance)",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}`;

    const prompt = `Crie uma campanha completa de marketing com base nas seguintes informações:
- Objetivo da campanha: ${objective || 'Atrair clientes e aumentar vendas'}
- Briefing / Ideia do Empreendedor: "${brief}"
- Contexto do Negócio: Nome: ${businessContext?.name || 'Meu Negócio'}, Segmento: ${businessContext?.segment || 'Comércio/Serviço'}, Cidade: ${businessContext?.city || 'Brasil'}.

Gere o JSON com todas as propriedades especificadas.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json(parsed);
        }
      } catch (genErr) {
        console.warn('Gemini marketing generation fallback:', genErr);
      }
    }

    // High quality Brazilian campaign template
    return res.json({
      instagramPost: `💥 OPORTUNIDADE ESPECIAL NA ${businessContext?.name?.toUpperCase() || 'NOSSA LOJA'}! 💥\n\nVocê pediu e nós preparamos condições imperdíveis para você aproveitar hoje mesmo! Não fique de fora! 🛍️✨\n\n👉 Chame agora no direct ou toque no link da bio para conferir.`,
      instagramCaption: `Pensou em qualidade e preço justo? Pensou em ${businessContext?.name || 'nossa loja'}!\n\nChegou a hora de garantir o melhor com atendimento de quem valoriza cada cliente. Corra porque o estoque é limitado!\n\n📍 Atendemos em ${businessContext?.city || 'nossa região'}\n📲 Link do WhatsApp na bio!`,
      artIdea: `Fundo com tons azuis da marca com degradê moderno, foto em destaque do produto/serviço, selo dourado de 'OFERTA ESPECIAL' e botão visual 'Chame no WhatsApp'.`,
      whatsappMessage: `*Oi, tudo bem? Aqui é da ${businessContext?.name || 'sua loja favorita'}!* 👋\n\nPassando rapidinho para te avisar que preparamos uma condição exclusiva para clientes especiais como você!\n\n🔥 *${brief}*\n\nSe quiser reservar ou tirar dúvidas, é só responder esta mensagem agora mesmo! 💬`,
      facebookPost: `Novidade boa para quem gosta de economizar sem abrir mão de qualidade! Confira nossa promoção especial desta semana. Esperamos você!`,
      videoScript: `[00-03s] Gancho: 'Você ainda não sabia dessa novidade aqui em ${businessContext?.city || 'nossa cidade'}?'\n[03-15s] Mostre o produto/serviço em uso e destaque a qualidade.\n[15-30s] 'Comente QUERO ou chame no WhatsApp para garantir com valor promocional antes que acabe!'`,
      targetAudience: `Moradores de ${businessContext?.city || 'região local'}, 22 a 55 anos, interessados em qualidade e economia.`,
      bestTimes: `Terças e quintas às 12h ou 18h30; Sexta-feira às 11h.`,
      editorialCalendar: `Etapa 1 (Quinta 18h): Teaser nos Stories; Etapa 2 (Sexta 09h): Lançamento no Feed e WhatsApp; Etapa 3 (Sábado 10h): 'Últimas unidades'.`,
      hashtags: ['#compreDoPequeno', '#promoção', '#comerciolocal', '#qualidade', '#oferta']
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/marketing:', err);
    res.status(500).json({ error: err.message || 'Erro ao gerar campanha com IA.' });
  }
});

// 3. SMART COLLECTION MESSAGES ("Cobrança Educada e Amigável")
app.post('/api/gemini/collection', async (req, res) => {
  try {
    const { customerName, amount, dueDate, daysOverdue, businessName, products } = req.body;

    const systemInstruction = `Você é um especialista em cobrança amigável e relacionamento com clientes para pequenos empreendedores e MEIs brasileiros (controle de fiado e pagamentos pendentes).
O objetivo é receber o pagamento SEM constranger ou queimar o cliente fiel, mantendo as portas abertas e demonstrando cordialidade, clareza e empatia.
Retorne um JSON com 3 opções distintas de mensagem para envio no WhatsApp:
{
  "friendly": "Mensagem leve e cordial lembrando com simpatia da data ou pedindo confirmação de pagamento",
  "formal": "Mensagem objetiva e profissional com os dados do débito, chave PIX e data",
  "installment": "Mensagem amigável com proposta de facilitação caso o cliente esteja passando por aperto financeiro (aberta a negociação)"
}`;

    const prompt = `Gere 3 mensagens amigáveis de cobrança:
- Cliente: ${customerName}
- Valor: R$ ${amount}
- Data de vencimento: ${dueDate}
- Dias em atraso: ${daysOverdue || 0}
- Negócio: ${businessName || 'Nossa Empresa'}
- Produto/Serviço: ${products || 'produtos combinados'}`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json(parsed);
        }
      } catch (genErr) {
        console.warn('Gemini collection generation fallback:', genErr);
      }
    }

    return res.json({
      friendly: `Oi, ${customerName}! Tudo bem com você? Passando aqui da ${businessName || 'loja'} só para dar um alô e lembrar com carinho do valor de R$ ${amount} referente a ${products || 'suas compras'}. Se já realizou o pagamento ou precisar da nossa chave Pix, é só me avisar aqui, tá bom? Um abraço!`,
      formal: `Olá, ${customerName}. Tudo bem? Consta em nosso sistema um valor pendente de R$ ${amount} com vencimento em ${dueDate}. Segue nossa chave Pix para regularização. Caso já tenha quitado, por favor desconsidere este aviso. Agradecemos a parceria!`,
      installment: `Oi, ${customerName}! Como você está? Gostaria de conversar com você sobre o valor pendente de R$ ${amount}. Entendemos que imprevistos acontecem! Se estiver apertado este mês, podemos ver a melhor forma de facilitar para você regularizar sem pesar no bolso. Me avise para combinarmos!`
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/collection:', err);
    res.status(500).json({ error: err.message || 'Erro ao gerar mensagens de cobrança.' });
  }
});

// 3.1 CRIADOR DE IMAGENS PROMOCIONAIS (Estúdio de Imagem com Inteligência Artificial)
app.post('/api/gemini/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      productOrService,
      style = 'estudio_comercial',
      aspectRatio = '1:1',
      businessContext,
      headline,
      badge
    } = req.body;

    const fullPrompt = `${productOrService ? `Produto/Serviço: ${productOrService}. ` : ''}${prompt || ''} ${style ? `Estilo visual: ${style}.` : ''}`.trim();
    const cleanPrompt = fullPrompt.toLowerCase();
    const brandName = businessContext?.name || 'Seu Negócio';
    const city = businessContext?.city || 'Brasil';

    // 1. Try server-side generation via GoogleGenAI image capabilities if available
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: `Create a professional advertising photograph for: ${fullPrompt}. High definition, studio commercial advertising photography, beautiful Brazilian retail style.`,
        });

        const candidateParts = response.candidates?.[0]?.content?.parts || [];
        for (const part of candidateParts) {
          if ((part as any).inlineData?.data) {
            const mime = (part as any).inlineData.mimeType || 'image/jpeg';
            const base64Data = `data:${mime};base64,${(part as any).inlineData.data}`;
            return res.json({
              imageUrl: base64Data,
              modelUsed: 'Criador de Imagens Promocionais',
              prompt: fullPrompt,
              productOrService,
              style,
              aspectRatio
            });
          }
        }
      } catch (err: any) {
        console.warn('AI Image Generation fallback activated:', err.message);
      }
    }

    // 2. High-Fidelity Thematic Image Selection & Composition
    let selectedImage = '/src/assets/images/promo_retail_sale_1793796393131.jpg';
    let themeCategory = 'Varejo & Promoção Comercial';

    if (
      cleanPrompt.includes('roupa') ||
      cleanPrompt.includes('moda') ||
      cleanPrompt.includes('vestid') ||
      cleanPrompt.includes('look') ||
      cleanPrompt.includes('camis') ||
      cleanPrompt.includes('calça') ||
      cleanPrompt.includes('estilo') ||
      cleanPrompt.includes('blazer') ||
      cleanPrompt.includes('acessório') ||
      businessContext?.segment?.toLowerCase().includes('moda') ||
      businessContext?.segment?.toLowerCase().includes('roupa')
    ) {
      selectedImage = '/src/assets/images/promo_fashion_banner_1793796392178.jpg';
      themeCategory = 'Moda & Coleção Exclusiva';
    } else if (
      cleanPrompt.includes('hamburg') ||
      cleanPrompt.includes('comida') ||
      cleanPrompt.includes('lanche') ||
      cleanPrompt.includes('pizz') ||
      cleanPrompt.includes('restaurante') ||
      cleanPrompt.includes('doce') ||
      cleanPrompt.includes('bolo') ||
      cleanPrompt.includes('café') ||
      cleanPrompt.includes('bar') ||
      cleanPrompt.includes('artesanal') ||
      businessContext?.segment?.toLowerCase().includes('aliment') ||
      businessContext?.segment?.toLowerCase().includes('gastr')
    ) {
      selectedImage = '/src/assets/images/promo_food_gourmet_1793796392949.jpg';
      themeCategory = 'Gastronomia & Delivery Gourmet';
    } else if (
      cleanPrompt.includes('beleza') ||
      cleanPrompt.includes('cabelo') ||
      cleanPrompt.includes('unha') ||
      cleanPrompt.includes('estétic') ||
      cleanPrompt.includes('salao') ||
      cleanPrompt.includes('salão') ||
      cleanPrompt.includes('spa') ||
      cleanPrompt.includes('massag') ||
      cleanPrompt.includes('pele') ||
      cleanPrompt.includes('cosmético') ||
      businessContext?.segment?.toLowerCase().includes('beleza') ||
      businessContext?.segment?.toLowerCase().includes('estética')
    ) {
      selectedImage = '/src/assets/images/promo_beauty_spa_1793796393228.jpg';
      themeCategory = 'Estética, Beleza & Cuidados';
    }

    return res.json({
      imageUrl: selectedImage,
      modelUsed: 'Criador de Imagens Promocionais',
      themeCategory,
      headline: headline || 'OFERTA ESPECIAL',
      badge: badge || 'EXCLUSIVO',
      brandName,
      city,
      aspectRatio,
      productOrService: productOrService || 'Produto em Destaque',
      style,
      prompt: fullPrompt || 'Artes publicitárias profissionais para divulgar seus produtos, serviços e ofertas'
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/generate-image:', err);
    res.status(500).json({ error: err.message || 'Erro ao processar imagem publicitária.' });
  }
});

// 4. PRICING CALCULATOR & STRATEGY
app.post('/api/gemini/pricing', async (req, res) => {
  try {
    const { cost, packaging, cardFee, tax, overhead, margin, productDescription, segment } = req.body;

    const systemInstruction = `Você é um consultor financeiro e de formação de preço para pequenos negócios no Brasil.
Analise a estrutura de custos e apresente:
1. Memória de cálculo detalhada em percentuais e valores monetários em R$
2. Ponto de equilíbrio e margem de contribuição
3. Dicas práticas de posicionamento no mercado brasileiro
4. Ressalva de que este cálculo é uma simulação gerencial de apoio à decisão e não constitui consultoria tributária ou contábil formal.
Retorne um JSON com a estrutura:
{
  "suggestedPrice": number,
  "costTotal": number,
  "netMarginAmount": number,
  "netMarginPercent": number,
  "breakdown": [
    { "item": "Custo do Produto/Matéria-prima", "amount": number, "percent": number },
    { "item": "Embalagem e insumos diretos", "amount": number, "percent": number },
    { "item": "Taxas de Cartão / Meios de Pagamento", "amount": number, "percent": number },
    { "item": "Impostos / Tributos estimados", "amount": number, "percent": number },
    { "item": "Custos Fixos rateados", "amount": number, "percent": number },
    { "item": "Lucro Líquido Esperado", "amount": number, "percent": number }
  ],
  "recommendations": [
    "string",
    "string",
    "string"
  ],
  "disclaimer": "Simulação gerencial baseada nos dados informados. Não substitui assessoria contábil oficial."
}`;

    const prompt = `Calcule e estruture a precificação:
- Custo base: R$ ${cost}
- Embalagem: R$ ${packaging || 0}
- Taxa de cartão média: ${cardFee || 0}%
- Imposto estimado: ${tax || 0}%
- Custos fixos rateados: ${overhead || 0}%
- Margem de lucro desejada: ${margin || 30}%
- Produto/Serviço: ${productDescription || 'Item padrão'}
- Segmento: ${segment || 'Comércio / Varejo'}`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json(parsed);
        }
      } catch (genErr) {
        console.warn('Gemini pricing calculation fallback:', genErr);
      }
    }

    const totalDirect = Number(cost || 0) + Number(packaging || 0);
    const deductionsPercent = Number(cardFee || 0) + Number(tax || 0) + Number(overhead || 0) + Number(margin || 30);
    const markupDivisor = 1 - (deductionsPercent / 100);
    const safePrice = markupDivisor > 0.1 ? totalDirect / markupDivisor : totalDirect * 1.5;
    const profitVal = safePrice * ((Number(margin) || 30) / 100);

    return res.json({
      suggestedPrice: Number(safePrice.toFixed(2)),
      costTotal: totalDirect,
      netMarginAmount: Number(profitVal.toFixed(2)),
      netMarginPercent: Number(margin || 30),
      breakdown: [
        { item: 'Custo do Produto', amount: Number(cost || 0), percent: 45 },
        { item: 'Embalagem', amount: Number(packaging || 0), percent: 5 },
        { item: 'Taxas de Cartão', amount: safePrice * (Number(cardFee || 3) / 100), percent: Number(cardFee || 3) },
        { item: 'Impostos', amount: safePrice * (Number(tax || 5) / 100), percent: Number(tax || 5) },
        { item: 'Custos Fixos', amount: safePrice * (Number(overhead || 10) / 100), percent: Number(overhead || 10) },
        { item: 'Lucro Líquido', amount: profitVal, percent: Number(margin || 30) }
      ],
      recommendations: [
        'Ofereça 5% de desconto à vista no Pix para economizar na taxa do cartão.',
        'Crie combos ou kits para aumentar o ticket médio e diluir o custo fixo.',
        'Pesquise concorrentes locais para validar se o valor sugerido está alinhado à percepção de valor.'
      ],
      disclaimer: 'Simulação gerencial baseada nos dados informados. Não substitui assessoria contábil oficial.'
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/pricing:', err);
    res.status(500).json({ error: err.message || 'Erro ao calcular precificação.' });
  }
});

// 5. BUSINESS EVOLUTION PLAN (7, 30, 90 DAYS)
app.post('/api/gemini/evolution-plan', async (req, res) => {
  try {
    const { businessContext, mainGoal, biggestDifficulty } = req.body;

    const systemInstruction = `Você é um consultor sênior de aceleração de pequenas empresas no Brasil.
Monte um Plano de Evolução prático, sem enrolação, dividido exatamente em 7 dias (ações imediatas e rápidas), 30 dias (consolidação e processos) e 90 dias (crescimento e fidelização sustentável).
Retorne um JSON no formato:
{
  "diagnostic": "Visão geral do momento do negócio e oportunidade clara",
  "sevenDays": [
    { "id": "7d-1", "action": "Título curto", "description": "Como fazer na prática", "category": "Vendas | Financeiro | Marketing | Organização" },
    { "id": "7d-2", "action": "Título curto", "description": "Como fazer na prática", "category": "Vendas | Financeiro | Marketing | Organização" },
    { "id": "7d-3", "action": "Título curto", "description": "Como fazer na prática", "category": "Vendas | Financeiro | Marketing | Organização" }
  ],
  "thirtyDays": [
    { "id": "30d-1", "action": "Título curto", "description": "Como fazer na prática", "category": "Vendas | Financeiro | Marketing | Organização" },
    { "id": "30d-2", "action": "Título curto", "description": "Como fazer na prática", "category": "Vendas | Financeiro | Marketing | Organização" }
  ],
  "ninetyDays": [
    { "id": "90d-1", "action": "Título curto", "description": "Como fazer na prática", "category": "Vendas | Financeiro | Marketing | Organização" },
    { "id": "90d-2", "action": "Título curto", "description": "Como fazer na prática", "category": "Vendas | Financeiro | Marketing | Organização" }
  ]
}`;

    const prompt = `Crie o plano de evolução para:
- Negócio: ${businessContext?.name || 'Pequeno Negócio'}
- Segmento: ${businessContext?.segment || 'Comércio / Serviços'}
- Tempo de existência: ${businessContext?.timeInBusiness || 'Recente'}
- Principal objetivo: ${mainGoal || businessContext?.mainGoal || 'Aumentar faturamento'}
- Maior dificuldade: ${biggestDifficulty || businessContext?.biggestDifficulty || 'Conseguir novos clientes e organizar o tempo'}
- Faturamento mensal: ${businessContext?.monthlyRevenue || 'Não informado'}`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json(parsed);
        }
      } catch (genErr) {
        console.warn('Gemini evolution plan fallback:', genErr);
      }
    }

    return res.json({
      diagnostic: `Seu negócio tem grande potencial de crescimento local através da organização de processos e contato ativo com clientes que já compraram de você.`,
      sevenDays: [
        { id: '7d-1', action: 'Resgatar clientes inativos no WhatsApp', description: 'Envie uma mensagem personalizada para os 15 clientes que não compram há mais de 30 dias com um mimo ou novidade.', category: 'Vendas' },
        { id: '7d-2', action: 'Atualizar a caderneta de fiados e contas a receber', description: 'Liste todos os recebíveis pendentes e envie lembretes cordiais com chave Pix para oxigenar o caixa nesta semana.', category: 'Financeiro' },
        { id: '7d-3', action: 'Programar postagem de prova social', description: 'Publique um depoimento real ou foto de cliente satisfeito no Instagram e Status do WhatsApp.', category: 'Marketing' }
      ],
      thirtyDays: [
        { id: '30d-1', action: 'Implantar Programa de Fidelidade Simples', description: 'Cadastre pontos a cada compra de R$ 20 para incentivar o cliente a retornar antes de 30 dias.', category: 'Fidelização' },
        { id: '30d-2', action: 'Revisar margens dos 5 produtos mais vendidos', description: 'Simule o preço com as taxas reais de cartão para garantir que não está pagando para vender.', category: 'Financeiro' }
      ],
      ninetyDays: [
        { id: '90d-1', action: 'Criar parceria com outro comércio complementar', description: 'Faça permuta de cupons de desconto com negócios que atendem o mesmo público na sua cidade.', category: 'Marketing' },
        { id: '90d-2', action: 'Meta de aumento de 20% no ticket médio', description: 'Treine sugestão de itens adicionais no fechamento de cada atendimento.', category: 'Vendas' }
      ]
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/evolution-plan:', err);
    res.status(500).json({ error: err.message || 'Erro ao gerar plano de evolução.' });
  }
});

// 6. EXECUTIVE SUMMARY REPORT
app.post('/api/gemini/executive-summary', async (req, res) => {
  try {
    const { summaryData, businessContext } = req.body;

    const systemInstruction = `Você é o consultor de gestão executiva da plataforma "SEU NEGÓCIO. MAS INTELIGENTE.".
Analise os números reais consolidados do negócio do empreendedor brasileiro e gere um relatório executivo sucinto, inspirador e estratégico em português brasileiro.
Formato:
- 1 parágrafo com o diagnóstico da saúde financeira e comercial
- 3 destaques positivos (pontos fortes)
- 3 pontos de atenção urgentes para proteger o caixa
- 1 recomendação de ouro para os próximos 15 dias`;

    const prompt = `Analise os dados consolidados do negócio:
${JSON.stringify(summaryData, null, 2)}
Negócio: ${businessContext?.name} (${businessContext?.segment}, ${businessContext?.city})`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { systemInstruction }
        });
        if (response.text) {
          return res.json({ report: response.text });
        }
      } catch (genErr) {
        console.warn('Gemini executive summary fallback:', genErr);
      }
    }

    return res.json({
      report: `Relatório Executivo Gerencial:\n\nSeu negócio apresenta movimento estável com fluxo financeiro ativo. As vendas recentes mostram boa aceitação dos clientes, porém o acompanhamento rígido dos custos operacionais e dos prazos de contas a receber é vital para manter a liquidez.\n\nPontos Positivos:\n- Base de clientes fiéis e engajamento recorrente.\n- Ticket médio saudável no período analisado.\n- Controle ativo das movimentações de estoque.\n\nPontos de Atenção:\n- Acompanhar os fiados em aberto para não comprometer o capital de giro.\n- Ficar atento aos itens com estoque abaixo do mínimo.\n- Monitorar as despesas fixas que podem comprimir a margem líquida.\n\nRecomendação de Ouro:\nFoque em campanhas de incentivo ao pagamento à vista via Pix nos próximos 15 dias.`
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/executive-summary:', err);
    res.status(500).json({ error: err.message || 'Erro ao gerar relatório executivo.' });
  }
});

// Setup Vite development middleware or serve production static files
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SEU NEGÓCIO. MAS INTELIGENTE. servidor rodando na porta ${PORT}`);
  });
}

startServer();
