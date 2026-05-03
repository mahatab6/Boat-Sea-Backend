import express from "express";
import { RagController } from "./rag.controller";
import { checkAuth } from "../../middleware/ckeckAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

// ─── Public: Ask a question (RAG pipeline) ───────────────────────────
router.post("/ask", RagController.askQuestion);

//  Public: Similarity search (no LLM)  
router.post("/search", RagController.searchSimilar);

// ─── Admin only: Re-index ALL data  ──────
router.post(
    "/index/all",
    checkAuth(UserRole.ADMIN),
    RagController.reindexAll,
);

// ─── Admin only: Index a specific source type ────────────────────────
router.post(
    "/index/:sourceType",
    checkAuth(UserRole.ADMIN),
    RagController.indexByType,
);

// ─── Admin only: Remove embeddings for a source ─────────────────────
router.delete(
    "/index/:sourceType/:sourceId",
    checkAuth(UserRole.ADMIN),
    RagController.removeBySource,
);

export const RagRoutes = router;
