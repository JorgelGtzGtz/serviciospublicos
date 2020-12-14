import { Features } from './Features';

export interface MapBoxOutput{
    attribution: string;
    features: Features[];
    query: [];
    type: string;
}
