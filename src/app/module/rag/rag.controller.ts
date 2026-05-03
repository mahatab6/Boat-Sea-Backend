import { Request, Response } from 'express';
import { RagService } from './rag.service';

const handleRagQuery = async (req: Request, res: Response) => {
  // TODO: Implement RAG query controller
  res.status(200).json({ message: 'RAG query endpoint' });
};

export const RagController = {
  handleRagQuery,
};
