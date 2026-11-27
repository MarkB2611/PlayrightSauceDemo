// @ts-check
import {test, expect} from "@playwright/test"



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


    //checks for first item before the z-a option
    const defaultItem = page.locator('.inventory_item').first();
    await expect(defaultItem.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(defaultItem.locator('.inventory_item_price')).toHaveText('$29.99');

    //change to z-a sort
    const selectOptions = await page.locator(".product_sort_container");
    await selectOptions.selectOption("za");

    // Locate the first inventory item after z-a option
    const firstItem = page.locator('.inventory_item').first();
    await expect(firstItem.locator('.inventory_item_name')).toHaveText('Test.allTheThings() T-Shirt (Red)');
    await expect(firstItem.locator('.inventory_item_price')).toHaveText('$15.99');
    
});

// Clicking an item image navigates to a new page with the item’s details
test("Selecting an Item Image Navigates to a New Page with the Item's Details", async ({ page }) => {
    await signInAndGoToProductList(page);


    //selects image
    const defaultItem = page.locator('.inventory_item_img').first();
    await defaultItem.click();

    //ensures the correct url for the item
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4");

    //ensures details
    const detailsName = page.locator('.inventory_details_name');
    await expect(detailsName).toHaveText("Sauce Labs Backpack");
    const detailsDesc = page.locator('.inventory_details_desc');
    await expect(detailsDesc).toHaveText("carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.");
    const detailsPrice = page.locator('.inventory_details_price');
    await expect(detailsPrice).toHaveText("$29.99");
    
});

// Clicking an item name navigates to a new page with the item’s details
test("Selecting an Item Name Navigates to a New Page with the Item's Details", async ({ page }) => {
    await signInAndGoToProductList(page);


    //selects image
    const defaultItem = page.locator('.inventory_item_name').first();
    await defaultItem.click();

    //ensures the correct url for the item
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4");

    //ensures details
    const detailsName = page.locator('.inventory_details_name');
    await expect(detailsName).toHaveText("Sauce Labs Backpack");
    const detailsDesc = page.locator('.inventory_details_desc');
    await expect(detailsDesc).toHaveText("carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.");
    const detailsPrice = page.locator('.inventory_details_price');
    await expect(detailsPrice).toHaveText("$29.99");
    
});

// Clicking an item price doesnt navigate to a new page with the item’s details
test("Selecting an Item Price Doesn't Navigate to a New Page with the Item's Details", async ({ page }) => {
    await signInAndGoToProductList(page);


    //selects image
    const defaultItem = page.locator('.inventory_item_price').first();
    await defaultItem.click();

    //ensures the correct url for the item
    await expect(page).not.toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4");
});

/*
     Clicking the “Add to cart” button:
o Updates the button to say “remove from cart”
o Updates the cart icon to show it holds one item
*/
test("Clicking add to cart: updates the button to say remove cart, Updates the cart to show more than one item", async ({ page }) => {
    await signInAndGoToProductList(page);


    //selects image
    const defaultItem = page.locator('.btn_inventory').first();
    const shoppingCart = page.locator(".shopping_cart_badge")
    await defaultItem.click();

    //Button says remove from cart - note it says remove if this were a real test automation suite
    // I would clarify whether it needs to exactly say "remove from cart" instead of "Remove"
    await expect(defaultItem).toHaveText("Remove");
    await expect(shoppingCart).toHaveText("1")
});

// Adding multiple items to cart shows the correct number of items on the icon
test("Adding each item to cart displays the correct number", async ({ page }) => {
    await signInAndGoToProductList(page);


    // Locate all "Add to cart" buttons
    const addToCartButtons = page.locator('.btn_inventory');
    const shoppingCartBadge = page.locator('.shopping_cart_badge');

    // Get the count of items in the inventory
    const itemCount = await addToCartButtons.count();

    // Loop through each item and add it to the cart
    for (let i = 0; i < itemCount; i++) {
        const button = addToCartButtons.nth(i);
        await button.click();

        // Verify the button text changes to "Remove"
        await expect(button).toHaveText('Remove');

        // Verify the cart badge shows the correct number of items
        await expect(shoppingCartBadge).toHaveText((i + 1).toString());
    }
});

/*
 Clicking “Remove from cart”
o Resets the button to say “Add to cart”
o Decrements the counter on the icon
*/
test("Clicking Remove From Cart: Resets the button to say add to cart, Decrements the counter on the icon", async ({ page }) => {
    await signInAndGoToProductList(page);


    //selects image
    const defaultItem = page.locator('.btn_inventory').first();
    //other item using nth
    const otherItem = page.locator(".btn_inventory").nth(1);
    //had to use link as shopping cart badge is unavailable after nothing is in the cart
    const shoppingCart = page.locator(".shopping_cart_link")
    await defaultItem.click();

    //Button says remove from cart - note it says remove if this were a real test automation suite
    // I would clarify whether it needs to exactly say "remove from cart" instead of "Remove"
    await expect(defaultItem).toHaveText("Remove");
    await expect(shoppingCart).toHaveText("1")

    //checking for values above 1
    await otherItem.click();
    await expect(otherItem).toHaveText("Remove");
    await expect(shoppingCart).toHaveText("2")
    //removes item from basket
    await otherItem.click();
    await expect(shoppingCart).toHaveText("1")
    await expect(otherItem).toHaveText("Add to cart");


    await defaultItem.click();
    await expect(defaultItem).toHaveText("Add to cart");
    await expect(defaultItem).not.toHaveText("Remove");
    await expect(shoppingCart).not.toHaveText("1")
});


// An item cannot be added to cart twice(checking by first adding in the inventory list page then in the inventory item page)
test("An item cannot be added to the cart twice", async ({ page }) => {
    await signInAndGoToProductList(page);


    //selects image
    const defaultItem = page.locator('.btn_inventory').first();
    await defaultItem.click();
    const defaultItemName = page.locator('.inventory_item_name').first();
    await defaultItemName.click();
    //ensures the correct url for the item
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4");

    const addToCartButton = page.locator('.btn_inventory').first();
    await addToCartButton.click();

    const shoppingCart = page.locator(".shopping_cart_link")
    await expect(shoppingCart).not.toHaveText("2")
});