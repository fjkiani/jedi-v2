export const aiMlTechStack = {
    OpenAI: {
      id: "openai",
      image: "https://cdn.worldvectorlogo.com/logos/openai-2.svg",
      name: "OpenAI",
      category: "AI/ML",
      description: "Advanced language models and AI APIs",
      primaryUses: ["Text Generation", "Classification", "Embeddings"],
      useCases: [
        {
          title: "Document Analysis & Summary",
          description: "Automated processing of documents using GPT models",
          relatedSolution: "ai-ml-solutions",
          architecture: {
            components: [
              {
                name: "Document Processor",
                tech: ["GPT-4", "LangChain", "Python"],
                role: "Handles document parsing and understanding",
              },
              {
                name: "Vector Store",
                tech: ["Pinecone", "OpenAI Embeddings"],
                role: "Stores document embeddings for retrieval",
              },
            ],
            workflow: [
              "Document ingestion and chunking",
              "Embedding generation using OpenAI",
              "Vector storage in Pinecone",
              "Query processing and response generation",
            ],
          },
          implementation: {
            steps: [
              "Document text extraction using OCR and GPT-4 Vision",
              "Content analysis with custom GPT-4 prompts",
              "Key information extraction using structured output",
              "Dynamic summary generation based on context",
            ],
            benefits: [
              "80% faster document processing",
              "95% accuracy in key info extraction",
              "Consistent summary quality across document types",
            ],
            metrics: {
              speed: "Process 100-page document in 2 minutes",
              accuracy: "95% accuracy in key information extraction",
              scalability: "Handle 10,000+ documents daily",
            },
          },
        },
      ],
      deploymentOptions: {
        cloud: ["AWS", "Azure", "GCP"],
        containerization: ["Docker", "Kubernetes"],
        scaling: ["Horizontal Pod Autoscaling", "Load Balancing"],
      },
      benchmarks: {
        performance: {
          latency: {
            value: 200,
            unit: "ms",
            context: "Average response time for GPT-4 standard requests",
          },
          throughput: {
            value: 3000,
            unit: "requests/minute",
            context: "Maximum API requests per minute",
          },
          maxContext: {
            value: 8192,
            unit: "tokens",
            context: "Maximum input context window",
          },
        },
        costs: {
          inputCost: {
            value: 0.01,
            unit: "USD/1K tokens",
            context: "Cost per 1,000 input tokens",
          },
          outputCost: {
            value: 0.03,
            unit: "USD/1K tokens",
            context: "Cost per 1,000 output tokens",
          },
        },
        quality: {
          accuracy: {
            value: 95.2,
            unit: "percent",
            context: "Task completion accuracy across standard benchmarks",
          },
          hallucination: {
            value: 3.1,
            unit: "percent",
            context: "Rate of factual hallucinations",
          },
        },
      },
    },
    LangChain: {
      id: "langchain",
      image: "https://raw.githubusercontent.com/langchain-ai/langchain/master/docs/static/img/langchain_icon.png",
      name: "LangChain",
      category: "AI/ML",
      description: "Framework for building LLM applications",
      primaryUses: ["LLM Framework", "Agents", "Memory"],
      useCases: [
        {
          title: "AI Agents Development",
          description: "Building autonomous AI assistants",
          relatedSolution: "ai-agents",
          architecture: {
            components: [
              {
                name: "Agent Core",
                tech: ["LangChain", "OpenAI", "Python"],
                role: "Handles agent logic and decision making",
              },
              {
                name: "Memory System",
                tech: ["Redis", "PostgreSQL"],
                role: "Maintains conversation context and history",
              },
            ],
            workflow: [
              "User input processing",
              "Context retrieval from memory",
              "Tool selection and execution",
              "Response generation and memory update",
            ],
          },
        },
      ],
      deploymentOptions: {
        cloud: ["AWS Lambda", "Google Cloud Functions"],
        containerization: ["Docker"],
        scaling: ["Serverless", "Container Orchestration"],
      },
    },
    HuggingFace: {
      id: "huggingface",
      image: "https://huggingface.co/front/assets/huggingface_logo.svg",
      name: "Hugging Face",
      category: "AI/ML",
      description: "Open-source ML model hub and tools",
      primaryUses: ["Model Hub", "Transformers", "NLP"],
      useCases: [
        {
          title: "Custom Model Training",
          description: "Training and deploying specialized ML models",
          relatedSolution: "ai-ml-solutions",
          architecture: {
            components: [
              {
                name: "Model Training Pipeline",
                tech: ["Transformers", "PyTorch", "TensorFlow"],
                role: "Handles model training and optimization",
              },
              {
                name: "Model Registry",
                tech: ["Hugging Face Hub", "Git LFS"],
                role: "Stores and versions trained models",
              },
            ],
            workflow: [
              "Dataset preparation and preprocessing",
              "Model selection and configuration",
              "Training and validation",
              "Model optimization and deployment",
            ],
          },
        },
      ],
      deploymentOptions: {
        cloud: ["Hugging Face Inference API", "Custom Deployment"],
        containerization: ["Docker"],
        scaling: ["Kubernetes", "Cloud Run"],
      },
    },
  };
  