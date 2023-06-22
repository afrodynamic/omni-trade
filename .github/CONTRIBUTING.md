# Contributing Guidelines

Thank you for your interest in contributing to our project! We welcome contributions of all kinds, whether it's fixing a typo, improving documentation, or adding a new feature. To get started, please follow these guidelines.

## Code of Conduct

Before contributing, please review our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to abide by these guidelines and help create a positive and welcoming community.

## How to Contribute

1. Fork the repository and clone your copy. create a new branch for your changes.

   ```shell
   git clone https://github.com/YOUR_USERNAME/omni-trade.git
   ```

2. After cloning, ensure you have a new remote named `upstream` that points to the original project so you can fetch the latest changes.

   ```shell
   git remote add upstream https://github.com/afrodynamic/omni-trade.git
   ```

3. Create a new branch for your changes based on the `development` branch. Use an imperative and descriptive name for the branch starting with `feat-` if it adds a new feature, `fix-` if it fixes a bug, or `doc-` if it improves documentation.

   ```shell
   git checkout -b feat-add-newfeature development
   ```

4. Install the project's dependencies using `npm install` in the root of the project directory.

   ```shell
   npm install
   ```

5. Run the client/frontend using `npm run client-dev` in the root of the project directory.

   ```shell
   npm run client-dev
   ```

6. Make your changes and test them thoroughly.

7. Create a pull request by filling out the template with the requested information, replacing/removing any placeholder text.
   - You can create a draft pull request while you are still working on your changes by clicking the "Create pull request" button and then clicking "Create draft pull request" on the next page. Once your changes are ready to be reviewed, click the "Ready for review" button to mark the pull request as ready for review.

8. Wait for a project maintainer to review your changes. They may request changes or ask for additional information.

9. Once your changes are approved, they will be merged into the project.

## Style Guidelines

Please follow these style guidelines when making changes to the codebase:

- Use consistent indentation and spacing.

- Use descriptive names for variables, functions, and other code elements.

- Avoid unnecessary comments, but include comments when they help explain the code.

- Use meaningful commit messages in an imperative style that describes the changes made in the commit. If the commit fixes a bug or resolves an issue, please include the issue number in the commit message. Reference the "conventional commits" guidelines, ([Guide](https://www.conventionalcommits.org/en/v1.0.0/#specification)), for more information.

## Reporting Bugs

If you encounter a bug or issue with the project, please report it by opening a new issue in the issue tracker. Please provide as much detail as possible, including steps to reproduce the issue and any error messages or other relevant information.

## Getting Help

If you have questions or need help with the project, please reach out to us on the project's discussion forum or via email.

## Attribution

We appreciate all contributions to the project and strive to give credit where credit is due. Please include your name and contact information in your contributions so we can properly attribute your work.

Thank you again for your interest in contributing to our project! We look forward to working with you.
