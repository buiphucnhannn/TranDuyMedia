"use client";

import { useState } from "react";
import { projectCategories, projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

export function ProjectGallery() {
  const [active, setActive] = useState(projectCategories[0]);

  const filtered =
    active === projectCategories[0] ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <div role="tablist" aria-label="Lọc dự án" className="flex flex-wrap gap-2">
        {projectCategories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={active === category}
            onClick={() => setActive(category)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              active === category
                ? "bg-brand-500 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
