// @ts-check
import {test, expect} from "@playwright/test"

/*Product list
Selecting “Name (Z to A)” from the filter drop-down reverses the order of the
items
 Clicking an item image navigates to a new page with the item’s details
 Clicking the name of an item navigates to a new page with the item’s details
 Clicking an item’s price or description does not navigate to a new page
 Clicking the “Add to cart” button:
o Updates the button to say “remove from cart”
o Updates the cart icon to show it holds one item
 Adding multiple items to cart shows the correct number of items on the icon
 Clicking “Remove from cart”
o Resets the button to say “Add to cart”
o Decrements the counter on the icon
 An item cannot be added to cart twice
*/

/** 
 * Types into an input field with a delay (simulates real typing).
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * */
export async function signInAndGoToProductList(page) {
    await page.goto("https://www.saucedemo.com");

    //expect the page to load
    // Fill in the login form
    await page.getByLabel('Username').fill("standard_user");
    await page.getByLabel('Password').fill("secret_sauce");

    // Click the login button
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

}


// Selecting “Name (Z to A)” from the filter drop-down reverses the order of the
//items
test("Selecting Name (Z to A) from the filter drop-down reverses the order of the items ", async ({ page }) => {
    await signInAndGoToProductList(page);

    //logic
});