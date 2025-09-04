import { useParams } from "react-router-dom";
import { useWorkspaceStore } from "../stores/workspace";

/**
 * Custom hook to get the effective workspaceId from params or store.
 * Returns the workspaceId from params if present, otherwise from store.
 */
export function useCurrentWorkspaceId() {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  
  const effectiveId = workspaceId;
  if (!effectiveId) {
    throw new Error("No workspaceId found");
  }
  return effectiveId;
}

export function useCurrentWorkspaceName(){
  const { workspaces } = useWorkspaceStore()
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  
  if (!workspaceId) {
    throw new Error("No workspaceId found");
  }

  return workspaces.find(x=>x.id == workspaceId)?.name
}
