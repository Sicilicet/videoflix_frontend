export class DashboardVideoModel {
  id: number;
  createdAt: string;
  category: string;
  thumbnail: string;

  constructor(obj?: any) {
    this.id = obj?.id || 0;
    this.createdAt = obj?.created_at || '';
    this.category = obj?.category || '';
    this.thumbnail = obj?.thumbnail || '';
  }
}
