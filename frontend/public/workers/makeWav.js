import { mergeFloat32Arrays } from "@/lib/utils";

self.onmessage = (e) => {
  if (e.data.type === "chunk") {
    let float32 = mergeFloat32Arrays(e.data.payload);
    // Create buffer for Raw PCM16 (2 bytes per sample)
    const buffer = new ArrayBuffer(float32.length * 2);
    const view = new DataView(buffer);

    // Convert Float32 -> Int16
    for (let i = 0; i < float32.length; i++) {
      let s = Math.max(-1, Math.min(1, float32[i]));
      // Scaling to 16-bit Range
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    self.postMessage(buffer, [buffer]);
  }
};
