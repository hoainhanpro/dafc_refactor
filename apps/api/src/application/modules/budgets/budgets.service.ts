import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    seasonId?: string;
    brandId?: string;
    status?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.seasonId) where.seasonId = query.seasonId;
    if (query.brandId) where.brandId = query.brandId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.budgetAllocation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          season: true,
          brand: true,
          location: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.budgetAllocation.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const budget = await this.prisma.budgetAllocation.findUnique({
      where: { id },
      include: {
        season: true,
        brand: true,
        location: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        approvedBy: {
          select: { id: true, name: true, email: true },
        },
        otbPlans: {
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  async create(data: any, userId: string) {
    return this.prisma.budgetAllocation.create({
      data: {
        ...data,
        createdById: userId,
        status: 'DRAFT',
        version: 1,
      },
      include: {
        season: true,
        brand: true,
        location: true,
      },
    });
  }

  async update(id: string, data: any) {
    const budget = await this.prisma.budgetAllocation.findUnique({
      where: { id },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return this.prisma.budgetAllocation.update({
      where: { id },
      data,
      include: {
        season: true,
        brand: true,
        location: true,
      },
    });
  }

  async remove(id: string) {
    const budget = await this.prisma.budgetAllocation.findUnique({
      where: { id },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    await this.prisma.budgetAllocation.delete({ where: { id } });
    return { deleted: true };
  }

  async submit(id: string, userId: string) {
    const budget = await this.prisma.budgetAllocation.findUnique({
      where: { id },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return this.prisma.budgetAllocation.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });
  }

  async approve(id: string, userId: string, comments?: string) {
    const budget = await this.prisma.budgetAllocation.findUnique({
      where: { id },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return this.prisma.budgetAllocation.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: userId,
        approvedAt: new Date(),
        comments: comments || budget.comments,
      },
    });
  }

  async reject(id: string, userId: string, reason: string) {
    const budget = await this.prisma.budgetAllocation.findUnique({
      where: { id },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return this.prisma.budgetAllocation.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedById: userId,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });
  }
}

