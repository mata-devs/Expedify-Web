import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../firebase";

export async function uploadBase64Image(
  base64String: string,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);

  // Upload base64 data
  await uploadString(storageRef, base64String, "data_url");

  // Get public download URL
  return await getDownloadURL(storageRef);
}
