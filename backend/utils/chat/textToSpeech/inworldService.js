import { nanoid } from "nanoid";
class InworldService {
  constructor(io) {
    this.inworldConnections = new Map();
    this.connectionContexts = new Map();
    this.inworldConnectionsCount = 0;
    this.contextsCount = 0;
    this.io = io;
  }

  async createNewConnection() {
    const headers = {
      Authorization: `Basic ${process.env.INWORLD_TTS_KEY}`,
    };

    try {
      console.log(` Connecting to WebSocket: ${websocketUrl}`);
      const startTime = Date.now();

      const ws = new WebSocket(websocketUrl, { headers });

      // Wait for connection to open
      await new Promise((resolve, reject) => {
        ws.on("open", resolve);
        ws.on("error", reject);
      });

      const inworldSocketId = nanoid();
      this.inworldConnections.set(inworldSocketId, ws);

      ws.on("message", (data) => {
        console.log(data);
      });

      ws.on("close", () => {});

      console.log(
        `Connection established in ${((Date.now() - startTime) / 1000).toFixed(
          2
        )} seconds`
      );

      return inworldSocketId;
    } catch (error) {
      if (error.code === "ECONNRESET" || error.code === "ECONNREFUSED") {
        console.log(
          `WebSocket connection closed unexpectedly: ${error.message}`
        );
      } else {
        console.log(`WebSocket error: ${error.message}`);
      }
      throw error;
    }
  }

  async createContext({ socket }) {
    const allConnectionsIds = [...this.inworldConnections.keys()];
    const lastConnectionId = allConnectionsIds.at(-1);
    const lastConnectionContexts =
      this.connectionContexts.get(lastConnectionId);
    if (!lastConnectionId || lastConnectionContexts.length === 5) {
    }

    connection.send(
      JSON.stringify({
        context_id: socket.id,
        create: {
          voice_id: "Ashley",
          model_id: "inworld-tts-1.5-mini",
          audio_config: {
            audio_encoding: "OGG_OPUS",
            sample_rate_hertz: 24000,
            bit_rate: 32000,
          },
        },
      })
    );
  }

  async sendTtsRequest({ contextId, inworldSocketId, voice_id }) {
    const connection = this.inworldConnections.get(inworldSocketId);
    connection.send(
      JSON.stringify({
        context_id: "ctx-1",
        create: {
          voice_id: "Ashley",
          model_id: "inworld-tts-1.5-mini",
          audio_config: {
            audio_encoding: "OGG_OPUS",
            sample_rate_hertz: 24000,
            bit_rate: 32000,
          },
        },
      })
    );
  }
}
