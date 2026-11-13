import { describe, expect, it } from "vitest";
import { addLine, setQty, price, MAX_QTY, SHIPPING } from "./cart";
import { kelvinToHex, products } from "./catalog";

describe("cart", () => {
  it("merges same product+finish and caps quantity", () => {
    let c = addLine([], "orla", "latao");
    c = addLine(c, "orla", "latao", 20);
    expect(c).toEqual([{ slug: "orla", finish: "latao", qty: MAX_QTY }]);
    expect(addLine(c, "orla", "grafite")).toHaveLength(2);
  });
  it("removes a line when qty goes to zero", () => {
    expect(setQty([{ slug: "lua", finish: "osso", qty: 2 }], "lua", "osso", 0)).toEqual([]);
  });
});

describe("price (server-side)", () => {
  it("uses catalog prices and ignores client-sent amounts", () => {
    const r = price([{ slug: "lua", finish: "osso", qty: 1, price: 1 }]);
    expect(r.subtotal).toBe(products.find((p) => p.slug === "lua")!.price);
    expect(r.shipping).toBe(SHIPPING);
  });
  it("drops unknown products, bad finishes and bad quantities", () => {
    const r = price([{ slug: "x", finish: "latao", qty: 1 }, { slug: "orla", finish: "neon", qty: 1 }, { slug: "orla", finish: "latao", qty: -5 }, { slug: "orla", finish: "latao", qty: 1.5 }]);
    expect(r.items.filter((i) => i.qty > 0)).toHaveLength(1); // -5 clamps to 1, 1.5 rejected
    expect(price("nope").total).toBe(0);
  });
  it("gives free shipping above the threshold", () => {
    expect(price([{ slug: "arco", finish: "latao", qty: 1 }]).shipping).toBe(0);
  });
});

describe("kelvinToHex", () => {
  it("is warm at 2700K and near white at 6500K", () => {
    const warm = kelvinToHex(2700);
    expect(parseInt(warm.slice(1, 3), 16)).toBe(255);
    expect(parseInt(warm.slice(5, 7), 16)).toBeLessThan(180);
    const white = kelvinToHex(6500);
    expect(parseInt(white.slice(5, 7), 16)).toBeGreaterThan(240);
  });
});
