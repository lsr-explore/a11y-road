import type { A11yIssueDefinition, A11yIssueInstance, ResolvedInstance } from './types';

export class A11yRegistry {
  private definitions: A11yIssueDefinition[];
  private instances: A11yIssueInstance[];

  constructor(definitions: A11yIssueDefinition[], instances: A11yIssueInstance[]) {
    this.definitions = definitions;
    this.instances = instances;
  }

  getDefinition(id: string): A11yIssueDefinition | undefined {
    return this.definitions.find((def) => def.id === id);
  }

  getDefinitions(): A11yIssueDefinition[] {
    return this.definitions;
  }

  getInstances(): A11yIssueInstance[] {
    return this.instances;
  }

  resolve(instance: A11yIssueInstance): ResolvedInstance | null {
    const definition = this.getDefinition(instance.issueId);
    if (!definition) return null;
    return { instance, definition };
  }

  getAllResolved(): ResolvedInstance[] {
    return this.instances
      .map((inst) => this.resolve(inst))
      .filter((result): result is ResolvedInstance => result !== null);
  }

  getResolvedByPage(pageId: string): ResolvedInstance[] {
    return this.instances
      .filter((inst) => inst.pageId === pageId)
      .map((inst) => this.resolve(inst))
      .filter((result): result is ResolvedInstance => result !== null);
  }

  getInstanceCountByDefinition(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const instance of this.instances) {
      counts.set(instance.issueId, (counts.get(instance.issueId) || 0) + 1);
    }
    return counts;
  }
}
