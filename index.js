import { get } from "http";
import { OpenAI } from "openai";
import { exec } from "node:child_process";

const OPENAPI_API_KEY = "add here your openai api key";

const client = new OpenAI({
  apiKey: OPENAPI_API_KEY,
});

function addTwoNumbers(x, y) {
  return x + y;
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    try {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(`Error: ${error.message}`);
        }

        resolve(`stdout: ${stdout}\nstderr: ${stderr}`); // Resolve with stdout
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getWeatherInfo(city) {
  return `${city} has 47 Degree C`;
}

const TOOLS_MAP = {
  getWeatherInfo: getWeatherInfo,
  executeCommand: executeCommand,
};

// const SYSTEM_PROMPT = `
//     You are an helpful AI assistant who is designed to resolve user query. If you think, user query needs tool invocation, just tell me the tool name with parameters.

//     Available tools:
//     - addTwoNumbers(x: number, y: number): returns Number
// `;

const SYSTEM_PROMPT = `
    You are an helpful AI assistant who is designed to resolve user query.
    You work on START, THINK, ACTION, OBSERVE and OUTPUT mode.

    In the START phase, user gives a query to you.
    Then you THINK how to resolve the query at least 3-4 times and make sure that all is clear.
    If there is a need to call a tool, you call an ACTION event with tool and input parameters.
    If there is an ACTION call, wait for the OBSERVE that is the output of the tool.
    Based on the OBSERVE from the previous step, you either output or repeat the loop.

    Rules:
    - Always wait for the next step.
    - Always output a single step and wait for the next step.
    - OUTPUT must be strictly JSON.
    - Only call tool action from available tools only.
    - Strictly follow the output format in JSON.

    Available tools:
    - getWeatherInfo(city: string): returns String
    - executeCommand(command: string): returns String Executes the given linux command on user's device and returns the stdout and stderr.

    Example:
    START: What is the weather in Patiala?
    THINK: The user is asking for the weather in Patiala.
    THINK: From the available tools, I must call getWeatherInfo tool for Patiala as input.
    ACTION: Call tool getWeatherInfo("Patiala")
    OBSERVE: 32 Degree C.
    THINK: The output of getWeatherInfo for Patiala is 32 Degree C.
    OUTPUT: The weather in Patiala is 32 Degree C which is quite hot.

    OUTPUT Example:
    {"role":"user", "content":"What is the weather in Patiala?"}
    {"step":"THINK", "content":"The user is asking for the weather in Patiala."}
    {"step":"THINK", "content":"From the available tools, I must call getWeatherInfo tool for Patiala as input."}
    {"step":"ACTION", "tool":"getWeatherInfo", "input":"Patiala"}
    {"step":"OBSERVE", "content":"32 Degree C."}
    {"step":"THINK", "content":"The output of getWeatherInfo for Patiala is 32 Degree C."}
    {"step":"OUTPUT", "content":"The weather in Patiala is 32 Degree C which is quite hot."}

    OUTPUT Format:
    { "step": "string", "tool": "string", "input": "string", "content": "string"}
`;

// async function init() {
//   const response = await client.chat.completions.create({
//     model: "gpt-4.1-mini",
//     response_format: { type: "json_object" },
//     messages: [
//       { role: "system", content: SYSTEM_PROMPT },
//       {
//         role: "user",
//         content: "what is the weather in Delhi?",
//       },
//       {
//         role: "assistant",
//         content: `{"step":"THINK","content":"The user is asking for the weather in Delhi."}`,
//       },
//       {
//         role: "assistant",
//         content: `{"step":"THINK","content":"From the available tools, I must call getWeatherInfo tool for Delhi as input."}`,
//       },
//       {
//         role: "assistant",
//         content: `{"step":"ACTION","tool":"getWeatherInfo","input":"Delhi"}`,
//       },
//       {
//         role: "assistant",
//         content: `{"step":"OBSERVE","content":"46 Degree C."}`,
//       },
//       {
//         role: "assistant",
//         content: `{"step":"THINK","content":"The output of getWeatherInfo for Delhi is 46 Degree C."}`,
//       },
//     ],
//   });

//   console.log(response.choices[0].message.content);
// }

//const user_query = "What is in my package.json file?";
// const user_query =
//     "Create a todo app folder and todo app with HTML, CSS and JS fully working";

// const user_query =
//     "Create a currency converter app folder and currency converter app with HTML, CSS and JS fully working";

async function init() {
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];

  const user_query =
    "Create a small weather app in HTML, CSS and JS inside a weather_app folder. It must be working and city as a dropdown with Patiala, Delhi, Mohali, Chandigarh.";

  messages.push({ role: "user", content: user_query });
  while (true) {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: messages,
    });
    //console.log({ response });
    messages.push({
      role: "assistant",
      content: response.choices[0].message.content,
    });
    const parsed_response = JSON.parse(response.choices[0].message.content);

    if (parsed_response.step && parsed_response.step === "THINK") {
      console.log(`🧠: ${parsed_response.content}`);
      continue;
    }

    if (parsed_response.step && parsed_response.step === "OUTPUT") {
      console.log(`🤖: ${parsed_response.content}`);
      break;
    }

    if (parsed_response.step && parsed_response.step === "ACTION") {
      const tool_name = parsed_response.tool;
      const tool_input = parsed_response.input;
      console.log(`🔧: Calling tool ${tool_name} with input ${tool_input}`);
      const value = await TOOLS_MAP[tool_name](tool_input);
      console.log(
        `🔧: Calling tool ${tool_name} with input ${tool_input} ${value}`
      );

      messages.push({
        role: "assistant",
        content: JSON.stringify({ step: "OBSERVE", content: value }),
      });
      continue;
    }
  }
}

init();
