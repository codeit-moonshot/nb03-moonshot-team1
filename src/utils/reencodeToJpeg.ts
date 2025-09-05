import sharp from 'sharp';

/**
 * 이미지를 JPG로 재인코딩합니다.
 * @param inputPath 원본 temp 파일 경로
 * @param outputPath 최종 저장 경로
 */
const reencodeToJpeg = async (
  inputAbsPath: string,
  outputAbsPath: string,
  opts: { quality?: number; progressive?: boolean; mozjpeg?: boolean } = {}
) => {
  const { quality = 85, progressive = true, mozjpeg = true } = opts;

  await sharp(inputAbsPath).jpeg({ quality, progressive, mozjpeg }).toFile(outputAbsPath);
};

export default reencodeToJpeg;
