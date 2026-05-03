import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";
import { IndexingService } from "./indexing.service";
import { LLMService } from "./llm.service";


const embeddingService = new EmbeddingService();
const llmService = new LLMService();
const indexingService = new IndexingService();

// ─── Ask a question using RAG ─────────────────────────────────────────
const askQuestion = async (
  query: string,
  topK: number = 5,
  sourceType?: string,
) => {
  // 1. Generate embedding for the user's query
  const queryEmbedding = await embeddingService.generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(",")}]`;

  // 2. Similarity search against DocumentEmbedding table
  let results: any[];

  if (sourceType) {
    results = await prisma.$queryRaw`
      SELECT
        "id",
        "chunkKey",
        "sourceType",
        "sourceId",
        "sourceLabel",
        "content",
        "metadata",
        1 - ("embedding" <=> CAST(${vectorString} AS vector)) AS similarity
      FROM "DocumentEmbedding"
      WHERE "isDeleted" = false
        AND "sourceType" = ${sourceType}
      ORDER BY "embedding" <=> CAST(${vectorString} AS vector)
      LIMIT ${topK};
    `;
  } else {
    results = await prisma.$queryRaw`
      SELECT
        "id",
        "chunkKey",
        "sourceType",
        "sourceId",
        "sourceLabel",
        "content",
        "metadata",
        1 - ("embedding" <=> CAST(${vectorString} AS vector)) AS similarity
      FROM "DocumentEmbedding"
      WHERE "isDeleted" = false
      ORDER BY "embedding" <=> CAST(${vectorString} AS vector)
      LIMIT ${topK};
    `;
  }

  if (!results || results.length === 0) {
    return {
      answer:
        "I don't have enough information to answer that question. Please try indexing data first.",
      sources: [],
    };
  }

  // 3. Extract context from top results
  const contextChunks = results.map((r: any) => r.content);
  const sources = results.map((r: any) => ({
    sourceType: r.sourceType,
    sourceId: r.sourceId,
    sourceLabel: r.sourceLabel,
    similarity: parseFloat(Number(r.similarity).toFixed(4)),
    chunkKey: r.chunkKey,
  }));

  // 4. Generate answer via LLM
  const answer = await llmService.generateResponse(query, contextChunks);

  return {
    answer,
    sources,
  };
};

// ─── Search similar documents only (no LLM) ──────────────────────────
const searchSimilar = async (
  query: string,
  topK: number = 10,
  sourceType?: string,
) => {
  const queryEmbedding = await embeddingService.generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(",")}]`;

  let results: any[];

  if (sourceType) {
    results = await prisma.$queryRaw`
      SELECT
        "id",
        "chunkKey",
        "sourceType",
        "sourceId",
        "sourceLabel",
        "content",
        "metadata",
        1 - ("embedding" <=> CAST(${vectorString} AS vector)) AS similarity
      FROM "DocumentEmbedding"
      WHERE "isDeleted" = false
        AND "sourceType" = ${sourceType}
      ORDER BY "embedding" <=> CAST(${vectorString} AS vector)
      LIMIT ${topK};
    `;
  } else {
    results = await prisma.$queryRaw`
      SELECT
        "id",
        "chunkKey",
        "sourceType",
        "sourceId",
        "sourceLabel",
        "content",
        "metadata",
        1 - ("embedding" <=> CAST(${vectorString} AS vector)) AS similarity
      FROM "DocumentEmbedding"
      WHERE "isDeleted" = false
      ORDER BY "embedding" <=> CAST(${vectorString} AS vector)
      LIMIT ${topK};
    `;
  }

  return results.map((r: any) => ({
    sourceType: r.sourceType,
    sourceId: r.sourceId,
    sourceLabel: r.sourceLabel,
    content: r.content,
    similarity: parseFloat(Number(r.similarity).toFixed(4)),
    metadata: r.metadata,
  }));
};

// ─── Re-index all data ────────────────────────────────────────────────
const reindexAll = async () => {
  return indexingService.indexAll();
};

// ─── Index a specific source type ─────────────────────────────────────
const indexByType = async (sourceType: string) => {
  switch (sourceType.toUpperCase()) {
    case "BOAT":
      return indexingService.indexBoats();
    case "REVIEW":
      return indexingService.indexReviews();
    case "OWNER":
      return indexingService.indexOwners();
    case "ROUTE":
      return indexingService.indexRoutes();
    case "SCHEDULE":
      return indexingService.indexSchedules();
    default:
      throw new Error(
        `Unknown source type: ${sourceType}. Valid types: BOAT, REVIEW, OWNER, ROUTE, SCHEDULE`,
      );
  }
};

// ─── Remove embeddings by source ──────────────────────────────────────
const removeBySource = async (sourceType: string, sourceId: string) => {
  return indexingService.removeBySource(sourceType, sourceId);
};

export const RagService = {
  askQuestion,
  searchSimilar,
  reindexAll,
  indexByType,
  removeBySource,
};
