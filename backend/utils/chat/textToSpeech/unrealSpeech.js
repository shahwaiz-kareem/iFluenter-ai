import WebSocket from "ws";

//Todo: add voice id field in avatar dashbaord page

export default function sendToUnrealSpeech({
  text,
  socket,
  model = "kokoro",
  sampleRate = 24000,
  codec = "libmp3lame",
  bitrate = "64k",
  pitch = 1.0,
  requestId,
}) {
  // URL for streaming endpoint
  const WS_URL = "wss://api.v8.unrealspeech.com/streamWithTimestamps";
  let totalChunksSent = 0;
  // Create WebSocket instance
  const ws = new WebSocket(WS_URL, {
    headers: {
      Authorization: `Bearer ${process.env.UNREAL_API_KEY}`,
    },
  });

  // When the connection is open, send the configuration payload
  ws.on("open", () => {
    const configPayload = {
      Text: text,
      VoiceId: socket.chatPreferences.avatarDetails.voiceId || "am_michael",
      Model: model,
      Codec: codec,
      SampleRate: sampleRate,
      Bitrate: bitrate,
      Pitch: pitch,
      Speed: socket.chatPreferences.preferences.speechSpeed,
      TimestampType: "word",
    };
    console.time("unrealLatency" + requestId);
    ws.send(JSON.stringify(configPayload));
  });

  // Handle incoming messages (could be JSON or binary)
  ws.on("message", (data, isBinary) => {
    if (isBinary) {
      socket.emit("tts-audio-chunk", data);
      if (totalChunksSent === 0) console.timeEnd("unrealLatency" + requestId);
      totalChunksSent++;
      return;
    }

    const str = data.toString("utf8");

    let parsed;
    try {
      parsed = JSON.parse(str);
    } catch {
      console.warn("⚠️ not JSON:", str);
      return;
    }

    if (parsed.type === "progress" && Array.isArray(parsed.message)) {
      const wordTimestamps = parsed.message.flat();
      // console.log("timestamps", wordTimestamps);
      socket.emit("chunk-timestamps", wordTimestamps);
    } else if (parsed.type === "complete") {
      socket.emit("tts-completed");
      ws.close();
    } else if (parsed.type === "error") {
      console.error("‼️ UnrealSpeech error:", parsed.message);
      socket.emit("error", "Something went wrong!");
      ws.close();
    }
  });

  // Handle errors
  ws.on("error", (err) => {
    console.log("error occurred: ", err);
    new Error(`WebSocket error: ${err.message}`);
    socket.emit("error", "Something went wrong!");
  });
}
