import React from "react";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "react-router-dom";

const Roadmap = () => {
  const { isDarkMode } = useTheme();

  return (
    <Section className="overflow-hidden" id="jedi-research">
      <div className="container md:pb-10 text-center">
        <Heading tag="Research" title="Jedi Research" />

        <p className={`body-1 max-w-3xl mx-auto mb-12 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
          Dive into our latest insights, technical deep dives, and explorations 
          into the future of AI. Discover how we're pushing the boundaries 
          and shaping the next generation of intelligent solutions.
        </p>

        <Button href="/blog">
          Explore Our Research
        </Button>
      </div>
    </Section>
  );
};

export default Roadmap;
