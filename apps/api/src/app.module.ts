import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Common
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { BrandsModule } from './modules/master-data/brands/brands.module';
import { CategoriesModule } from './modules/master-data/categories/categories.module';
import { LocationsModule } from './modules/master-data/locations/locations.module';
import { SeasonsModule } from './modules/master-data/seasons/seasons.module';
import { DivisionsModule } from './modules/master-data/divisions/divisions.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { OtbPlansModule } from './modules/otb-plans/otb-plans.module';
import { SkuProposalsModule } from './modules/sku-proposals/sku-proposals.module';
import { UsersModule } from './modules/users/users.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AiModule } from './modules/ai/ai.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';

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
export class AppModule {}
