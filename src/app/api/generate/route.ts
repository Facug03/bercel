import OpenAI from "openai";
import { auth } from "@/lib/auth";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://bercel.dev",
    "X-Title": "Bercel",
  },
});

const SYSTEM_PROMPT = `Sos un generador de páginas web HTML. El usuario va a describir lo que quiere y vos tenés que generar un archivo HTML completo, autocontenido, con estilos inline o en un <style> tag.

Reglas:
- Devolvé SOLO el HTML, sin markdown, sin bloques de código, sin explicaciones.
- El HTML debe ser válido, completo (con <!doctype html>, <html>, <head>, <body>).
- Usá estilos modernos, limpios y responsivos. Podés usar Google Fonts si corresponde.
- No uses JavaScript a menos que sea esencial para la funcionalidad pedida.
- No uses frameworks externos (React, Vue, etc.). Solo HTML y CSS (y JS vanilla si hace falta).
- El resultado debe verse bien en producción.`;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "No autenticado" }), {
      status: 401,
    });
  }

  const { prompt } = (await request.json()) as { prompt?: string };

  if (!prompt?.trim()) {
    return new Response(JSON.stringify({ error: "Prompt requerido" }), {
      status: 400,
    });
  }

  if (prompt.length > 2000) {
    return new Response(
      JSON.stringify({
        error: "El prompt no puede superar los 2000 caracteres.",
      }),
      { status: 400 },
    );
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENROUTER_API_KEY no configurada" }),
      { status: 500 },
    );
  }

  const stream = await client.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) {
          controller.enqueue(new TextEncoder().encode(text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
