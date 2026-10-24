export function getWavHeader(dataLength, sampleRate = 16000) {
  const header = Buffer.alloc(44);
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;

  // RIFF identifier
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataLength, 4);
  // RIFF type
  header.write("WAVE", 8);
  // Format chunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34); // Bits per sample
  // Data chunk
  header.write("data", 36);
  header.writeUInt32LE(dataLength, 40);

  return header;
}
