"use client";

import { ProfileProjectsProps } from "../types/profileProjects.types";
import { useProfileProjects } from "../hook/useProfileProjects";
import {
  ProjectHeader,
  ProjectCard,
  ProjectEmptyState,
  ProjectDialog,
} from "./projects";

export type { ProjectItem, ProfileProjectsProps } from "../types/profileProjects.types";

export function ProfileProjects({ editable = false, username }: ProfileProjectsProps) {
  const {
    projects,
    mounted,
    dialogOpen,
    editingProject,
    formData,
    isAnalyzing,
    analyzingProjectId,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseDialog,
    handleFieldChange,
    handleDelete,
    handleStartProjectInterview,
    handleSubmit,
  } = useProfileProjects({ editable, username });

  if (!mounted) {
    return <div className="h-44 rounded-2xl bg-muted/40 animate-pulse" />;
  }

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs space-y-5">
      <ProjectHeader editable={editable} onAddProject={handleOpenAdd} />

      {projects.length === 0 ? (
        <ProjectEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              editable={editable}
              isAnalyzingThisProject={analyzingProjectId === project.id}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onStartInterview={handleStartProjectInterview}
            />
          ))}
        </div>
      )}

      <ProjectDialog
        isOpen={dialogOpen}
        isEditing={Boolean(editingProject)}
        isAnalyzing={isAnalyzing}
        formData={formData}
        onChangeField={handleFieldChange}
        onSubmit={handleSubmit}
        onClose={handleCloseDialog}
      />
    </div>
  );
}

export default ProfileProjects;
