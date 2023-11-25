/** Possible marketing channels */
export type MarketingChannel = 'Affiliates'|'Content Syndication'|'Direct Mail'|'Email'|'Events'|'SEM';

/**
 * Segment properties sent with each event.
 */
export interface SegmentProperty {
  created_date?: string;
  created_month?: number;
  kpi_adjusted?: string;
  sales_territory_country?: string;
  mktg_channel?: MarketingChannel;
  lead_count?: number;
  opp_count?: number;
  aMRR_calc?: string;
}

export default interface S3File {
  /** From Segment */
  event: string;
  /** From Segment */
  properties: SegmentProperty;
  /** From S3 Object */
  path: string;
  /** From S3 Object */
  lastModified: string;
  /** From S3 Object */
  size: string;
  /** From S3 Object */
  storageClass: string;
}
