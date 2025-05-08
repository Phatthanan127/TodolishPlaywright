# Create a folder for your test project
mkdir playwright-todo-test && cd playwright-todo-test

# Initialize npm project
npm init -y

# Install Playwright
npm install --save-dev playwright

# Install browsers for testing
npx playwright install


# Install browsers for testing
npx playwright test
npx playwright test --headed
