
import Events from '@/config/events.config';
import general from '@/config/general.config';

export default {
    ...general
};

export const logs = general.logs;
export const events = Events;