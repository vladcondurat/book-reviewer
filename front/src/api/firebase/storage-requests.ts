import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase.config';

export const uploadFile = async (file: File): Promise<string> => {
  if (file === null) {
    throw new Error('No file provided'); // Throw an error if no file is provided
  }

  try {
    const imageRef = ref(storage, `images/${crypto.randomUUID()}`); // Create a reference to the storage location
    const snapshot = await uploadBytes(imageRef, file); // Upload the file and wait for the upload t23o complete
    const url = await getDownloadURL(snapshot.ref); // Get the download URL and wait for it to be retrieved
    return url; // Return the download URL
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Rethrow the error
  }
};
