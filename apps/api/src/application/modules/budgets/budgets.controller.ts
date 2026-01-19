import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from '../../shared/decorators/current-user.decorator';

@ApiTags('budgets')
@ApiBearerAuth()
@Controller('budgets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @ApiOperation({ summary: 'List all budgets' })
  findAll(@Query() query: any) {
    return this.budgetsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get budget by ID' })
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'FINANCE_HEAD', 'BRAND_MANAGER')
  @ApiOperation({ summary: 'Create new budget' })
  create(@Body() data: any, @CurrentUser() user: CurrentUserPayload) {
    return this.budgetsService.create(data, user.id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'FINANCE_HEAD', 'BRAND_MANAGER')
  @ApiOperation({ summary: 'Update budget' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.budgetsService.update(id, data);
  }

  @Delete(':id')
  @Roles('ADMIN', 'FINANCE_HEAD')
  @ApiOperation({ summary: 'Delete budget' })
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(id);
  }

  @Post(':id/submit')
  @Roles('ADMIN', 'BRAND_MANAGER', 'BRAND_PLANNER')
  @ApiOperation({ summary: 'Submit budget for approval' })
  submit(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.budgetsService.submit(id, user.id);
  }

  @Post(':id/approve')
  @Roles('ADMIN', 'FINANCE_HEAD', 'BOD_MEMBER')
  @ApiOperation({ summary: 'Approve budget' })
  approve(
    @Param('id') id: string,
    @Body() data: { comments?: string },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.budgetsService.approve(id, user.id, data.comments);
  }

  @Post(':id/reject')
  @Roles('ADMIN', 'FINANCE_HEAD', 'BOD_MEMBER')
  @ApiOperation({ summary: 'Reject budget' })
  reject(
    @Param('id') id: string,
    @Body() data: { reason: string },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.budgetsService.reject(id, user.id, data.reason);
  }
}

