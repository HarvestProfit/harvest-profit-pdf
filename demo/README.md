## Demo

This is a simple demo. We use [yarn](https://yarnpkg.com/en/) for package management.

Bootstrapped using [Create React App](https://github.com/facebookincubator/create-react-app)

To run this locally, simply run the following on your machine in this directory:
```
# Install all dependencies
yarn install

# Run the development server
yarn start
```

### Putting it all together

All the logic in this directory happens in the [src/generate.js](./src/generate.js) file. Basically, there is a button in [src/App.js](./src/App.js) that triggers the `generate()` function, which creates and pushes a PDF directly to the client.
