import {Configuration, OpenAIApi} from "openai";


const configuration = new Configuration({
  organization: "org-T1GRCkKuvk4HWc4NAngjo9LS",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

var topic = "sports"

function getLink() {
  queryGPT()
}

async function queryGPT() {

  try {
    const config = {
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7, // You can adjust the temperature of the generated text
      max_tokens: 256, // You can adjust the maximum number of tokens
      top_p: 1, // alternative to sampling with temperature, called nucleus
      frequency_penalty: 0, // Number between -2.0 and 2.0. Positive values
      presence_penalty: 0,
    };

    const result = await openai.createCompletion(config);
    const response = result.data.choices[0].text;

    console.log(response)

    return response
  } catch (err) {
      console.error(err);
  }
}

getLink()