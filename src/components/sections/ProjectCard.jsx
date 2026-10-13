import Image from "next/image";
import { Icon } from "@/components/icons";

export function ProjectCard({ project }) {
  return (
    <article className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-ink-900">
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-500 text-white">
          <Icon name="play" className="size-5" />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-xs font-semibold tracking-wider text-brand-400 uppercase">
          {project.category} · {project.client}
        </p>
        <h3 className="mt-1 text-lg font-semibold">{project.title}</h3>
      </div>
    </article>
  );
}
