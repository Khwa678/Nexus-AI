/**
 * ElevenLabs Conversational Voice API Service
 * Securely proxies authorization requests through the backend to avoid exposing keys in client-side bundles.
 */

export async function fetchElevenLabsToken(agentId: string): Promise<string | null> {
  try {
    const response = await fetch("/api/elevenlabs/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      console.warn("Failed to retrieve ElevenLabs signed URL token from proxy.");
      return null;
    }

    const data = await response.json();
    if (data.success && data.signedUrl) {
      return data.signedUrl;
    }
    return null;
  } catch (error) {
    console.error("ElevenLabs Service Token Error:", error);
    return null;
  }
}
