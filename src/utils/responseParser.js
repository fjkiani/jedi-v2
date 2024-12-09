const parseResponse = (response) => {
  const sections = [];
  let currentSection = null;

  response.split('\n').forEach(line => {
    // Main section headers (with emojis like 🤖, 💡, 🔬)
    if (line.match(/^[🤖💡🔬🧪⚡] .+/)) {
      currentSection = {
        title: line.trim(),
        subsections: [],
        type: 'main'
      };
      sections.push(currentSection);
    }
    // Diamond bullet points (♦)
    else if (line.match(/^🔸 .+/)) {
      if (currentSection) {
        currentSection.subsections.push({
          title: line.trim(),
          items: [],
          type: 'subsection'
        });
      }
    }
    // Regular bullet points (•)
    else if (line.match(/^• .+/)) {
      const lastSubsection = currentSection?.subsections[currentSection.subsections.length - 1];
      if (lastSubsection) {
        lastSubsection.items.push(line.trim());
      }
    }
    // Hyphenated lines (-)
    else if (line.match(/^- .+/)) {
      const lastSubsection = currentSection?.subsections[currentSection.subsections.length - 1];
      if (lastSubsection) {
        lastSubsection.items.push({
          text: line.trim(),
          type: 'subitem'
        });
      }
    }
  });

  return sections;
}; 