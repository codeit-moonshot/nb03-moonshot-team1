import prisma from '#prisma/prisma';
import StorageService from '#libs/storage.service';

type Options = {
  guardUnreferenced?: boolean;
};

const removeManyByRelPath = async (relPaths: string[], opts: Options = {}): Promise<void> => {
  const unique = Array.from(new Set(relPaths.filter(Boolean)));
  for (const relPath of unique) {
    try {
      if (opts.guardUnreferenced) {
        const cnt = await prisma.attachments.count({ where: { relPath } });
        if (cnt > 0) continue;
      }
      await StorageService.removeFinalByRelPath(relPath);
    } catch (e: any) {
      console.warn(`[fileRemover] remove failed: ${relPath}`, e?.message);
    }
  }
};

export default removeManyByRelPath;
