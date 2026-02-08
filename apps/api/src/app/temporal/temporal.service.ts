import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, Connection } from '@temporalio/client';

@Injectable()
export class TemporalService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private connection: Connection;

  async onModuleInit() {
    this.connection = await Connection.connect({
      address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    });
    this.client = new Client({
      connection: this.connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    });
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  getClient(): Client {
    return this.client;
  }
}
