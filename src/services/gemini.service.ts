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

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  const text =
    response.text?.trim() || "{}";

  const cleaned = text
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      backgroundStyle: "national color theme",
      headlinePosition: "top-center",
      headlineSize: "large",
      photoLayout: "three-horizontal",
      photoPosition: "top",
      decoration: "simple floral border",
      footerStyle: "bottom bar",
      colorScheme: "green-red"
    };
  }
};