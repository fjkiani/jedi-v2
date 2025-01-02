export const fullStackSolution = {
  // Basic information
  id: "1",
  title: "Full Stack Development",
  shortTitle: "Full Stack",
  slug: "full-stack-development",
  description: "Modern, scalable web and mobile application architecture with end-to-end development capabilities.",
  imageUrl: "/images/solutions/full-stack.jpg",
  icon: "code",
  categories: ["Web Development", "Mobile Development", "Cloud Computing", "Microservices", "DevOps"],

  // Business value proposition
  businessValue: {
    metrics: [
      "Accelerate development cycles by up to 50% with efficient frameworks.",
      "Scale seamlessly from startup to enterprise-level traffic.",
      "Enhance user engagement with optimized user experience, leading to a 40% increase in user retention.",
      "Achieve real-time data synchronization with latency under 100ms.",
      "Reduce operational costs by 30% through cloud-native solutions.",
      "Improve application reliability with 99.99% uptime."
    ],
    capabilities: [
      "Responsive and accessible cross-platform interfaces (web and mobile).",
      "Real-time data updates using WebSockets and push notifications.",
      "Secure authentication & authorization with multi-factor and single sign-on (SSO).",
      "Automated testing, continuous integration, and continuous deployment (CI/CD).",
      "Microservices architecture for modular scalability.",
      "Internationalization and localization support."
    ],
    useCases: [
      "E-commerce Platform with global reach",
      "Social Media Application with real-time interactions",
      "Enterprise Dashboard for analytics and reporting",
      "Collaboration Tools for remote teams",
      "Healthcare Management System",
      "FinTech Applications with secure transactions",
      "Educational Platforms with interactive learning",
      "Travel and Booking Platforms",
      "Content Management Systems",
      "Streaming Services with high concurrency"
    ]
  },

  // Architecture diagram configuration
  architecture: {
    title: "Full-Stack Web and Mobile Application Architecture",
    description: "Scalable, resilient, and high-performance full-stack architecture utilizing modern technologies and best practices.",
    layout: {
      type: "horizontal",
      spacing: { x: 300, y: 200 },
      startPosition: { x: 100, y: 80 }
    },
    nodes: [
      {
        id: 'client_app',
        label: 'Client Applications',
        x: 100,
        y: 80,
        description: 'User interfaces on various devices.',
        technologies: {
          web: ["React", "Angular", "Vue.js", "Next.js"],
          mobile: ["React Native", "Flutter", "Ionic"],
          desktop: ["Electron"],
          styling: ["TailwindCSS", "Bootstrap"],
          stateManagement: ["Redux", "MobX", "Vuex"],
          testing: ["Jest", "React Testing Library"]
        }
      },
      {
        id: 'api_gateway',
        label: 'API Gateway',
        x: 450,
        y: 80,
        description: 'Unified entry point for all client requests.',
        technologies: {
          gateways: ["AWS API Gateway", "Kong", "NGINX"],
          protocols: ["REST", "GraphQL", "gRPC"],
          security: ["OAuth2", "JWT", "API Keys"],
          rateLimiting: ["AWS WAF", "Rate-limiter"],
          caching: ["CloudFront", "Varnish Cache"]
        }
      },
      {
        id: 'microservices',
        label: 'Backend Microservices',
        x: 800,
        y: 80,
        description: 'Modular services handling business logic.',
        technologies: {
          languages: ["Node.js", "Java (Spring Boot)", "Python (Django, Flask)", "Go"],
          frameworks: ["Express.js", "NestJS", "Koa.js", "Hapi.js"],
          containerization: ["Docker", "Kubernetes"],
          communication: ["REST", "GraphQL", "AMQP (RabbitMQ)"],
          testing: ["Mocha", "Chai", "JUnit", "PyTest"]
        }
      },
      {
        id: 'databases',
        label: 'Databases',
        x: 1150,
        y: 80,
        description: 'Data storage solutions.',
        technologies: {
          relational: ["PostgreSQL", "MySQL", "Microsoft SQL Server"],
          noSQL: ["MongoDB", "Cassandra", "DynamoDB"],
          timeSeries: ["InfluxDB", "TimescaleDB"],
          graph: ["Neo4j"],
          ORM: ["Prisma", "TypeORM", "Sequelize", "Entity Framework"],
          dataWarehousing: ["Snowflake", "Amazon Redshift"]
        }
      },
      {
        id: 'message_queue',
        label: 'Message Queues',
        x: 800,
        y: 300,
        description: 'Asynchronous communication between services.',
        technologies: {
          queues: ["RabbitMQ", "Apache Kafka", "AWS SQS"],
          streaming: ["Kafka Streams", "Amazon Kinesis"],
          eventBus: ["EventBridge", "Azure Service Bus"]
        }
      },
      {
        id: 'authentication',
        label: 'Authentication & Authorization',
        x: 450,
        y: 300,
        description: 'Security layer managing user access.',
        technologies: {
          identityProviders: ["Auth0", "Okta", "Firebase Auth"],
          protocols: ["OAuth2.0", "OpenID Connect", "SAML"],
          MFA: ["Google Authenticator", "SMS Verification"],
          RBAC: ["Role-Based Access Control", "Attribute-Based Access Control"]
        }
      },
      {
        id: 'devops_tools',
        label: 'DevOps & Infrastructure',
        x: 1150,
        y: 300,
        description: 'Tools for deployment and infrastructure management.',
        technologies: {
          ciCd: ["GitHub Actions", "Jenkins", "GitLab CI/CD", "CircleCI", "Travis CI"],
          infrastructureAsCode: ["Terraform", "AWS CloudFormation", "Pulumi"],
          monitoring: ["Prometheus", "Grafana", "Datadog", "New Relic"],
          logging: ["ELK Stack (Elasticsearch, Logstash, Kibana)", "Splunk"],
          containerOrchestration: ["Kubernetes", "Docker Swarm"],
          featureFlags: ["LaunchDarkly", "FeatureHub"]
        }
      },
      {
        id: 'cdn_assets',
        label: 'CDN & Static Assets',
        x: 450,
        y: 520,
        description: 'Content delivery network for assets.',
        technologies: {
          cdn: ["Cloudflare CDN", "Akamai", "Amazon CloudFront"],
          storage: ["AWS S3", "Google Cloud Storage", "Azure Blob Storage"],
          imageOptimization: ["ImageKit", "Cloudinary", "imgix"]
        }
      },
      {
        id: 'testing',
        label: 'Testing & Quality Assurance',
        x: 800,
        y: 520,
        description: 'Ensuring code quality and reliability.',
        technologies: {
          unitTesting: ["Jest", "Mocha", "JUnit"],
          integrationTesting: ["Selenium", "Cypress", "Puppeteer"],
          performanceTesting: ["JMeter", "Gatling", "Locust"],
          staticAnalysis: ["ESLint", "SonarQube", "Prettier"],
          securityTesting: ["OWASP ZAP", "Burp Suite"]
        }
      },
      {
        id: 'third_party_services',
        label: 'Third-party Services',
        x: 1150,
        y: 520,
        description: 'External services integrations.',
        technologies: {
          payments: ["Stripe", "PayPal", "Square"],
          communications: ["Twilio", "SendGrid", "Mailgun"],
          analytics: ["Google Analytics", "Mixpanel"],
          maps: ["Google Maps API", "Mapbox"],
          socialAuth: ["Facebook Login", "Google Sign-In"]
        }
      }
    ],
    connections: [
      {
        from: 'client_app',
        to: 'api_gateway',
        label: 'HTTP Requests'
      },
      {
        from: 'api_gateway',
        to: 'authentication',
        label: 'Auth Checks'
      },
      {
        from: 'api_gateway',
        to: 'microservices',
        label: 'Service Calls'
      },
      {
        from: 'microservices',
        to: 'databases',
        label: 'Database Queries'
      },
      {
        from: 'microservices',
        to: 'message_queue',
        label: 'Async Messaging'
      },
      {
        from: 'message_queue',
        to: 'microservices',
        label: 'Event Processing'
      },
      {
        from: 'microservices',
        to: 'devops_tools',
        label: 'Metrics & Logs'
      },
      {
        from: 'devops_tools',
        to: 'testing',
        label: 'Deployment & Testing'
      },
      {
        from: 'client_app',
        to: 'cdn_assets',
        label: 'Asset Requests'
      },
      {
        from: 'microservices',
        to: 'third_party_services',
        label: 'External API Calls'
      }
    ]
  },

  // Tech stack details
  techStack: {
    frontend: {
      'React': {
        icon: 'https://cdn.simpleicons.org/react',
        description: 'Component-based UI library for building interactive user interfaces.',
        category: 'Frontend',
        priority: 1
      },
      'Angular': {
        icon: 'https://cdn.simpleicons.org/angular',
        description: 'Platform for building mobile and desktop web applications.',
        category: 'Frontend',
        priority: 2
      },
      'Vue.js': {
        icon: 'https://cdn.simpleicons.org/vue-dot-js',
        description: 'Progressive framework for building user interfaces.',
        category: 'Frontend',
        priority: 3
      },
      'Next.js': {
        icon: 'https://cdn.simpleicons.org/next-dot-js',
        description: 'React framework with server-side rendering and static site generation.',
        category: 'Frontend',
        priority: 4
      }
    },
    mobile: {
      'React Native': {
        icon: 'https://cdn.simpleicons.org/react',
        description: 'Framework for building native apps using React.',
        category: 'Mobile',
        priority: 1
      },
      'Flutter': {
        icon: 'https://cdn.simpleicons.org/flutter',
        description: 'UI toolkit for building natively compiled applications.',
        category: 'Mobile',
        priority: 2
      },
      'Ionic': {
        icon: 'https://cdn.simpleicons.org/ionic',
        description: 'Framework for building hybrid mobile apps.',
        category: 'Mobile',
        priority: 3
      }
    },
    backend: {
      'Node.js': {
        icon: 'https://cdn.simpleicons.org/node-dot-js',
        description: 'JavaScript runtime built on Chrome\'s V8 engine.',
        category: 'Backend',
        priority: 1
      },
      'Express.js': {
        icon: 'https://cdn.simpleicons.org/express',
        description: 'Fast, unopinionated, minimalist web framework for Node.js.',
        category: 'Backend',
        priority: 2
      },
      'NestJS': {
        icon: 'https://cdn.simpleicons.org/nestjs',
        description: 'Progressive Node.js framework for building efficient, reliable, and scalable server-side applications.',
        category: 'Backend',
        priority: 3
      },
      'Spring Boot': {
        icon: 'https://cdn.simpleicons.org/spring',
        description: 'Framework for building production-ready Java applications.',
        category: 'Backend',
        priority: 4
      },
      'Django': {
        icon: 'https://cdn.simpleicons.org/django',
        description: 'High-level Python Web framework.',
        category: 'Backend',
        priority: 5
      },
      'Go (Golang)': {
        icon: 'https://cdn.simpleicons.org/go',
        description: 'Open-source programming language that makes it easy to build simple, reliable, and efficient software.',
        category: 'Backend',
        priority: 6
      }
    },
    databases: {
      'PostgreSQL': {
        icon: 'https://cdn.simpleicons.org/postgresql',
        description: 'Advanced open-source relational database.',
        category: 'Database',
        priority: 1
      },
      'MySQL': {
        icon: 'https://cdn.simpleicons.org/mysql',
        description: 'Open-source relational database management system.',
        category: 'Database',
        priority: 2
      },
      'MongoDB': {
        icon: 'https://cdn.simpleicons.org/mongodb',
        description: 'Document-oriented NoSQL database.',
        category: 'Database',
        priority: 3
      },
      'Redis': {
        icon: 'https://cdn.simpleicons.org/redis',
        description: 'In-memory data structure store, used as a database, cache, and message broker.',
        category: 'Caching',
        priority: 1
      },
      'Elasticsearch': {
        icon: 'https://cdn.simpleicons.org/elasticsearch',
        description: 'Search and analytics engine.',
        category: 'Search',
        priority: 1
      }
    },
    authentication: {
      'Auth0': {
        icon: 'https://cdn.simpleicons.org/auth0',
        description: 'Universal authentication & authorization platform.',
        category: 'Authentication',
        priority: 1
      },
      'Okta': {
        icon: 'https://cdn.simpleicons.org/okta',
        description: 'Enterprise-grade identity management service.',
        category: 'Authentication',
        priority: 2
      },
      'Firebase Auth': {
        icon: 'https://cdn.simpleicons.org/firebase',
        description: 'Backend services for authentication, customizable UI, and more.',
        category: 'Authentication',
        priority: 3
      }
    },
    devOps: {
      'Docker': {
        icon: 'https://cdn.simpleicons.org/docker',
        description: 'Platform to build, run, and share applications with containers.',
        category: 'DevOps',
        priority: 1
      },
      'Kubernetes': {
        icon: 'https://cdn.simpleicons.org/kubernetes',
        description: 'Automate deploying, scaling, and managing containerized applications.',
        category: 'DevOps',
        priority: 2
      },
      'Terraform': {
        icon: 'https://cdn.simpleicons.org/terraform',
        description: 'Infrastructure as code software tool.',
        category: 'DevOps',
        priority: 3
      },
      'GitHub Actions': {
        icon: 'https://cdn.simpleicons.org/githubactions',
        description: 'Automate your workflow from idea to production.',
        category: 'CI/CD',
        priority: 1
      },
      'Jenkins': {
        icon: 'https://cdn.simpleicons.org/jenkins',
        description: 'Open-source automation server for CI/CD.',
        category: 'CI/CD',
        priority: 2
      }
    },
    monitoring: {
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'Monitoring system and time series database.',
        category: 'Monitoring',
        priority: 1
      },
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Visualization and analytics platform.',
        category: 'Monitoring',
        priority: 2
      },
      'New Relic': {
        icon: 'https://cdn.simpleicons.org/newrelic',
        description: 'Application performance monitoring.',
        category: 'Monitoring',
        priority: 3
      },
      'Sentry': {
        icon: 'https://cdn.simpleicons.org/sentry',
        description: 'Error tracking and performance monitoring.',
        category: 'Monitoring',
        priority: 4
      }
    },
    messaging: {
      'RabbitMQ': {
        icon: 'https://cdn.simpleicons.org/rabbitmq',
        description: 'Open-source message broker software.',
        category: 'Messaging',
        priority: 1
      },
      'Apache Kafka': {
        icon: 'https://cdn.simpleicons.org/apachekafka',
        description: 'Distributed event streaming platform.',
        category: 'Messaging',
        priority: 2
      },
      'AWS SQS': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Fully managed message queuing service.',
        category: 'Messaging',
        priority: 3
      }
    },
    testing: {
      'Jest': {
        icon: 'https://cdn.simpleicons.org/jest',
        description: 'JavaScript Testing Framework.',
        category: 'Testing',
        priority: 1
      },
      'Cypress': {
        icon: 'https://cdn.simpleicons.org/cypress',
        description: 'End-to-end testing framework.',
        category: 'Testing',
        priority: 2
      },
      'Selenium': {
        icon: 'https://cdn.simpleicons.org/selenium',
        description: 'Automated testing across different browsers.',
        category: 'Testing',
        priority: 3
      },
      'SonarQube': {
        icon: 'https://cdn.simpleicons.org/sonarqube',
        description: 'Continuous inspection of code quality.',
        category: 'Testing',
        priority: 4
      }
    },
    cdnAssets: {
      'Cloudflare': {
        icon: 'https://cdn.simpleicons.org/cloudflare',
        description: 'CDN and DDoS mitigation.',
        category: 'CDN',
        priority: 1
      },
      'Amazon CloudFront': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Fast content delivery network (CDN) service.',
        category: 'CDN',
        priority: 2
      },
      'ImageKit': {
        icon: 'https://cdn.simpleicons.org/imagekit',
        description: 'Image optimization and transformation.',
        category: 'Assets',
        priority: 1
      },
      'Cloudinary': {
        icon: 'https://cdn.simpleicons.org/cloudinary',
        description: 'Media management platform for images and videos.',
        category: 'Assets',
        priority: 2
      }
    },
    thirdPartyServices: {
      'Stripe': {
        icon: 'https://cdn.simpleicons.org/stripe',
        description: 'Online payment processing.',
        category: 'Payments',
        priority: 1
      },
      'Twilio': {
        icon: 'https://cdn.simpleicons.org/twilio',
        description: 'Cloud communications platform for messaging and voice calls.',
        category: 'Communications',
        priority: 1
      },
      'SendGrid': {
        icon: 'https://cdn.simpleicons.org/sendgrid',
        description: 'Email delivery and management service.',
        category: 'Communications',
        priority: 2
      },
      'Google Analytics': {
        icon: 'https://cdn.simpleicons.org/googleanalytics',
        description: 'Web analytics service.',
        category: 'Analytics',
        priority: 1
      },
      'Mapbox': {
        icon: 'https://cdn.simpleicons.org/mapbox',
        description: 'Maps and location data platform.',
        category: 'Maps',
        priority: 1
      }
    }
  },

  // Deployment configuration
  deployment: {
    environments: [
      {
        name: 'Development',
        icon: 'https://cdn.simpleicons.org/visualstudiocode',
        description: 'Local development environment with hot-reloading.',
        tools: ["Docker Compose", "Local Kubernetes", "Mock Services"]
      },
      {
        name: 'Testing',
        icon: 'https://cdn.simpleicons.org/testinglibrary',
        description: 'Continuous integration environment for automated testing.',
        tools: ["CI Pipelines", "Test Suites", "Code Analysis"]
      },
      {
        name: 'Staging',
        icon: 'https://cdn.simpleicons.org/heroku',
        description: 'Pre-production environment mirroring production.',
        tools: ["Automated Deployments", "QA Testing", "User Acceptance Testing"]
      },
      {
        name: 'Production',
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Live production environment serving end-users.',
        tools: ["Auto-Scaling Groups", "Load Balancing", "Monitoring & Alerting"]
      },
      {
        name: 'Disaster Recovery',
        icon: 'https://cdn.simpleicons.org/evergreen',
        description: 'Redundant environment for high availability.',
        tools: ["Multi-region Deployment", "Data Backups", "Failover Strategies"]
      }
    ],
    monitoring: {
      'Prometheus': {
        icon: 'https://cdn.simpleicons.org/prometheus',
        description: 'System monitoring and alerting toolkit.'
      },
      'Grafana': {
        icon: 'https://cdn.simpleicons.org/grafana',
        description: 'Visualization and analytics platform.'
      },
      'New Relic': {
        icon: 'https://cdn.simpleicons.org/newrelic',
        description: 'Application performance monitoring.'
      },
      'Sentry': {
        icon: 'https://cdn.simpleicons.org/sentry',
        description: 'Error tracking and performance monitoring.'
      },
      'Datadog': {
        icon: 'https://cdn.simpleicons.org/datadog',
        description: 'Monitoring service for cloud-scale applications.'
      }
    },
    security: {
      'Cloudflare': {
        icon: 'https://cdn.simpleicons.org/cloudflare',
        description: 'Web application firewall, DDoS protection, and CDN.'
      },
      'Auth0': {
        icon: 'https://cdn.simpleicons.org/auth0',
        description: 'Authentication and authorization platform.'
      },
      'SSL/TLS Encryption': {
        icon: 'https://cdn.simpleicons.org/letsencrypt',
        description: 'Encryption for data in transit.'
      },
      'AWS Security Services': {
        icon: 'https://cdn.simpleicons.org/amazonaws',
        description: 'Services like AWS Shield, AWS WAF for enhanced security.'
      },
      'Compliance Tools': {
        icon: 'https://cdn.simpleicons.org/gdpr',
        description: 'Ensure compliance with regulations like GDPR, HIPAA.'
      }
    }
  }
};