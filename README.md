# My Cursor - AI Assistant with Tool Integration

A Node.js application that implements an AI assistant with a structured conversation flow using OpenAI's GPT model. The assistant can execute system commands and provide weather information through a tool-based architecture.

## Features

- 🧠 **Structured AI Conversation Flow**: Implements START → THINK → ACTION → OBSERVE → OUTPUT pattern
- 🤖 **Tool Integration**: Supports multiple tools including weather info and command execution
- ⚡ **Real-time Processing**: Asynchronous handling of AI responses and tool execution
- 🔧 **Extensible Architecture**: Easy to add new tools and capabilities

## Available Tools

- **getWeatherInfo(city)**: Get weather information for a specified city
- **executeCommand(command)**: Execute system commands and return stdout/stderr

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-cursor
```

2. Install dependencies:
```bash
npm install
```

3. Configure your OpenAI API key:
   - Open `index.js`
   - Replace `"add here your openai api key"` with your actual OpenAI API key

## Usage

Run the application:
```bash
node index.js
```

The application will:
1. Start with a predefined user query
2. Process the query through the AI assistant
3. Execute any required tools
4. Display the conversation flow with emojis:
   - 🧠 for THINK steps
   - 🤖 for OUTPUT responses
   - 🔧 for tool executions

## Example Conversation Flow

```
🧠: The user is asking for weather information in Delhi.
🧠: I need to use the getWeatherInfo tool with Delhi as input.
🔧: Calling tool getWeatherInfo with input Delhi
🔧: Calling tool getWeatherInfo with input Delhi 46 Degree C
🧠: The weather information has been retrieved successfully.
🤖: The weather in Delhi is 46 Degree C, which is quite hot.
```

## Configuration

### System Prompt
The AI assistant is configured with a specific system prompt that defines:
- Conversation flow structure
- Available tools and their parameters
- Output format requirements
- JSON response structure

### Adding New Tools
To add a new tool:

1. Create the tool function:
```javascript
function newTool(parameter) {
  // Your tool logic here
  return result;
}
```

2. Add it to the TOOLS_MAP:
```javascript
const TOOLS_MAP = {
  getWeatherInfo: getWeatherInfo,
  executeCommand: executeCommand,
  newTool: newTool, // Add your new tool here
};
```

3. Update the system prompt to include the new tool description.

## Dependencies

- **openai**: ^6.3.0 - Official OpenAI API client
- **node:child_process**: Built-in Node.js module for executing system commands
- **http**: Built-in Node.js module for HTTP operations

## Project Structure

```
my-cursor/
├── index.js          # Main application file
├── package.json      # Project configuration and dependencies
└── README.md         # Project documentation
```

## API Response Format

The AI assistant responds in JSON format with the following structure:
```json
{
  "step": "THINK|ACTION|OBSERVE|OUTPUT",
  "tool": "toolName",
  "input": "toolInput",
  "content": "responseContent"
}
```

## Security Notes

- Keep your OpenAI API key secure and never commit it to version control
- Be cautious with the `executeCommand` tool as it can run any system command
- Consider implementing input validation and sanitization for production use

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please open an issue in the repository or contact the maintainer.