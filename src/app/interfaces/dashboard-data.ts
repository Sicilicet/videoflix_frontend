import { DashboardVideoModel } from '../models/dashboard-video.class';

export interface DashboardData {
  latest_videos: DashboardVideoModel[];
  my_videos: DashboardVideoModel[];
  category_videos: { [key: string]: DashboardVideoModel[] };
  categories: string[];
}
