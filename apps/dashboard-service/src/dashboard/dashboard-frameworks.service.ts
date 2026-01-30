import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { DashboardProjectsQueryBuilder } from './dashboard-projects-query.builder';
import { Framework } from '../framework/framework.model';
import { Project } from '../project/project.model';

export interface DashboardFrameworkItem {
  framework_slug: string;
  name: string;
}

@Injectable()
export class DashboardFrameworksService {
  constructor(
    private readonly dashboardProjectsQueryBuilder: DashboardProjectsQueryBuilder,
  ) {}

  async getFrameworks(query: Record<string, unknown>): Promise<DashboardFrameworkItem[]> {
    const qb = this.dashboardProjectsQueryBuilder
      .build(Project, [])
      .queryFilters(query);
    const rows = await qb.select(['frameworkKey']);
    const keys = [
      ...new Set(
        (rows as { frameworkKey: string | null }[])
          .map((r) => r.frameworkKey)
          .filter((k): k is string => k != null),
      ),
    ];
    if (keys.length === 0) return [];

    const frameworks = await Framework.findAll({
      where: { slug: { [Op.in]: keys } },
      attributes: ['slug', 'name'],
    });

    return frameworks
      .map((f) => ({ framework_slug: f.slug, name: f.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
