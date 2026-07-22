import { useState, useEffect, useRef } from "react";
import { fetchElevenLabsToken } from "../services/elevenlabs";

export interface TranscriptLine {
  role: "user" | "agent";
  text: string;
}

export function useVoice(agentId: string = "agent_5801ky0g9czef2t8mj8qrwhpq1w") {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [hasElevenLabs, setHasElevenLabs] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState("");

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  // References to bypass stale state closures inside event callbacks
  const isActiveRef = useRef(false);
  const isMutedRef = useRef(false);
  const isAgentSpeakingRef = useRef(false);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isAgentSpeakingRef.current = isAgentSpeaking;
  }, [isAgentSpeaking]);

  // Initialize browser Web Speech Recognition safely
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Set to false to trigger onresult frequently and naturally restart
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsUserSpeaking(true);
      };

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const text = result[0].transcript;
        setCurrentSpeechText(text);

        if (result.isFinal) {
          handleUserSpeechSubmitted(text);
          setCurrentSpeechText("");
        }
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
      };

      recognition.onend = () => {
        setIsUserSpeaking(false);
        // Automatically restart speech recognition if session is active, unmuted, and agent is not speaking
        setTimeout(() => {
          if (isActiveRef.current && !isMutedRef.current && !isAgentSpeakingRef.current) {
            try {
              recognition.start();
            } catch (err) {
              // Ignore already running error
            }
          }
        }, 300);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Check if ElevenLabs credentials can be fetched
  useEffect(() => {
    fetchElevenLabsToken(agentId).then((url) => {
      if (url) {
        setHasElevenLabs(true);
      }
    });
  }, [agentId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  const startVoiceSession = async () => {
    setIsConnecting(true);
    setTranscript([{ role: "agent", text: "Voice session initialized. Connecting workspace..." }]);

    // Attempt ElevenLabs Connection
    const signedUrl = await fetchElevenLabsToken(agentId);
    if (signedUrl) {
      try {
        const ws = new WebSocket(signedUrl);
        websocketRef.current = ws;

        ws.onopen = () => {
          setIsConnecting(false);
          setIsActive(true);
          setTranscript((prev) => [...prev, { role: "agent", text: "Hello! Connected securely to ElevenLabs agent. Speak when ready." }]);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "agent_response" && data.text) {
              setIsAgentSpeaking(true);
              setTranscript((prev) => [...prev, { role: "agent", text: data.text }]);
            }
            if (data.type === "user_response" && data.text) {
              setTranscript((prev) => [...prev, { role: "user", text: data.text }]);
            }
          } catch (e) {
            // Raw binary audio processing would occur here
          }
        };

        ws.onclose = () => {
          setIsActive(false);
          setIsConnecting(false);
        };

        ws.onerror = (err) => {
          console.error("ElevenLabs WebSocket Error:", err);
          fallbackToNativeVoice();
        };

        return;
      } catch (err) {
        console.warn("Failed to connect ElevenLabs socket, falling back.", err);
      }
    }

    fallbackToNativeVoice();
  };

  const fallbackToNativeVoice = () => {
    setIsConnecting(false);
    setIsActive(true);
    setTranscript([
      { role: "agent", text: "Connected via high-fidelity native speech loop (Gemini Model Voice)." }
    ]);

    // Speak introductory welcome
    speakText("Welcome to NexusAI Voice mode. Speak naturally, and I will respond verbally using Gemini speech intelligence.");

    // Start recognition
    if (recognitionRef.current && !isMuted) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition already active", e);
      }
    }
  };

  const stopVoiceSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    setIsAgentSpeaking(false);
    setIsUserSpeaking(false);

    // Stop recording
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // Stop WebSocket
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    // Stop playing audio
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch (e) {}
      currentAudioSourceRef.current = null;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);

    if (recognitionRef.current) {
      if (nextMute) {
        recognitionRef.current.stop();
        setIsUserSpeaking(false);
      } else if (isActive) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    }
  };

  const handleUserSpeechSubmitted = async (text: string) => {
    if (!text.trim()) return;

    // Temporarily pause recognition to prevent capturing self echo
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // Interrupt agent speech if speaking
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch (e) {}
      currentAudioSourceRef.current = null;
      setIsAgentSpeaking(false);
    }

    setTranscript((prev) => [...prev, { role: "user", text }]);

    // Query core voice agent via backend API
    try {
      const chatRes = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: [],
          agentId: "agent-voice",
        }),
      });

      const chatData = await chatRes.json();
      if (chatData.error) {
        setTranscript((prev) => [...prev, { role: "agent", text: chatData.error }]);
        return;
      }

      const agentReply = chatData.reply;
      setTranscript((prev) => [...prev, { role: "agent", text: agentReply }]);

      // Speak back the agent reply
      speakText(agentReply);
    } catch (e) {
      console.error("Failed to fetch response for voice input", e);
      speakText("I had trouble resolving your query. Please repeat.");
    }
  };

  const speakText = async (text: string) => {
    setIsAgentSpeaking(true);

    try {
      // Fetch TTS Audio from our Gemini server-side endpoint
      const ttsRes = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const ttsData = await ttsRes.json();
      if (ttsData.audio) {
        // Play PCM 24kHz audio via Web Audio API
        const base64Audio = ttsData.audio;
        playPcmAudio(base64Audio);
      } else {
        // Speech synthesis browser backup if Gemini TTS is unavailable
        const synth = window.speechSynthesis;
        if (synth) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = () => {
            setIsAgentSpeaking(false);
            // Resume recognition once voice is done
            if (isActiveRef.current && !isMutedRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {}
            }
          };
          synth.speak(utterance);
        } else {
          setIsAgentSpeaking(false);
        }
      }
    } catch (err) {
      console.warn("TTS fetch failed, falling back to Web Speech Synthesis", err);
      const synth = window.speechSynthesis;
      if (synth) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          setIsAgentSpeaking(false);
          // Resume recognition once voice is done
          if (isActiveRef.current && !isMutedRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {}
          }
        };
        synth.speak(utterance);
      } else {
        setIsAgentSpeaking(false);
      }
    }
  };

  // Web Audio API PCM Player
  const playPcmAudio = async (base64Data: string) => {
    try {
      // Decode Base64 string to ArrayBuffer
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const arrayBuffer = bytes.buffer;

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioCtx = audioContextRef.current;
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      // 16-bit PCM (Int16) to Float32 conversion
      const numSamples = arrayBuffer.byteLength / 2;
      const float32Data = new Float32Array(numSamples);
      const dataView = new DataView(arrayBuffer);
      for (let i = 0; i < numSamples; i++) {
        float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, numSamples, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      // Stop previous playing source if active
      if (currentAudioSourceRef.current) {
        try {
          currentAudioSourceRef.current.stop();
        } catch (e) {}
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      
      source.onended = () => {
        setIsAgentSpeaking(false);
        // Resume speech recognition once speech playback is completed
        if (isActiveRef.current && !isMutedRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }
      };

      currentAudioSourceRef.current = source;
      source.start(0);
    } catch (e) {
      console.error("PCM Audio Player failed", e);
      setIsAgentSpeaking(false);
    }
  };

  return {
    isActive,
    isMuted,
    isConnecting,
    transcript,
    isAgentSpeaking,
    isUserSpeaking,
    hasElevenLabs,
    currentSpeechText,
    startVoiceSession,
    stopVoiceSession,
    toggleMute,
  };
}
