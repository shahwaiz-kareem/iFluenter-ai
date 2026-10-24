export async function getExtensionFromBase64(base64String) {
  return base64String.slice(0, 30).split(",")[0].split(";")[0].split("/")[1];
}
export const purifyBase64 = (base64String) => {
  const base64Data = base64String.split(";base64,").pop();
  return Buffer.from(base64Data, "base64");
};
