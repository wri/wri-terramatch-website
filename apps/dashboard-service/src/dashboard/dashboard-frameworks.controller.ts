import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CacheService } from '../cache/cache.service';
import { getCacheKeyFromQuery } from '../cache/cache.utils';
import { NoBearerAuth } from '../auth/no-bearer-auth.decorator';
import { DashboardQueryDto } from './dashboard-query.dto';
import {
  DashboardFrameworksService,
  DashboardFrameworkItem,
} from './dashboard-frameworks.service';

const CACHE_KEY_PREFIX = 'dashboard:frameworks';

@Controller('dashboard/v3')
export class DashboardFrameworksController {
  constructor(
    private readonly dashboardFrameworksService: DashboardFrameworksService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('frameworks')
  @NoBearerAuth()
  @ApiOperation({ summary: 'List distinct frameworks used in projects' })
  @ApiOkResponse({
    description: 'Array of framework slug and name',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        framework_slug: { type: 'string' },
        name: { type: 'string' },
      },
    },
  })
  async getFrameworks(
    @Query() query: DashboardQueryDto,
  ): Promise<DashboardFrameworkItem[]> {
    const cacheKey = `${CACHE_KEY_PREFIX}|${getCacheKeyFromQuery(query)}`;
    return this.cacheService.get(cacheKey, () =>
      this.dashboardFrameworksService.getFrameworks(query as unknown as Record<string, unknown>),
    );
  }
}
