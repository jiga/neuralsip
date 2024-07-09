# NeuralSIP

NeuralSIP is an AI-powered SIP (Stacks Improvement Proposal) review system for the Stacks blockchain.

## Features

- AI-assisted review of SIP proposals
- Evaluation of SIP structure, originality, and appropriateness
- Suggestion of additional considerations
- Detailed feedback on SIP content

## Live Demo

Check out the live demo at [https://neuralsip.j2p2.workers.dev/](https://neuralsip.j2p2.workers.dev/)

## Getting Started

### Prerequisites

- Node.js
- npm
- Cloudflare Workers account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Configuration

1. Set up your OpenAI API key in the Cloudflare Workers environment variables:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Running the Application

To run the application locally:

1. Install Wrangler CLI:
   ```
   npm install -g wrangler
   ```

2. Start the development server:
   ```
   wrangler dev
   ```

3. Open your browser and navigate to the local address provided by Wrangler.

## Deployment

To deploy to Cloudflare Workers:

1. Authenticate with Cloudflare:
   ```
   wrangler login
   ```

2. Deploy the worker:
   ```
   wrangler publish
   ```

## Usage

1. Access the web interface
2. Submit a SIP proposal for review
3. Receive AI-generated feedback on the proposal

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
