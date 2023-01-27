import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
// import axios from "axios";
import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
  organization: "org-T1GRCkKuvk4HWc4NAngjo9LS",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use("/api/v1", app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.get("/warm", (req, res) => {
  res.send("I am your Sensai :]");
});

// POST a GPT response using tone, user_input, and user_id
app.post("/gpt", async (req, res) => {
  const {userInput, tone} = req.body;

  if (!userInput || !tone) {
    res.status(400).json({
      error: "Missing some field in request body",
    });
  }

  const prompt = tone+" "+userInput;
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
    // const generatedText = await generateText(userInput);
    const response = result.data.choices[0].text;
    res.status(200).json({
      generatedText: response,
    });
  } catch (err) {
    const e = normalizeError(err);
    // console.error(err);
    res.status(500).json({
      error: "Internal Server Error: "+e,
    });
  }
});

/**
 * @param {string} prompt prompt to send to open ai
 * @return {string}
 */
// async function generateText(prompt: string): Promise<string> {
//   const data = {
//     model: "text-davinci-003",
//     prompt: prompt,
//     temperature: 0.7, // You can adjust the temperature of the generated text
//     max_tokens: 500, // You can adjust the maximum number of tokens
//   };

//   try {
//     const response = await axios.post(
//         "https://api.openai.com/v1/completions",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${apiKey}`,
//           },
//         }
//     );
//     return response.data.choices[0].text;
//   } catch (err) {
//     const e = normalizeError(err);
//     console.error(e);
//     return e.message;
//   }
// }

/**
 * @param {any} e
 * @return {string}
 */
function normalizeError(e: any): Error {
  if (e instanceof Error) {
    return e;
  }

  return new Error(typeof e === "string" ? e : e.toString());
}
