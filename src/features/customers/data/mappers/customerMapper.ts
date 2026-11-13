import { istTimeFromIso, statusFromDto } from '@/core/network';

import type { Customer, CustomerList } from '../../domain';
import type { CustomerDto, CustomerListDto } from '../dto/CustomerDto';

export const toCustomer = (dto: CustomerDto): Customer => ({
  id: dto.slug,
  code: dto.code,
  name: dto.name,
  status: statusFromDto(dto.status),
  etl: { ok: dto.etl_passed, total: dto.etl_total },
  api: { ok: dto.api_passed, total: dto.api_total },
  lastCheck: istTimeFromIso(dto.last_check_at),
});

export const toCustomerList = (dto: CustomerListDto): CustomerList => ({
  updatedAt: istTimeFromIso(dto.updated_at),
  customers: dto.customers.map(toCustomer),
});
