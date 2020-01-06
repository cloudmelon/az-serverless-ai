module.exports = async function (context, myQueueItem) {
    context.log('Processing queue message ===>', myQueueItem);
    
    const os = require("os");
    const CognitiveServicesCredentials = require("@azure/ms-rest-js");
    const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
    
    const subscription_key = '20fe8f4cc20243a494c8ada2de44e1b8';
    const endpoint = `https://msmelon-textanalytics.cognitiveservices.azure.com/`;

    const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscription_key } });
    const textAnalyticsClient = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);
    
    async function sentimentAnalysis(client){

        console.log("3. This will perform sentiment analysis on the sentences.");
    
        const sentimentInput = {
            documents: [
                { language: "en", id: "1", text: myQueueItem }
            ]
        };
    
        const sentimentResult = await client.sentiment({
            multiLanguageBatchInput: sentimentInput
        });
        console.log(sentimentResult.documents);
        console.log(os.EOL);
    }
    sentimentAnalysis(textAnalyticsClient);
};