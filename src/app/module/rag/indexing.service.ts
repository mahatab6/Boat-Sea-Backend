import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";

export class IndexingService {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  // ─── Core: Upsert a single document embedding ───────────────────────
  async indexDocument(
    chunkKey: string,
    chunkIndex: number,
    sourceType: string,
    sourceId: string,
    content: string,
    sourceLabel?: string,
    metadata?: Record<string, unknown>,
  ) {
    try {
      const embedding = await this.embeddingService.generateEmbedding(content);
      const vectorString = `[${embedding.join(",")}]`;

      await prisma.$executeRaw`
        INSERT INTO "DocumentEmbedding" (
          "chunkKey",
          "chunkIndex",
          "sourceType",
          "sourceId",
          "sourceLabel",
          "content",
          "metadata",
          "embedding",
          "updatedAt"
        )
        VALUES (
          ${chunkKey},
          ${chunkIndex},
          ${sourceType},
          ${sourceId},
          ${sourceLabel || null},
          ${content},
          ${JSON.stringify(metadata || {})}::jsonb,
          CAST(${vectorString} AS vector),
          NOW()
        )
        ON CONFLICT ("chunkKey")
        DO UPDATE SET
          "content"   = EXCLUDED."content",
          "metadata"  = EXCLUDED."metadata",
          "embedding" = EXCLUDED."embedding",
          "isDeleted" = false,
          "deletedAt" = null,
          "updatedAt" = NOW();
      `;
    } catch (error) {
      console.error("❌ Indexing Error for Key:", chunkKey, error);
      throw new Error(
        "Index document failed due to database or embedding error.",
      );
    }
  }

  //  Index all Boats 
  async indexBoats() {
    const boats = await prisma.boat.findMany({
      include: {
        owner: true,
        reviews: { include: { user: true } },
        license: true,
        schedules: { include: { route: true } },
      },
    });

    let count = 0;
    for (const boat of boats) {
      const reviewText = boat.reviews.length
        ? boat.reviews
          .map(
            (r) =>
              `⭐ ${r.rating}/5 by ${r.user.name}: "${r.comment || "No comment"}"`,
          )
          .join("\n")
        : "No reviews yet";

      const routeText = boat.schedules.length
        ? [
          ...new Set(
            boat.schedules.map(
              (s) =>
                `${s.route.name} (${s.route.difficulty}, ${s.route.duration}, ${s.route.distance})`,
            ),
          ),
        ].join(", ")
        : "No routes scheduled";

      const content = `
Boat Name: ${boat.boatName}
Type: ${boat.boatType}
Status: ${boat.status}
Location: ${boat.location}
Capacity: ${boat.capacity} passengers
Price Per Trip: $${boat.pricePerTrip}
Rating: ${boat.rating}/5 (${boat.totalReviews} reviews)
Owner: ${boat.owner.name}
Description: ${boat.description}
Condition: ${boat.boatCondition}
Manufacturer: ${boat.manufacturer} (${boat.manufacturingYear})
Dimensions: ${boat.length}ft × ${boat.width}ft
Engine Capacity: ${boat.engineCapacity} HP
Specifications: ${boat.specifications}
Amenities: ${boat.amenities.join(", ") || "None listed"}
Cancellation Policy: ${boat.cancellationPolicy}
Licensed: ${boat.license ? `Yes (${boat.license.licenseType}, #${boat.license.licenseNumber})` : "No"}
Approved: ${boat.isApproved ? "Yes" : "No"}
Available Routes: ${routeText}
Reviews:
${reviewText}
`.trim();

      await this.indexDocument(
        `boat-${boat.id}`,
        0,
        "BOAT",
        boat.id,
        content,
        boat.boatName,
        {
          boatId: boat.id,
          ownerId: boat.ownerId,
          boatType: boat.boatType,
          location: boat.location,
          rating: boat.rating,
          pricePerTrip: boat.pricePerTrip,
          capacity: boat.capacity,
          isApproved: boat.isApproved,
        },
      );
      count++;
    }
    return { message: `${count} boats indexed successfully`, count };
  }

  //  Index all Reviews (User Reviews on Boats)
  async indexReviews() {
    const reviews = await prisma.review.findMany({
      include: { boat: true, user: true },
    });

    let count = 0;
    for (const review of reviews) {
      const content = `
Boat: ${review.boat.boatName}
Location: ${review.boat.location}
Reviewer: ${review.user.name}
Rating: ${review.rating}/5
Comment: ${review.comment || "No comment provided"}
Verified: ${review.isVerified ? "Yes" : "No"}
Date: ${review.createdAt.toISOString().split("T")[0]}
`.trim();

      await this.indexDocument(
        `review-${review.id}`,
        0,
        "REVIEW",
        review.id,
        content,
        `${review.user.name}'s review on ${review.boat.boatName}`,
        {
          reviewId: review.id,
          boatId: review.boatId,
          userId: review.userId,
          rating: review.rating,
          isVerified: review.isVerified,
        },
      );
      count++;
    }
    return { message: `${count} reviews indexed successfully`, count };
  }

  // Index Boat Owners (Users with role BOAT_OWNER)
  async indexOwners() {
    const owners = await prisma.user.findMany({
      where: { role: "BOAT_OWNER", isDeleted: false },
      include: {
        boats: {
          include: { reviews: true },
        },
      },
    });

    let count = 0;
    for (const owner of owners) {
      const boatSummaries = owner.boats.length
        ? owner.boats
          .map(
            (b) =>
              `• ${b.boatName} (${b.boatType}, ${b.location}, $${b.pricePerTrip}/trip, ⭐ ${b.rating})`,
          )
          .join("\n")
        : "No boats listed";

      const totalReviews = owner.boats.reduce(
        (sum, b) => sum + b.reviews.length,
        0,
      );
      const avgRating =
        owner.boats.length > 0
          ? (
            owner.boats.reduce((sum, b) => sum + b.rating, 0) /
            owner.boats.length
          ).toFixed(1)
          : "N/A";

      const content = `
Owner Name: ${owner.name}
Email: ${owner.email}
Status: ${owner.status}
Total Boats: ${owner.boats.length}
Average Boat Rating: ${avgRating}
Total Reviews Across Boats: ${totalReviews}
Boats:
${boatSummaries}
`.trim();

      await this.indexDocument(
        `owner-${owner.id}`,
        0,
        "OWNER",
        owner.id,
        content,
        owner.name,
        {
          ownerId: owner.id,
          totalBoats: owner.boats.length,
          avgRating,
          totalReviews,
        },
      );
      count++;
    }
    return { message: `${count} owners indexed successfully`, count };
  }

  // ─── Index Routes ──────────────────────────────────────────────────
  async indexRoutes() {
    const routes = await prisma.route.findMany({
      include: {
        schedules: {
          include: { boat: true },
        },
      },
    });

    let count = 0;
    for (const route of routes) {
      const boatNames = [
        ...new Set(route.schedules.map((s) => s.boat.boatName)),
      ];

      const content = `
Route Name: ${route.name}
Difficulty: ${route.difficulty}
Duration: ${route.duration}
Distance: ${route.distance}
Scenic Highlights: ${route.scenicHighlights}
Description: ${route.description || "No description"}
Boats on this route: ${boatNames.length > 0 ? boatNames.join(", ") : "No boats currently scheduled"}
Total Schedules: ${route.schedules.length}
`.trim();

      await this.indexDocument(
        `route-${route.id}`,
        0,
        "ROUTE",
        route.id,
        content,
        route.name,
        {
          routeId: route.id,
          difficulty: route.difficulty,
          duration: route.duration,
          distance: route.distance,
          totalSchedules: route.schedules.length,
        },
      );
      count++;
    }
    return { message: `${count} routes indexed successfully`, count };
  }

  // ─── Index Schedules ───────────────────────────────────────────────
  async indexSchedules() {
    const schedules = await prisma.schedule.findMany({
      where: { status: "UPCOMING" },
      include: {
        boat: true,
        route: true,
        user: true,
      },
    });

    let count = 0;
    for (const schedule of schedules) {
      const content = `
Schedule for Boat: ${schedule.boat.boatName}
Route: ${schedule.route.name}
Departure: ${schedule.departureTime}
Arrival: ${schedule.arrivalTime}
Start Date: ${schedule.startDate.toISOString().split("T")[0]}
End Date: ${schedule.endDate ? schedule.endDate.toISOString().split("T")[0] : "Open-ended"}
Available Seats: ${schedule.availableSeats}
Status: ${schedule.status}
Recurring: ${schedule.recurringPattern || "One-time"}
Boat Type: ${schedule.boat.boatType}
Price Per Trip: $${schedule.boat.pricePerTrip}
Location: ${schedule.boat.location}
Route Difficulty: ${schedule.route.difficulty}
Route Duration: ${schedule.route.duration}
`.trim();

      await this.indexDocument(
        `schedule-${schedule.id}`,
        0,
        "SCHEDULE",
        schedule.id,
        content,
        `${schedule.boat.boatName} - ${schedule.route.name}`,
        {
          scheduleId: schedule.id,
          boatId: schedule.boatId,
          routeId: schedule.routeId,
          availableSeats: schedule.availableSeats,
          departureTime: schedule.departureTime,
        },
      );
      count++;
    }
    return { message: `${count} schedules indexed successfully`, count };
  }

  // ─── Index ALL data sources at once ─────────────────────────────────
  async indexAll() {
    const results = {
      boats: await this.indexBoats(),
      reviews: await this.indexReviews(),
      owners: await this.indexOwners(),
      routes: await this.indexRoutes(),
      schedules: await this.indexSchedules(),
    };

    const totalCount = Object.values(results).reduce(
      (sum, r) => sum + r.count,
      0,
    );

    return {
      message: `All data indexed successfully. Total: ${totalCount} documents.`,
      totalCount,
      details: results,
    };
  }

  // ─── Soft-delete embeddings for a given source ─────────────────────
  async removeBySource(sourceType: string, sourceId: string) {
    await prisma.$executeRaw`
      UPDATE "DocumentEmbedding"
      SET "isDeleted" = true, "deletedAt" = NOW(), "updatedAt" = NOW()
      WHERE "sourceType" = ${sourceType}
        AND "sourceId" = ${sourceId}
        AND "isDeleted" = false;
    `;
    return { message: `Embeddings for ${sourceType}:${sourceId} soft-deleted.` };
  }
}