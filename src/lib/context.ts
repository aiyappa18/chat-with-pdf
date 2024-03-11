import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

let pinecone: Pinecone | null = null;

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }
    const index = await pinecone.Index("chat-with-pdf-fullstack");
    try {
        const namespace = convertToAscii(fileKey);
        const ns1 = index.namespace(namespace); // Specify the namespace using the namespace method
        const queryOptions = {
            topK: 5,
            vector: embeddings,
            includeMetadata: true,
        };
        const queryResult = await ns1.query(queryOptions); // Use the namespace instance to perform the query
        return queryResult.matches || [];
    } catch(error) {
        console.error(error);
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

    const qualifyingDocs = matches?.filter(
        (match) => match.score && match.score > 0.7
    );

    type MetaData = {
        text: string,
        pageNumber: number
    };

    // Use map function correctly to extract text from metadata
    const docs = qualifyingDocs?.map(match => {
        return (match.metadata as MetaData).text;
    });

    // Concatenate the extracted texts and limit the total length to 3000 characters
    const concatenatedText = docs?.join('\n').substring(0, 3000);
    return concatenatedText;
}
