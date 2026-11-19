import type { Finish, Product } from "./catalog";

export const LANGS = ["pt", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);
export const htmlLang: Record<Lang, string> = { pt: "pt-BR", en: "en", es: "es" };
export const langLabel: Record<Lang, string> = { pt: "Português", en: "English", es: "Español" };
const LOCALE: Record<Lang, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

/** Portuguese lives at the root; the other languages get a prefix. */
export const href = (lang: Lang, path = "/") => (lang === "pt" ? path : `/${lang}${path === "/" ? "" : path}`);
/** Prices stay in reais (that is what the test checkout charges), formatted for each language. */
export const money = (cents: number, lang: Lang) => (cents / 100).toLocaleString(LOCALE[lang], { style: "currency", currency: "BRL" });

const pt = {
  meta: { title: "Lumen — luminárias para a noite", description: "Luminárias desenhadas para a luz baixa da noite. Veja cada peça em 3D, acesa, na temperatura de cor que você escolher." },
  skip: "Pular para o conteúdo",
  nav: { label: "Principal", collection: "Coleção", atelier: "Ateliê", language: "Idioma" },
  footer: { brand: "Lumen é uma marca fictícia criada para portfólio por", noCharge: "Nenhuma compra é cobrada.", test: "Pagamentos em modo de teste" },
  home: {
    eyebrow: "Coleção Noite · 2026", h1: ["Luz para depois", "que o sol vai embora."], cta: "Ver a coleção",
    lead: "Cada peça pode ser vista acesa, em 3D, na cor de luz que você escolher.",
    collection: "Coleção", pieces: (n: number) => `${n} peças`, see3d: "Ver em 3D →",
    atelier: ["Feitas para", "luz baixa."],
    notes: [
      ["2700K", "Todas as peças saem com sugestão de lâmpada quente. É a cor da luz de vela, a que menos atrapalha o sono."],
      ["Sem ofuscar", "As cúpulas escondem a lâmpada de quem está sentado. Você vê a luz, não o bulbo."],
      ["Feito à mão", "Torneamento, solda e vidro soprado em oficinas pequenas no interior de São Paulo."],
    ],
  },
  product: {
    loading: "Acendendo a peça…", drag: "Arraste para girar · pinça ou roda para aproximar",
    switch: "Interruptor", seeIt: (on: boolean) => `Veja a peça ${on ? "acesa" : "apagada"}`, turnOn: "Acender a luminária",
    temp: "Temperatura da luz", moods: ["aconchegante", "neutra", "de trabalho"], tempText: (k: number, m: string) => `${k} kelvin, luz ${m}`,
    finish: "Acabamento", add: "Adicionar à sacola", model: (on: boolean) => `Modelo 3D da luminária, ${on ? "acesa" : "apagada"}`,
  },
  cart: {
    open: (n: number) => `Abrir sacola, ${n} ${n === 1 ? "item" : "itens"}`, bag: "Sacola", close: "Fechar",
    toFree: (v: string) => `Faltam ${v} para o frete grátis`, less: (n: string) => `Diminuir ${n}`, more: (n: string) => `Aumentar ${n}`,
    remove: "remover", empty: "Sua sacola está vazia.", subtotal: "Subtotal", shipping: "Frete", free: "grátis", total: "Total",
    opening: "Abrindo checkout…", checkout: "Finalizar compra", fail: "Falha no checkout", testNote: "Pagamento em modo de teste. Use o cartão 4242 4242 4242 4242.",
  },
  demo: {
    title: "Checkout de demonstração", h1: "Pagamento",
    lead: "A loja não tem uma chave Stripe configurada, então este formulário simula o checkout. Nenhum dado sai do seu navegador e nada é cobrado.",
    card: "Número do cartão (teste)", onlyTest: "No modo de demonstração só o cartão de teste 4242 4242 4242 4242 é aceito.",
    processing: "Processando…", pay: (v: string) => `Pagar ${v}`, summary: "Resumo", empty: "Sacola vazia.", total: "Total",
  },
  done: {
    title: "Pedido confirmado", eyebrow: "Pedido de teste confirmado", h1: ["Obrigado.", "Boa noite."],
    text: "Como a Lumen é uma loja de demonstração, nada foi cobrado e nenhuma peça vai sair daqui.", back: "Voltar para a loja",
  },
};
export type Dict = typeof pt;

const en: Dict = {
  meta: { title: "Lumen — lamps for the evening", description: "Lamps designed for low evening light. See every piece in 3D, switched on, at the color temperature you choose." },
  skip: "Skip to content",
  nav: { label: "Main", collection: "Collection", atelier: "Atelier", language: "Language" },
  footer: { brand: "Lumen is a fictional brand made for a portfolio by", noCharge: "No purchase is charged.", test: "Payments in test mode" },
  home: {
    eyebrow: "Night Collection · 2026", h1: ["Light for after", "the sun goes down."], cta: "See the collection",
    lead: "Every piece can be seen switched on, in 3D, in the light color you choose.",
    collection: "Collection", pieces: (n) => `${n} pieces`, see3d: "See in 3D →",
    atelier: ["Made for", "low light."],
    notes: [
      ["2700K", "Every piece ships with a warm bulb suggestion. It is the color of candlelight, the one that disturbs sleep the least."],
      ["No glare", "The shades hide the bulb from anyone sitting down. You see the light, not the bulb."],
      ["Handmade", "Turning, welding and blown glass in small workshops in the countryside of São Paulo."],
    ],
  },
  product: {
    loading: "Lighting the piece…", drag: "Drag to rotate · pinch or scroll to zoom",
    switch: "Switch", seeIt: (on) => `See the piece ${on ? "on" : "off"}`, turnOn: "Turn on the lamp",
    temp: "Light temperature", moods: ["cozy", "neutral", "task"], tempText: (k, m) => `${k} kelvin, ${m} light`,
    finish: "Finish", add: "Add to bag", model: (on) => `3D model of the lamp, ${on ? "on" : "off"}`,
  },
  cart: {
    open: (n) => `Open bag, ${n} ${n === 1 ? "item" : "items"}`, bag: "Bag", close: "Close",
    toFree: (v) => `${v} more for free shipping`, less: (n) => `Decrease ${n}`, more: (n) => `Increase ${n}`,
    remove: "remove", empty: "Your bag is empty.", subtotal: "Subtotal", shipping: "Shipping", free: "free", total: "Total",
    opening: "Opening checkout…", checkout: "Check out", fail: "Checkout failed", testNote: "Payment in test mode. Use card 4242 4242 4242 4242.",
  },
  demo: {
    title: "Demo checkout", h1: "Payment",
    lead: "The store has no Stripe key set up, so this form simulates checkout. No data leaves your browser and nothing is charged.",
    card: "Card number (test)", onlyTest: "In demo mode only the test card 4242 4242 4242 4242 is accepted.",
    processing: "Processing…", pay: (v) => `Pay ${v}`, summary: "Summary", empty: "Bag is empty.", total: "Total",
  },
  done: {
    title: "Order confirmed", eyebrow: "Test order confirmed", h1: ["Thank you.", "Good night."],
    text: "Since Lumen is a demo store, nothing was charged and no piece will ship.", back: "Back to the store",
  },
};

const es: Dict = {
  meta: { title: "Lumen — lámparas para la noche", description: "Lámparas diseñadas para la luz baja de la noche. Mira cada pieza en 3D, encendida, en la temperatura de color que elijas." },
  skip: "Saltar al contenido",
  nav: { label: "Principal", collection: "Colección", atelier: "Taller", language: "Idioma" },
  footer: { brand: "Lumen es una marca ficticia creada para un portafolio por", noCharge: "No se cobra ninguna compra.", test: "Pagos en modo de prueba" },
  home: {
    eyebrow: "Colección Noche · 2026", h1: ["Luz para cuando", "el sol se va."], cta: "Ver la colección",
    lead: "Cada pieza se puede ver encendida, en 3D, con el color de luz que elijas.",
    collection: "Colección", pieces: (n) => `${n} piezas`, see3d: "Ver en 3D →",
    atelier: ["Hechas para", "luz baja."],
    notes: [
      ["2700K", "Todas las piezas incluyen la sugerencia de una bombilla cálida. Es el color de la luz de vela, el que menos afecta el sueño."],
      ["Sin deslumbrar", "Las pantallas esconden la bombilla de quien está sentado. Ves la luz, no el foco."],
      ["Hecho a mano", "Torneado, soldadura y vidrio soplado en talleres pequeños del interior de São Paulo."],
    ],
  },
  product: {
    loading: "Encendiendo la pieza…", drag: "Arrastra para girar · pellizca o usa la rueda para acercar",
    switch: "Interruptor", seeIt: (on) => `Mira la pieza ${on ? "encendida" : "apagada"}`, turnOn: "Encender la lámpara",
    temp: "Temperatura de la luz", moods: ["acogedora", "neutra", "de trabajo"], tempText: (k, m) => `${k} kelvin, luz ${m}`,
    finish: "Acabado", add: "Añadir a la bolsa", model: (on) => `Modelo 3D de la lámpara, ${on ? "encendida" : "apagada"}`,
  },
  cart: {
    open: (n) => `Abrir bolsa, ${n} ${n === 1 ? "artículo" : "artículos"}`, bag: "Bolsa", close: "Cerrar",
    toFree: (v) => `Faltan ${v} para el envío gratis`, less: (n) => `Disminuir ${n}`, more: (n) => `Aumentar ${n}`,
    remove: "quitar", empty: "Tu bolsa está vacía.", subtotal: "Subtotal", shipping: "Envío", free: "gratis", total: "Total",
    opening: "Abriendo checkout…", checkout: "Finalizar compra", fail: "Error en el checkout", testNote: "Pago en modo de prueba. Usa la tarjeta 4242 4242 4242 4242.",
  },
  demo: {
    title: "Checkout de demostración", h1: "Pago",
    lead: "La tienda no tiene una clave de Stripe configurada, así que este formulario simula el checkout. Ningún dato sale de tu navegador y no se cobra nada.",
    card: "Número de tarjeta (prueba)", onlyTest: "En modo demostración solo se acepta la tarjeta de prueba 4242 4242 4242 4242.",
    processing: "Procesando…", pay: (v) => `Pagar ${v}`, summary: "Resumen", empty: "Bolsa vacía.", total: "Total",
  },
  done: {
    title: "Pedido confirmado", eyebrow: "Pedido de prueba confirmado", h1: ["Gracias.", "Buenas noches."],
    text: "Como Lumen es una tienda de demostración, no se cobró nada y ninguna pieza saldrá de aquí.", back: "Volver a la tienda",
  },
};

export const dicts: Record<Lang, Dict> = { pt, en, es };

type ProductText = Pick<Product, "line" | "tagline" | "story" | "specs">;
const PRODUCTS: Record<Exclude<Lang, "pt">, Record<string, ProductText>> = {
  en: {
    orla: { line: "Pendant", tagline: "A bell of light over the dining table.", story: "The shade is turned from a single piece and painted matte white inside, so the light comes out soft and never glares at whoever sits at the table.", specs: [["Diameter", "38 cm"], ["Cord", "1.8 m adjustable"], ["Socket", "E27"], ["Suggested bulb", "LED 9 W 2700K"]] },
    vigia: { line: "Desk", tagline: "An articulated arm for people who work late.", story: "Two spring joints, a heavy cast iron base and a head that turns 340°. It was designed to stand on its own at any angle.", specs: [["Max height", "62 cm"], ["Base", "Cast iron, 2.1 kg"], ["Socket", "E14"], ["Switch", "Dimmer on the cord"]] },
    arco: { line: "Floor", tagline: "Reading light that reaches the middle of the sofa.", story: "The steel arc reaches out 1.4 m with no hole in the ceiling. The marble base holds everything in place and the glass globe spreads light across the room.", specs: [["Height", "1.9 m"], ["Reach", "1.4 m"], ["Base", "Carrara marble"], ["Socket", "E27"]] },
    lua: { line: "Desk", tagline: "A milky glass globe for the nightstand.", story: "Hand-blown glass with small bubbles that make every piece different. Touch the base to turn it on and touch again to change the brightness.", specs: [["Height", "28 cm"], ["Glass", "Hand-blown"], ["Control", "Touch, 3 levels"], ["Bulb", "Built-in LED 6 W"]] },
  },
  es: {
    orla: { line: "Colgante", tagline: "Una campana de luz sobre la mesa del comedor.", story: "La pantalla está torneada en una sola pieza y pintada por dentro de blanco mate, para que la luz salga suave y no deslumbre a quien se sienta a la mesa.", specs: [["Diámetro", "38 cm"], ["Cable", "1,8 m ajustable"], ["Casquillo", "E27"], ["Bombilla sugerida", "LED 9 W 2700K"]] },
    vigia: { line: "Mesa", tagline: "Brazo articulado para quien trabaja hasta tarde.", story: "Dos articulaciones con resorte, base pesada de hierro fundido y cabeza que gira 340°. Se diseñó para mantenerse sola en cualquier ángulo.", specs: [["Altura máx.", "62 cm"], ["Base", "Hierro fundido, 2,1 kg"], ["Casquillo", "E14"], ["Interruptor", "Dimmer en el cable"]] },
    arco: { line: "Pie", tagline: "Luz de lectura que llega al centro del sofá.", story: "El arco de acero avanza 1,4 m sin necesidad de perforar el techo. La base de mármol sostiene todo en su lugar y el globo de vidrio esparce la luz por el ambiente.", specs: [["Altura", "1,9 m"], ["Alcance", "1,4 m"], ["Base", "Mármol de Carrara"], ["Casquillo", "E27"]] },
    lua: { line: "Mesa", tagline: "Un globo de vidrio lechoso para la mesa de noche.", story: "Vidrio soplado a mano, con pequeñas burbujas que hacen única cada pieza. Toca la base para encenderla y vuelve a tocar para cambiar la intensidad.", specs: [["Altura", "28 cm"], ["Vidrio", "Soplado a mano"], ["Control", "Táctil, 3 niveles"], ["Bombilla", "LED integrado 6 W"]] },
  },
};

const FINISHES: Record<Exclude<Lang, "pt">, Record<string, string>> = {
  en: { latao: "Brushed brass", grafite: "Graphite", osso: "Bone", salvia: "Sage" },
  es: { latao: "Latón cepillado", grafite: "Grafito", osso: "Hueso", salvia: "Salvia" },
};

export const finishFor = (f: Finish, lang: Lang): Finish => (lang === "pt" ? f : { ...f, name: FINISHES[lang][f.id] ?? f.name });

/** The product with its text (and finish names) in the given language. */
export function productFor(p: Product, lang: Lang): Product {
  if (lang === "pt") return p;
  return { ...p, ...PRODUCTS[lang][p.slug], finishes: p.finishes.map((f) => finishFor(f, lang)) };
}
