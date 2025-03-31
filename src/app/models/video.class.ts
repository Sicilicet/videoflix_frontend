export class VideoModel {
    id: number;
    title: string;
    timestamp: number;
    hls_file: string;

    constructor(obj?: any) {
        this.id = obj?.id || 0;
        this.title = obj?.title || '';
        this.timestamp = obj?.timestamp || 0;
        this.hls_file = obj?.hls_file || '';
    }
}