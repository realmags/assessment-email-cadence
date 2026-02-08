async function run() {
    console.log('Starting worker...');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
