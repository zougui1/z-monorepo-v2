import envVar from 'env-var';

export const CONFIG_FILE = envVar.get('GARBAGE_COLLECTOR_CONFIG_FILE').required().asString();
