# Sneezl

Sneezl is a web application designed to help hayfever sufferers manage their symptoms. The application allows users to track their allergy symptoms and medication usage via a user-friendly diary. Users can also predict future symptoms based on historical data and receive live pollen maps and forecasts from Google's pollen API.

This application is developed as part of the SIT725 Group Project at Deakin University and will not be available for commercial use.

## Table of Contents

- [Key Features](#key-features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Key Features

- Track allergy symptoms and medication usage via a user-friendly diary
- Predict future symptoms based on historical data
- Integration with Google's pollen API for live pollen maps and forecasts

## Installation

### Requirements

- Node.js (version 22 or newer)
- NPM (version 10 or newer)
- MongoDB (version 8 or newer)

### Setting up the Database

The application uses MongoDB as its database. You can either run the database using Docker or install it natively.

[Install Docker](https://docs.docker.com/get-docker/)

OR

[Install MongoDB](https://www.mongodb.com/docs/manual/installation/)

### Setting up the Application

To install the application, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/vmombs/sit725_group_project.git
cd sit725_group_project
```

2. Install the dependencies:

```bash
npm install
```

## Usage

### Running the Database

**Option 1 - Docker (RECOMMENDED)** Assuming you have Docker setup, run the following command:

```bash
docker compose up
```

**Option 2 - MongoDB** If you have MongoDB installed locally, follow the steps for your chosen platform below:

[MongoDB on Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition)

[MongoDB on MacOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb-community-edition)

[MongoDB on Linux](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#run-mongodb-community-edition)

This will start the MongoDB database.

### Running the Application

1. Start the development server:
    ```bash
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Register for an account or log in if you already have one.

4. Start tracking your allergy symptoms and medication usage.

## Testing

Tests in this project are named with the format `*.test.mjs`. To run all tests, use:
```bash
npm test
```
    
To run tests and view the coverage report generated with `nyc`, run:
```bash
npm run cov
```

Test reports will then also be available in the `.nyc_output` folder in json format. 

The code coverage requirement in the project is currently set to 0% in the `nyc` config, as this is purely for informational purposes at this point and not a requirement to merge.

## Contributing

We welcome contributions to Sneezl! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and concise messages.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.

Please ensure your code follows our coding standards and includes appropriate tests.

## License

This project is licensed under Deakin University and is not available for commercial use.

## Contact

For any questions or inquiries, please contact us at:

- Email: support@sneezl.com
- GitHub Issues: [https://github.com/vmombs/sit725_group_project/issues](https://github.com/vmombs/sit725_group_project/issues)