import React from 'react';
import { Architecture } from './Architecture';
import { Implementation } from './Implementation';
import { Metrics } from './Metrics';

export const UseCaseDetail = ({ useCase }) => {
  const {
    title,
    description,
    capabilities,
    queries,
    technologies,
    architecture,
    metrics,
    implementation
  } = useCase;

  return (
    <div className="use-case-detail">
      <header>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <section className="capabilities">
        <h2>Capabilities</h2>
        <ul>
          {capabilities.map((capability, index) => (
            <li key={index}>{capability}</li>
          ))}
        </ul>
      </section>

      <section className="technologies">
        <h2>Technologies</h2>
        <div className="tech-grid">
          {technologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              name={tech.name}
              icon={tech.icon}
              description={tech.description}
            />
          ))}
        </div>
      </section>

      <Architecture data={architecture} />
      <Implementation data={implementation} />
      <Metrics data={metrics} />
    </div>
  );
};
