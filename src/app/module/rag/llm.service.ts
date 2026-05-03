import { envVariables } from "../../../config/env";
import AppErrors from "../../errorHandler/AppErrors";

export class LLMService {
  private apiKey: string;
  private apiUrl: string = "https://openrouter.ai/api/v1";
  private model: string;

  constructor() {
    this.apiKey = envVariables.Open_Router_Api_key || "";
    this.model =
      envVariables.OPENROUTER_LLM_MODEL ||
      "nvidia/nemotron-3-super-120b-a12b:free";

    if (!this.apiKey) {
      throw new AppErrors(500, "OpenRouter api key is missing...");
    }
  }

  async generateResponse(
    prompt: string,
    context: string[] = [],
    asJson: boolean = false,
  ) {
    try {
      const MAX_CONTEXT_CHARS = 12000;

      const trimmedContext = context.join("\n\n").slice(0, MAX_CONTEXT_CHARS);

      let fullPrompt = `
        You are an AI assistant for a boat booking platform.

        Use ONLY the provided context to answer the question.
        If the answer is not in the context, say: "I don't have enough information."

        Context:
        ${trimmedContext}

        Question:
        ${prompt}

        Answer:
        `;

      if (asJson) {
        fullPrompt += `
        Return ONLY valid JSON:
        {
          "boats": [
            {
              "name": "Boat Name",
              "reason": "Why suitable",
              "type": "Boat Type",
              "location": "Location",
              "pricePerTrip": 0
            }
          ]
        }
        `;
      }

      const bodyPayload: any = {
        model: this.model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: fullPrompt },
        ],
        temperature: asJson ? 0 : 0.3,
        max_tokens: 1500,
      };

      const isOpenAIModel = this.model.startsWith("openai/");

      if (asJson && isOpenAIModel) {
        bodyPayload.response_format = { type: "json_object" };
      }

      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "",
          "X-Title": process.env.APP_NAME || "BoatBooking",
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        let errBody: any;
        try {
          errBody = await response.json();
        } catch {
          errBody = await response.text().catch(() => "Could not read response body");
        }

        console.error("❌ OpenRouter API Error:", {
          status: response.status,
          statusText: response.statusText,
          model: this.model,
          error: errBody,
        });

        const message =
          errBody?.error?.message ||
          errBody?.error?.code ||
          (typeof errBody === "string" ? errBody : `OpenRouter error ${response.status}`);

        throw new AppErrors(
          response.status === 429 ? 429 : 500,
          `LLM Error (${response.status}): ${message}`,
        );
      }

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        console.error("❌ OpenRouter returned no choices:", data);
        throw new AppErrors(500, "LLM returned no response. The model may be unavailable.");
      }

      const raw = data.choices[0].message.content;

      if (asJson) {
        try {
          return JSON.parse(raw);
        } catch {
          console.error("❌ Invalid JSON from LLM:", raw);
          throw new AppErrors(500, "Invalid JSON returned from model");
        }
      }

      return raw;
    } catch (error: any) {
      if (error instanceof AppErrors) throw error;
      console.error("❌ LLM unexpected error:", error);
      throw new AppErrors(500, error.message || "LLM request failed");
    }
  }
}