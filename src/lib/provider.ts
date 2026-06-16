export interface GenerationInput {
  body: unknown;
  pose: string;
  garments: unknown[];
  fitPrompt: string;
  modelImage?: string;
  productImage?: string;
}

export interface TryOnProvider {
  create(input: GenerationInput): Promise<{ providerJobId: string; status: "queued" | "completed"; imageUrl?: string }>;
}

class MockProvider implements TryOnProvider {
  async create() {
    return { providerJobId: `mock_${crypto.randomUUID()}`, status: "queued" as const };
  }
}

class FashnProvider implements TryOnProvider {
  async create(input: GenerationInput) {
    const apiKey = process.env.FASHN_API_KEY;
    if (!apiKey) throw new Error("FASHN_API_KEY is not configured");
    if (!input.modelImage || !input.productImage) {
      throw new Error("FASHN requires hosted modelImage and productImage assets");
    }
    const response = await fetch("https://api.fashn.ai/v1/run", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model_name: "tryon-max",
        inputs: {
          product_image: input.productImage,
          model_image: input.modelImage,
          prompt: input.fitPrompt,
          resolution: "2k",
          generation_mode: "quality",
          output_format: "png",
          num_images: 1,
        },
      }),
    });
    if (!response.ok) throw new Error(`FASHN request failed: ${response.status}`);
    const data = await response.json();
    return { providerJobId: data.id, status: "queued" as const };
  }
}

export function getTryOnProvider(): TryOnProvider {
  return process.env.FASHN_API_KEY ? new FashnProvider() : new MockProvider();
}
