export type Shape = "pendant" | "desk" | "arc" | "globe";
export type Finish = { id: string; name: string; color: string; metal: number; rough: number };
export type Product = {
  slug: string;
  name: string;
  line: string;
  price: number; // centavos
  shape: Shape;
  tagline: string;
  story: string;
  specs: [string, string][];
  finishes: Finish[];
};

const brass: Finish = { id: "latao", name: "Latão escovado", color: "#b8915a", metal: 0.9, rough: 0.35 };
const black: Finish = { id: "grafite", name: "Grafite", color: "#2a2826", metal: 0.6, rough: 0.55 };
const bone: Finish = { id: "osso", name: "Osso", color: "#e6dccb", metal: 0.05, rough: 0.8 };
const sage: Finish = { id: "salvia", name: "Sálvia", color: "#8d9a83", metal: 0.1, rough: 0.7 };

export const products: Product[] = [
  {
    slug: "orla", name: "Orla", line: "Pendente", price: 129000, shape: "pendant",
    tagline: "Um sino de luz sobre a mesa de jantar.",
    story: "A cúpula é torneada numa peça só e pintada por dentro em branco fosco, para a luz sair macia e sem ofuscar quem senta à mesa.",
    specs: [["Diâmetro", "38 cm"], ["Cabo", "1,8 m ajustável"], ["Soquete", "E27"], ["Lâmpada sugerida", "LED 9 W 2700K"]],
    finishes: [brass, black, bone],
  },
  {
    slug: "vigia", name: "Vigia", line: "Mesa", price: 89000, shape: "desk",
    tagline: "Braço articulado para quem trabalha até tarde.",
    story: "Duas articulações com mola, base pesada de ferro fundido e cabeça que gira 340°. Foi desenhada para ficar em pé sozinha em qualquer ângulo.",
    specs: [["Altura máx.", "62 cm"], ["Base", "Ferro fundido, 2,1 kg"], ["Soquete", "E14"], ["Interruptor", "Dimmer no cabo"]],
    finishes: [black, sage, brass],
  },
  {
    slug: "arco", name: "Arco", line: "Piso", price: 219000, shape: "arc",
    tagline: "Luz de leitura que alcança o meio do sofá.",
    story: "O arco de aço avança 1,4 m sem precisar de furo no teto. A base de mármore segura tudo no lugar e o globo de vidro espalha a luz para o ambiente.",
    specs: [["Altura", "1,9 m"], ["Alcance", "1,4 m"], ["Base", "Mármore Carrara"], ["Soquete", "E27"]],
    finishes: [brass, black],
  },
  {
    slug: "lua", name: "Lua", line: "Mesa", price: 69000, shape: "globe",
    tagline: "Um globo de vidro leitoso para a mesa de cabeceira.",
    story: "Vidro soprado à mão, com pequenas bolhas que fazem cada peça ser diferente. Toque na base para ligar e toque de novo para mudar a intensidade.",
    specs: [["Altura", "28 cm"], ["Vidro", "Soprado à mão"], ["Controle", "Toque, 3 níveis"], ["Lâmpada", "LED integrado 6 W"]],
    finishes: [bone, sage, black],
  },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
export const brl = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Kelvin → approximate sRGB hex (Tanner Helland's approximation). */
export function kelvinToHex(k: number) {
  const t = k / 100;
  const r = t <= 66 ? 255 : 329.7 * (t - 60) ** -0.1332;
  const g = t <= 66 ? 99.47 * Math.log(t) - 161.12 : 288.12 * (t - 60) ** -0.0755;
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  const c = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
