
import { FileRecord } from "../types/file";

const FILES_STORAGE_KEY = 'mediscribe_files';

export const getUserFiles = (userId: string): FileRecord[] => {
  const storedFiles = localStorage.getItem(`${FILES_STORAGE_KEY}_${userId}`);
  return storedFiles ? JSON.parse(storedFiles) : [];
};

export const saveUserFiles = (userId: string, files: FileRecord[]): void => {
  localStorage.setItem(`${FILES_STORAGE_KEY}_${userId}`, JSON.stringify(files));
};
