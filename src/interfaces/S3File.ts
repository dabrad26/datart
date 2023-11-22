/**
 * Segment properties sent with each event.
 */
export interface SegmentProperty {
  source_and_segment?: string;
  region_adj?: string;
  hills_adj?: string;
  segment_group?: string;
  channel_adj?: string;
  dfr_id?: string;
  segment_name?: string;
  sales_territory_country?: string;
  lead_source?: string;
  high_level_lead_source?: string;
  created_month?: string;
  created_date?: string;
  rtlm_channel?: string;
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
