import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Common
import { PrismaExceptionFilter } from './application/shared/filters/prisma-exception.filter';
import { TransformInterceptor } from './application/shared/interceptors/transform.interceptor';

// Infrastructure
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';

// Application Modules
import { AuthModule } from './application/modules/auth/auth.module';
import { HealthModule } from './application/modules/health/health.module';
import { BrandsModule } from './application/modules/master-data/brands/brands.module';
import { CategoriesModule } from './application/modules/master-data/categories/categories.module';
import { LocationsModule } from './application/modules/master-data/locations/locations.module';
import { SeasonsModule } from './application/modules/master-data/seasons/seasons.module';
import { DivisionsModule } from './application/modules/master-data/divisions/divisions.module';
import { BudgetsModule } from './application/modules/budgets/budgets.module';
import { OtbPlansModule } from './application/modules/otb-plans/otb-plans.module';
import { SkuProposalsModule } from './application/modules/sku-proposals/sku-proposals.module';
import { UsersModule } from './application/modules/users/users.module';
import { ReportsModule } from './application/modules/reports/reports.module';
import { NotificationsModule } from './application/modules/notifications/notifications.module';
import { AiModule } from './application/modules/ai/ai.module';
import { WorkflowsModule } from './application/modules/workflows/workflows.module';
import { AnalyticsModule } from './application/modules/analytics/analytics.module';
import { IntegrationsModule } from './application/modules/integrations/integrations.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    PrismaModule,

    // Auth
    AuthModule,

    // Health check
    HealthModule,

    // Master Data
    BrandsModule,
    CategoriesModule,
    LocationsModule,
    SeasonsModule,
    DivisionsModule,

    // Business modules
    BudgetsModule,
    OtbPlansModule,
    SkuProposalsModule,

    // Users & Permissions
    UsersModule,

    // Reports
    ReportsModule,

    // Notifications
    NotificationsModule,

    // AI Features
    AiModule,

    // Workflows & Approvals
    WorkflowsModule,

    // Analytics & KPI
    AnalyticsModule,

    // Integrations (ERP, S3, Webhooks, API Keys)
    IntegrationsModule,
  ],
  providers: [
    // Global exception filter for Prisma errors
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    // Global response transform interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
