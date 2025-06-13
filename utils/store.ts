interface Record {
  kban: string;
  created_at: string;
  status: string;
  assigned_to?: any;
}

const store = new Map<string, Record>();

export const kbanStore = {
  get: (id: string) => store.get(id),
  set: (id: string, data: Record) => store.set(id, data),
  delete: (id: string) => store.delete(id)
};
