// @ts-check
import {test, expect} from "@playwright/test"
import { signInAndGoToProductList } from "./ProductList.spec";


/*

Checkout process

*/

// Completing the process removes the item count from the cart icon
test("Order is attainable when correct information is entered", async ({ page }) => {
    await signInAndGoToProductList(page);

    //select item for checkout
    let shoppingCart = await page.locator(".shopping_cart_badge");
    const defaultItem = await page.locator(".btn_inventory").first();
    await defaultItem.click();

    //go to checkout
    await shoppingCart.click();

    const checkoutBtn = await page.locator(".checkout_button");
    await checkoutBtn.click();

    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");


    //enter form
    const fname = await page.getByLabel("First Name");
    const sname = await page.getByLabel("Last Name");
    const postcode = await page.getByLabel("Zip/Postal Code");

    await fname.type("Mark");
    await sname.type("Blackmore");
    await postcode.type("S2 4AH");

    const continueBtn = await page.getByText("Continue");
    await continueBtn.click();

    const finishBtn = await page.getByText("Finish");
    await finishBtn.click();

    shoppingCart = await page.locator(".shopping_cart_link");
    await expect(shoppingCart).not.toHaveText("1");
});


// All information must be included in the customer detail form to proceed
//also checks each individual message
test("All information must be included in the customer detail form to proceed", async ({ page }) => {
    await signInAndGoToProductList(page);

    //select item for checkout
    const shoppingCart = await page.locator(".shopping_cart_badge");
    const defaultItem = await page.locator(".btn_inventory").first();
    await defaultItem.click();

    //go to checkout
    await shoppingCart.click();

    const checkoutBtn = await page.locator(".checkout_button");
    await checkoutBtn.click();

    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");


    //enter form

    const continueBtn = await page.getByText("Continue");
    
    const fname = await page.getByLabel("First Name");
    const sname = await page.getByLabel("Last Name");
    const postcode = await page.getByLabel("Zip/Postal Code");

    await fname.type("Mark");
    await sname.type("Blackmore");
    
    await continueBtn.click();

    //expect postal code error
    const errorMsg = await page.locator(".error-message-container");
    await expect(errorMsg).toHaveText("Error: Postal Code is required");
    const dismissError = await page.locator(".fa-xmark");
    await dismissError.click();

    //no fname test
    await fname.clear();
    await sname.type("Blackmore");
    await postcode.type("S2 4AH");
    await continueBtn.click();

    await expect(errorMsg).toHaveText("Error: First Name is required");



    //no sname test
    await sname.clear();
    await fname.type("Mark");
    await postcode.type("S2 4AH");
    await continueBtn.click();

    await expect(errorMsg).toHaveText("Error: Last Name is required");
});


// Clicking “cancel” at any point returns to the product list
//assuming that the cart is the page that is meant by the product list here
test("Cancel brings the user back to the cart at any point", async ({ page }) => {
    await signInAndGoToProductList(page);

    //select item for checkout
    let shoppingCart = await page.locator(".shopping_cart_badge");
    const defaultItem = await page.locator(".btn_inventory").first();
    await defaultItem.click();

    //go to checkout
    await shoppingCart.click();

    const checkoutBtn = await page.locator(".checkout_button");
    await checkoutBtn.click();

    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");

    //first cancel
    const cancelBtn = await page.locator(".cart_cancel_link");
    await cancelBtn.click();
    //page goes to the cart so it would fail here
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

    //back to the checkout
    await shoppingCart.click();
    await checkoutBtn.click();

    //enter form
    const fname = await page.getByLabel("First Name");
    const sname = await page.getByLabel("Last Name");
    const postcode = await page.getByLabel("Zip/Postal Code");

    await fname.type("Mark");
    await sname.type("Blackmore");
    await postcode.type("S2 4AH");

    const continueBtn = await page.getByText("Continue");
    await continueBtn.click();

    //cancel again
    await cancelBtn.click();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});