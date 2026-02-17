import { IconName } from '../../app/icon-mapping';

export interface Tab {
    key: string;
    label: string;
    route: string;
    icon: IconName;
}