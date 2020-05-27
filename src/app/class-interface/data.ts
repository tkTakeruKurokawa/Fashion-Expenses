import { Observable } from 'rxjs';

export interface Data {
    id?: number;
    brand: string;
    item_name: string;
    item_category: string;
    value: number;
    image: string;
    url?: string | Observable<string>;
    doc_key?: string;
}
