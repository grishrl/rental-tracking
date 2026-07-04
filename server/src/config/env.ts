import path from 'path';
import dotenv from 'dotenv';

// Load server/.env regardless of where the process is started from.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
