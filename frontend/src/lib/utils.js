import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function mergeFloat32Arrays(arrays) {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Float32Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}
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

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export async function checkMicrophonePermission() {
  if (!navigator.permissions) {
    console.log("Permissions API not supported in this browser.");
    // Fallback: directly call getUserMedia and handle the error/success
    return;
  }

  try {
    const permissionStatus = await navigator.permissions.query({
      name: "microphone",
    });
    console.log(`Microphone permission state is: ${permissionStatus.state}`);

    permissionStatus.onchange = () => {
      console.log(
        `Microphone permission state changed to: ${permissionStatus.state}`
      );
    };

    return permissionStatus.state;
  } catch (error) {
    console.error("Error querying permissions:", error);
    return "unknown";
  }
}
