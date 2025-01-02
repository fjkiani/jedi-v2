// src/constants/registry/technologyRegistry.js

// Category Enums
export const TECH_CATEGORIES = {
    AI_ML: "AI & Machine Learning",
    DATABASE: "Databases",
    CLOUD: "Cloud & Infrastructure",
    FRAMEWORKS: "Frameworks & Libraries",
    INTEGRATION: "Integration & APIs",
    MONITORING: "Monitoring & Analytics",
    SECURITY: "Security & Compliance",
    DEVOPS: "DevOps & Deployment"
  };
  

  //machine learning values 


export const technologyRegistry = {
    // AI/ML Technologies
    "langchain": {
      id: "langchain",
      name: "LangChain",
      slug: "langchain",
      icon: {
        type: "LOCAL",
        path: "langchain.png",
        url: null
      },
      category: "AI_ML",
      subcategories: ["FRAMEWORKS", "INTEGRATION"],
      description: "Framework for developing applications powered by language models",
      services: ["LLM Framework", "Agents", "Memory"],
  
      // Detailed Information
      details: {
        primaryUses: ["LLM Framework", "Agents", "Memory"],
        useCases: [
          {
            title: "AI Agents Development",
            description: "Building autonomous AI assistants capable of complex tasks",
            relatedSolution: "ai-agents",
            components: [
              {
                name: "Agent Core",
                tech: ["LangChain", "OpenAI", "Python"],
                role: "Handles agent logic and decision making"
              },
              {
                name: "Memory Module",
                tech: ["Redis", "LangChain"],
                role: "Stores state and context for the AI agent"
              }
            ]
          },
          {
            title: "Conversational Bots",
            description: "Creating chatbots with advanced conversational capabilities",
            relatedSolution: "chatbot",
            components: [
              {
                name: "Dialogue Manager",
                tech: ["LangChain", "Transformers"],
                role: "Manages conversation flow and context"
              }
            ]
          },
          {
            title: "Document Analysis",
            description: "Automating the processing and understanding of large documents",
            relatedSolution: "document-processing",
            components: [
              {
                name: "Document Parser",
                tech: ["LangChain", "NLP Libraries"],
                role: "Extracts and interprets information from documents"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            latency: "200ms average response time",
            throughput: "3000 requests/minute"
          },
          quality: {
            accuracy: "95% task completion rate"
          }
        },
        deployment: {
          cloud: ["AWS Lambda", "Google Cloud Functions"],
          containerization: ["Docker"],
          scaling: ["Serverless", "Container Orchestration"]
        }
      },
  
      // Integration Information
      integration: {
        dependencies: ["OpenAI", "Anthropic Claude"],
        compatibleWith: ["Python", "JavaScript/TypeScript"],
        apis: ["REST", "WebSocket"]
      },
  
      // Documentation & Resources
      resources: {
        documentation: "https://docs.langchain.com",
        github: "https://github.com/langchain-ai/langchain",
        website: "https://langchain.com"
      }
    },
  
    // PyTorch
    "pytorch": {
      id: "pytorch",
      name: "PyTorch",
      slug: "pytorch",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/pytorch"
      },
      category: "AI_ML",
      subcategories: ["DEEP_LEARNING", "FRAMEWORKS"],
      description: "Open-source machine learning library for Python based on Torch",
      services: ["Model Training", "Neural Networks", "Deep Learning"],
  
      details: {
        primaryUses: ["Computer Vision", "Natural Language Processing", "Research"],
        useCases: [
          {
            title: "Image Recognition",
            description: "Developing models to classify images",
            relatedSolution: "image-recognition",
            components: [
              {
                name: "Convolutional Neural Network",
                tech: ["PyTorch"],
                role: "Learns visual features from images"
              }
            ]
          },
          {
            title: "Natural Language Understanding",
            description: "Processing and understanding human language",
            relatedSolution: "nlp",
            components: [
              {
                name: "Transformer Models",
                tech: ["PyTorch", "Hugging Face"],
                role: "Processes textual data for comprehension"
              }
            ]
          },
          {
            title: "Reinforcement Learning",
            description: "Training models that learn from actions",
            relatedSolution: "reinforcement-learning",
            components: [
              {
                name: "Agent",
                tech: ["PyTorch"],
                role: "Interacts with environment to learn optimal policies"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            trainingSpeed: "Optimized with GPU acceleration",
            modelSize: "Flexible model architecture"
          },
          quality: {
            accuracy: "State-of-the-art results in multiple benchmarks"
          }
        },
        deployment: {
          cloud: ["AWS SageMaker", "Azure ML"],
          containerization: ["Docker"],
          scaling: ["Distributed Training", "PyTorch Lightning"]
        }
      },
  
      integration: {
        dependencies: ["NumPy", "CUDA"],
        compatibleWith: ["Python", "C++"],
        apis: ["PyTorch API"]
      },
  
      resources: {
        documentation: "https://pytorch.org/docs/stable/index.html",
        github: "https://github.com/pytorch/pytorch",
        website: "https://pytorch.org"
      }
    },
  
    // Scikit-Learn
    "scikit-learn": {
      id: "scikit-learn",
      name: "Scikit-Learn",
      slug: "scikit-learn",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/scikitlearn"
      },
      category: "AI_ML",
      subcategories: ["MACHINE_LEARNING", "LIBRARIES"],
      description: "Simple and efficient tools for predictive data analysis",
      services: ["Classification", "Regression", "Clustering"],
  
      details: {
        primaryUses: ["Predictive Modeling", "Data Mining", "Data Analysis"],
        useCases: [
          {
            title: "Customer Segmentation",
            description: "Clustering customers based on behavior",
            relatedSolution: "customer-segmentation",
            components: [
              {
                name: "Clustering Model",
                tech: ["Scikit-Learn"],
                role: "Groups customers into segments"
              }
            ]
          },
          {
            title: "Predictive Maintenance",
            description: "Predicting equipment failures",
            relatedSolution: "predictive-maintenance",
            components: [
              {
                name: "Regression Model",
                tech: ["Scikit-Learn"],
                role: "Forecasts when maintenance is needed"
              }
            ]
          },
          {
            title: "Spam Detection",
            description: "Classifying emails as spam or not spam",
            relatedSolution: "spam-detection",
            components: [
              {
                name: "Classification Model",
                tech: ["Scikit-Learn"],
                role: "Identifies spam emails"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            computation: "Efficient algorithms for large datasets",
            scalability: "Suitable for medium-scale data"
          },
          quality: {
            accuracy: "Dependable performance across tasks"
          }
        },
        deployment: {
          cloud: ["AWS", "Azure"],
          containerization: ["Docker"],
          scaling: ["Vertical Scaling"]
        }
      },
  
      integration: {
        dependencies: ["NumPy", "SciPy", "Pandas"],
        compatibleWith: ["Python"],
        apis: ["Scikit-Learn API"]
      },
  
      resources: {
        documentation: "https://scikit-learn.org/stable/",
        github: "https://github.com/scikit-learn/scikit-learn",
        website: "https://scikit-learn.org/"
      }
    },
  
    // Keras
    "keras": {
      id: "keras",
      name: "Keras",
      slug: "keras",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/keras"
      },
      category: "AI_ML",
      subcategories: ["DEEP_LEARNING", "FRAMEWORKS"],
      description: "Deep learning API written in Python, running on top of TensorFlow",
      services: ["Neural Networks", "Model Training", "Deep Learning"],
  
      details: {
        primaryUses: ["Prototyping", "Computer Vision", "NLP"],
        useCases: [
          {
            title: "Handwritten Digit Recognition",
            description: "Classifying handwritten digits",
            relatedSolution: "digit-recognition",
            components: [
              {
                name: "Convolutional Neural Network",
                tech: ["Keras", "TensorFlow"],
                role: "Learns to recognize digits"
              }
            ]
          },
          {
            title: "Text Generation",
            description: "Generating text based on input data",
            relatedSolution: "text-generation",
            components: [
              {
                name: "Recurrent Neural Network",
                tech: ["Keras"],
                role: "Generates sequences of text"
              }
            ]
          },
          {
            title: "Anomaly Detection",
            description: "Identifying unusual patterns in data",
            relatedSolution: "anomaly-detection",
            components: [
              {
                name: "Autoencoder",
                tech: ["Keras"],
                role: "Learns to detect anomalies"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            prototypingSpeed: "Fast model development",
            trainingTime: "Optimized with backend engines"
          },
          quality: {
            userFriendly: "Simple API for quick learning"
          }
        },
        deployment: {
          cloud: ["Google Cloud AI Platform"],
          containerization: ["Docker"],
          scaling: ["TensorFlow Serving", "Cloud Functions"]
        }
      },
  
      integration: {
        dependencies: ["TensorFlow"],
        compatibleWith: ["Python"],
        apis: ["Keras API"]
      },
  
      resources: {
        documentation: "https://keras.io/",
        github: "https://github.com/keras-team/keras",
        website: "https://keras.io/"
      }
    },
  
    // XGBoost
    "xgboost": {
      id: "xgboost",
      name: "XGBoost",
      slug: "xgboost",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/xgboost"
      },
      category: "AI_ML",
      subcategories: ["MACHINE_LEARNING", "LIBRARIES"],
      description: "Optimized distributed gradient boosting library",
      services: ["Classification", "Regression", "Ranking"],
  
      details: {
        primaryUses: ["Regression", "Classification", "Prediction"],
        useCases: [
          {
            title: "House Price Prediction",
            description: "Predicting real estate prices based on features",
            relatedSolution: "price-prediction",
            components: [
              {
                name: "Regression Model",
                tech: ["XGBoost"],
                role: "Estimates property values"
              }
            ]
          },
          {
            title: "Credit Scoring",
            description: "Assessing the creditworthiness of customers",
            relatedSolution: "credit-scoring",
            components: [
              {
                name: "Classification Model",
                tech: ["XGBoost"],
                role: "Predicts likelihood of default"
              }
            ]
          },
          {
            title: "Click-Through Rate Prediction",
            description: "Forecasting ad clicks",
            relatedSolution: "ctr-prediction",
            components: [
              {
                name: "Ranking Model",
                tech: ["XGBoost"],
                role: "Ranks ads based on predicted clicks"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            speed: "Fast training and inference",
            scalability: "Supports distributed computing"
          },
          quality: {
            accuracy: "High predictive performance"
          }
        },
        deployment: {
          cloud: ["AWS EMR", "Azure HDInsight"],
          containerization: ["Docker"],
          scaling: ["Distributed Training"]
        }
      },
  
      integration: {
        dependencies: ["NumPy", "Pandas"],
        compatibleWith: ["Python", "R", "Java", "C++"],
        apis: ["XGBoost API"]
      },
  
      resources: {
        documentation: "https://xgboost.readthedocs.io/en/latest/",
        github: "https://github.com/dmlc/xgboost",
        website: "https://xgboost.ai/"
      }
    },
  
    // OpenCV
    "opencv": {
      id: "opencv",
      name: "OpenCV",
      slug: "opencv",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/opencv"
      },
      category: "AI_ML",
      subcategories: ["COMPUTER_VISION", "LIBRARIES"],
      description: "Open-source computer vision and machine learning software library",
      services: ["Image Processing", "Computer Vision", "Machine Learning"],
  
      details: {
        primaryUses: ["Image Processing", "Video Analysis", "Object Detection"],
        useCases: [
          {
            title: "Face Recognition",
            description: "Identifying or verifying individuals",
            relatedSolution: "face-recognition",
            components: [
              {
                name: "Recognition System",
                tech: ["OpenCV", "Python"],
                role: "Detects and recognizes faces in images"
              }
            ]
          },
          {
            title: "Augmented Reality",
            description: "Overlaying digital content onto the real world",
            relatedSolution: "augmented-reality",
            components: [
              {
                name: "AR Module",
                tech: ["OpenCV", "Unity"],
                role: "Tracks environments and renders content"
              }
            ]
          },
          {
            title: "Motion Detection",
            description: "Detecting movement in video streams",
            relatedSolution: "motion-detection",
            components: [
              {
                name: "Detection Algorithm",
                tech: ["OpenCV"],
                role: "Identifies changes between frames"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            processingSpeed: "Real-time image processing",
            resourceUsage: "Optimized for efficiency"
          },
          quality: {
            robustness: "Reliable in diverse conditions"
          }
        },
        deployment: {
          cloud: ["AWS", "Azure"],
          containerization: ["Docker"],
          scaling: ["Edge Computing", "Distributed Systems"]
        }
      },
  
      integration: {
        dependencies: ["NumPy"],
        compatibleWith: ["C++", "Python", "Java"],
        apis: ["OpenCV API"]
      },
  
      resources: {
        documentation: "https://docs.opencv.org/master/",
        github: "https://github.com/opencv/opencv",
        website: "https://opencv.org/"
      }
    },
  
    // NLTK (Natural Language Toolkit)
    "nltk": {
      id: "nltk",
      name: "NLTK",
      slug: "nltk",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/nltk"
      },
      category: "AI_ML",
      subcategories: ["NLP", "LIBRARIES"],
      description: "Platform for building Python programs to work with human language data",
      services: ["Tokenization", "Stemming", "Corpus Readers"],
  
      details: {
        primaryUses: ["Text Processing", "Linguistic Analysis", "NLP Education"],
        useCases: [
          {
            title: "Text Preprocessing",
            description: "Preparing text data for modeling",
            relatedSolution: "text-preprocessing",
            components: [
              {
                name: "Tokenizer",
                tech: ["NLTK"],
                role: "Splits text into tokens"
              }
            ]
          },
          {
            title: "Part-of-Speech Tagging",
            description: "Identifying grammatical parts of text",
            relatedSolution: "pos-tagging",
            components: [
              {
                name: "Tagger",
                tech: ["NLTK"],
                role: "Assigns POS tags to words"
              }
            ]
          },
          {
            title: "Named Entity Recognition",
            description: "Detecting entities like names and organizations",
            relatedSolution: "ner",
            components: [
              {
                name: "NER Module",
                tech: ["NLTK"],
                role: "Identifies named entities in text"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            processingSpeed: "Suitable for small to medium datasets",
            easeOfUse: "User-friendly interfaces"
          },
          quality: {
            educationalValue: "Widely used for teaching NLP concepts"
          }
        },
        deployment: {
          cloud: ["Local Deployment"],
          containerization: ["Docker"],
          scaling: ["Not typically used for large-scale deployment"]
        }
      },
  
      integration: {
        dependencies: ["Python"],
        compatibleWith: ["Python"],
        apis: ["NLTK API"]
      },
  
      resources: {
        documentation: "https://www.nltk.org/",
        github: "https://github.com/nltk/nltk",
        website: "https://www.nltk.org/"
      }
    },
  
    // SpaCy
    "spacy": {
      id: "spacy",
      name: "spaCy",
      slug: "spacy",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/spacy"
      },
      category: "AI_ML",
      subcategories: ["NLP", "LIBRARIES"],
      description: "Industrial-strength NLP library for advanced Natural Language Processing",
      services: ["Tokenization", "POS Tagging", "NER", "Lemmatization"],
  
      details: {
        primaryUses: ["Text Processing", "Information Extraction", "NER"],
        useCases: [
          {
            title: "Information Extraction",
            description: "Extracting structured information from unstructured text",
            relatedSolution: "information-extraction",
            components: [
              {
                name: "Parser",
                tech: ["spaCy"],
                role: "Analyzes text to extract data"
              }
            ]
          },
          {
            title: "Chatbot Development",
            description: "Processing user input for chatbots",
            relatedSolution: "chatbot-nlp",
            components: [
              {
                name: "Intent Recognizer",
                tech: ["spaCy"],
                role: "Understands user intents"
              }
            ]
          },
          {
            title: "Text Classification",
            description: "Categorizing text into predefined labels",
            relatedSolution: "text-classification",
            components: [
              {
                name: "Classifier",
                tech: ["spaCy"],
                role: "Assigns labels to texts"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            speed: "Fast processing for large volumes",
            scalability: "Suitable for production pipelines"
          },
          quality: {
            accuracy: "High accuracy models"
          }
        },
        deployment: {
          cloud: ["AWS", "Azure"],
          containerization: ["Docker"],
          scaling: ["Microservices", "Batch Processing"]
        }
      },
  
      integration: {
        dependencies: ["Python", "Blis", "Thinc"],
        compatibleWith: ["Python"],
        apis: ["spaCy API"]
      },
  
      resources: {
        documentation: "https://spacy.io/usage",
        github: "https://github.com/explosion/spaCy",
        website: "https://spacy.io/"
      }
    },
  
    // CatBoost
    "catboost": {
      id: "catboost",
      name: "CatBoost",
      slug: "catboost",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/catboost"
      },
      category: "AI_ML",
      subcategories: ["MACHINE_LEARNING", "LIBRARIES"],
      description: "Fast, scalable, high performance gradient boosting on decision trees library",
      services: ["Classification", "Regression"],
  
      details: {
        primaryUses: ["Handling Categorical Data", "Prediction Tasks"],
        useCases: [
          {
            title: "Customer Churn Prediction",
            description: "Predicting if a customer will leave",
            relatedSolution: "churn-prediction",
            components: [
              {
                name: "Churn Model",
                tech: ["CatBoost"],
                role: "Predicts churn probability"
              }
            ]
          },
          {
            title: "Fraud Detection",
            description: "Identifying fraudulent transactions",
            relatedSolution: "fraud-detection",
            components: [
              {
                name: "Fraud Model",
                tech: ["CatBoost"],
                role: "Detects anomalies in transactions"
              }
            ]
          },
          {
            title: "Demand Forecasting",
            description: "Predicting product demand",
            relatedSolution: "demand-forecasting",
            components: [
              {
                name: "Forecasting Model",
                tech: ["CatBoost"],
                role: "Estimates future demand"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            speed: "Fast training even on large datasets",
            handlingOfCategoricalFeatures: "No need for extensive preprocessing"
          },
          quality: {
            accuracy: "Competitive performance with less overfitting"
          }
        },
        deployment: {
          cloud: ["AWS", "Azure"],
          containerization: ["Docker"],
          scaling: ["Distributed Training"]
        }
      },
  
      integration: {
        dependencies: ["NumPy", "Pandas"],
        compatibleWith: ["Python", "R", "C++", "Java"],
        apis: ["CatBoost API"]
      },
  
      resources: {
        documentation: "https://catboost.ai/docs/",
        github: "https://github.com/catboost/catboost",
        website: "https://catboost.ai/"
      }
    },
  
    // TensorFlow
    "tensorflow": {
      id: "tensorflow",
      name: "TensorFlow",
      slug: "tensorflow",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/tensorflow"
      },
      category: "AI_ML",
      subcategories: ["DEEP_LEARNING", "FRAMEWORKS"],
      description: "Open-source machine learning platform with comprehensive ecosystem",
      services: ["Deep Learning", "Neural Networks", "Model Deployment"],
  
      details: {
        primaryUses: ["Machine Learning", "Deep Learning", "Production Deployment"],
        useCases: [
          {
            title: "Image Recognition",
            description: "Building and deploying computer vision models",
            relatedSolution: "computer-vision",
            components: [
              {
                name: "Vision Model",
                tech: ["TensorFlow", "TensorFlow Hub"],
                role: "Processes and analyzes images"
              }
            ]
          },
          {
            title: "Natural Language Processing",
            description: "Text analysis and generation",
            relatedSolution: "nlp",
            components: [
              {
                name: "BERT Model",
                tech: ["TensorFlow", "Transformers"],
                role: "Processes and understands text"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            scalability: "Enterprise-grade scaling",
            deployment: "Multi-platform support"
          },
          quality: {
            ecosystem: "Comprehensive tools and libraries"
          }
        },
        deployment: {
          cloud: ["Google Cloud AI", "AWS SageMaker", "Azure ML"],
          containerization: ["Docker", "Kubernetes"],
          scaling: ["TensorFlow Serving", "TensorFlow Lite"]
        }
      },
  
      integration: {
        dependencies: ["NumPy", "Keras"],
        compatibleWith: ["Python", "JavaScript", "C++", "Java"],
        apis: ["TensorFlow API", "Keras API"]
      },
  
      resources: {
        documentation: "https://www.tensorflow.org/docs",
        github: "https://github.com/tensorflow/tensorflow",
        website: "https://www.tensorflow.org/"
      }
    },
  
    // Hugging Face Transformers
    "huggingface-transformers": {
      id: "huggingface-transformers",
      name: "Hugging Face Transformers",
      slug: "huggingface-transformers",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/huggingface"
      },
      category: "AI_ML",
      subcategories: ["NLP", "DEEP_LEARNING"],
      description: "State-of-the-art Natural Language Processing library",
      services: ["Model Hub", "NLP Pipeline", "Text Generation"],
  
      details: {
        primaryUses: ["Text Processing", "Model Fine-tuning", "Transfer Learning"],
        useCases: [
          {
            title: "Text Classification",
            description: "Sentiment analysis and content categorization",
            relatedSolution: "text-analysis",
            components: [
              {
                name: "BERT Classifier",
                tech: ["Transformers", "PyTorch"],
                role: "Classifies text into categories"
              }
            ]
          },
          {
            title: "Question Answering",
            description: "Automated response generation",
            relatedSolution: "qa-system",
            components: [
              {
                name: "QA Model",
                tech: ["Transformers", "RoBERTa"],
                role: "Processes questions and generates answers"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            accuracy: "State-of-the-art results",
            efficiency: "Optimized inference"
          },
          quality: {
            modelVariety: "Thousands of pre-trained models"
          }
        },
        deployment: {
          cloud: ["Hugging Face Inference API", "AWS", "GCP"],
          containerization: ["Docker"],
          scaling: ["Inference Endpoints", "Model Parallelism"]
        }
      },
  
      integration: {
        dependencies: ["PyTorch", "TensorFlow"],
        compatibleWith: ["Python", "JavaScript"],
        apis: ["Hugging Face API", "Pipeline API"]
      },
  
      resources: {
        documentation: "https://huggingface.co/docs",
        github: "https://github.com/huggingface/transformers",
        website: "https://huggingface.co/"
      }
    },
  
    // FastAI
    "fastai": {
      id: "fastai",
      name: "FastAI",
      slug: "fastai",
      icon: {
        type: "CDN",
        path: null,
        url: "https://cdn.simpleicons.org/fastai"
      },
      category: "AI_ML",
      subcategories: ["DEEP_LEARNING", "FRAMEWORKS"],
      description: "Deep learning library built on PyTorch with simplified training",
      services: ["Computer Vision", "NLP", "Tabular Data"],
  
      details: {
        primaryUses: ["Rapid Prototyping", "Transfer Learning", "Model Training"],
        useCases: [
          {
            title: "Image Classification",
            description: "Training vision models with minimal code",
            relatedSolution: "image-classification",
            components: [
              {
                name: "Vision Learner",
                tech: ["FastAI", "PyTorch"],
                role: "Trains image classification models"
              }
            ]
          },
          {
            title: "Text Analysis",
            description: "NLP tasks with simplified API",
            relatedSolution: "text-analysis",
            components: [
              {
                name: "Text Model",
                tech: ["FastAI", "AWD-LSTM"],
                role: "Processes and analyzes text data"
              }
            ]
          }
        ],
        metrics: {
          performance: {
            trainingSpeed: "Optimized training loops",
            accuracy: "High accuracy with less code"
          },
          quality: {
            usability: "Developer-friendly API"
          }
        },
        deployment: {
          cloud: ["AWS SageMaker", "Google Colab"],
          containerization: ["Docker"],
          scaling: ["Model Export", "ONNX Integration"]
        }
      },
  
      integration: {
        dependencies: ["PyTorch", "NumPy"],
        compatibleWith: ["Python"],
        apis: ["FastAI API"]
      },
  
      resources: {
        documentation: "https://docs.fast.ai",
        github: "https://github.com/fastai/fastai",
        website: "https://www.fast.ai/"
      }
    }
  };
  
  // src/constants/registry/technologyRegistry.js

// Existing helper functions
export const getTechnologyByCategory = (category) => {
    return Object.values(technologyRegistry).filter(
      (tech) =>
        tech.category === category ||
        (tech.subcategories && tech.subcategories.includes(category))
    );
  };
  
  export const getTechnologyIcon = (techId) => {
    const tech = technologyRegistry[techId];
    if (!tech) return null;
  
    return tech.icon.type === "LOCAL"
      ? require(`../../assets/stack/${tech.icon.path}`)
      : tech.icon.url;
  };
  
  // New helper functions
  export const getTechnologyByName = (name) => {
    return Object.values(technologyRegistry).find(
      (tech) => tech.name.toLowerCase() === name.toLowerCase()
    );
  };
  
  export const getTechnologiesForUseCase = (components) => {
    if (!components) return [];
    
    const technologies = new Set();
    
    components.forEach(component => {
      component.tech.forEach(techName => {
        const tech = getTechnologyByName(techName);
        if (tech) {
          technologies.add(tech);
        }
      });
    });
    
    return Array.from(technologies);
  };
  
  export const getRelatedTechnologies = (techId) => {
    const tech = technologyRegistry[techId];
    if (!tech) return [];
    
    return Object.values(technologyRegistry).filter(
      (t) => 
        t.id !== techId && 
        (t.integration.dependencies.includes(tech.name) ||
         tech.integration.dependencies.includes(t.name))
    );
  };
  
  export const getTechnologyDetails = (techId) => {
    const tech = technologyRegistry[techId];
    if (!tech) return null;
  
    return {
      ...tech,
      icon: getTechnologyIcon(techId),
      relatedTechnologies: getRelatedTechnologies(techId),
      primaryUse: tech.details.primaryUses[0],
      mainCategory: tech.category,
      documentationUrl: tech.resources.documentation
    };
  };