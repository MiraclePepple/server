import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private isConnected = false;

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      this.client = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.client.on('connect', () => {
        this.logger.log('Connected to Redis');
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        this.logger.error('Redis connection error:', error);
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to initialize Redis:', error);
      this.isConnected = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) return null;
    
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<boolean> {
    if (!this.isConnected) return false;
    
    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      this.logger.error(`Redis SET error for key ${key}:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isConnected) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      this.logger.error(`Redis DEL error for key ${key}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) return false;
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Redis invalidate pattern error for ${pattern}:`, error);
    }
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}