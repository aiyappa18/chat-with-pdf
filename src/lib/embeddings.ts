import { OpenAIApi, Configuration } from 'openai-edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, ' ')
        });

        const result = await response.json();

        if (result.error && result.error.code === 'rate_limit_exceeded') {
            const waitTimeSeconds = 20; // Wait for 20 seconds as indicated in the error message
            console.log(`Rate limit exceeded. Waiting for ${waitTimeSeconds} seconds before retrying...`);
            await new Promise(resolve => setTimeout(resolve, waitTimeSeconds * 1000));
            return getEmbeddings(text); // Retry the request recursively
        } else if (result.data && result.data.length > 0) {
            return result.data[0].embedding as number[];
        } else {
            console.error('No embeddings found in the response:', result);
            throw new Error('No embeddings found in the response');
        }
    } catch (error) {
        console.error('Error calling the OpenAI API:', error);
        throw error;
    }
}
