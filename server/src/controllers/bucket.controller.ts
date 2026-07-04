import { Request, Response } from 'express';
import { BucketService } from '../services/bucket.service';

export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const ownerId = req.query.ownerId as string | undefined;
      if (!ownerId) {
        res.status(400).json({ error: 'ownerId query parameter is required' });
        return;
      }

      const buckets = await this.bucketService.getUserBuckets(ownerId);
      res.json(buckets);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  get = async (req: Request, res: Response): Promise<void> => {
    try {
      const bucket = await this.bucketService.getBucketById(req.params.id);
      if (!bucket) {
        res.status(404).json({ error: 'Bucket not found' });
        return;
      }

      res.json(bucket);
    } catch {
      res.status(500).json({ error: 'Failed to fetch bucket' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const bucket = await this.bucketService.createBucket(req.body);
      res.status(201).json(bucket);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const bucket = await this.bucketService.updateBucket(req.params.id, req.body);
      if (!bucket) {
        res.status(404).json({ error: 'Bucket not found' });
        return;
      }

      res.json(bucket);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.bucketService.deleteBucket(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Bucket not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
