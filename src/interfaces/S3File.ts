/**
 * Segment properties sent with each event.
 *
 * @todo - Wait for final data source
 */
export interface SegmentProperty {
  source?: string;
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
