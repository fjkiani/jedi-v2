export const fullStackSolution = {
  // Basic information
  id: "1",
  title: "Full Stack Development",
  shortTitle: "Full Stack",
  slug: "full-stack-development",
  description: "Modern scalable web application architecture with end-to-end development capabilities",
  imageUrl: "/images/solutions/full-stack.jpg",
  icon: "code",
  categories: ["Web Development", "Mobile", "Cloud"],

  // Business value proposition
  businessValue: {
    metrics: [
      "Rapid development and deployment cycles",
      "Scalable from startup to enterprise",
      "Optimized user experience",
      "Real-time data synchronization"
    ],
    capabilities: [
      "Responsive cross-platform interface",
      "Real-time data updates",
      "Secure authentication & authorization",
      "Automated testing & deployment"
    ],
    useCases: [
      "E-commerce Platform",
      "Social Media Application",
      "Enterprise Dashboard",
      "Collaboration Tools"
    ]
  },

  // Architecture diagram configuration
  architecture: {
    title: "Full-Stack Web Application",
    description: "Modern scalable web application architecture",
    layout: {
      type: "horizontal",
      spacing: { x: 300, y: 170 },
      startPosition: { x: 100, y: 80 }
    },
    nodes: [
      {
        id: 'frontend',
        label: 'Frontend App',
        x: 100,
        y: 80,
        description: 'Modern web application interface',
        technologies: {
          core: ["React", "Next.js", "TypeScript"],
          styling: ["TailwindCSS", "Styled Components"],
          state: ["Redux Toolkit", "React Query"]
        }
      },
      {
        id: 'backend',
        label: 'API Server',
        x: 400,
        y: 80,
        description: 'RESTful/GraphQL API service',
        technologies: {
          runtime: ["Node.js", "Express", "NestJS"],
          api: ["REST", "GraphQL", "WebSocket"],
          auth: ["JWT", "OAuth2", "Passport"]
        }
      },
      {
        id: 'database',
        label: 'Database',
        x: 700,
        y: 80,
        description: 'Data persistence layer',
        technologies: {
          primary: ["PostgreSQL", "MongoDB"],
          orm: ["Prisma", "TypeORM"],
          cache: ["Redis", "Memcached"]
        }
      },
      {
        id: 'cdn',
        label: 'CDN & Assets',
        x: 250,
        y: 250,
        description: 'Content delivery and static assets',
        technologies: {
          cdn: ["CloudFlare", "Akamai"],
          storage: ["S3", "CloudFront"],
          media: ["ImageKit", "Cloudinary"]
        }
      },
      {
        id: 'devops',
        label: 'DevOps',
        x: 550,
        y: 250,
        description: 'CI/CD and infrastructure',
        technologies: {
          ci: ["GitHub Actions", "Jenkins"],
          monitoring: ["Grafana", "Prometheus"],
          logging: ["ELK Stack", "Papertrail"]
        }
      }
    ],
    connections: [
      {
        from: 'frontend',
        to: 'backend',
        label: 'API/WS'
      },
      {
        from: 'backend',
        to: 'database',
        label: 'Queries'
      },
      {
        from: 'frontend',
        to: 'cdn',
        label: 'Assets'
      },
      {
        from: 'backend',
        to: 'devops',
        label: 'Metrics'
      },
      {
        from: 'database',
        to: 'devops',
        label: 'Logs'
      }
    ]
  },

  // Tech stack details
  techStack: {
    frontend: {
      'React': {
        icon: 'https://cdn.simpleicons.org/react',
        description: 'Component-based UI library',
        category: 'Frontend',
        priority: 1
      },
      'Next.js': {
        icon: 'https://cdn.simpleicons.org/nextdotjs',
        description: 'React framework for production',
        category: 'Frontend',
        priority: 2
      }
    },
    styling: {
      'TailwindCSS': {
        icon: 'https://cdn.simpleicons.org/tailwindcss',
        description: 'Utility-first CSS framework',
        category: 'Frontend',
        priority: 1
      },
      'Material-UI': {
        icon: 'https://cdn.simpleicons.org/mui',
        description: 'React UI component library',
        category: 'Frontend',
        priority: 2
      }
    },
    backend: {
      'Node.js': {
        icon: 'https://cdn.simpleicons.org/nodedotjs',
        description: 'JavaScript runtime',
        category: 'Backend',
        priority: 1
      },
      'Express': {
        icon: 'https://cdn.simpleicons.org/express',
        description: 'Web framework for Node.js',
        category: 'Backend',
        priority: 2
      }
    },
    database: {
      'PostgreSQL': {
        icon: 'https://cdn.simpleicons.org/postgresql',
        description: 'Relational database',
        category: 'Data',
        priority: 1
      },
      'MongoDB': {
        icon: 'https://cdn.simpleicons.org/mongodb',
        description: 'Document database',
        category: 'Data',
        priority: 2
      }
    }
  },

  // Deployment configuration
  deployment: {
    environments: [
      {
        name: 'Development',
        icon: 'https://cdn.simpleicons.org/codepen',
        description: 'Local development environment'
      },
      {
        name: 'Staging',
        icon: 'https://cdn.simpleicons.org/testinglibrary',
        description: 'Testing and QA environment'
      },
      {
        name: 'Production',
        icon: 'https://cdn.simpleicons.org/vercel',
        description: 'Live production environment'
      }
    ],
    monitoring: {
      'New Relic': {
        icon: 'https://cdn.simpleicons.org/newrelic',
        description: 'Application monitoring'
      },
      'Sentry': {
        icon: 'https://cdn.simpleicons.org/sentry',
        description: 'Error tracking'
      }
    },
    security: {
      'Auth0': {
        icon: 'https://cdn.simpleicons.org/auth0',
        description: 'Authentication & authorization'
      },
      'CloudFlare': {
        icon: 'https://cdn.simpleicons.org/cloudflare',
        description: 'Security & CDN'
      }
    }
  }
}; 