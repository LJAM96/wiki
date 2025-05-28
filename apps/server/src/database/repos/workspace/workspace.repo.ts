import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { KyselyDB, KyselyTransaction } from '@docmost/db/types/kysely.types';
import { dbOrTx } from '@docmost/db/utils';
import {
  InsertableWorkspace,
  UpdatableWorkspace,
  Workspace,
} from '@docmost/db/types/entity.types';
import { ExpressionBuilder, sql } from 'kysely';
import { DB, Workspaces } from '@docmost/db/types/db';

export class WorkspaceRepo {
  constructor(@InjectKysely() private db: KyselyDB) {}

  public baseFields: Array<keyof Workspaces> = [
    'id',
    'name',
    'description',
    'logo',
    'favicon',
    'icon',
    'brandName',
    'hostname',
    'customDomain',
    'defaultSpaceId',
    'settings',
    'status',
    'enforceSso',
    'billingEmail',
    'trialEndAt',
    'createdAt',
    'updatedAt',
    'emailDomains',
    'plan',
    'licenseKey',
  ];

  async create(
    data: InsertableWorkspace,
    trx?: KyselyTransaction,
  ): Promise<Workspace> {
    const db = dbOrTx(this.db, trx);

    return db
      .insertInto('workspaces')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async insertWorkspace(
    data: InsertableWorkspace,
    trx?: KyselyTransaction,
  ): Promise<Workspace> {
    return this.create(data, trx);
  }

  async findById(
    workspaceId: string,
    trx?: KyselyTransaction,
  ): Promise<Workspace | null> {
    const db = dbOrTx(this.db, trx);

    return db
      .selectFrom('workspaces')
      .select(this.baseFields)
      .where('id', '=', workspaceId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst() as Promise<Workspace | null>;
  }

  async findFirst(): Promise<Workspace | null> {
    return this.db
      .selectFrom('workspaces')
      .select(this.baseFields)
      .where('deletedAt', 'is', null)
      .limit(1)
      .executeTakeFirst() as Promise<Workspace | null>;
  }

  async findByHostname(hostname: string): Promise<Workspace | null> {
    return this.db
      .selectFrom('workspaces')
      .select(this.baseFields)
      .where('hostname', '=', hostname)
      .where('deletedAt', 'is', null)
      .executeTakeFirst() as Promise<Workspace | null>;
  }

  async findByCustomDomain(customDomain: string): Promise<Workspace | null> {
    return this.db
      .selectFrom('workspaces')
      .select(this.baseFields)
      .where('customDomain', '=', customDomain)
      .where('deletedAt', 'is', null)
      .executeTakeFirst() as Promise<Workspace | null>;
  }

  async findMany(paginationOptions: any): Promise<any> {
    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;
    const offset = (page - 1) * limit;

    const workspaces = await this.db
      .selectFrom('workspaces')
      .select(this.baseFields)
      .where('deletedAt', 'is', null)
      .orderBy('createdAt', 'asc')
      .limit(limit)
      .offset(offset)
      .execute() as Workspace[];
    
    const totalQuery = await this.db
      .selectFrom('workspaces')
      .select((eb: ExpressionBuilder<DB, 'workspaces'>) => [
        eb.fn.count<number>('id').as('count'),
      ])
      .where('deletedAt', 'is', null)
      .executeTakeFirst();

    const total = Number(totalQuery?.count || 0);

    return {
      data: workspaces,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAll(): Promise<Workspace[]> {
    return this.db
      .selectFrom('workspaces')
      .select(this.baseFields)
      .where('deletedAt', 'is', null)
      .execute() as Promise<Workspace[]>;
  }

  async update(
    workspaceId: string,
    data: UpdatableWorkspace,
    trx?: KyselyTransaction,
  ): Promise<Workspace> {
    const db = dbOrTx(this.db, trx);

    return db
      .updateTable('workspaces')
      .set(data)
      .where('id', '=', workspaceId)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateWorkspace(
    data: UpdatableWorkspace,
    workspaceId: string,
    trx?: KyselyTransaction,
  ): Promise<Workspace> {
    return this.update(workspaceId, data, trx);
  }

  async delete(workspaceId: string, trx?: KyselyTransaction): Promise<void> {
    const db = dbOrTx(this.db, trx);

    await db
      .updateTable('workspaces')
      .set({ deletedAt: new Date() })
      .where('id', '=', workspaceId)
      .execute();
  }

  async count(): Promise<number> {
    const result = await this.db
      .selectFrom('workspaces')
      .select((eb: ExpressionBuilder<DB, 'workspaces'>) => [
        eb.fn.count<number>('id').as('count'),
      ])
      .where('deletedAt', 'is', null)
      .executeTakeFirst();

    return Number(result?.count || 0);
  }

  async getActiveUserCount(workspaceId: string): Promise<number> {
    const result = await this.db
      .selectFrom('users')
      .select((eb: ExpressionBuilder<DB, 'users'>) => [
        eb.fn.count<number>('id').as('count'),
      ])
      .where('workspaceId', '=', workspaceId)
      .where('deletedAt', 'is', null)
      .where('deactivatedAt', 'is', null)
      .executeTakeFirst();

    return Number(result?.count || 0);
  }

  async exists(): Promise<boolean> {
    const result = await this.db
      .selectFrom('workspaces')
      .select('id')
      .where('deletedAt', 'is', null)
      .limit(1)
      .executeTakeFirst();

    return !!result;
  }

  async hostnameExists(hostname: string): Promise<boolean> {
    const result = await this.db
      .selectFrom('workspaces')
      .select('id')
      .where('hostname', '=', hostname)
      .where('deletedAt', 'is', null)
      .limit(1)
      .executeTakeFirst();

    return !!result;
  }

  async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    return this.db
      .selectFrom('workspaces')
      .innerJoin('users', 'users.workspaceId', 'workspaces.id')
      .select(this.baseFields.map((field) => `workspaces.${field}` as any))
      .where('users.id', '=', userId)
      .where('workspaces.deletedAt', 'is', null)
      .where('users.deletedAt', 'is', null)
      .execute() as Promise<Workspace[]>;
  }
}
