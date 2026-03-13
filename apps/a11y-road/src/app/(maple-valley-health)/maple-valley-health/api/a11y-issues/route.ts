import { NextResponse } from 'next/server';
import { issueDefinitions, registry } from '@/data/issues-registry';

export const GET = async (request: Request) => {
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
    resolved = resolved.filter((item) => item.definition.id === definitionId);
  }

  return NextResponse.json({
    instances: resolved.map((item) => ({
      ...item.instance,
      definition: item.definition,
    })),
    total: resolved.length,
  });
};
