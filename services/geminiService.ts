
import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName } from "../types";
import { decodeBase64, decodeAudioData, audioBufferToWav } from "../utils/audioUtils";

export async function generateSpeech(text: string, voice: VoiceName): Promise<{ audioUrl: string; blob: Blob }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `为以下内容生成清晰的教程语音：${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received from Gemini API");
    }

    const audioBytes = decodeBase64(base64Audio);
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
    const wavBlob = audioBufferToWav(audioBuffer);
    const audioUrl = URL.createObjectURL(wavBlob);

    return { audioUrl, blob: wavBlob };
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
}
