import { MetricsRow } from "../routes/products.js";

export type HealthStatus = 
    | "healthy"
    | "needs_attention"
    | "critical"
    | "insufficient_data";

export type ProductMetrics = {
    reviewCount: number,
    avgRating: number | null;
    negativePct: number | null;
}

export function computeHealthStatus(productMetrics: ProductMetrics): HealthStatus{
    if(productMetrics.reviewCount < 5) return 'insufficient_data'

    const averageRating = productMetrics.avgRating ?? 0;
    const negativePercent = productMetrics.negativePct ?? 0;

    if (averageRating < 2.5 || negativePercent > 40) return 'critical';
    if (averageRating < 3.5 || negativePercent > 25) return 'needs_attention';

    return 'healthy';
}

function buildProductMetrics(row: MetricsRow | undefined){
    const productMetrics = {
        reviewCount: Number(row?.review_count ?? 0),
        avgRating: row?.avg_rating !== null ? Number(row?.avg_rating) : null,
        negativePct: row?.negative_pct !== null ? Number(row?.negative_pct) : null,
    }

    const healthStatus = computeHealthStatus(productMetrics)
}

export function healthLabel(healthStatus: HealthStatus): string {
    switch (healthStatus) {
        case "critical":
            return "Critical";
        case "needs_attention":
            return "Need Attention";
        case "healthy":
            return "Healthy";
        case "insufficient_data":
            return "Insufficient Data"; 
    }
}