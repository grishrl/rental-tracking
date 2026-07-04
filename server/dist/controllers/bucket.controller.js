"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketController = void 0;
class BucketController {
    constructor(bucketService) {
        this.bucketService = bucketService;
        this.getAll = async (req, res) => {
            try {
                const ownerId = req.query.ownerId;
                if (!ownerId) {
                    res.status(400).json({ error: 'ownerId query parameter is required' });
                    return;
                }
                const buckets = await this.bucketService.getUserBuckets(ownerId);
                res.json(buckets);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.get = async (req, res) => {
            try {
                const bucket = await this.bucketService.getBucketById(req.params.id);
                if (!bucket) {
                    res.status(404).json({ error: 'Bucket not found' });
                    return;
                }
                res.json(bucket);
            }
            catch {
                res.status(500).json({ error: 'Failed to fetch bucket' });
            }
        };
        this.create = async (req, res) => {
            try {
                const bucket = await this.bucketService.createBucket(req.body);
                res.status(201).json(bucket);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.update = async (req, res) => {
            try {
                const bucket = await this.bucketService.updateBucket(req.params.id, req.body);
                if (!bucket) {
                    res.status(404).json({ error: 'Bucket not found' });
                    return;
                }
                res.json(bucket);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const deleted = await this.bucketService.deleteBucket(req.params.id);
                if (!deleted) {
                    res.status(404).json({ error: 'Bucket not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }
}
exports.BucketController = BucketController;
//# sourceMappingURL=bucket.controller.js.map