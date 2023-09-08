module.exports = async function (context, myQueueItem) {
    context.log('Processing queue message ===>', myQueueItem);
    
    const os = require("os");
    const CognitiveServicesCredentials = require("@azure/ms-rest-js");
    const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
    
    const subscription_key = 'your cog sub id';
    const endpoint = `your cog sub endpoint`;

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
        console.log('documents ==> ', sentimentResult.documents);
  
        var score = sentimentResult.documents[0].score;
        console.log('documents ==> ', score ); 

        sentimentDistribution(myQueueItem, score, context);

    }

    async function sentimentDistribution(myQueueItem, score, context){

       var messageWithScore = JSON.stringify({ 
            originalMessage: myQueueItem,
            score: score
        });

        if (score > 0.8) {
                    context.bindings.positiveFeedbackQueueItem = messageWithScore;
                    console.log ("Positive message arrived");
                   
                } else if (score < 0.3) {
                    context.bindings.negativeFeedbackQueueItem = messageWithScore;
                    console.log ("Negative message arrived");
                } else {
                    context.bindings.neutralFeedbackQueueItem = messageWithScore;
                    console.log("Neutral message arrived");
                }
    }

    sentimentAnalysis(textAnalyticsClient);
};