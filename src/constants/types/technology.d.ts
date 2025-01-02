export type TechnologyIcon = {
  type: "LOCAL" | "CDN";
  path: string | null;
  url: string | null;
};

export type UseCase = {
  title: string;
  description: string;
  relatedSolution: string;
  components: Array<{
    name: string;
    tech: string[];
    role: string;
  }>;
};

export type Technology = {
  id: string;
  name: string;
  slug: string;
  icon: TechnologyIcon;
  category: string;
  subcategories: string[];
  description: string;
  services: string[];
  details: {
    primaryUses: string[];
    useCases: UseCase[];
    metrics: Record<string, any>;
    deployment: {
      cloud: string[];
      containerization: string[];
      scaling: string[];
    };
  };
  integration: {
    dependencies: string[];
    compatibleWith: string[];
    apis: string[];
  };
  resources: {
    documentation: string;
    github: string;
    website: string;
  };
};
