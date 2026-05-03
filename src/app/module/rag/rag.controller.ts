import { Request, Response } from "express";
import status from "http-status";

import { RagService } from "./rag.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

// ─── POST /rag/ask — Ask a question (full RAG pipeline) ──────────────
const askQuestion = catchAsync(async (req: Request, res: Response) => {
  const { query, topK, sourceType } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    sendResponse(res, {
      httpStatusCode: status.BAD_REQUEST,
      success: false,
      message: "Query is required and must be a non-empty string.",
    });
    return;
  }

  const result = await RagService.askQuestion(
    query.trim(),
    topK || 5,
    sourceType,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "RAG query processed successfully",
    data: result,
  });
});

// ─── POST /rag/search — Similarity search only (no LLM) ─────────────
const searchSimilar = catchAsync(async (req: Request, res: Response) => {
  const { query, topK, sourceType } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    sendResponse(res, {
      httpStatusCode: status.BAD_REQUEST,
      success: false,
      message: "Query is required and must be a non-empty string.",
    });
    return;
  }

  const result = await RagService.searchSimilar(
    query.trim(),
    topK || 10,
    sourceType,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Similar documents retrieved successfully",
    data: result,
  });
});

// ─── POST /rag/index/all — Re-index all data sources ─────────────────
const reindexAll = catchAsync(async (req: Request, res: Response) => {
  const result = await RagService.reindexAll();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All data re-indexed successfully",
    data: result,
  });
});

// ─── POST /rag/index/:sourceType — Index a specific source ───────────
const indexByType = catchAsync(async (req: Request, res: Response) => {
  const { sourceType } = req.params;

  const result = await RagService.indexByType(sourceType as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: `${sourceType} data indexed successfully`,
    data: result,
  });
});

// ─── DELETE /rag/index/:sourceType/:sourceId — Remove embeddings ─────
const removeBySource = catchAsync(async (req: Request, res: Response) => {
  const { sourceType, sourceId } = req.params;

  const result = await RagService.removeBySource(sourceType as string, sourceId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Embeddings removed successfully",
    data: result,
  });
});

export const RagController = {
  askQuestion,
  searchSimilar,
  reindexAll,
  indexByType,
  removeBySource,
};
