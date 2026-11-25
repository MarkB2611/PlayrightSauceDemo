// @ts-check
import {test, expect} from "@playwright/test"



//basic test checking page contents
test("Page Loads and Correct Title is Present", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");

    //expect the page to load
    await expect(page).toHaveTitle(/Swag Labs/);
    //ensures that the test doesnt just find the existance of a title
    await expect(page).not.toHaveTitle(/Swagg Labbs/);
});

//function for better maintainability/reusability
/** 
 * Types into an input field with a delay (simulates real typing).
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {boolean} clickLogin - determines whether login is pressed
 * @param {string} username - determines username - optional so I can use a default value
 * @param {string} password - determines password - optional so I can use a default value
 * */
export async function badSignIn(page, clickLogin, username="Username", password="Password123") {
    //checking username input
    const usernameInput = await page.getByLabel("Username");
    //could use fill but that is like copying and pasting rather than typing
    await usernameInput.click();
    await usernameInput.type(username);
    await expect(usernameInput).toHaveValue(username);

    //checking password input
    const passwordInput = await page.getByLabel("Password");
    await passwordInput.click();
    await passwordInput.type(password);
    await expect(passwordInput).toHaveValue(password);

    //makes the function multi use
    if(clickLogin) {
        //checking input button(had to use text because there was no aria label or role)
        const buttonInput = await page.getByText("Login");
        await buttonInput.click();
    }

}

//checking that the sign in inputs and buttons are present and interactable
test("Form Text Inputs are Interactable", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");

    //false because we are just testing the form inputs
    await badSignIn(page, false);

});

//checking that the sign in inputs and buttons are present and interactable
test("Form Button Input is Interactable and Correct Failure Message Shown", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");

    await badSignIn(page, true);

    //expect message present and expected error message text content
    //Epic sadface: Username and password do not match any user in this service
    const errorMessage = await page.locator(".error-message-container");
    await expect(errorMessage).toHaveText("Epic sadface: Username and password do not match any user in this service");
});

//checking that the sign in inputs and buttons are present and interactable
test("Correct Error Icons Shown + Dismiss Error Working as Expected", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");

    await badSignIn(page, true);

    //expect message present and expected error message text content
    //Epic sadface: Username and password do not match any user in this service
    const errorMessage = await page.locator(".error-message-container");
    await expect(errorMessage).toHaveText("Epic sadface: Username and password do not match any user in this service");

    //icons in the forms should be visible(needed to grab them as an array and then ensure there is 2 icons because
    // they are inidentifiable from eachother)
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

//Correct sign in leads to the next page
//basic test checking page contents
test("Sign-in Leads to the Correct Page", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");

    //expect the page to load
    // Fill in the login form
    await page.getByLabel('Username').fill("standard_user");
    await page.getByLabel('Password').fill("secret_sauce");

    // Click the login button
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

});

