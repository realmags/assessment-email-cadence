import { Worker, NativeConnection } from '@temporalio/worker';
import { createActivities } from './activities';

async function run() {
  const workflowsPath = require.resolve('@email-cadence/temporal-workflow');

  console.log(`registering workflows from path=${workflowsPath}`);

  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  });

  const worker = await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'cadence-email-queue',
    workflowsPath,
    activities: createActivities(),
  });

  await worker.run();

  console.log(`'worker' service is running`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
