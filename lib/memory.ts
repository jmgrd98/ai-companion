import { Redis } from '@upstash/redis';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeClient } from 'pinecone-client';

export type CompanionKey = {
    companionName: string;
    modelName: string;
    userId: string;
};
export type Metadata = {
    [key: string]: any;
  };
export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: PineconeClient<Metadata>;

    public constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = new PineconeClient<Metadata>({
            apiKey: process.env.PINECONE_API_KEY,
        });
    }

    
}