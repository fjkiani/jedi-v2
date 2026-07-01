import React from 'react';
import { Helmet } from 'react-helmet-async';

export const RootSEO = () => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Jedi Labs",
            "url": "https://jedilabs.org",
            "logo": "https://jedilabs.org/logo.png",
            "description": "Jedi Labs builds, evaluates, and deploys production AI for frontier-model teams and enterprises. Multi-domain model demos (medical imaging, geospatial segmentation, audio classification, video understanding) with real evaluation curves, train/val splits, and live inference.",
            "sameAs": [
              "https://twitter.com/jedilabs",
              "https://www.linkedin.com/company/jedilabs",
              "https://github.com/fjkiani",
              "https://huggingface.co/fjkiani"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "engineering",
              "availableLanguage": ["English"],
              "url": "https://jedilabs.org/contact"
            }
          }
        `}
      </script>
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://jedilabs.org",
            "name": "Jedi Labs — We solve what AI fails.",
            "description": "Production-grade deployment, training, evaluation, and benchmarking for frontier-model teams and enterprise AI. Four shipped demos with real metrics.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://jedilabs.org/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
      </script>
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Production AI Deployment, Training & Evaluation",
            "provider": {
              "@type": "Organization",
              "name": "Jedi Labs"
            },
            "description": "Jedi Labs deploys, trains, evaluates, and benchmarks production AI for frontier-model teams and enterprises. Real train/val curves, per-class F1, dual-axis loss/IoU, zero-shot classifiers, live inference on Hugging Face Spaces.",
            "serviceType": "AI Engineering, Model Evaluation, Production Deployment",
            "areaServed": "Worldwide",
            "audience": {
              "@type": "BusinessAudience",
              "audienceType": "Frontier AI labs, enterprise ML teams"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Engagement Tiers",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "name": "Pilot (Proof of Value)",
                  "price": "15000",
                  "priceCurrency": "USD",
                  "description": "Validate the model in a controlled environment with success metrics."
                },
                {
                  "@type": "Offer",
                  "name": "Production (Scale)",
                  "price": "50000",
                  "priceCurrency": "USD",
                  "description": "Full deployment, multi-model orchestration, SLA-backed performance."
                },
                {
                  "@type": "Offer",
                  "name": "Partner (Enterprise)",
                  "description": "Dedicated engineering, custom fine-tuning, on-premise/VPC deployment."
                }
              ]
            }
          }
        `}
      </script>
    </Helmet>
  );
};
