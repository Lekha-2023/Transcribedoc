
export interface FileRecord {
  id: string;
  fileName: string;
  originalFileName: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  fileType: string;
  fileSize: number;
  transcriptText?: string;
}

