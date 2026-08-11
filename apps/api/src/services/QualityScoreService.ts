export class QualityScoreService {
  /**
   * Calculates confidence-weighted Resource Quality Score (0–100)
   */
  public static calculateRQS(params: {
    averageRating: number;
    ratingsCount: number;
    downloadsCount: number;
    bookmarksCount: number;
    reportsCount?: number;
    createdAt?: Date;
  }): number {
    const {
      averageRating = 0,
      ratingsCount = 0,
      downloadsCount = 0,
      bookmarksCount = 0,
      reportsCount = 0,
    } = params;

    // 1. Bayesian Weighted Star Score (Prior: C = 3.5, Minimum votes weight m = 5)
    const m = 5;
    const C = 3.5;
    const bayesianRating =
      ratingsCount > 0
        ? (ratingsCount * averageRating + m * C) / (ratingsCount + m)
        : C;

    // Convert Bayesian rating (1–5) to 0–50 scale
    const ratingComponent = ((bayesianRating - 1) / 4) * 50;

    // 2. Download Volume Component (0–30 scale, logarithmic)
    const downloadComponent = Math.min(30, Math.log10(downloadsCount + 1) * 12);

    // 3. Bookmarks Engagement Component (0–20 scale)
    const bookmarkComponent = Math.min(20, bookmarksCount * 2);

    // 4. Report Penalty
    const reportPenalty = (reportsCount || 0) * 15;

    const totalRQS = Math.round(
      Math.max(0, Math.min(100, ratingComponent + downloadComponent + bookmarkComponent - reportPenalty))
    );

    return totalRQS;
  }
}
