// @ts-check
import {test, expect} from "@playwright/test"

//created an advanced sign in test for extra practise

//checking wrong passwords/ usernames - also checking that an appropriate vague message is shown,
//  as not to give away information to be used by hackers(if the user exists or not)
const testCases = [
    {username: "standard_user", password: "FAKE PASSWORD"},
    {username: "locked_out_user", password: "FAKE PASSWORD"},
    {username: "problem_user", password: "FAKE PASSWORD"},
    {username: "performance_glitch_user", password: "FAKE PASSWORD"},
    {username: "error_user", password: "FAKE PASSWORD"},
    {username: "visual_user", password: "FAKE PASSWORD"},
    {username: "FAKE USER", password: "secret_sauce"}
];
testCases.forEach((testCase, index) => {
  test(`Login test case ${index + 1}: ${testCase.username}`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // Fill in the login form
    await page.getByLabel('Username').fill(testCase.username);
    await page.getByLabel('Password').fill(testCase.password);

    // Click the login button
    await page.getByRole('button', { name: 'Login' }).click();

    //verify
    const errorMessage = await page.locator(".error-message-container");
    await expect(errorMessage).toHaveText("Epic sadface: Username and password do not match any user in this service");
    const icons = await page.locator(".error_icon").all();
    expect(icons.length).toBe(2);

    //click dismiss
    const errorDismiss = await page.getByLabel("Dismiss error");
    await errorDismiss.click();

    //now error icons and message should NOT be present
    expect(icons.length).toBeGreaterThan(0); // Icons exist in the DOM
    await Promise.all(icons.map(icon => expect(icon).toBeHidden())); // Icons are hidden

    //had to locate the error message and button by the role alert as the container is still visible
    const errorForm = await page.getByRole("alert");
    await expect(errorForm).not.toBeVisible();


  });
});

//once the task list is complete 
// come back to verify if the correct users get to the next page and the ones that are locked out stay at sign in
