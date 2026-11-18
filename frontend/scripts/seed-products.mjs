// Adds the demo catalogue through the API gateway. Skips names that already exist, so it is safe to re-run.
const API = process.env.API_URL ?? "http://localhost:8080/api/v1/products";

const PRODUCTS = [
  ["Halden Over-Ear Headphones", 349, 40, "Closed-back headphones with quiet, adaptive noise cancelling and thirty hours of battery."],
  ["Arden 14 Laptop", 1499, 18, "A slim aluminium laptop with a matte display and a keyboard made for long days of writing."],
  ["Vale Smartphone", 899, 35, "A compact phone with an honest camera, two-day battery and no needless extras."],
  ["Tempo Smartwatch", 279, 50, "Everyday health tracking in a brushed steel case, with a week between charges."],
  ["Oriel Mirrorless Camera", 1249, 12, "A 26-megapixel body with quiet shutter, weather sealing and a tactile set of dials."],
  ["Lumen Bookshelf Speaker", 429, 22, "Warm, room-filling sound from a walnut cabinet that connects over Wi-Fi."],
  ["Norden Mechanical Keyboard", 189, 60, "Low-profile tactile switches in a machined frame, wireless across three devices."],
  ["Fell Wireless Mouse", 89, 75, "A sculpted, silent mouse that charges in minutes and lasts for months."],
  ["Atlas 27 Monitor", 649, 20, "A colour-accurate 4K display with a single cable for video, data and charging."],
  ["Slate 11 Tablet", 599, 30, "A light, paper-textured tablet for reading, sketching and notes."],
];

const existing = await fetch(API).then((r) => r.json());
const names = new Set(existing.map((p) => p.name));

for (const [name, price, quantity, description] of PRODUCTS) {
  if (names.has(name)) continue;
  const response = await fetch(`${API}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, quantity, description }),
  });
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  process.stdout.write(`Added ${name}\n`);
  // The public tier allows 20 requests a second; stay well under it.
  await new Promise((resolve) => setTimeout(resolve, 150));
}
