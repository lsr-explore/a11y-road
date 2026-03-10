import { NextResponse } from 'next/server';
import { registry, issueDefinitions } from '../../../data/issues-registry';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('page');
  const definitionId = searchParams.get('definition');
  const view = searchParams.get('view');

  if (view === 'definitions') {
    return NextResponse.json({
      definitions: issueDefinitions,
      counts: Object.fromEntries(registry.getInstanceCountByDefinition()),
    });
  }

  let resolved = registry.getAllResolved();

  if (pageId) {
    resolved = registry.getResolvedByPage(pageId);
  }

  if (definitionId) {
    resolved = resolved.filter(
      (r) => r.definition.id === definitionId,
    );
  }

  return NextResponse.json({
    instances: resolved.map((r) => ({
      ...r.instance,
      definition: r.definition,
    })),
    total: resolved.length,
  });
}
