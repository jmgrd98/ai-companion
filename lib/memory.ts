import { Redis } from '@upstash/redis';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

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

    public async vectorSearch(
        recentChatHistory: string,
        companionFileName: string
    ) {
        const pineconeClient = <PineconeClient<Metadata>>this.vectorDBClient;

        const pineconeIndex = await pineconeClient.createIndex({
            environment: 'us-east1-gcp-free',
            name: process.env.PINECONE_INDEX || '',
            dimension: 128,
        });
        
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            model: 'text-embedding-3-small',
        });

        const vectorStore = await PineconeStore.fromExistingIndex(
            embeddings,
            {
                pineconeIndex,
                maxConcurrency: 5,
                namespace: 'default', // or provide your namespace here
            }
        );

        // Embed the recent chat history to get the query vector
        const queryEmbedding = await embeddings.embedQuery(recentChatHistory);

        // Run the similarity search
        const results = await vectorStore.similaritySearchWithScore(queryEmbedding, 5);

        return results;
    }
}
