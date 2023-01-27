import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import axios from "axios";

const apiKey = "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";

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
    res.status(400).send("Missing some field in request body");
  }

  try {
    const generatedText = await generateText(userInput);
    res.status(200).json({
      generatedText: generatedText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @param {string} prompt prompt to send to open ai
 * @return {string}
 */
async function generateText(prompt: string): Promise<string> {
  const data = {
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7, // You can adjust the temperature of the generated text
    max_tokens: 500, // You can adjust the maximum number of tokens
  };

  try {
    const response = await axios.post(
        "https://api.openai.com/v1/completions",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
        }
    );
    return response.data.choices[0].text;
  } catch (err) {
    const e = normalizeError(err);
    console.error(e);
    return e.message;
  }
}

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
