import { gemini } from "../lib/gemini";

interface PosterData {
  name: string;
  designation: string;
  party?: string;
  organization?: string;
  district?: string;
  occasion: string;
  headline: string;
}

const fallbackLayout = {
  backgroundStyle: "national color theme",
  headlinePosition: "top-center",
  headlineSize: "large",
  photoLayout: "three-horizontal",
  photoPosition: "top",
  decoration: "simple floral border",
  footerStyle: "bottom bar",
  colorScheme: "green-red"
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const isRetryableGeminiError = (error: unknown) => {
  const status = (error as { status?: number })?.status;
  return status === 429 || status === 500 || status === 502 ||
    status === 503 || status === 504;
};

export const generatePosterLayout = async (
  data: PosterData
) => {
  const prompt = `
You are a professional Bangladeshi poster designer.

Create a JSON layout recommendation for a political/community poster.

Poster information:

Name: ${data.name}
Designation: ${data.designation}
Party/Organization: ${data.party || data.organization || ""}
District: ${data.district || ""}
Occasion: ${data.occasion}
Headline: ${data.headline}

Return ONLY valid JSON.

Use this exact structure:

{
  "backgroundStyle": "",
  "headlinePosition": "",
  "headlineSize": "",
  "photoLayout": "",
  "photoPosition": "",
  "decoration": "",
  "footerStyle": "",
  "colorScheme": ""
}

Important:
- Do not generate text.
- Do not modify the Bangla headline.
- Do not invent names.
- Do not include political persuasion.
`;

  let response;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await gemini.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt
      });
      break;
    } catch (error) {
      if (!isRetryableGeminiError(error) || attempt === 2) {
        console.warn("Gemini layout generation unavailable; using fallback layout.");
        return fallbackLayout;
      }

      await wait(500 * 2 ** attempt);
    }
  }

  const text =
    response?.text?.trim() || "{}";

  const cleaned = text
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return fallbackLayout;
  }
};