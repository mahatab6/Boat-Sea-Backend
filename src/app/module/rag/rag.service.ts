import { LLMService } from './llm.service';
import { IndexingService } from './indexing.service';
import { EmbeddingService } from './embedding.service';

const processRagQuery = async (query: string) => {
  // TODO: Implement RAG orchestration
  return {};
};

export const RagService = {
  processRagQuery,
};
