// Firebase Storage helpers.
//
// The Storage SDK is loaded lazily via getStorageInstance() in firebase.js
// so we don't pay the ~100KB bundle cost unless the user actually uploads.

import { getStorageInstance } from './firebase';

/**
 * Upload a user's profile image and return the public download URL.
 *
 * Path: users/{uid}/avatar.{ext}
 * Rules: see storage.rules — writable only by owner, 2MB cap, image/* content type.
 *
 * @param {string} uid - The user's Firebase Auth UID.
 * @param {File} file - The image File object from an <input type="file">.
 * @returns {Promise<string>} The download URL suitable for <img src> and profile.photoURL.
 */
export async function uploadProfileImage(uid, file) {
  if (!uid) throw new Error('uploadProfileImage: missing uid');
  if (!file) throw new Error('uploadProfileImage: missing file');
  if (!file.type?.startsWith('image/')) {
    throw new Error('Profile image must be an image file.');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Profile image must be smaller than 2MB.');
  }

  const storage = await getStorageInstance();
  if (!storage) throw new Error('Firebase Storage is not configured.');

  const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');

  // Preserve the original extension so content-type inference works.
  const extMatch = file.name?.match(/\.([a-zA-Z0-9]+)$/);
  const ext = (extMatch?.[1] || 'png').toLowerCase();
  const path = `users/${uid}/avatar.${ext}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}
