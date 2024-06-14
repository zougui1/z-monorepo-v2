import { GarbageContainer } from './GarbageContainer';
import { getConfig } from './config';

const program = async (): Promise<void> => {
  const config = await getConfig();
  for (const data of config.containers) {
    const garbage = new GarbageContainer(data.dir, {
      lifetime: data.lifetime,
    });

    await garbage.removeExpiredNodes();
  }
}

program().catch(error => {
  console.error(error);
});
