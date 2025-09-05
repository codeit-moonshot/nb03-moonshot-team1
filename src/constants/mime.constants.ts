export const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const DOC_MIME = [
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'text/plain',
] as const;

// Set 형태
export const IMAGE_MIME_SET: ReadonlySet<string> = new Set(IMAGE_MIME);
export const DEFAULT_FILE_MIME_SET: ReadonlySet<string> = new Set([...IMAGE_MIME, ...DOC_MIME]);

// 검사 헬퍼 TODO: 유틸로 빼버리기
export const isAllowedMime = (mime: string, allow: ReadonlySet<string>) => allow.has(mime);
