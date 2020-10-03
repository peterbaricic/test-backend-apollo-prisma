# Test backend assignment

Task is to create backend application in Node.js using any SQL database. This application should communicate with frontend via GraphQL. There is no need to do frontend in this assessment. You can use any libraries you may consider useful. The assessment is to create an application for book catalogue.

## Use cases:

* User should be able to log in.
* User should be able to add new book, edit existing book, and delete book. User should be able to “travel back” in time and see older state of any book or library.
* Anonymous user should be able to find some book by author name or book title.
* Pagination is not required but is big plus.

## Minimum data requirements:

* User: email, password
* Book: title, author, year of publication, genres, rating

You can model SQL schema as you consider best. The same applies for GraphQL schema.

## Additional informations:

* Feel free to use any additional library you might need for completing this project, or change structure or anything
* We would like to see, how will you solve this task in terms of end result precision, code quality & readability

## Sample project Requirements
* node `^10.7.0`
* yarn `^1.9.2` or npm `^6.2.0`
* babel-cli `^6.26.0`

## Installation

After confirming that your environment meets the above [requirements](#requirements), clone `vestberry` by doing the following:

```bash
$ git clone git@github.com:VESTBERRY/Test-backend-assignment.git <directory>
$ cd <directory>
```

When that's done, install the project dependencies. It is recommended that you use [Yarn](https://yarnpkg.com/) for deterministic dependency management, but `npm install` will suffice.

```bash
$ yarn  # Install project dependencies (or `npm install`)
```

## Running the Project

After completing the [installation](#installation) step, you're ready to start the project!

```bash
$ yarn start  # Start the development server (or `npm start`)
```

After this you can open in your browser the GraphiQL at [http://localhost:8000/graphql](http://localhost:8000/graphql)

While developing, you will probably rely mostly on `yarn start`; however, there are additional scripts at your disposal:

|`yarn <script>`        |Description|
|-----------------------|-----------|
|`start`                |Serves your app at `localhost:8000`|
|`lint`                 |[Lints](http://stackoverflow.com/questions/8503559/what-is-linting) the project for potential errors|
|`lint:fix`             |Lints the project and [fixes all correctable errors](http://eslint.org/docs/user-guide/command-line-interface.html#fix)|
