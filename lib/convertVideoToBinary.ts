export function convertVideoToBinary(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const binaryString = reader.result as string;
      const binaryArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryArray[i] = binaryString.charCodeAt(i);
      }
      resolve(binaryArray);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
  });
}