import {Configuration, OpenAIApi} from "openai";
import axios from 'axios';

const configuration = new Configuration({
  organization: "org-T1GRCkKuvk4HWc4NAngjo9LS",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

var topic = "sports"

async function getLink() {

  var search_term = await queryGPT()
  var get_link = await getProduct(search_term)

  console.log(get_link)
}

interface Product {
  search_results: Array<SearchResult>,
}

interface SearchResult {
  link: String
}

async function getProduct(search_term: String): Promise<String> {
  // set up the request parameters
  const params = {
    api_key: "AA8F40739D424AC194F00A7617899F30",
    type: "search",
    amazon_domain: "amazon.com",
    search_term: search_term,
    associate_id: "wonmarketing-20",
    page: "1",
    sort_by: "average_review"
  }

  // make the http GET request to ASIN Data API
  axios.get<Product>('https://api.asindataapi.com/request', { params })
  .then(response => {
    var link = response.data.search_results[0].link
    // var json = JSON.stringify(response.data, 0, 2)
      // print the JSON response from ASIN Data API
      // console.log(JSON.stringify(response.data, 0, 2));
    console.log(link)
    return link
    }).catch(error => {
      // catch and print the error
      console.log(error);
      return Promise.reject(error)
  })
  return ""
}


async function queryGPT(): Promise<String> {

  try {
    const config = {
      model: "text-davinci-003",
      prompt: topic,
      temperature: 0.8, // You can adjust the temperature of the generated text
      max_tokens: 256, // You can adjust the maximum number of tokens
      top_p: 1, // alternative to sampling with temperature, called nucleus
      frequency_penalty: 0, // Number between -2.0 and 2.0. Positive values
      presence_penalty: 0,
    };

    const result = await openai.createCompletion(config);
    const response = result.data.choices[0].text;

    console.log(response)
    return response as String
  } catch (err) {
      console.error(err);
      return Promise.reject(err)
  }
}

getLink()