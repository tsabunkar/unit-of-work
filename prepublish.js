const PUBLISH_MODE = process.env.PUBLISH_MODE === 'true' ? true : false;

if (PUBLISH_MODE) {
  console.log(
    'Running `npm publish` to publish the package is restricted \nSorry but you are not allowed to do this, please follow developer guide'
  );
  process.exit(1); //which terminates the publish process
}
