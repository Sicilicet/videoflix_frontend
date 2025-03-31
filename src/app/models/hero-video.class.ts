export class HeroVideoModel {
    id: number;
    title: string;
    description: string;
    teaser: string;

    constructor(obj?: any) {
        this.id = obj?.id || 0;
        this.title = obj?.title || '';
        this.description = obj?.description || '';
        this.teaser = obj?.teaser || '';
    }
}