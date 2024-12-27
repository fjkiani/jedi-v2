export class ResponseFactory {
  static createResponse(industry, section, query, docs) {
    const sectionData = docs[section];
    if (!sectionData) return null;

    const queryData = this.findQueryData(sectionData, query);
    if (!queryData) return null;

    return {
      ...queryData.response,
      footer: this.createFooter(industry, section, docs)
    };
  }

  static findQueryData(sectionData, query) {
    return sectionData.sections.find(section => 
      section.queries && section.queries[query]
    )?.queries[query];
  }

  static createFooter(industry, section, docs) {
    const metrics = docs.technical?.metrics;
    return {
      metrics: {
        confidence: metrics?.confidence || "95%",
        dataPoints: metrics?.dataPoints || "1M+",
        processingTime: metrics?.processingTime || "2.5s"
      },
      certifications: [
        "🔒 Enterprise Secure",
        "✓ Industry Certified",
        "📊 Production Ready"
      ],
      poweredBy: "JediLabs AI™"
    };
  }
} 